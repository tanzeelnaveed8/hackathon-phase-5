"""Task management API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime
import uuid
import os
import httpx

from ...database import get_session
from ...models.task import Task, ActivityLog
from ...schemas.task import (
    TaskCreate, TaskUpdate, TaskComplete, TaskResponse, ActivityLogResponse
)
from ..dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["tasks"])

# Dapr configuration
DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_BASE_URL = f"http://localhost:{DAPR_HTTP_PORT}/v1.0"
PUBSUB_NAME = "kafka-pubsub"
PHASE5_ENABLED = os.getenv("PHASE5_ENABLED", "false").lower() == "true"


async def publish_event(topic: str, data: dict):
    """Publish event to Dapr pub/sub (only when Phase 5 is enabled)."""
    if not PHASE5_ENABLED:
        return
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{DAPR_BASE_URL}/publish/{PUBSUB_NAME}/{topic}",
                json=data,
                timeout=5.0
            )
    except Exception:
        pass  # Non-blocking: don't fail task operations if event publishing fails


def log_activity(session: Session, user_id: uuid.UUID, task_id: Optional[int], action: str, details: str = None):
    """Record an activity log entry."""
    entry = ActivityLog(
        user_id=user_id,
        task_id=task_id,
        action=action,
        details=details
    )
    session.add(entry)


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str,
    search: Optional[str] = Query(None, description="Search in title and description"),
    priority: Optional[str] = Query(None, pattern=r"^(low|medium|high|urgent)$"),
    is_completed: Optional[bool] = Query(None),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    sort_by: Optional[str] = Query("created_at", pattern=r"^(created_at|due_date|priority|title)$"),
    sort_order: Optional[str] = Query("desc", pattern=r"^(asc|desc)$"),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for authenticated user with search, filter, and sort.
    """
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = select(Task).where(Task.user_id == user_uuid)

    # Phase 5: Search
    if search:
        statement = statement.where(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # Phase 5: Filter by priority
    if priority:
        statement = statement.where(Task.priority == priority)

    # Filter by completion status
    if is_completed is not None:
        statement = statement.where(Task.is_completed == is_completed)

    # Phase 5: Filter by tag (JSON contains)
    if tag:
        statement = statement.where(Task.tags.contains([tag]))

    # Phase 5: Sorting
    priority_order = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
    sort_column = getattr(Task, sort_by, Task.created_at)
    if sort_order == "desc":
        statement = statement.order_by(sort_column.desc())
    else:
        statement = statement.order_by(sort_column.asc())

    tasks = session.exec(statement).all()
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for authenticated user."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    task = Task(
        user_id=user_uuid,
        title=task_data.title,
        description=task_data.description,
        is_completed=False,
        priority=task_data.priority or "medium",
        due_date=task_data.due_date,
        recurrence_pattern=task_data.recurrence_pattern or "none",
        tags=task_data.tags
    )

    session.add(task)
    log_activity(session, user_uuid, None, "task_created", f"Created task: {task.title}")
    session.commit()
    session.refresh(task)

    # Publish event
    await publish_event("task-events", {
        "type": "task_created",
        "task_id": task.id,
        "user_id": str(user_uuid),
        "title": task.title,
        "priority": task.priority,
        "due_date": task.due_date.isoformat() if task.due_date else None,
        "recurrence_pattern": task.recurrence_pattern,
        "tags": task.tags
    })

    # Publish reminder if due date set
    if task.due_date:
        await publish_event("reminders", {
            "type": "reminder_set",
            "task_id": task.id,
            "user_id": str(user_uuid),
            "title": task.title,
            "due_date": task.due_date.isoformat()
        })

    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_uuid)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a task (title, description, priority, due_date, recurrence, tags)."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_uuid)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    changes = []
    if task_data.title is not None:
        task.title = task_data.title
        changes.append("title")
    if task_data.description is not None:
        task.description = task_data.description
        changes.append("description")
    if task_data.priority is not None:
        task.priority = task_data.priority
        changes.append("priority")
    if task_data.due_date is not None:
        task.due_date = task_data.due_date
        changes.append("due_date")
    if task_data.recurrence_pattern is not None:
        task.recurrence_pattern = task_data.recurrence_pattern
        changes.append("recurrence_pattern")
    if task_data.tags is not None:
        task.tags = task_data.tags
        changes.append("tags")

    task.updated_at = datetime.utcnow()

    log_activity(session, user_uuid, task_id, "task_updated", f"Updated: {', '.join(changes)}")
    session.add(task)
    session.commit()
    session.refresh(task)

    await publish_event("task-events", {
        "type": "task_updated",
        "task_id": task.id,
        "user_id": str(user_uuid),
        "changes": changes
    })

    await publish_event("task-updates", {
        "type": "task_updated",
        "task_id": task.id,
        "user_id": str(user_uuid),
        "title": task.title,
        "is_completed": task.is_completed,
        "priority": task.priority
    })

    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a task permanently."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_uuid)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_title = task.title
    log_activity(session, user_uuid, task_id, "task_deleted", f"Deleted task: {task_title}")
    session.delete(task)
    session.commit()

    await publish_event("task-events", {
        "type": "task_deleted",
        "task_id": task_id,
        "user_id": str(user_uuid),
        "title": task_title
    })

    await publish_event("task-updates", {
        "type": "task_deleted",
        "task_id": task_id,
        "user_id": str(user_uuid)
    })

    return None


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    user_id: str,
    task_id: int,
    completion_data: TaskComplete,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Toggle task completion status."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_uuid)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.is_completed = completion_data.is_completed
    task.updated_at = datetime.utcnow()

    action = "task_completed" if task.is_completed else "task_uncompleted"
    log_activity(session, user_uuid, task_id, action, f"Task '{task.title}' marked as {'completed' if task.is_completed else 'incomplete'}")

    session.add(task)
    session.commit()
    session.refresh(task)

    event_data = {
        "type": action,
        "task_id": task.id,
        "user_id": str(user_uuid),
        "title": task.title,
        "is_completed": task.is_completed,
        "recurrence_pattern": task.recurrence_pattern
    }

    await publish_event("task-events", event_data)
    await publish_event("task-updates", event_data)

    return task


# Phase 5: Activity log endpoint
@router.get("/{user_id}/activity", response_model=List[ActivityLogResponse])
async def get_activity_log(
    user_id: str,
    limit: int = Query(50, ge=1, le=200),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get activity log for authenticated user."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden - user_id does not match authenticated user"
        )

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format"
        )

    statement = (
        select(ActivityLog)
        .where(ActivityLog.user_id == user_uuid)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
    )
    logs = session.exec(statement).all()
    return logs
