# Phase 5: Implementation Plan

## Stack Additions

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Message Broker | Redpanda (Kafka-compatible) | Event streaming |
| Service Mesh | Dapr | Infrastructure abstraction |
| Microservices | FastAPI | Notification, Recurring, WebSocket |
| Container Orchestration | Kubernetes (Minikube) | Production deployment |
| CI/CD | GitHub Actions | Automated pipeline |

## Implementation Steps

### 1. Database Schema Extension
- Add `priority`, `due_date`, `recurrence_pattern`, `tags` to tasks table
- Create `activity_logs` table
- Alembic migration `004_phase5_advanced_tasks`

### 2. Backend API Enhancement
- Search (full-text on title/description)
- Filter by priority, completion status, tags
- Sort by created_at, due_date, priority, title
- Activity log endpoint
- Dapr pub/sub event publishing (toggleable via PHASE5_ENABLED)

### 3. Microservices
- Each service: FastAPI app, Dockerfile, requirements.txt
- Communication exclusively via Dapr pub/sub
- Dapr subscription endpoints (`/dapr/subscribe`)

### 4. Infrastructure
- Dapr component YAML files (pub/sub, state store, cron, secrets)
- Docker Compose Phase 5 overlay
- Kubernetes manifests for Minikube
- Kustomize overlay for cloud deployment
- GitHub Actions CI/CD pipeline

### 5. Frontend Enhancement
- Priority selector, due date picker, recurrence toggle, tags input
- Search bar, filter panel, sort controls
- Activity log side panel
- WebSocket hook for real-time updates
- Priority/due-date/tags/recurrence badges on task items

## Key Design Decisions

1. **Additive approach** - All Phase 5 code is additive, Phase 4 remains functional
2. **Feature toggle** - `PHASE5_ENABLED` env var controls event publishing
3. **Separate Docker Compose** - `docker-compose.phase5.yml` extends base file
4. **Dapr-only communication** - No direct Kafka clients, all via Dapr sidecar
5. **Non-blocking events** - Event publishing failures don't break task operations
