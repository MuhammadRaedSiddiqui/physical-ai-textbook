"""
Authentication service layer.
Handles user CRUD operations and authentication logic.
"""

import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User
from .schemas import UserCreate, UserUpdate
from .security import get_password_hash, verify_password


class UserService:
    """Service class for user-related operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get a user by their ID."""
        result = await self.session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get a user by their email address."""
        result = await self.session.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def create(self, user_data: UserCreate) -> User:
        """
        Create a new user.

        Args:
            user_data: User registration data including custom background fields

        Returns:
            Created User object

        Raises:
            ValueError: If email already exists
        """
        # Check if email already exists
        existing_user = await self.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("A user with this email already exists")

        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            email=user_data.email.lower(),
            hashed_password=get_password_hash(user_data.password),
            name=user_data.name,
            software_background=user_data.software_background,
            hardware_background=user_data.hardware_background,
            is_active=True,
            is_verified=False,
            is_superuser=False,
        )

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Args:
            email: User's email address
            password: User's plain text password

        Returns:
            User object if authentication successful, None otherwise
        """
        user = await self.get_by_email(email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        return user

    async def update(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """
        Update a user's profile.

        Args:
            user_id: User's ID
            user_data: Updated user data

        Returns:
            Updated User object or None if user not found
        """
        user = await self.get_by_id(user_id)

        if not user:
            return None

        # Update only provided fields
        update_data = user_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def delete(self, user_id: str) -> bool:
        """
        Delete a user.

        Args:
            user_id: User's ID

        Returns:
            True if user was deleted, False if user not found
        """
        user = await self.get_by_id(user_id)

        if not user:
            return False

        await self.session.delete(user)
        await self.session.commit()

        return True

    async def deactivate(self, user_id: str) -> Optional[User]:
        """
        Deactivate a user account (soft delete).

        Args:
            user_id: User's ID

        Returns:
            Updated User object or None if user not found
        """
        user = await self.get_by_id(user_id)

        if not user:
            return None

        user.is_active = False
        await self.session.commit()
        await self.session.refresh(user)

        return user
