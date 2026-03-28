"""
Service d'authentification JWT pour l'API d'administration.
Gestion des tokens, hashing de mots de passe, et CRUD des administrateurs.
"""

import os
import uuid
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Set

from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import Request, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

# ─── Configuration ────────────────────────────────────────────────────────────

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "dev-secret-key-change-in-production-aissa-portfolio-2026"
)
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# ─── Password Hashing ────────────────────────────────────────────────────────

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── Token Blacklist (en mémoire, persisté en DB aussi) ──────────────────────

_blacklisted_tokens: Set[str] = set()


# ─── Fonctions de hashing ────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash un mot de passe avec bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe contre son hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ─── Fonctions JWT ───────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crée un token d'accès JWT."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.now(timezone.utc),
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crée un token de rafraîchissement JWT."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.now(timezone.utc),
        "jti": str(uuid.uuid4()),
    })
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[Dict]:
    """Vérifie et décode un token JWT. Retourne None si invalide."""
    try:
        if token in _blacklisted_tokens:
            logger.warning("Tentative d'utilisation d'un token révoqué")
            return None

        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError:
        logger.info("Token expiré")
        return None
    except JWTError as e:
        logger.warning(f"Erreur de vérification du token : {str(e)}")
        return None


async def blacklist_token(db: AsyncIOMotorDatabase, token: str) -> None:
    """Ajoute un token à la liste noire (mémoire + DB)."""
    _blacklisted_tokens.add(token)
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM],
            options={"verify_exp": False}
        )
        await db.token_blacklist.insert_one({
            "token": token,
            "jti": payload.get("jti"),
            "exp": datetime.fromtimestamp(payload.get("exp", 0), tz=timezone.utc),
            "blacklisted_at": datetime.now(timezone.utc),
        })
    except Exception as e:
        logger.error(f"Erreur lors du blacklisting du token : {str(e)}")


async def load_blacklisted_tokens(db: AsyncIOMotorDatabase) -> None:
    """Charge les tokens blacklistés depuis la DB au démarrage."""
    try:
        now = datetime.now(timezone.utc)
        cursor = db.token_blacklist.find({"exp": {"$gt": now}})
        async for doc in cursor:
            _blacklisted_tokens.add(doc["token"])
        logger.info(f"{len(_blacklisted_tokens)} tokens blacklistés chargés depuis la DB")
    except Exception as e:
        logger.error(f"Erreur lors du chargement des tokens blacklistés : {str(e)}")


# ─── CRUD Admin ──────────────────────────────────────────────────────────────

async def create_admin_user(
    db: AsyncIOMotorDatabase,
    username: str,
    email: str,
    password: str
) -> Optional[Dict]:
    """Crée un nouvel administrateur."""
    try:
        existing = await db.admin_users.find_one({"username": username})
        if existing:
            logger.warning(f"L'administrateur '{username}' existe déjà")
            return None

        admin_doc = {
            "id": str(uuid.uuid4()),
            "username": username,
            "email": email,
            "hashed_password": hash_password(password),
            "created_at": datetime.now(timezone.utc),
            "last_login": None,
            "is_active": True,
        }

        await db.admin_users.insert_one(admin_doc)
        logger.info(f"Administrateur '{username}' créé avec succès")

        safe_admin = {k: v for k, v in admin_doc.items() if k not in ("hashed_password", "_id")}
        return safe_admin

    except Exception as e:
        logger.error(f"Erreur lors de la création de l'administrateur : {str(e)}")
        return None


async def authenticate_admin(
    db: AsyncIOMotorDatabase,
    username: str,
    password: str
) -> Optional[Dict]:
    """Authentifie un administrateur. Retourne les données si valide, None sinon."""
    try:
        admin = await db.admin_users.find_one({"username": username})
        if not admin:
            logger.info(f"Tentative de connexion avec un nom d'utilisateur inconnu : '{username}'")
            return None

        if not admin.get("is_active", True):
            logger.warning(f"Tentative de connexion avec un compte désactivé : '{username}'")
            return None

        if not verify_password(password, admin["hashed_password"]):
            logger.warning(f"Mot de passe incorrect pour '{username}'")
            return None

        # Mettre à jour la date de dernière connexion
        await db.admin_users.update_one(
            {"_id": admin["_id"]},
            {"$set": {"last_login": datetime.now(timezone.utc)}}
        )

        safe_admin = {
            "id": admin["id"],
            "username": admin["username"],
            "email": admin["email"],
            "created_at": admin["created_at"],
            "last_login": datetime.now(timezone.utc),
            "is_active": admin["is_active"],
        }
        return safe_admin

    except Exception as e:
        logger.error(f"Erreur lors de l'authentification : {str(e)}")
        return None


async def get_admin_by_id(db: AsyncIOMotorDatabase, admin_id: str) -> Optional[Dict]:
    """Récupère un administrateur par son ID."""
    try:
        admin = await db.admin_users.find_one({"id": admin_id})
        if not admin:
            return None
        return {
            "id": admin["id"],
            "username": admin["username"],
            "email": admin["email"],
            "created_at": admin["created_at"],
            "last_login": admin.get("last_login"),
            "is_active": admin.get("is_active", True),
        }
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'admin : {str(e)}")
        return None


# ─── Dépendance FastAPI ──────────────────────────────────────────────────────

async def get_current_admin(request: Request, db: AsyncIOMotorDatabase) -> Dict:
    """
    Dépendance FastAPI pour extraire et vérifier l'admin courant
    à partir du cookie d'accès JWT.
    Lève HTTPException 401 si non authentifié.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié. Veuillez vous connecter.",
        )

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré. Veuillez vous reconnecter.",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Type de token invalide.",
        )

    admin = await get_admin_by_id(db, payload.get("sub", ""))
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrateur introuvable.",
        )

    if not admin.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte administrateur désactivé.",
        )

    return admin


# ─── Audit Log ────────────────────────────────────────────────────────────────

async def log_admin_action(
    db: AsyncIOMotorDatabase,
    admin_id: str,
    action: str,
    details: Optional[Dict] = None,
    ip_address: Optional[str] = None,
) -> None:
    """Enregistre une action d'administration dans le journal d'audit."""
    try:
        await db.audit_log.insert_one({
            "id": str(uuid.uuid4()),
            "admin_id": admin_id,
            "action": action,
            "details": details or {},
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc),
        })
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement de l'action d'audit : {str(e)}")
