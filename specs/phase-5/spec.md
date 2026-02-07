# Phase 5: Advanced Cloud & Event-Driven Architecture

## Overview

Phase 5 transforms the Todo Chatbot into an event-driven, cloud-ready microservices system using Kafka (Redpanda) and Dapr, deployable locally on Minikube and on Cloud Kubernetes.

## Architecture

### Event-Driven Flow

```
[Frontend] --> [Backend API] --Dapr Pub/Sub--> [Redpanda/Kafka]
                                                     |
                  +----------------------------------+----------------------------------+
                  |                                  |                                  |
         [Notification Service]           [Recurring Task Service]          [WebSocket Service]
         (reminders topic)                (task-events topic)               (task-updates topic)
         Logs notifications               Auto-creates next task            Broadcasts via WS
```

### Topics

| Topic | Purpose | Producers | Consumers |
|-------|---------|-----------|-----------|
| `task-events` | Task CRUD lifecycle | Backend | Recurring Service |
| `reminders` | Due date reminders | Backend | Notification Service |
| `task-updates` | Real-time sync | Backend | WebSocket Service |

### Dapr Building Blocks

- **Pub/Sub** - Kafka abstraction via Redpanda
- **State Store** - PostgreSQL for service state
- **Service Invocation** - Inter-service communication
- **Cron Bindings** - Scheduled reminder checks
- **Secrets Management** - Local file-based secrets

## New Features

### Advanced Todo
- Task priorities (low, medium, high, urgent)
- Due dates with reminder integration
- Recurring tasks (daily, weekly, monthly)
- Tags with filtering
- Full-text search across title and description
- Sort by created date, due date, priority, or title
- Activity/audit log

### Microservices
1. **Notification Service** (port 8002) - Processes reminders, logs notifications
2. **Recurring Task Service** (port 8003) - Creates next task instance on completion
3. **WebSocket Service** (port 8004) - Real-time updates to connected clients

## Deployment

### Local Development
```bash
# Phase 4 only (unchanged)
docker-compose up

# Phase 5 (extends Phase 4)
docker-compose -f docker-compose.yml -f docker-compose.phase5.yml up
```

### Minikube
```bash
kubectl apply -f infra/k8s/minikube/
```

### Cloud (Kustomize)
```bash
kubectl apply -k infra/k8s/cloud/
```

## Configuration

Phase 5 is toggled via `PHASE5_ENABLED=true` environment variable. When disabled, the backend works exactly as Phase 4 with no event publishing.
