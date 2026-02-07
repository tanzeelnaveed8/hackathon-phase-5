"""
Notification Service - Phase 5 Microservice

Consumes "reminders" topic via Dapr pub/sub.
Checks for upcoming due dates and sends notifications (console/log).
Also handles cron-triggered reminder checks.
"""
from fastapi import FastAPI, Request
from datetime import datetime, timedelta
import logging
import os
import httpx

logging.basicConfig(level=logging.INFO, format="%(asctime)s [NOTIFICATION] %(message)s")
logger = logging.getLogger("notification-service")

app = FastAPI(title="Notification Service", version="1.0.0")

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_BASE_URL = f"http://localhost:{DAPR_HTTP_PORT}/v1.0"
PUBSUB_NAME = "kafka-pubsub"
STATE_STORE = "statestore"


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "notification-service"}


@app.get("/dapr/subscribe")
async def subscribe():
    """Tell Dapr which topics this service subscribes to."""
    return [
        {
            "pubsubname": PUBSUB_NAME,
            "topic": "reminders",
            "route": "/events/reminders"
        }
    ]


@app.post("/events/reminders")
async def handle_reminder(request: Request):
    """Process reminder events from the reminders topic."""
    try:
        event = await request.json()
        data = event.get("data", event)

        event_type = data.get("type", "unknown")
        task_id = data.get("task_id")
        user_id = data.get("user_id")
        title = data.get("title", "Untitled")
        due_date_str = data.get("due_date")

        if event_type == "reminder_set":
            logger.info(
                f"REMINDER SET - Task #{task_id} '{title}' for user {user_id} "
                f"due at {due_date_str}"
            )
            # Store reminder in Dapr state store for cron-based checking
            if due_date_str:
                await store_reminder(task_id, user_id, title, due_date_str)

        elif event_type == "reminder_triggered":
            logger.info(
                f"NOTIFICATION SENT - Task #{task_id} '{title}' is due! "
                f"User: {user_id}"
            )

        return {"status": "SUCCESS"}

    except Exception as e:
        logger.error(f"Error processing reminder event: {e}")
        return {"status": "DROP"}


async def store_reminder(task_id: int, user_id: str, title: str, due_date: str):
    """Store reminder in Dapr state store for later cron checking."""
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{DAPR_BASE_URL}/state/{STATE_STORE}",
                json=[{
                    "key": f"reminder-{task_id}",
                    "value": {
                        "task_id": task_id,
                        "user_id": user_id,
                        "title": title,
                        "due_date": due_date
                    }
                }],
                timeout=5.0
            )
            logger.info(f"Stored reminder for task #{task_id} in state store")
    except Exception as e:
        logger.error(f"Failed to store reminder: {e}")


@app.post("/reminder-cron")
async def cron_check_reminders(request: Request):
    """Cron-triggered endpoint to check for upcoming due reminders."""
    logger.info("Cron triggered: Checking for upcoming reminders...")
    now = datetime.utcnow()
    reminder_window = now + timedelta(minutes=30)

    logger.info(
        f"Checking reminders due between {now.isoformat()} and {reminder_window.isoformat()}"
    )

    # In a production system, this would query the state store for all pending reminders
    # and publish notification events for those that are due
    return {"status": "checked"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
