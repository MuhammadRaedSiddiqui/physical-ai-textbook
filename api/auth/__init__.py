"""
Authentication module for Physical AI Textbook.

Provides complete signup/signin flow with custom user fields
for content personalization.

Usage:
    from auth import auth_router, get_current_user, create_db_and_tables

    # Add router to FastAPI app
    app.include_router(auth_router)

    # Create tables on startup
    @app.on_event("startup")
    async def startup():
        await create_db_and_tables()

    # Protect routes with authentication
    @app.get("/protected")
    async def protected_route(user: User = Depends(get_current_user)):
        return {"user_id": user.id}
"""

from .router import router as auth_router
from .database import create_db_and_tables, get_async_session
from .dependencies import get_current_user, get_current_user_optional, get_current_superuser
from .models import User, Base
from .schemas import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    SignupResponse,
    LoginResponse,
    MessageResponse,
)
from .service import UserService
from .security import create_access_token, verify_password, get_password_hash

__all__ = [
    # Router
    "auth_router",
    # Database
    "create_db_and_tables",
    "get_async_session",
    # Dependencies
    "get_current_user",
    "get_current_user_optional",
    "get_current_superuser",
    # Models
    "User",
    "Base",
    # Schemas
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "SignupResponse",
    "LoginResponse",
    "MessageResponse",
    # Services
    "UserService",
    # Security
    "create_access_token",
    "verify_password",
    "get_password_hash",
]
