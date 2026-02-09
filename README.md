# Task Management System (RBAC + Org Scoping)

A full-stack task management application built as a technical assessment, demonstrating role-based access control (RBAC), organization scoping, audit logging, and a modern Angular + NestJS architecture.

The repository is structured as an Nx monorepo containing a backend API and a frontend dashboard.

---

## Architecture Overview

- **Backend**: NestJS + TypeORM + SQLite  
  - JWT authentication  
  - Role-based authorization (Owner / Admin / Viewer)  
  - Organization-scoped data access  
  - Immutable audit logging  

- **Frontend**: Angular (standalone components) + Tailwind CSS  
  - JWT-based authentication  
  - Drag-and-drop task board (Kanban)  
  - Role-aware UI behavior  

- **Monorepo Tooling**: Nx  
  - Shared build, test, and lint workflows  
  - Clear separation of concerns  

---

## Repository Structure

~~~text
org/
├── apps/
│   ├── api/                # NestJS backend
│   ├── api-e2e/            # Backend end-to-end tests
│   └── dashboard/          # Angular frontend
├── libs/                   # Shared libraries (auth, data, etc.)
├── nx.json
├── package.json
└── tsconfig.base.json
~~~

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- SQLite (optional – auto-created in development)

---

## Getting Started

### Install dependencies

~~~bash
npm install
~~~

### Start the backend API

~~~bash
npx nx serve api
~~~

### Start the frontend dashboard

~~~bash
npx nx serve dashboard
~~~

### Application URLs

- API: http://localhost:3000/api
- Dashboard: http://localhost:4200

---

## Testing

### Run backend unit tests

~~~bash
npx nx test api
~~~

### Run backend end-to-end tests

~~~bash
npx nx e2e api-e2e
~~~

---

## API Documentation

The API is documented using a Postman collection, covering:

- Authentication flows
- Task CRUD operations
- RBAC enforcement
- Audit log visibility by role

Import the collection into Postman to explore and test all endpoints.

---

## Security Notes

- JWTs are stored client-side and attached to all API requests via the `Authorization` header.
- Tokens are intentionally visible in browser developer tools (standard for SPAs).
- No sensitive secrets are exposed to the client.
- All authorization rules are enforced server-side for protected resources.
