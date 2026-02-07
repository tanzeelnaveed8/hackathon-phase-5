# Full-Stack Todo Web Application

A modern, multi-user, authenticated full-stack web application for task management.

## Architecture

- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS
- **Backend**: FastAPI (Python) running on port 8001
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: Better Auth (Passwordless JWT-based)

## Project Structure

```
Phase-2/
├── backend/              # FastAPI backend
│   ├── src/
│   │   ├── main.py      # Application entry point
│   │   ├── config.py    # Configuration management
│   │   ├── database.py  # Database connection
│   │   ├── models/      # SQLModel entities
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── middleware/  # JWT authentication
│   │   └── api/         # API routes
│   ├── requirements.txt
│   └── .env.example
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities (API client, auth)
│   ├── package.json
│   └── .env.local.example
└── specs/              # Feature specifications

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Neon PostgreSQL account

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET
   ```

5. Start backend server:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
   ```

   Backend will be available at: http://localhost:8001
   API documentation: http://localhost:8001/docs

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   Frontend will be available at: http://localhost:3000

## API Endpoints

All endpoints require JWT Bearer token authentication.

- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

## Security

- Passwordless authentication using Better Auth
- JWT tokens for API authentication
- User ownership enforcement on all operations
- No hardcoded credentials (environment variables only)
- CORS configured for frontend-backend communication

## Development

See `specs/001-fullstack-todo-app/` for detailed specifications:
- `spec.md` - Feature requirements and user stories
- `plan.md` - Implementation plan and architecture
- `tasks.md` - Detailed task breakdown
- `quickstart.md` - Setup and validation guide

---

## Phase 5: Advanced Cloud & Event-Driven Architecture

Phase 5 adds event-driven microservices, Kafka messaging via Redpanda, and Dapr integration on top of the existing system.

### New Features
- **Task Priorities** - Low, Medium, High, Urgent
- **Due Dates** with reminder integration
- **Recurring Tasks** - Daily, Weekly, Monthly auto-creation
- **Tags** with filter support
- **Search** - Full-text search across tasks
- **Filter & Sort** - By priority, status, due date, title
- **Activity Log** - Audit trail for all task operations
- **Real-time Updates** - WebSocket-powered live sync

### Architecture

```
Frontend --> Backend API --Dapr--> Redpanda/Kafka
                                       |
              +------------------------+------------------------+
              |                        |                        |
     Notification Svc         Recurring Task Svc        WebSocket Svc
     (reminders)              (task-events)             (task-updates)
```

### Microservices

| Service | Port | Topic | Purpose |
|---------|------|-------|---------|
| Notification | 8002 | reminders | Due date notifications |
| Recurring Task | 8003 | task-events | Auto-create recurring tasks |
| WebSocket | 8004 | task-updates | Real-time client sync |

### Dapr Building Blocks
- Pub/Sub (Kafka via Redpanda)
- State Store (PostgreSQL)
- Service Invocation
- Cron Bindings (scheduled reminders)
- Secrets Management

### Running Phase 5

**Docker Compose (extends Phase 4):**
```bash
docker-compose -f docker-compose.yml -f docker-compose.phase5.yml up --build
```

**Phase 4 Only (unchanged):**
```bash
docker-compose up
```

**Minikube:**
```bash
kubectl apply -f infra/k8s/minikube/
```

**Cloud (Kustomize):**
```bash
kubectl apply -k infra/k8s/cloud/
```

### Phase 5 API Additions

- `GET /api/{user_id}/tasks?search=...&priority=...&sort_by=...` - Search, filter, sort
- `GET /api/{user_id}/activity` - Activity/audit log
- `WS ws://localhost:8004/ws/{user_id}` - Real-time WebSocket

### Phase 5 Directory Structure

```
backend/
  services/
    notification/    # Notification microservice
    recurring/       # Recurring task microservice
    websocket/       # WebSocket microservice
  dapr/
    components/      # Dapr component YAML files
infra/
  kafka/redpanda/    # Redpanda configuration
  k8s/
    minikube/        # Minikube K8s manifests
    cloud/           # Cloud deployment (Kustomize)
  ci-cd/             # GitHub Actions CI/CD pipeline
specs/phase-5/       # Phase 5 specifications
```

### Configuration

Set `PHASE5_ENABLED=true` to activate event publishing. When disabled, the backend functions identically to Phase 4.

## License

Private project for Hackathon
