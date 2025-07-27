# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for a home absence declaration management system for police services, featuring a Node.js REST API backend with SQLite database, a React TypeScript admin frontend, and a Node.js SSR public client.

## Development Commands

```bash
# Root monorepo commands
npm run dev              # Start all three projects in parallel
npm run dev:backend      # Start backend only (port 3000)
npm run dev:frontend     # Start admin frontend only (port 5173)
npm run dev:client       # Start public client only (port 3001)

# Build commands
npm run build            # Build all projects
npm run build:backend    # Build backend only
npm run build:frontend   # Build admin frontend only
npm run build:client     # Build public client only

# Testing and quality
npm run test            # Run tests for all workspaces
npm run lint            # Run linting for all workspaces

# Database operations
npm run migrate         # Run database migrations
npm run migrate:rollback # Rollback last migration

# Docker operations
npm run docker:up       # docker-compose up --build
npm run docker:down     # docker-compose down
```

## Monorepo Architecture

This is a workspaces-based monorepo with three main packages:

### Backend (`absence-backend/`)
- **Framework**: Express.js with comprehensive middleware setup
- **Database**: SQLite with Sequelize ORM and automatic migrations
- **Validation**: Dual-layer validation (Joi for requests + Sequelize for models)
- **API Documentation**: Swagger/OpenAPI 3.0 with interactive UI at `/api-docs`
- **Security**: Helmet, CORS, request size limits, CSP configuration
- **Health Monitoring**: Built-in health check at `/health`

Key architectural patterns:
- Model-driven validation with Sequelize validators
- Centralized error handling middleware
- Automatic database initialization and migration on startup
- Environment-based configuration with graceful shutdown handling

### Frontend Admin (`absence-frontend/`)
- **Framework**: React 18 + TypeScript with Vite build system
- **Styling**: Tailwind CSS with Heroicons
- **Routing**: React Router with nested routes
- **State Management**: React Query for server state + React Hook Form for forms
- **API Layer**: Axios-based API client with error interceptors
- **Path Mapping**: TypeScript path aliases configured (`@/components/*`, etc.)

Key architectural patterns:
- Page-based routing with shared Layout component
- Custom hooks for API operations (`useAbsences.ts`)
- Typed API responses with comprehensive TypeScript interfaces
- Form validation utilities and date formatting helpers

### Public Client (`absence-client/`)
- **Framework**: Express.js with Server-Side Rendering (SSR)
- **Template Engine**: EJS with embedded CSS from original template.html
- **Styling**: Inline styles adapted from template.html design
- **Security**: Helmet middleware with CSP configuration
- **API Integration**: Axios client connecting to backend API
- **Validation**: Client-side and server-side form validation

Key architectural patterns:
- SSR with EJS templates for public-facing forms
- Direct API communication with absence-backend
- Responsive design matching template.html specifications
- Error handling with user-friendly messages

## API Architecture

The backend follows RESTful conventions with these endpoints:
- `POST /api/absences` - Create absence declaration
- `GET /api/absences/:id` - Get single absence
- `PUT /api/absences/:id` - Update absence
- `GET /api/absences` - List with pagination (`?page=1&limit=10`)
- `GET /health` - Health check
- `GET /api-docs` - Interactive Swagger documentation

## Data Model

The core `Absence` model includes comprehensive validation:
- Date validation (dateFin must be after dateDebut)
- French phone number format validation
- Email validation (optional field)
- Name length constraints (2-50 characters)
- Address length constraints (10-500 characters)
- Automatic timestamps (dateCreation, dateModification)

## Docker Configuration

Multi-service setup with:
- Backend container on port 3000
- Frontend nginx container on port 8080
- Persistent SQLite volume in `./data/`
- Health checks for both services
- Custom bridge network for internal communication

## Development Notes

- The admin frontend uses Vite proxy to redirect `/api` calls to backend during development
- The public client connects directly to backend API at `http://localhost:3000/api`
- Database is automatically created and migrated on first startup
- Environment variables configured via `.env` files
- All services have comprehensive health monitoring
- TypeScript strict mode enabled with comprehensive linting rules

## Port Configuration

- **Backend API**: `http://localhost:3000` (Express.js REST API)
- **Admin Frontend**: `http://localhost:5173` (React + Vite dev server)
- **Public Client**: `http://localhost:3002` (NestJS SSR)

## Testing the API

Use the interactive Swagger UI at `http://localhost:3000/api-docs` for complete API testing and documentation. The system includes example data and validation error responses.