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
    SettingsUpdate,
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
    """Configure les cookies httpOnly pour les tokens JWT."""
    is_prod = _is_production()
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_prod,
        samesite="lax",
        max_age=30 * 60,  # 30 min
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_prod,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 jours
        path="/api/admin/refresh",
    )


def _clear_auth_cookies(response: Response):
    """Supprime les cookies d'authentification."""
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/api/admin/refresh")


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
        "created_at": admin["created_at"].isoformat() if isinstance(admin["created_at"], datetime) else admin["created_at"],
        "last_login": admin["last_login"].isoformat() if isinstance(admin.get("last_login"), datetime) else admin.get("last_login"),
        "is_active": admin["is_active"],
    })


# ═══════════════════════════════════════════════════════════════════════════════
#  DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════


@admin_router.get("/dashboard")
async def get_dashboard(request: Request):
    """Vue d'ensemble du tableau de bord — stats, contacts récents, santé des services."""
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
        pending = await db.contact_submissions.count_documents({"status": "pending"})
        processed = await db.contact_submissions.count_documents({"status": "processed"})
        replied = await db.contact_submissions.count_documents({"status": "replied"})
        spam_count = await db.contact_submissions.count_documents({"status": "spam"})

        # Contacts récents (5 derniers)
        recent_cursor = db.contact_submissions.find(
            {"status": {"$ne": "spam"}},
            {"_id": 0, "ip_address": 0, "user_agent": 0}
        ).sort("timestamp", -1).limit(5)
        recent = [_serialize_doc(doc) async for doc in recent_cursor]

        # Santé des services
        services = {
            "mongodb": True,
            "smtp": bool(os.getenv("EMAIL_USER") and os.getenv("EMAIL_PASSWORD")),
            "telegram": bool(os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("TELEGRAM_CHAT_ID")),
            "notion": bool(os.getenv("NOTION_TOKEN")),
            "google_sheets": bool(os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")),
        }

        try:
            await db.command("ping")
        except Exception:
            services["mongodb"] = False

        # Timeline 7 derniers jours
        pipeline = [
            {"$match": {"timestamp": {"$gte": today_start - timedelta(days=7)}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}
                    },
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"_id": 1}},
        ]
        timeline_cursor = db.contact_submissions.aggregate(pipeline)
        timeline = [{"date": doc["_id"], "count": doc["count"]} async for doc in timeline_cursor]

        return _ok({
            "stats": {
                "total": total,
                "today": today_count,
                "this_week": week_count,
                "this_month": month_count,
                "pending": pending,
                "processed": processed,
                "replied": replied,
                "spam": spam_count,
            },
            "recent_contacts": recent,
            "services": services,
            "timeline": timeline,
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
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

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

        return _ok({"rate_limits": rate_data})

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
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

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
        query = {}
        if action:
            query["action"] = action

        total = await db.audit_log.count_documents(query)
        skip = (page - 1) * per_page
        cursor = (
            db.audit_log.find(query, {"_id": 0})
            .sort("timestamp", -1)
            .skip(skip)
            .limit(per_page)
        )
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

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
):
    """Journaux de livraison des notifications."""
    db = _get_db()
    await get_current_admin(request, db)

    try:
        total = await db.notification_logs.count_documents({})
        skip = (page - 1) * per_page
        cursor = (
            db.notification_logs.find({}, {"_id": 0})
            .sort("timestamp", -1)
            .skip(skip)
            .limit(per_page)
        )
        items = [_serialize_doc(doc) async for doc in cursor]

        return _paginated(items, total, page, per_page)

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

        return _ok({
            "maintenance": {
                "enabled": maintenance_data.get("enabled", False),
                "message": maintenance_data.get("message"),
                "estimated_end": maintenance_data.get("estimated_end"),
                "toggled_at": maintenance_data.get("toggled_at"),
                "toggled_by": maintenance_data.get("toggled_by"),
            },
            "domains": {
                "main": "aissabelkoussa.fr",
                "admin": "admin.aissabelkoussa.fr",
            },
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

        return _ok({"services": services, "checked_at": datetime.now(timezone.utc).isoformat()})

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
    await get_current_admin(request, db)

    try:
        # Récupérer les settings persistés en DB
        db_settings = await db.site_config.find_one({"key": "settings"}, {"_id": 0})
        custom = db_settings.get("value", {}) if db_settings else {}

        settings = {
            "smtp": {
                "server": custom.get("smtp_server", os.getenv("SMTP_SERVER", "smtp.gmail.com")),
                "port": custom.get("smtp_port", int(os.getenv("SMTP_PORT", "587"))),
                "user_configured": bool(os.getenv("EMAIL_USER")),
                "recipient": custom.get("recipient_email", os.getenv("RECIPIENT_EMAIL", "")),
            },
            "telegram": {
                "configured": bool(os.getenv("TELEGRAM_BOT_TOKEN")),
                "chat_id_set": bool(os.getenv("TELEGRAM_CHAT_ID")),
            },
            "notion": {
                "configured": bool(os.getenv("NOTION_TOKEN")),
                "database_id_set": bool(os.getenv("NOTION_DATABASE_ID")),
            },
            "google_sheets": {
                "configured": bool(os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")),
            },
            "whatsapp": {
                "configured": bool(os.getenv("WHATSAPP_API_TOKEN")),
            },
            "spam_protection": {
                "threshold": custom.get("spam_threshold", 0.5),
                "rate_limit_max": custom.get("rate_limit_max", 3),
                "rate_limit_window": custom.get("rate_limit_window", 3600),
            },
            "environment": os.getenv("ENVIRONMENT", "development"),
        }

        return _ok(settings)

    except Exception as e:
        logger.error(f"Erreur get settings : {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors du chargement des paramètres.")


@admin_router.patch("/settings")
async def update_settings(request: Request, payload: SettingsUpdate):
    """Met à jour la configuration de l'application."""
    db = _get_db()
    admin = await get_current_admin(request, db)

    try:
        # Récupérer les settings actuels
        existing = await db.site_config.find_one({"key": "settings"})
        current = existing.get("value", {}) if existing else {}

        # Fusionner les nouvelles valeurs (seulement celles fournies)
        update_data = payload.model_dump(exclude_none=True)
        current.update(update_data)
        current["updated_at"] = datetime.now(timezone.utc).isoformat()
        current["updated_by"] = admin["id"]

        await db.site_config.update_one(
            {"key": "settings"},
            {"$set": {"key": "settings", "value": current}},
            upsert=True,
        )

        await log_admin_action(
            db, admin["id"], "settings_updated",
            {"fields": list(update_data.keys())},
            _get_client_ip(request),
        )

        return _ok({"message": "Paramètres mis à jour avec succès.", "updated_fields": list(update_data.keys())})

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
