"""
User models with custom fields for the Physical AI Textbook authentication system.
Extends FastAPI-Users base models to include softwareBackground and hardwareBackground.
"""

from typing import Optional
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


class User(Base):
    """
    User model with extended profile fields for content personalization.

    Custom fields:
    - software_background: User's programming/software experience (Python, ROS 2, etc.)
    - hardware_background: User's hardware/robotics experience (Jetson, Arduino, etc.)
    """
    __tablename__ = "users"

    # Core authentication fields
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(1024), nullable=False)

    # Profile fields
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Custom fields for content personalization
    software_background: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
        comment="User's software/programming experience (e.g., Python, ROS 2, TensorFlow)"
    )
    hardware_background: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
        comment="User's hardware/robotics experience (e.g., Jetson Nano, Arduino, Robotics kits)"
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, email={self.email!r}, name={self.name!r})"
