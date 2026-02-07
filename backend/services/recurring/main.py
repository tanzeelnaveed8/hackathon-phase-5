"""
Recurring Task Service - Phase 5 Microservice

Consumes "task-events" topic via Dapr pub/sub.
When a recurring task is completed, automatically creates the next task instance
via Dapr service invocation to the main backend.
"""
from fastapi import FastAPI, Request
from datetime import datetime, timedelta
import logging
import os
import httpx

logging.basicConfig(level=logging.INFO, format="%(asctime)s [RECURRING] %(message)s")
logger = logging.getLogger("recurring-service")

app = FastAPI(title="Recurring Task Service", version="1.0.0")

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_BASE_URL = f"http://localhost:{DAPR_HTTP_PORT}/v1.0"
PUBSUB_NAME = "kafka-pubsub"
BACKEND_APP_ID = "backend"


def calculate_next_due_date(current_due: str, pattern: str) -> str:
    """Calculate the next due date based on recurrence pattern."""
    try:
        base_date = datetime.fromisoformat(current_due) if current_due else datetime.utcnow()
    except (ValueError, TypeError):
        base_date = datetime.utcnow()

    if pattern == "daily":
        next_date = base_date + timedelta(days=1)
    elif pattern == "weekly":
        next_date = base_date + timedelta(weeks=1)
    elif pattern == "monthly":
        # Add approximately one month
        month = base_date.month % 12 + 1
        year = base_date.year + (1 if month == 1 else 0)
        try:
            next_date = base_date.replace(year=year, month=month)
        except ValueError:
            # Handle months with fewer days (e.g., Jan 31 -> Feb 28)
            next_date = base_date.replace(year=year, month=month, day=28)
    else:
        return None

    return next_date.isoformat()


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "recurring-service"}


@app.get("/dapr/subscribe")
async def subscribe():
    """Tell Dapr which topics this service subscribes to."""
    return [
        {
            "pubsubname": PUBSUB_NAME,
            "topic": "task-events",
            "route": "/events/task-events"
        }
    ]


@app.post("/events/task-events")
async def handle_task_event(request: Request):
    """Process task events - handle recurring task creation on completion."""
    try:
        event = await request.json()
        data = event.get("data", event)

        event_type = data.get("type", "unknown")
        task_id = data.get("task_id")
        user_id = data.get("user_id")
        recurrence = data.get("recurrence_pattern", "none")

        logger.info(f"Received event: {event_type} for task #{task_id}")

        # Only process completed recurring tasks
        if event_type == "task_completed" and recurrence and recurrence != "none":
            logger.info(
                f"Recurring task #{task_id} completed with pattern '{recurrence}'. "
                f"Creating next instance..."
            )
            await create_next_recurring_task(data)

        return {"status": "SUCCESS"}

    except Exception as e:
        logger.error(f"Error processing task event: {e}")
        return {"status": "DROP"}


async def create_next_recurring_task(completed_task: dict):
    """Create the next instance of a recurring task via Dapr service invocation."""
    try:
        title = completed_task.get("title", "Recurring Task")
        recurrence = completed_task.get("recurrence_pattern", "daily")
        user_id = completed_task.get("user_id")
        due_date = completed_task.get("due_date")
        tags = completed_task.get("tags")
        priority = completed_task.get("priority", "medium")

        next_due = calculate_next_due_date(due_date, recurrence)

        new_task = {
            "title": title,
            "priority": priority,
            "recurrence_pattern": recurrence,
            "due_date": next_due,
            "tags": tags
        }

        # Use Dapr service invocation to create task via the backend
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DAPR_BASE_URL}/invoke/{BACKEND_APP_ID}/method/api/{user_id}/tasks",
                json=new_task,
                headers={"Content-Type": "application/json"},
                timeout=10.0
            )

            if response.status_code in (200, 201):
                logger.info(
                    f"Successfully created next recurring task for user {user_id}. "
                    f"Next due: {next_due}"
                )
            else:
                logger.error(
                    f"Failed to create recurring task: {response.status_code} - {response.text}"
                )

    except Exception as e:
        logger.error(f"Error creating next recurring task: {e}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8003"))
    uvicorn.run(app, host="0.0.0.0", port=port)
