"""
Authentication API routes.
Provides endpoints for signup, signin, profile management, and logout.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_async_session
from .models import User
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
from .security import create_access_token, get_token_expiry_seconds
from .dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


# -----------------------------------------------------------------------------
# Public Routes (No authentication required)
# -----------------------------------------------------------------------------

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email, password, and optional background information for content personalization."
)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Register a new user.

    - **email**: Valid email address (required)
    - **password**: At least 8 characters (required)
    - **name**: User's display name (optional)
    - **software_background**: Programming experience for personalization (optional)
    - **hardware_background**: Hardware/robotics experience for personalization (optional)

    Returns JWT access token and user data on successful registration.
    """
    user_service = UserService(session)

    try:
        user = await user_service.create(user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return SignupResponse(
        message="User registered successfully",
        user=UserResponse.model_validate(user),
        access_token=access_token,
        token_type="bearer",
    )


@router.post(
    "/signin",
    response_model=LoginResponse,
    summary="Sign in with email and password",
    description="Authenticate with email and password to receive a JWT access token."
)
async def signin(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Sign in to an existing account.

    - **email**: Registered email address
    - **password**: Account password

    Returns JWT access token and user data on successful authentication.
    """
    user_service = UserService(session)

    user = await user_service.authenticate(
        email=credentials.email,
        password=credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        expires_in=get_token_expiry_seconds(),
        user=UserResponse.model_validate(user),
    )


# -----------------------------------------------------------------------------
# Protected Routes (Authentication required)
# -----------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Retrieve the authenticated user's profile including background data."
)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Get the current authenticated user's profile.

    Requires a valid JWT token in the Authorization header:
    `Authorization: Bearer <token>`

    Returns full user profile including custom background fields.
    """
    return UserResponse.model_validate(current_user)


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
    description="Update the authenticated user's profile information."
)
async def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Update the current user's profile.

    - **name**: Update display name
    - **software_background**: Update software experience
    - **hardware_background**: Update hardware experience

    All fields are optional - only provided fields will be updated.
    """
    user_service = UserService(session)

    updated_user = await user_service.update(
        user_id=current_user.id,
        user_data=user_data
    )

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse.model_validate(updated_user)


@router.post(
    "/signout",
    response_model=MessageResponse,
    summary="Sign out current user",
    description="Invalidate the current session (client should discard token)."
)
async def signout(
    current_user: User = Depends(get_current_user),
):
    """
    Sign out the current user.

    Note: JWT tokens are stateless, so this endpoint is primarily
    for client-side cleanup. The client should discard the token
    after receiving this response.

    For enhanced security, implement a token blacklist or use
    short-lived tokens with refresh tokens.
    """
    return MessageResponse(
        message="Signed out successfully",
        success=True
    )


@router.delete(
    "/me",
    response_model=MessageResponse,
    summary="Delete current user account",
    description="Permanently delete the authenticated user's account."
)
async def delete_me(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Delete the current user's account.

    WARNING: This action is irreversible. All user data will be permanently deleted.
    """
    user_service = UserService(session)

    deleted = await user_service.delete(current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return MessageResponse(
        message="Account deleted successfully",
        success=True
    )


# -----------------------------------------------------------------------------
# Utility Routes
# -----------------------------------------------------------------------------

@router.get(
    "/verify-token",
    response_model=MessageResponse,
    summary="Verify JWT token",
    description="Check if the current JWT token is valid."
)
async def verify_token(
    current_user: User = Depends(get_current_user),
):
    """
    Verify that the current JWT token is valid.

    Returns success if the token is valid and the user exists.
    Useful for client-side token validation on app startup.
    """
    return MessageResponse(
        message="Token is valid",
        success=True
    )
