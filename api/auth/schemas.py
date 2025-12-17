"""
Pydantic schemas for authentication requests and responses.
Includes custom fields for user background data.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# -----------------------------------------------------------------------------
# User Schemas
# -----------------------------------------------------------------------------

class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    name: Optional[str] = Field(None, max_length=255)


class UserCreate(UserBase):
    """
    Schema for user registration (signup).
    Includes custom background fields for content personalization.
    """
    password: str = Field(..., min_length=8, max_length=128)
    software_background: Optional[str] = Field(
        None,
        max_length=1000,
        description="Your software/programming experience (e.g., 'Python intermediate, ROS 2 beginner, familiar with TensorFlow')"
    )
    hardware_background: Optional[str] = Field(
        None,
        max_length=1000,
        description="Your hardware/robotics experience (e.g., 'Jetson Nano projects, Arduino basics, built a robot arm')"
    )


class UserLogin(BaseModel):
    """Schema for user login (signin)."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = Field(None, max_length=255)
    software_background: Optional[str] = Field(None, max_length=1000)
    hardware_background: Optional[str] = Field(None, max_length=1000)


class UserResponse(UserBase):
    """Schema for user data in API responses (excludes password)."""
    id: str
    is_active: bool
    is_verified: bool
    software_background: Optional[str] = None
    hardware_background: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    """Schema for user profile endpoint response."""
    user: UserResponse
    message: str = "Profile retrieved successfully"


# -----------------------------------------------------------------------------
# Authentication Schemas
# -----------------------------------------------------------------------------

class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Token expiration time in seconds")
    user: UserResponse


class SignupResponse(BaseModel):
    """Schema for signup response."""
    message: str = "User registered successfully"
    user: UserResponse
    access_token: str
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    """Schema for login response."""
    message: str = "Login successful"
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    success: bool = False
