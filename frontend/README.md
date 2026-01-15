# Frontend Setup Instructions

## Prerequisites

- Node.js 20 or higher
- npm (Node package manager)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

1. **Copy environment template**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` file** with your configuration:
   - `NEXT_PUBLIC_API_URL`: Backend API URL (http://localhost:8001 for development)
   - `BETTER_AUTH_SECRET`: Secret key for Better Auth (must match backend)
   - `BETTER_AUTH_URL`: Frontend URL (http://localhost:3000 for development)

## Running the Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing/login page
│   │   ├── auth/
│   │   │   └── callback/    # Auth callback handler
│   │   └── tasks/
│   │       ├── layout.tsx   # Protected layout
│   │       └── page.tsx     # Task list page
│   ├── components/          # React components
│   │   ├── TaskList.tsx     # Task list component
│   │   └── TaskItem.tsx     # Individual task component
│   └── lib/                 # Utilities
│       ├── api.ts           # API client
│       ├── auth.ts          # Better Auth configuration
│       └── types.ts         # TypeScript types
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local.example
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- **Passwordless Authentication**: Email-based magic link authentication
- **Task Management**: Create, read, update, delete tasks
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Real-time Updates**: Optimistic UI updates for better UX

## Troubleshooting

**Port already in use**:
```bash
# Use a different port
PORT=3001 npm run dev
```

**API connection errors**:
- Verify backend is running on port 8001
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS is configured correctly in backend

**Build errors**:
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
