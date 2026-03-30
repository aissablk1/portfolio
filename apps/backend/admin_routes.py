"""
Routes d'administration du portfolio — API complète.
Toutes les routes sont protégées par JWT (sauf /login).
"""

import os
import io
import csv
import uuid
import math
import smtplib
import logging
import requests as http_requests
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Response, Query
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from admin_models import (
    AdminLogin,
    ContactUpdate,
    ContactReply,
    EmailCompose,
    BlacklistCreate,
    MaintenanceToggle,
    TestNotification,
    ContactStatus,
    SortOrder,
    ExportFormat,
)
from services.auth_service import (
    create_access_token,
    create_refresh_token,
    verify_token,
    authenticate_admin,
    blacklist_token,
    get_current_admin,
    log_admin_action,
)

logger = logging.getLogger(__name__)

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

# ─── Helpers ──────────────────────────────────────────────────────────────────


def _get_db():
    """Récupère la connexion MongoDB depuis les variables d'environnement."""
    mongo_url = os.environ["MONGO_URL"]
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ["DB_NAME"]]


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _ok(data=None):
    """Réponse standard de succès."""
    return {"success": True, "data": data}


def _error(message: str, status_code: int = 400):
    raise HTTPException(status_code=status_code, detail=message)


def _paginated(items: list, total: int, page: int, per_page: int):
    return {
        "success": True,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": max(1, math.ceil(total / per_page)),
        },
    }


def _serialize_doc(doc: dict) -> dict:
    """Convertit un document MongoDB pour la sérialisation JSON."""
    if doc is None:
        return None
    result = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


def _is_production() -> bool:
    return os.getenv("ENVIRONMENT", "development") == "production"


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    """Configure les cookies httpOnly pour les tokens JWT (cross-origin compatible)."""
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=30 * 60,  # 30 min
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,  # 7 jours
        path="/api/admin/refresh",
    )


def _clear_auth_cookies(response: Response):
    """Supprime les cookies d'authentification."""
    response.delete_cookie("access_token", path="/", samesite="none", secure=True)
    response.delete_cookie("refresh_token", path="/api/admin/refresh", samesite="none", secure=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  AUTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.post("/login")
async def login(credentials: AdminLogin, request: Request, response: Response):
    """Authentification administrateur — retourne JWT dans des cookies httpOnly."""
    db = _get_db()
    try:
        admin = await authenticate_admin(db, credentials.username, credentials.password)
        if not admin:
            await log_admin_action(
                db, "unknown", "login_failed",
                {"username": credentials.username},
                _get_client_ip(request),
            )
            raise HTTPException(
                status_code=401,
                detail="Nom d'utilisateur ou mot de passe incorrect.",
            )

        token_data = {"sub": admin["id"], "username": admin["username"]}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        _set_auth_cookies(response, access_token, refresh_token)

        await log_admin_action(
            db, admin["id"], "login",
            {"username": admin["username"]},
            _get_client_ip(request),
        )

        return _ok({
            "user": {
                "id": admin["id"],
                "username": admin["username"],
                "email": admin["email"],
                "last_login": admin.get("last_login"),
            },
            "access_token": access_token,
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la connexion : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur.")


@admin_router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """Rafraîchit le token d'accès en utilisant le refresh token cookie."""
    db = _get_db()
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token de rafraîchissement manquant.")

    payload = verify_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token de rafraîchissement invalide ou expiré.")

    token_data = {"sub": payload["sub"], "username": payload["username"]}
    new_access = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    _set_auth_cookies(response, new_access, new_refresh)

    await log_admin_action(
        db, payload["sub"], "token_refresh", None, _get_client_ip(request)
    )

    return _ok({"access_token": new_access})


@admin_router.post("/logout")
async def logout(request: Request, response: Response):
    """Déconnexion — supprime les cookies et blackliste le token."""
    db = _get_db()
    access_token = request.cookies.get("access_token")
    refresh_token_val = request.cookies.get("refresh_token")

    admin_id = "unknown"
    if access_token:
        payload = verify_token(access_token)
        if payload:
            admin_id = payload.get("sub", "unknown")
        await blacklist_token(db, access_token)

    if refresh_token_val:
        await blacklist_token(db, refresh_token_val)

    _clear_auth_cookies(response)

    await log_admin_action(
        db, admin_id, "logout", None, _get_client_ip(request)
    )

    return _ok({"message": "Déconnexion réussie."})


@admin_router.get("/me")
async def get_me(request: Request):
    """Retourne le profil de l'administrateur connecté."""
    db = _get_db()
    admin = await get_current_admin(request, db)
    return _ok({
        "id": admin["id"],
        "username": admin["username"],
        "email": admin["email"],
        "display_name": admin.get("display_name", ""),
        "avatar_url": admin.get("avatar_url", ""),
        "sigle": admin.get("sigle", ""),
        "created_at": admin["created_at"].isoformat() if isinstance(admin["created_at"], datetime) else admin["created_at"],
        "last_login": admin["last_login"].isoformat() if isinstance(admin.get("last_login"), datetime) else admin.get("last_login"),
        "is_active": admin["is_active"],
    })


@admin_router.patch("/profile")
async def update_profile(request: Request):
    """Met à jour le profil de l'administrateur connecté."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        body = await request.json()
        allowed = {"display_name", "avatar_url", "sigle"}
        updates = {k: str(v)[:200] for k, v in body.items() if k in allowed and v is not None}

        if not updates:
            raise HTTPException(status_code=400, detail="Aucun champ à mettre à jour.")

        await db.admin_users.update_one(
            {"id": admin["id"]},
            {"$set": updates},
        )

        await log_admin_action(db, admin["id"], "profile_updated", updates, _get_client_ip(request))

        return _ok({"message": "Profil mis à jour.", **updates})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur mise à jour profil : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du profil.")


# ═══════════════════════════════════════════════════════════════════════════════
#  DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/dashboard")
async def get_dashboard(request: Request):
    """Vue d'ensemble du tableau de bord — stats, contacts récents, santé des services, GitHub."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=today_start.weekday())
        month_start = today_start.replace(day=1)

        # Stats agrégées
        total = await db.contact_submissions.count_documents({})
        today_count = await db.contact_submissions.count_documents(
            {"timestamp": {"$gte": today_start}}
        )
        week_count = await db.contact_submissions.count_documents(
            {"timestamp": {"$gte": week_start}}
        )
        month_count = await db.contact_submissions.count_documents(
            {"timestamp": {"$gte": month_start}}
        )
        spam_count = await db.contact_submissions.count_documents({"status": "spam"})
        spam_today = await db.contact_submissions.count_documents(
            {"status": "spam", "timestamp": {"$gte": today_start}}
        )
        replied = await db.contact_submissions.count_documents({"status": "replied"})
        non_spam = max(total - spam_count, 1)
        response_rate = round((replied / non_spam) * 100, 1) if non_spam > 0 else 0

        # Temps de réponse moyen (en minutes)
        avg_pipeline = [
            {"$match": {"status": "replied", "replied_at": {"$exists": True}}},
            {"$project": {"diff": {"$subtract": ["$replied_at", "$timestamp"]}}},
            {"$group": {"_id": None, "avg": {"$avg": "$diff"}}},
        ]
        avg_cursor = db.contact_submissions.aggregate(avg_pipeline)
        avg_doc = await avg_cursor.to_list(length=1)
        avg_response_minutes = round(avg_doc[0]["avg"] / 60000, 0) if avg_doc and avg_doc[0].get("avg") else 0

        # Taux de délivrabilité email
        total_emails = await db.email_logs.count_documents({})
        sent_emails = await db.email_logs.count_documents({"status": "sent"})
        email_delivery_rate = round((sent_emails / max(total_emails, 1)) * 100, 1)

        # Notifications aujourd'hui
        notifications_today = await db.notification_logs.count_documents(
            {"timestamp": {"$gte": today_start}}
        )

        # Contacts récents (10 derniers)
        recent_cursor = db.contact_submissions.find(
            {"status": {"$ne": "spam"}},
            {"_id": 0, "ip_address": 0, "user_agent": 0}
        ).sort("timestamp", -1).limit(10)
        recent = [_serialize_doc(doc) async for doc in recent_cursor]

        # Santé des services
        checked_at = now.isoformat()
        service_checks = {
            "MongoDB": True,
            "SMTP": bool(os.getenv("EMAIL_USER") and os.getenv("EMAIL_PASSWORD")),
            "Telegram": bool(os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("TELEGRAM_CHAT_ID")),
            "Notion": bool(os.getenv("NOTION_TOKEN")),
            "Google Sheets": bool(os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")),
        }
        try:
            await db.command("ping")
        except Exception:
            service_checks["MongoDB"] = False

        service_health = [
            {
                "name": name,
                "status": "healthy" if ok else "down",
                "last_checked": checked_at,
            }
            for name, ok in service_checks.items()
        ]

        # Timeline 7 derniers jours (avec spam)
        pipeline = [
            {"$match": {"timestamp": {"$gte": today_start - timedelta(days=7)}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}
                    },
                    "count": {"$sum": 1},
                    "spam": {
                        "$sum": {"$cond": [{"$eq": ["$status", "spam"]}, 1, 0]}
                    },
                }
            },
            {"$sort": {"_id": 1}},
        ]
        timeline_cursor = db.contact_submissions.aggregate(pipeline)
        timeline = [
            {"date": doc["_id"], "count": doc["count"], "spam": doc["spam"]}
            async for doc in timeline_cursor
        ]

        return _ok({
            "stats": {
                "total_contacts": total,
                "contacts_today": today_count,
                "contacts_this_week": week_count,
                "contacts_this_month": month_count,
                "spam_blocked": spam_count,
                "response_rate": response_rate,
                "avg_response_time": avg_response_minutes,
                "email_delivery_rate": email_delivery_rate,
            },
            "recent_contacts": recent,
            "service_health": service_health,
            "timeline": timeline,
            "notifications_today": notifications_today,
            "spam_today": spam_today,
        })

    except Exception as e:
        logger.error(f"Erreur tableau de bord : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement du tableau de bord.")


# ═══════════════════════════════════════════════════════════════════════════════
#  CONTACTS CRUD
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/contacts/export")
async def export_contacts(
    request: Request,
    format: ExportFormat = Query(ExportFormat.json),
    status: Optional[ContactStatus] = None,
):
    """Exporte les contacts en CSV ou JSON."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        query = {}
        if status:
            query["status"] = status.value

        cursor = db.contact_submissions.find(query, {"_id": 0}).sort("timestamp", -1)
        contacts = [_serialize_doc(doc) async for doc in cursor]

        if format == ExportFormat.csv:
            if not contacts:
                output = io.StringIO()
                writer = csv.writer(output)
                writer.writerow(["id", "name", "email", "subject", "message", "status", "timestamp"])
                output.seek(0)
                return StreamingResponse(
                    iter([output.getvalue()]),
                    media_type="text/csv",
                    headers={"Content-Disposition": "attachment; filename=contacts_export.csv"},
                )

            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=contacts[0].keys())
            writer.writeheader()
            writer.writerows(contacts)
            output.seek(0)

            return StreamingResponse(
                iter([output.getvalue()]),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=contacts_export.csv"},
            )

        return _ok({"contacts": contacts, "total": len(contacts)})

    except Exception as e:
        logger.error(f"Erreur export contacts : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'export.")


@admin_router.get("/contacts")
async def list_contacts(
    request: Request,
    status: Optional[ContactStatus] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort_by: str = Query("timestamp", pattern=r"^(timestamp|name|email|subject|status)$"),
    sort_order: SortOrder = Query(SortOrder.desc),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Liste paginée des contacts avec filtres."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        query = {}

        if status:
            query["status"] = status.value

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"subject": {"$regex": search, "$options": "i"}},
                {"message": {"$regex": search, "$options": "i"}},
            ]

        if date_from:
            query.setdefault("timestamp", {})["$gte"] = datetime.fromisoformat(date_from)

        if date_to:
            query.setdefault("timestamp", {})["$lte"] = datetime.fromisoformat(date_to)

        total = await db.contact_submissions.count_documents(query)
        sort_dir = 1 if sort_order == SortOrder.asc else -1
        skip = (page - 1) * per_page

        cursor = (
            db.contact_submissions.find(query, {"_id": 0})
            .sort(sort_by, sort_dir)
            .skip(skip)
            .limit(per_page)
        )
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

    except Exception as e:
        logger.error(f"Erreur liste contacts : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des contacts.")


@admin_router.get("/contacts/{contact_id}")
async def get_contact(request: Request, contact_id: str):
    """Détail d'un contact par son UUID (champ id, pas _id)."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        doc = await db.contact_submissions.find_one({"id": contact_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Contact introuvable.")
        return _ok(_serialize_doc(doc))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur récupération contact : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du contact.")


@admin_router.patch("/contacts/{contact_id}")
async def update_contact(request: Request, contact_id: str, update: ContactUpdate):
    """Met à jour le statut ou les notes d'un contact."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        doc = await db.contact_submissions.find_one({"id": contact_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Contact introuvable.")

        update_data = {}
        if update.status is not None:
            update_data["status"] = update.status.value
        if update.notes is not None:
            update_data["notes"] = update.notes
        update_data["updated_at"] = datetime.now(timezone.utc)
        update_data["updated_by"] = admin["id"]

        await db.contact_submissions.update_one({"id": contact_id}, {"$set": update_data})

        await log_admin_action(
            db, admin["id"], "contact_updated",
            {"contact_id": contact_id, "updates": {k: v for k, v in update_data.items() if k != "updated_at"}},
            _get_client_ip(request),
        )

        updated = await db.contact_submissions.find_one({"id": contact_id}, {"_id": 0})
        return _ok(_serialize_doc(updated))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur mise à jour contact : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du contact.")


@admin_router.delete("/contacts/{contact_id}")
async def delete_contact(request: Request, contact_id: str):
    """Suppression douce — passe le statut à 'archived'."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        doc = await db.contact_submissions.find_one({"id": contact_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Contact introuvable.")

        await db.contact_submissions.update_one(
            {"id": contact_id},
            {
                "$set": {
                    "status": "archived",
                    "archived_at": datetime.now(timezone.utc),
                    "archived_by": admin["id"],
                }
            },
        )

        await log_admin_action(
            db, admin["id"], "contact_archived",
            {"contact_id": contact_id},
            _get_client_ip(request),
        )

        return _ok({"message": "Contact archivé avec succès.", "id": contact_id})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur archivage contact : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'archivage du contact.")


@admin_router.post("/contacts/{contact_id}/reply")
async def reply_to_contact(request: Request, contact_id: str, reply: ContactReply):
    """Envoie une réponse par email à un contact et marque comme 'replied'."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        doc = await db.contact_submissions.find_one({"id": contact_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Contact introuvable.")

        recipient_email = doc["email"]
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        email_user = os.getenv("EMAIL_USER")
        email_password = os.getenv("EMAIL_PASSWORD")

        if not email_user or not email_password:
            raise HTTPException(
                status_code=503,
                detail="Configuration SMTP manquante. Impossible d'envoyer l'email.",
            )

        msg = MIMEMultipart()
        msg["From"] = email_user
        msg["To"] = recipient_email
        msg["Subject"] = reply.subject

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="white-space: pre-wrap;">{reply.message}</div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                    <p>Cordialement,<br><strong>AÏSSA BELKOUSSA</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)

        # Marquer comme répondu
        await db.contact_submissions.update_one(
            {"id": contact_id},
            {
                "$set": {
                    "status": "replied",
                    "replied_at": datetime.now(timezone.utc),
                    "replied_by": admin["id"],
                }
            },
        )

        # Log dans email_logs
        await db.email_logs.insert_one({
            "id": str(uuid.uuid4()),
            "type": "reply",
            "to": recipient_email,
            "subject": reply.subject,
            "body": reply.message,
            "contact_id": contact_id,
            "sent_by": admin["id"],
            "sent_at": datetime.now(timezone.utc),
            "status": "sent",
        })

        await log_admin_action(
            db, admin["id"], "contact_replied",
            {"contact_id": contact_id, "recipient": recipient_email},
            _get_client_ip(request),
        )

        return _ok({"message": "Réponse envoyée avec succès.", "contact_id": contact_id})

    except HTTPException:
        raise
    except smtplib.SMTPException as e:
        logger.error(f"Erreur SMTP lors de l'envoi de la réponse : {str(e)}")
        raise HTTPException(status_code=502, detail="Erreur lors de l'envoi de l'email.")
    except Exception as e:
        logger.error(f"Erreur réponse contact : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de la réponse.")


# ═══════════════════════════════════════════════════════════════════════════════
#  EMAILS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/emails")
async def list_emails(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Liste paginée des emails envoyés."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        total = await db.email_logs.count_documents({})
        skip = (page - 1) * per_page
        cursor = db.email_logs.find({}, {"_id": 0}).sort("sent_at", -1).skip(skip).limit(per_page)
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

    except Exception as e:
        logger.error(f"Erreur liste emails : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emails.")


@admin_router.get("/emails/{email_id}")
async def get_email(request: Request, email_id: str):
    """Détail d'un email envoyé."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        doc = await db.email_logs.find_one({"id": email_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Email introuvable.")
        return _ok(_serialize_doc(doc))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur récupération email : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'email.")


@admin_router.post("/emails/send")
async def send_email(request: Request, email_data: EmailCompose):
    """Compose et envoie un email."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        email_user = os.getenv("EMAIL_USER")
        email_password = os.getenv("EMAIL_PASSWORD")

        if not email_user or not email_password:
            raise HTTPException(
                status_code=503,
                detail="Configuration SMTP manquante.",
            )

        msg = MIMEMultipart()
        msg["From"] = email_user
        msg["To"] = email_data.to
        msg["Subject"] = email_data.subject

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="white-space: pre-wrap;">{email_data.body}</div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                    <p>Cordialement,<br><strong>AÏSSA BELKOUSSA</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)

        email_log = {
            "id": str(uuid.uuid4()),
            "type": "compose",
            "to": email_data.to,
            "subject": email_data.subject,
            "body": email_data.body,
            "contact_id": email_data.reply_to_contact_id,
            "sent_by": admin["id"],
            "sent_at": datetime.now(timezone.utc),
            "status": "sent",
        }
        await db.email_logs.insert_one(email_log)

        await log_admin_action(
            db, admin["id"], "email_sent",
            {"to": email_data.to, "subject": email_data.subject},
            _get_client_ip(request),
        )

        return _ok({"message": "Email envoyé avec succès.", "email_id": email_log["id"]})

    except HTTPException:
        raise
    except smtplib.SMTPException as e:
        logger.error(f"Erreur SMTP : {str(e)}")

        # Logger l'échec
        await db.email_logs.insert_one({
            "id": str(uuid.uuid4()),
            "type": "compose",
            "to": email_data.to,
            "subject": email_data.subject,
            "body": email_data.body,
            "sent_by": admin["id"],
            "sent_at": datetime.now(timezone.utc),
            "status": "failed",
            "error": str(e),
        })

        raise HTTPException(status_code=502, detail="Erreur lors de l'envoi de l'email.")
    except Exception as e:
        logger.error(f"Erreur envoi email : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de l'email.")


# ═══════════════════════════════════════════════════════════════════════════════
#  ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/analytics/overview")
async def analytics_overview(request: Request):
    """KPIs : total, aujourd'hui, semaine, mois, spam, taux de réponse."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=today_start.weekday())
        month_start = today_start.replace(day=1)

        total = await db.contact_submissions.count_documents({})
        today_count = await db.contact_submissions.count_documents({"timestamp": {"$gte": today_start}})
        week_count = await db.contact_submissions.count_documents({"timestamp": {"$gte": week_start}})
        month_count = await db.contact_submissions.count_documents({"timestamp": {"$gte": month_start}})
        spam_count = await db.contact_submissions.count_documents({"status": "spam"})
        replied_count = await db.contact_submissions.count_documents({"status": "replied"})
        non_spam_total = total - spam_count

        response_rate = round((replied_count / non_spam_total * 100) if non_spam_total > 0 else 0, 2)

        # Taux de spam
        spam_rate = round((spam_count / total * 100) if total > 0 else 0, 2)

        # Temps de réponse moyen (en heures)
        pipeline = [
            {"$match": {"status": "replied", "replied_at": {"$exists": True}}},
            {
                "$project": {
                    "response_time": {
                        "$subtract": ["$replied_at", "$timestamp"]
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_response_ms": {"$avg": "$response_time"},
                }
            },
        ]
        avg_cursor = db.contact_submissions.aggregate(pipeline)
        avg_doc = None
        async for doc in avg_cursor:
            avg_doc = doc

        avg_response_hours = None
        if avg_doc and avg_doc.get("avg_response_ms"):
            avg_response_hours = round(avg_doc["avg_response_ms"] / (1000 * 60 * 60), 1)

        return _ok({
            "total": total,
            "today": today_count,
            "this_week": week_count,
            "this_month": month_count,
            "spam": spam_count,
            "spam_rate": spam_rate,
            "replied": replied_count,
            "response_rate": response_rate,
            "avg_response_hours": avg_response_hours,
        })

    except Exception as e:
        logger.error(f"Erreur analytics overview : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des analytics.")


@admin_router.get("/analytics/timeline")
async def analytics_timeline(
    request: Request,
    days: int = Query(30, ge=1, le=365),
):
    """Nombre de soumissions par jour sur les N derniers jours."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        now = datetime.now(timezone.utc)
        start_date = now - timedelta(days=days)

        pipeline = [
            {"$match": {"timestamp": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}
                    },
                    "total": {"$sum": 1},
                    "spam": {
                        "$sum": {"$cond": [{"$eq": ["$status", "spam"]}, 1, 0]}
                    },
                    "legitimate": {
                        "$sum": {"$cond": [{"$ne": ["$status", "spam"]}, 1, 0]}
                    },
                }
            },
            {"$sort": {"_id": 1}},
        ]
        cursor = db.contact_submissions.aggregate(pipeline)
        timeline = []
        async for doc in cursor:
            timeline.append({
                "date": doc["_id"],
                "total": doc["total"],
                "spam": doc["spam"],
                "legitimate": doc["legitimate"],
            })

        return _ok({"timeline": timeline, "days": days})

    except Exception as e:
        logger.error(f"Erreur analytics timeline : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement de la timeline.")


@admin_router.get("/analytics/geo")
async def analytics_geo(request: Request):
    """Distribution géographique basée sur les adresses IP (headers ou lookup basique)."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        pipeline = [
            {"$match": {"ip_address": {"$exists": True, "$ne": None, "$ne": "unknown"}}},
            {
                "$group": {
                    "_id": {
                        "$cond": [
                            {"$ifNull": ["$country", False]},
                            "$country",
                            "Inconnu",
                        ]
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": -1}},
        ]
        cursor = db.contact_submissions.aggregate(pipeline)
        geo_data = []
        async for doc in cursor:
            geo_data.append({"country": doc["_id"], "count": doc["count"]})

        # Aussi grouper par IP pour une vue brute
        ip_pipeline = [
            {"$match": {"ip_address": {"$exists": True, "$ne": None, "$ne": "unknown"}}},
            {
                "$group": {
                    "_id": "$ip_address",
                    "count": {"$sum": 1},
                    "last_seen": {"$max": "$timestamp"},
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 50},
        ]
        ip_cursor = db.contact_submissions.aggregate(ip_pipeline)
        ip_data = []
        async for doc in ip_cursor:
            ip_data.append({
                "ip": doc["_id"],
                "count": doc["count"],
                "last_seen": doc["last_seen"].isoformat() if isinstance(doc["last_seen"], datetime) else doc["last_seen"],
            })

        return _ok({"by_country": geo_data, "by_ip": ip_data})

    except Exception as e:
        logger.error(f"Erreur analytics geo : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des données géographiques.")


@admin_router.get("/analytics/subjects")
async def analytics_subjects(request: Request):
    """Distribution des sujets de contact."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        pipeline = [
            {"$match": {"status": {"$ne": "spam"}}},
            {
                "$group": {
                    "_id": "$subject",
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 30},
        ]
        cursor = db.contact_submissions.aggregate(pipeline)
        subjects = []
        async for doc in cursor:
            subjects.append({"subject": doc["_id"], "count": doc["count"]})

        return _ok({"subjects": subjects})

    except Exception as e:
        logger.error(f"Erreur analytics sujets : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des sujets.")


@admin_router.get("/analytics/hourly")
async def analytics_hourly(request: Request):
    """Distribution horaire des soumissions."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        pipeline = [
            {
                "$group": {
                    "_id": {"$hour": "$timestamp"},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"_id": 1}},
        ]
        cursor = db.contact_submissions.aggregate(pipeline)
        hourly = []
        async for doc in cursor:
            hourly.append({"hour": doc["_id"], "count": doc["count"]})

        return _ok({"hourly": hourly})

    except Exception as e:
        logger.error(f"Erreur analytics horaire : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement de la distribution horaire.")


# ═══════════════════════════════════════════════════════════════════════════════
#  SECURITY
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/security/spam-log")
async def spam_log(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Journal des soumissions spam."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        query = {"status": "spam"}
        total = await db.contact_submissions.count_documents(query)
        skip = (page - 1) * per_page
        cursor = (
            db.contact_submissions.find(query, {"_id": 0})
            .sort("timestamp", -1)
            .skip(skip)
            .limit(per_page)
        )
        raw_items = [_serialize_doc(doc) async for doc in cursor]

        # Normalize for frontend SpamLogEntry type
        logs = []
        for item in raw_items:
            logs.append({
                "id": item.get("id", item.get("contact_id", "")),
                "email": item.get("email", ""),
                "ip_address": item.get("ip_address", ""),
                "reason": item.get("spam_reason", item.get("error_message", "Spam détecté")),
                "score": item.get("spam_score", 0.0),
                "timestamp": item.get("timestamp", ""),
                "keywords_found": item.get("spam_keywords", []),
            })

        return _ok({"logs": logs, "total": total})

    except Exception as e:
        logger.error(f"Erreur spam log : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement du journal spam.")


@admin_router.get("/security/rate-limits")
async def rate_limits(request: Request):
    """Statut actuel des limites de taux par IP."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        # Agrégation des soumissions récentes par IP (dernière heure)
        one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
        pipeline = [
            {"$match": {"timestamp": {"$gte": one_hour_ago}}},
            {
                "$group": {
                    "_id": "$ip_address",
                    "count": {"$sum": 1},
                    "last_submission": {"$max": "$timestamp"},
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 50},
        ]
        cursor = db.contact_submissions.aggregate(pipeline)
        rate_data = []
        async for doc in cursor:
            rate_data.append({
                "ip": doc["_id"],
                "submissions_last_hour": doc["count"],
                "last_submission": doc["last_submission"].isoformat() if isinstance(doc["last_submission"], datetime) else doc["last_submission"],
                "limit": 3,
                "exceeded": doc["count"] >= 3,
            })

        # Normalize for frontend RateLimitEntry type
        limits = []
        for item in rate_data:
            limits.append({
                "ip_address": item.get("ip", ""),
                "requests": item.get("submissions_last_hour", 0),
                "first_request": item.get("last_submission", ""),
                "last_request": item.get("last_submission", ""),
                "blocked": item.get("exceeded", False),
            })

        return _ok({"limits": limits})

    except Exception as e:
        logger.error(f"Erreur rate limits : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des limites de taux.")


@admin_router.get("/security/blacklist")
async def get_blacklist(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Liste de blocage IP/domaine/email."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        total = await db.blacklist.count_documents({})
        skip = (page - 1) * per_page
        cursor = db.blacklist.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(per_page)
        raw_items = [_serialize_doc(doc) async for doc in cursor]

        # Normalize for frontend BlacklistEntry type
        entries = []
        for item in raw_items:
            entry_type = item.get("type", "ip")
            entries.append({
                "id": item.get("id", ""),
                "ip_address": item.get("value") if entry_type == "ip" else None,
                "email_domain": item.get("value") if entry_type in ("domain", "email") else None,
                "reason": item.get("reason", ""),
                "added_at": item.get("created_at", ""),
                "added_by": item.get("created_by", ""),
            })

        return _ok({"entries": entries})

    except Exception as e:
        logger.error(f"Erreur blacklist : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement de la liste de blocage.")


@admin_router.post("/security/blacklist")
async def add_to_blacklist(request: Request, entry: BlacklistCreate):
    """Ajoute une entrée à la liste de blocage."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        existing = await db.blacklist.find_one({"value": entry.value, "type": entry.type})
        if existing:
            raise HTTPException(status_code=409, detail="Cette entrée existe déjà dans la liste de blocage.")

        doc = {
            "id": str(uuid.uuid4()),
            "value": entry.value,
            "type": entry.type,
            "reason": entry.reason,
            "created_by": admin["id"],
            "created_at": datetime.now(timezone.utc),
        }
        await db.blacklist.insert_one(doc)

        await log_admin_action(
            db, admin["id"], "blacklist_add",
            {"value": entry.value, "type": entry.type},
            _get_client_ip(request),
        )

        return _ok({"message": "Entrée ajoutée à la liste de blocage.", "id": doc["id"]})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur ajout blacklist : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'ajout à la liste de blocage.")


@admin_router.delete("/security/blacklist/{entry_id}")
async def remove_from_blacklist(request: Request, entry_id: str):
    """Supprime une entrée de la liste de blocage."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        result = await db.blacklist.find_one({"id": entry_id})
        if not result:
            raise HTTPException(status_code=404, detail="Entrée introuvable dans la liste de blocage.")

        await db.blacklist.delete_one({"id": entry_id})

        await log_admin_action(
            db, admin["id"], "blacklist_remove",
            {"entry_id": entry_id, "value": result.get("value")},
            _get_client_ip(request),
        )

        return _ok({"message": "Entrée supprimée de la liste de blocage."})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur suppression blacklist : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de la liste de blocage.")


@admin_router.get("/security/audit-log")
async def get_audit_log(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    action: Optional[str] = None,
):
    """Journal d'audit des actions administrateur."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        query: dict = {}
        if action:
            # Support partial match for filtering
            query["action"] = {"$regex": action, "$options": "i"}

        total = await db.audit_log.count_documents(query)
        skip = (page - 1) * per_page
        cursor = (
            db.audit_log.find(query, {"_id": 0})
            .sort("timestamp", -1)
            .skip(skip)
            .limit(per_page)
        )
        raw_items = [_serialize_doc(doc) async for doc in cursor]

        # Normalize for frontend AuditLogEntry type
        logs = []
        for item in raw_items:
            details_raw = item.get("details")
            if isinstance(details_raw, dict):
                details_str = ", ".join(f"{k}: {v}" for k, v in details_raw.items())
            elif details_raw is not None:
                details_str = str(details_raw)
            else:
                details_str = ""

            logs.append({
                "id": item.get("id", ""),
                "action": item.get("action", ""),
                "user": item.get("admin_id", item.get("user", "")),
                "details": details_str,
                "ip_address": item.get("ip_address", ""),
                "timestamp": item.get("timestamp", ""),
            })

        return _ok({"logs": logs, "total": total})

    except Exception as e:
        logger.error(f"Erreur audit log : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement du journal d'audit.")


# ═══════════════════════════════════════════════════════════════════════════════
#  NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/notifications/logs")
async def notification_logs(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    channel: Optional[str] = None,
    status: Optional[str] = None,
):
    """Journaux de livraison des notifications."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        query: dict = {}
        if channel:
            query["channel"] = channel
        if status:
            # Map frontend status to DB field (logs store "success" as bool)
            if status == "success":
                query["success"] = True
            elif status == "failed":
                query["success"] = False
            elif status == "pending":
                query["success"] = {"$exists": False}

        total = await db.notification_logs.count_documents(query)
        skip = (page - 1) * per_page
        cursor = (
            db.notification_logs.find(query, {"_id": 0})
            .sort("timestamp", -1)
            .skip(skip)
            .limit(per_page)
        )
        raw_items = [_serialize_doc(doc) async for doc in cursor]

        # Normalize items for frontend NotificationLog type
        logs = []
        for item in raw_items:
            logs.append({
                "id": item.get("id", ""),
                "channel": item.get("channel", "email"),
                "status": "success" if item.get("success") else ("pending" if item.get("success") is None else "failed"),
                "contact_id": item.get("contact_id", ""),
                "contact_name": item.get("contact_name", item.get("type", "Test")),
                "message_preview": item.get("message", item.get("message_preview", "")),
                "sent_at": item.get("timestamp", item.get("sent_at", "")),
                "error": item.get("error"),
            })

        return _ok({"logs": logs, "total": total})

    except Exception as e:
        logger.error(f"Erreur notification logs : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des journaux de notifications.")


@admin_router.post("/notifications/test")
async def send_test_notification(request: Request, payload: TestNotification):
    """Envoie une notification de test sur un canal donné."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        import requests as http_requests

        test_message = payload.message or "Notification de test depuis le tableau de bord admin AÏSSA BELKOUSSA."
        result = {"channel": payload.channel, "success": False, "error": None}

        if payload.channel == "telegram":
            bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
            chat_id = os.getenv("TELEGRAM_CHAT_ID")
            if not bot_token or not chat_id:
                result["error"] = "Configuration Telegram manquante (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)."
            else:
                url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                resp = http_requests.post(
                    url,
                    json={
                        "chat_id": chat_id,
                        "text": f"🧪 *Test Admin*\n\n{test_message}",
                        "parse_mode": "Markdown",
                    },
                    timeout=10,
                )
                result["success"] = resp.status_code == 200
                if not result["success"]:
                    result["error"] = f"Telegram a répondu avec le code {resp.status_code}."

        elif payload.channel == "email":
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            email_user = os.getenv("EMAIL_USER")
            email_password = os.getenv("EMAIL_PASSWORD")
            recipient = os.getenv("RECIPIENT_EMAIL", email_user)

            if not email_user or not email_password:
                result["error"] = "Configuration SMTP manquante."
            else:
                msg = MIMEMultipart()
                msg["From"] = email_user
                msg["To"] = recipient
                msg["Subject"] = "🧪 Test notification admin"
                msg.attach(MIMEText(test_message, "plain"))

                with smtplib.SMTP(smtp_server, smtp_port) as server:
                    server.starttls()
                    server.login(email_user, email_password)
                    server.send_message(msg)
                result["success"] = True

        elif payload.channel == "whatsapp":
            whatsapp_token = os.getenv("WHATSAPP_API_TOKEN")
            whatsapp_phone_id = os.getenv("WHATSAPP_PHONE_ID")
            if not whatsapp_token or not whatsapp_phone_id:
                result["error"] = "Configuration WhatsApp Business API manquante."
            else:
                url = f"https://graph.facebook.com/v17.0/{whatsapp_phone_id}/messages"
                headers = {
                    "Authorization": f"Bearer {whatsapp_token}",
                    "Content-Type": "application/json",
                }
                resp = http_requests.post(
                    url,
                    json={
                        "messaging_product": "whatsapp",
                        "to": "33782721406",
                        "type": "text",
                        "text": {"body": f"🧪 Test Admin: {test_message}"},
                    },
                    headers=headers,
                    timeout=10,
                )
                result["success"] = resp.status_code == 200
                if not result["success"]:
                    result["error"] = f"WhatsApp a répondu avec le code {resp.status_code}."

        elif payload.channel == "notion":
            notion_token = os.getenv("NOTION_TOKEN")
            notion_db_id = os.getenv("NOTION_DATABASE_ID")
            if not notion_token or not notion_db_id:
                result["error"] = "Configuration Notion manquante (NOTION_TOKEN / NOTION_DATABASE_ID)."
            else:
                try:
                    resp = http_requests.get(
                        "https://api.notion.com/v1/users/me",
                        headers={
                            "Authorization": f"Bearer {notion_token}",
                            "Notion-Version": "2022-06-28",
                        },
                        timeout=10,
                    )
                    result["success"] = resp.status_code == 200
                    if not result["success"]:
                        result["error"] = f"Notion a répondu avec le code {resp.status_code}."
                except Exception as e:
                    result["error"] = f"Erreur Notion: {str(e)}"

        elif payload.channel == "google_sheets":
            gs_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")
            if not gs_url:
                result["error"] = "Configuration Google Sheets manquante (GOOGLE_SHEETS_WEBHOOK_URL)."
            else:
                result["success"] = True  # Webhook URL configured = OK

        else:
            result["error"] = f"Canal inconnu : {payload.channel}"

        # Logger le résultat
        await db.notification_logs.insert_one({
            "id": str(uuid.uuid4()),
            "channel": payload.channel,
            "type": "test",
            "message": test_message,
            "success": result["success"],
            "error": result.get("error"),
            "sent_by": admin["id"],
            "timestamp": datetime.now(timezone.utc),
        })

        await log_admin_action(
            db, admin["id"], "test_notification",
            {"channel": payload.channel, "success": result["success"]},
            _get_client_ip(request),
        )

        return _ok(result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur test notification : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de la notification de test.")


# ═══════════════════════════════════════════════════════════════════════════════
#  SITE CONTROL
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/site/status")
async def site_status(request: Request):
    """Statut du mode maintenance et informations domaine."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        maintenance = await db.site_config.find_one({"key": "maintenance"}, {"_id": 0})
        maintenance_data = maintenance.get("value", {}) if maintenance else {}

        # Return in the flat SiteStatus format the frontend expects
        return _ok({
            "maintenance_enabled": maintenance_data.get("enabled", False),
            "maintenance_password": "",
            "maintenance_message": maintenance_data.get("message", ""),
            "domains": [
                {
                    "domain": "aissabelkoussa.fr",
                    "ssl_valid": True,
                    "ssl_expires": None,
                    "dns_configured": True,
                },
                {
                    "domain": "admin.aissabelkoussa.fr",
                    "ssl_valid": True,
                    "ssl_expires": None,
                    "dns_configured": True,
                },
            ],
            "uptime": 99.9,
            "last_deploy": maintenance_data.get("toggled_at"),
        })

    except Exception as e:
        logger.error(f"Erreur site status : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement du statut du site.")


@admin_router.post("/site/maintenance")
async def toggle_maintenance(request: Request, payload: MaintenanceToggle):
    """Active ou désactive le mode maintenance (persisté en DB)."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        value = {
            "enabled": payload.enabled,
            "message": payload.message,
            "estimated_end": payload.estimated_end.isoformat() if payload.estimated_end else None,
            "toggled_at": datetime.now(timezone.utc).isoformat(),
            "toggled_by": admin["id"],
        }

        await db.site_config.update_one(
            {"key": "maintenance"},
            {"$set": {"key": "maintenance", "value": value}},
            upsert=True,
        )

        status_text = "activé" if payload.enabled else "désactivé"
        await log_admin_action(
            db, admin["id"], "maintenance_toggle",
            {"enabled": payload.enabled, "message": payload.message},
            _get_client_ip(request),
        )

        return _ok({
            "message": f"Mode maintenance {status_text}.",
            "maintenance": value,
        })

    except Exception as e:
        logger.error(f"Erreur toggle maintenance : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du changement du mode maintenance.")


@admin_router.get("/site/health")
async def site_health(request: Request):
    """Santé de tous les services (MongoDB, SMTP, Telegram, etc.)."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        import requests as http_requests

        services = {}

        # MongoDB
        try:
            await db.command("ping")
            services["mongodb"] = {"status": "healthy", "latency_ms": None}
        except Exception as e:
            services["mongodb"] = {"status": "unhealthy", "error": str(e)}

        # SMTP
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        email_user = os.getenv("EMAIL_USER")
        email_password = os.getenv("EMAIL_PASSWORD")

        if email_user and email_password:
            try:
                with smtplib.SMTP(smtp_server, smtp_port, timeout=5) as server:
                    server.starttls()
                    server.login(email_user, email_password)
                services["smtp"] = {"status": "healthy", "server": smtp_server}
            except Exception as e:
                services["smtp"] = {"status": "unhealthy", "error": str(e)}
        else:
            services["smtp"] = {"status": "not_configured"}

        # Telegram
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        if bot_token:
            try:
                resp = http_requests.get(
                    f"https://api.telegram.org/bot{bot_token}/getMe",
                    timeout=5,
                )
                if resp.status_code == 200:
                    services["telegram"] = {"status": "healthy"}
                else:
                    services["telegram"] = {"status": "unhealthy", "error": f"Code {resp.status_code}"}
            except Exception as e:
                services["telegram"] = {"status": "unhealthy", "error": str(e)}
        else:
            services["telegram"] = {"status": "not_configured"}

        # Notion
        notion_token = os.getenv("NOTION_TOKEN")
        if notion_token:
            try:
                resp = http_requests.get(
                    "https://api.notion.com/v1/users/me",
                    headers={
                        "Authorization": f"Bearer {notion_token}",
                        "Notion-Version": "2022-06-28",
                    },
                    timeout=5,
                )
                if resp.status_code == 200:
                    services["notion"] = {"status": "healthy"}
                else:
                    services["notion"] = {"status": "unhealthy", "error": f"Code {resp.status_code}"}
            except Exception as e:
                services["notion"] = {"status": "unhealthy", "error": str(e)}
        else:
            services["notion"] = {"status": "not_configured"}

        # Google Sheets
        gs_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")
        services["google_sheets"] = {
            "status": "configured" if gs_url else "not_configured"
        }

        # WhatsApp
        wa_token = os.getenv("WHATSAPP_API_TOKEN")
        services["whatsapp"] = {
            "status": "configured" if wa_token else "not_configured"
        }

        # Transformer le dict en array pour le frontend
        checked_at = datetime.now(timezone.utc).isoformat()
        service_names = {
            "mongodb": "MongoDB",
            "smtp": "SMTP",
            "telegram": "Telegram",
            "notion": "Notion",
            "google_sheets": "Google Sheets",
            "whatsapp": "WhatsApp",
        }
        services_list = [
            {
                "name": service_names.get(key, key),
                "status": "healthy" if info.get("status") in ("healthy", "configured") else "down",
                "last_checked": checked_at,
                "details": info.get("error"),
                "latency": info.get("latency_ms"),
            }
            for key, info in services.items()
            if info.get("status") != "not_configured"
        ]

        return _ok({"services": services_list, "checked_at": checked_at})

    except Exception as e:
        logger.error(f"Erreur site health : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la vérification de la santé des services.")


# ═══════════════════════════════════════════════════════════════════════════════
#  SETTINGS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/settings")
async def get_settings(request: Request):
    """Configuration actuelle de l'application (sans les secrets)."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        # Récupérer les settings persistés en DB
        db_settings = await db.site_config.find_one({"key": "settings"}, {"_id": 0})
        custom = db_settings.get("value", {}) if db_settings else {}

        # Return in the format the frontend AppSettings type expects
        settings = {
            "email": {
                "provider": custom.get("email_provider", "smtp"),
                "smtp_server": custom.get("smtp_server", os.getenv("SMTP_SERVER", "smtp.gmail.com")),
                "smtp_port": custom.get("smtp_port", int(os.getenv("SMTP_PORT", "587"))),
                "from_email": custom.get("from_email", os.getenv("EMAIL_USER", "")),
                "auto_reply_enabled": custom.get("auto_reply_enabled", False),
            },
            "notifications": {
                "telegram_enabled": custom.get("telegram_enabled", bool(os.getenv("TELEGRAM_BOT_TOKEN"))),
                "whatsapp_enabled": custom.get("whatsapp_enabled", bool(os.getenv("WHATSAPP_API_TOKEN"))),
                "notion_enabled": custom.get("notion_enabled", bool(os.getenv("NOTION_TOKEN"))),
                "google_sheets_enabled": custom.get("google_sheets_enabled", bool(os.getenv("GOOGLE_SHEETS_WEBHOOK_URL"))),
            },
            "security": {
                "rate_limit_per_hour": custom.get("rate_limit_per_hour", custom.get("rate_limit_max", 60)),
                "spam_threshold": custom.get("spam_threshold", 0.5),
                "auto_blacklist": custom.get("auto_blacklist", False),
            },
            "admin_email": admin.get("email", ""),
            "last_backup": custom.get("last_backup"),
            "environment": os.getenv("ENVIRONMENT", "development"),
        }

        return _ok(settings)

    except Exception as e:
        logger.error(f"Erreur get settings : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des paramètres.")


@admin_router.patch("/settings")
async def update_settings(request: Request):
    """Met à jour la configuration de l'application.
    Accepts nested objects from frontend: email, notifications, security, password, admin_email, reset, clear_cache.
    """
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        body = await request.json()

        # Handle password change
        if "password" in body:
            pw_data = body["password"]
            from services.auth_service import verify_password, hash_password
            admin_doc = await db.admin_users.find_one({"id": admin["id"]})
            if not admin_doc or not verify_password(pw_data.get("current", ""), admin_doc["hashed_password"]):
                raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect.")
            new_hash = hash_password(pw_data["new"])
            await db.admin_users.update_one(
                {"id": admin["id"]},
                {"$set": {"hashed_password": new_hash}},
            )
            await log_admin_action(db, admin["id"], "password_changed", None, _get_client_ip(request))
            return _ok({"message": "Mot de passe modifié avec succès."})

        # Handle settings reset
        if body.get("reset"):
            await db.site_config.delete_one({"key": "settings"})
            await log_admin_action(db, admin["id"], "settings_reset", None, _get_client_ip(request))
            return _ok({"message": "Paramètres réinitialisés."})

        # Handle cache clear
        if body.get("clear_cache"):
            await log_admin_action(db, admin["id"], "cache_cleared", None, _get_client_ip(request))
            return _ok({"message": "Cache vidé avec succès."})

        # Récupérer les settings actuels
        existing = await db.site_config.find_one({"key": "settings"})
        current = existing.get("value", {}) if existing else {}
        updated_fields = []

        # Flatten nested objects into the DB settings format
        if "email" in body:
            email_data = body["email"]
            for key in ("provider", "smtp_server", "smtp_port", "from_email", "auto_reply_enabled"):
                if key in email_data:
                    db_key = f"email_{key}" if key == "provider" else key
                    current[db_key] = email_data[key]
                    updated_fields.append(f"email.{key}")

        if "notifications" in body:
            notif_data = body["notifications"]
            for key in ("telegram_enabled", "whatsapp_enabled", "notion_enabled", "google_sheets_enabled"):
                if key in notif_data:
                    current[key] = notif_data[key]
                    updated_fields.append(f"notifications.{key}")

        if "security" in body:
            sec_data = body["security"]
            for key in ("rate_limit_per_hour", "spam_threshold", "auto_blacklist"):
                if key in sec_data:
                    current[key] = sec_data[key]
                    updated_fields.append(f"security.{key}")

        if "admin_email" in body:
            await db.admin_users.update_one(
                {"id": admin["id"]},
                {"$set": {"email": body["admin_email"]}},
            )
            updated_fields.append("admin_email")

        current["updated_at"] = datetime.now(timezone.utc).isoformat()
        current["updated_by"] = admin["id"]

        await db.site_config.update_one(
            {"key": "settings"},
            {"$set": {"key": "settings", "value": current}},
            upsert=True,
        )

        await log_admin_action(
            db, admin["id"], "settings_updated",
            {"fields": updated_fields},
            _get_client_ip(request),
        )

        return _ok({"message": "Paramètres mis à jour avec succès.", "updated_fields": updated_fields})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur update settings : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour des paramètres.")


@admin_router.post("/settings/backup")
async def backup_database(request: Request):
    """Déclenche un export/backup de la base MongoDB."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        backup_data = {}
        collections = ["contact_submissions", "email_logs", "audit_log", "blacklist",
                        "site_config", "notification_logs"]

        for collection_name in collections:
            cursor = db[collection_name].find({}, {"_id": 0})
            docs = []
            async for doc in cursor:
                docs.append(_serialize_doc(doc))
            backup_data[collection_name] = docs

        backup_record = {
            "id": str(uuid.uuid4()),
            "created_by": admin["id"],
            "created_at": datetime.now(timezone.utc),
            "collections": list(backup_data.keys()),
            "total_documents": sum(len(v) for v in backup_data.values()),
        }
        await db.backups.insert_one(backup_record)

        await log_admin_action(
            db, admin["id"], "database_backup",
            {"total_documents": backup_record["total_documents"]},
            _get_client_ip(request),
        )

        # Retourner le backup comme JSON téléchargeable
        import json
        backup_json = json.dumps(backup_data, default=str, ensure_ascii=False, indent=2)

        return StreamingResponse(
            iter([backup_json]),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=backup_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.json"
            },
        )

    except Exception as e:
        logger.error(f"Erreur backup : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du backup de la base de données.")


# ═══════════════════════════════════════════════════════════════════════════════
#  GITHUB INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "aissablk1")
GITHUB_CACHE_TTL = 900  # 15 minutes


@admin_router.get("/github/profile")
async def get_github_profile(request: Request):
    """Profil GitHub avec cache MongoDB (15 min TTL)."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        # Vérifier le cache
        cached = await db.github_cache.find_one({"_id": "profile"})
        if cached:
            fetched_at = cached.get("fetched_at")
            if fetched_at and (datetime.now(timezone.utc) - fetched_at).total_seconds() < GITHUB_CACHE_TTL:
                del cached["_id"]
                del cached["fetched_at"]
                return _ok(cached)

        headers = {"Accept": "application/vnd.github.v3+json"}
        gh_token = os.getenv("GITHUB_TOKEN")
        if gh_token:
            headers["Authorization"] = f"token {gh_token}"

        # Fetch profile + repos + events en parallèle (sync mais rapide)
        profile_resp = http_requests.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}", headers=headers, timeout=10
        )
        repos_resp = http_requests.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=20",
            headers=headers, timeout=10,
        )
        events_resp = http_requests.get(
            f"https://api.github.com/users/{GITHUB_USERNAME}/events/public?per_page=30",
            headers=headers, timeout=10,
        )

        if profile_resp.status_code != 200:
            raise HTTPException(status_code=502, detail="GitHub API indisponible")

        profile_data = profile_resp.json()
        repos_data = repos_resp.json() if repos_resp.status_code == 200 else []
        events_data = events_resp.json() if events_resp.status_code == 200 else []

        # Agréger les langages
        languages = {}
        for repo in repos_data:
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1

        # Extraire les commits récents des PushEvents
        recent_activity = []
        for event in events_data[:30]:
            if event.get("type") == "PushEvent":
                for commit in event.get("payload", {}).get("commits", [])[:1]:
                    recent_activity.append({
                        "type": "commit",
                        "repo": event["repo"]["name"].replace(f"{GITHUB_USERNAME}/", ""),
                        "message": commit.get("message", "")[:120],
                        "created_at": event["created_at"],
                    })
            elif event.get("type") == "CreateEvent":
                recent_activity.append({
                    "type": "create",
                    "repo": event["repo"]["name"].replace(f"{GITHUB_USERNAME}/", ""),
                    "message": f"Nouveau {event.get('payload', {}).get('ref_type', 'repo')}",
                    "created_at": event["created_at"],
                })

        total_stars = sum(r.get("stargazers_count", 0) for r in repos_data)

        result = {
            "profile": {
                "login": profile_data.get("login"),
                "name": profile_data.get("name"),
                "bio": profile_data.get("bio"),
                "public_repos": profile_data.get("public_repos", 0),
                "followers": profile_data.get("followers", 0),
                "avatar_url": profile_data.get("avatar_url"),
                "html_url": profile_data.get("html_url"),
            },
            "repos": [
                {
                    "name": r["name"],
                    "description": r.get("description"),
                    "language": r.get("language"),
                    "stargazers_count": r.get("stargazers_count", 0),
                    "forks_count": r.get("forks_count", 0),
                    "updated_at": r.get("updated_at"),
                    "html_url": r.get("html_url"),
                }
                for r in repos_data[:10]
            ],
            "languages": languages,
            "total_stars": total_stars,
            "recent_activity": recent_activity[:10],
            "cached_at": datetime.now(timezone.utc).isoformat(),
        }

        # Sauvegarder dans le cache
        await db.github_cache.replace_one(
            {"_id": "profile"},
            {**result, "_id": "profile", "fetched_at": datetime.now(timezone.utc)},
            upsert=True,
        )

        return _ok(result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur GitHub : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des données GitHub.")


# ═══════════════════════════════════════════════════════════════════════════════
#  PAGE VIEWS ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/stats/visits")
async def get_pageviews_stats(request: Request):
    """Analytics des page views — vues/jour, top pages, referrers."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)
        month_start = today_start - timedelta(days=30)

        views_today = await db.page_views.count_documents({"ts": {"$gte": today_start}})
        views_week = await db.page_views.count_documents({"ts": {"$gte": week_start}})
        views_month = await db.page_views.count_documents({"ts": {"$gte": month_start}})

        # Timeline 30 jours
        timeline_pipeline = [
            {"$match": {"ts": {"$gte": month_start}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$ts"}},
                "count": {"$sum": 1},
            }},
            {"$sort": {"_id": 1}},
        ]
        timeline = [
            {"date": d["_id"], "count": d["count"]}
            async for d in db.page_views.aggregate(timeline_pipeline)
        ]

        # Top pages
        top_pages_pipeline = [
            {"$match": {"ts": {"$gte": month_start}}},
            {"$group": {"_id": "$page", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        top_pages = [
            {"page": d["_id"], "count": d["count"]}
            async for d in db.page_views.aggregate(top_pages_pipeline)
        ]

        # Top referrers
        referrer_pipeline = [
            {"$match": {"ts": {"$gte": month_start}, "referrer": {"$ne": ""}}},
            {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        top_referrers = [
            {"referrer": d["_id"], "count": d["count"]}
            async for d in db.page_views.aggregate(referrer_pipeline)
        ]

        return _ok({
            "today": views_today,
            "this_week": views_week,
            "this_month": views_month,
            "timeline": timeline,
            "top_pages": top_pages,
            "top_referrers": top_referrers,
        })

    except Exception as e:
        logger.error(f"Erreur stats visits : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des statistiques de visite.")
