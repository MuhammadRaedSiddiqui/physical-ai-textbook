"""
Security utilities for authentication.
Handles password hashing and JWT token management.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

# JWT Settings
SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "your-secret-key-change-in-production-min-32-chars")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours default

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# -----------------------------------------------------------------------------
# Password Utilities
# -----------------------------------------------------------------------------

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


# -----------------------------------------------------------------------------
# JWT Token Utilities
# -----------------------------------------------------------------------------

def create_access_token(
    data: dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary of claims to encode in the token
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    })

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and validate a JWT access token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Verify it's an access token
        if payload.get("type") != "access":
            return None

        return payload
    except JWTError:
        return None


def get_token_expiry_seconds() -> int:
    """Get token expiration time in seconds."""
    return ACCESS_TOKEN_EXPIRE_MINUTES * 60
