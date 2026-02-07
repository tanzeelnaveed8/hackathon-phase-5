"""
WebSocket Service - Phase 5 Microservice

Consumes "task-updates" topic via Dapr pub/sub.
Broadcasts real-time updates to connected WebSocket clients.
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from typing import Dict, Set
import asyncio
import json
import logging
import os

logging.basicConfig(level=logging.INFO, format="%(asctime)s [WEBSOCKET] %(message)s")
logger = logging.getLogger("websocket-service")

app = FastAPI(title="WebSocket Service", version="1.0.0")

PUBSUB_NAME = "kafka-pubsub"


class ConnectionManager:
    """Manages WebSocket connections grouped by user_id."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected. Total connections: {self._total_connections()}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"User {user_id} disconnected. Total connections: {self._total_connections()}")

    async def send_to_user(self, user_id: str, message: dict):
        """Send a message to all WebSocket connections for a specific user."""
        if user_id in self.active_connections:
            dead_connections = set()
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_connections.add(connection)
            # Clean up dead connections
            for conn in dead_connections:
                self.active_connections[user_id].discard(conn)

    async def broadcast(self, message: dict):
        """Broadcast a message to all connected clients."""
        for user_id in list(self.active_connections.keys()):
            await self.send_to_user(user_id, message)

    def _total_connections(self) -> int:
        return sum(len(conns) for conns in self.active_connections.values())


manager = ConnectionManager()


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "websocket-service",
        "active_connections": manager._total_connections()
    }


@app.get("/dapr/subscribe")
async def subscribe():
    """Tell Dapr which topics this service subscribes to."""
    return [
        {
            "pubsubname": PUBSUB_NAME,
            "topic": "task-updates",
            "route": "/events/task-updates"
        }
    ]


@app.post("/events/task-updates")
async def handle_task_update(request: Request):
    """Process task update events and broadcast to WebSocket clients."""
    try:
        event = await request.json()
        data = event.get("data", event)

        user_id = data.get("user_id")
        event_type = data.get("type", "unknown")
        task_id = data.get("task_id")

        logger.info(f"Task update event: {event_type} for task #{task_id}, user {user_id}")

        if user_id:
            await manager.send_to_user(user_id, {
                "type": event_type,
                "task_id": task_id,
                "data": data
            })
            logger.info(f"Broadcast {event_type} to user {user_id}")

        return {"status": "SUCCESS"}

    except Exception as e:
        logger.error(f"Error processing task update event: {e}")
        return {"status": "DROP"}


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time task updates."""
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive, listen for client messages
            data = await websocket.receive_text()
            # Echo back as acknowledgment
            await websocket.send_json({"type": "ack", "message": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(websocket, user_id)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8004"))
    uvicorn.run(app, host="0.0.0.0", port=port)
