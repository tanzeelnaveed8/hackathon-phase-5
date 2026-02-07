"""Task model definition."""
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from datetime import datetime
from typing import Optional, List
from enum import Enum
import uuid


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class RecurrencePattern(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class Task(SQLModel, table=True):
    """
    Task entity representing a todo item.

    Each task belongs to exactly one user. All task operations must
    enforce user ownership to prevent cross-user data access.
    """
    __tablename__ = "tasks"

    # Primary key
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        nullable=False,
        description="Unique task identifier (auto-increment)"
    )

    # Foreign key to User
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="Owner user ID (foreign key to users.id)"
    )

    # Task content
    title: str = Field(
        nullable=False,
        min_length=1,
        max_length=500,
        description="Task title (required, 1-500 characters)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Task description (optional, max 5000 characters)"
    )

    # Task status
    is_completed: bool = Field(
        default=False,
        nullable=False,
        description="Task completion status (default: false)"
    )

    # Phase 5: Priority
    priority: str = Field(
        default=TaskPriority.MEDIUM,
        nullable=False,
        description="Task priority: low, medium, high, urgent"
    )

    # Phase 5: Due date
    due_date: Optional[datetime] = Field(
        default=None,
        nullable=True,
        description="Task due date for reminders"
    )

    # Phase 5: Recurrence
    recurrence_pattern: str = Field(
        default=RecurrencePattern.NONE,
        nullable=False,
        description="Recurrence pattern: none, daily, weekly, monthly"
    )

    # Phase 5: Tags (stored as JSON array)
    tags: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(JSON, nullable=True),
        description="Task tags as JSON array"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was created"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when task was last updated"
    )


class ActivityLog(SQLModel, table=True):
    """Phase 5: Activity/audit log for task changes."""
    __tablename__ = "activity_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    task_id: Optional[int] = Field(default=None, nullable=True, index=True)
    action: str = Field(nullable=False, max_length=50)
    details: Optional[str] = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
