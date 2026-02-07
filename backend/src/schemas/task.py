"""Task Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
import uuid


class TaskCreate(BaseModel):
    """Request schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = Field(None, max_length=5000)
    priority: Optional[str] = Field("medium", pattern=r"^(low|medium|high|urgent)$")
    due_date: Optional[datetime] = None
    recurrence_pattern: Optional[str] = Field("none", pattern=r"^(none|daily|weekly|monthly)$")
    tags: Optional[List[str]] = None

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        """Validate title is not empty or whitespace."""
        if not v or not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()


class TaskUpdate(BaseModel):
    """Request schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = Field(None, max_length=5000)
    priority: Optional[str] = Field(None, pattern=r"^(low|medium|high|urgent)$")
    due_date: Optional[datetime] = None
    recurrence_pattern: Optional[str] = Field(None, pattern=r"^(none|daily|weekly|monthly)$")
    tags: Optional[List[str]] = None

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate title is not empty or whitespace if provided."""
        if v is not None and (not v or not v.strip()):
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip() if v else v


class TaskComplete(BaseModel):
    """Request schema for toggling task completion."""
    is_completed: bool


class TaskResponse(BaseModel):
    """Response schema for task data."""
    id: int
    user_id: uuid.UUID
    title: str
    description: Optional[str]
    is_completed: bool
    priority: str = "medium"
    due_date: Optional[datetime] = None
    recurrence_pattern: str = "none"
    tags: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActivityLogResponse(BaseModel):
    """Response schema for activity log entries."""
    id: int
    user_id: uuid.UUID
    task_id: Optional[int]
    action: str
    details: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
