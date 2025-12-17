"""
Database configuration for authentication.
Uses async SQLAlchemy with Neon PostgreSQL.
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv

from .models import Base

load_dotenv()


def get_async_database_url() -> str:
    """
    Convert standard PostgreSQL URL to async format for SQLAlchemy.
    Neon uses standard postgres:// URLs, we need to convert to postgresql+asyncpg://
    """
    db_url = os.getenv("NEON_DB_URL", "")

    if not db_url:
        raise ValueError("NEON_DB_URL environment variable is not set")

    # Convert postgres:// or postgresql:// to postgresql+asyncpg://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif not db_url.startswith("postgresql+asyncpg://"):
        db_url = f"postgresql+asyncpg://{db_url}"

    # Remove sslmode and channel_binding params (not supported by asyncpg directly)
    # SSL is handled via connect_args instead
    import re
    db_url = re.sub(r'[?&]sslmode=[^&]*', '', db_url)
    db_url = re.sub(r'[?&]channel_binding=[^&]*', '', db_url)
    # Clean up any trailing ? or &
    db_url = re.sub(r'\?&', '?', db_url)
    db_url = re.sub(r'\?$', '', db_url)

    return db_url


# Create async engine for Neon PostgreSQL
# NullPool is recommended for serverless environments like Neon
engine = create_async_engine(
    get_async_database_url(),
    poolclass=NullPool,  # Recommended for serverless Postgres
    echo=False,  # Set to True for SQL query logging
    connect_args={"ssl": "require"},  # Enable SSL for Neon
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an async database session.
    Use with FastAPI's Depends().
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_db_and_tables():
    """
    Create all database tables.
    Call this on application startup.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_db_and_tables():
    """
    Drop all database tables.
    Use with caution - only for development/testing.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
