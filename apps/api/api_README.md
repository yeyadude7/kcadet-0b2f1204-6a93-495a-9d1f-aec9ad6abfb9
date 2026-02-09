# Task Management API

NestJS-based backend providing authentication, task management, RBAC enforcement,
organization scoping, and audit logging.

---

## Technology Stack

- NestJS
- TypeORM
- SQLite (development)
- JWT authentication
- Jest (unit + e2e testing)

---

## Core Features

### Authentication
- Email/password login
- JWT issuance on successful authentication
- Stateless authorization via `Authorization: Bearer <token>`

---

### Authorization (RBAC)

Three roles are supported:
- **Owner**: Full access
- **Admin**: Task management + audit log access
- **Viewer**: Read-only access

Permissions are enforced via guards and decorators at the controller level.

---

### Organization Scoping
- All tasks and audit logs are scoped to the authenticated user’s organization.
- Cross-organization access is prevented at the query layer.

---

### Task Management
- Create, read, update, delete tasks
- Status lifecycle: `Todo → InProgress → Done`
- Positional ordering to support drag-and-drop reordering

---

### Audit Logging
- Immutable audit log entries for security-sensitive actions
- Records include:
  - Timestamp
  - Actor
  - Action
  - Resource
  - Result (ALLOW / DENY)
  - Reason (when denied)

Audit logs are restricted to Owner/Admin roles.

---

## Local Development

### Start the API

~~~bash
npx nx serve api
~~~

The database file (`data.db`) is created automatically on first run.

---

## Testing

### Run unit tests

~~~bash
npx nx test api
~~~

### Run end-to-end tests

~~~bash
npx nx e2e api-e2e
~~~

**Notes:**
- Some default Nx scaffold tests were adapted to account for global guards.
- Guards and services are mocked where appropriate in unit tests.

---

## API Documentation

A complete Postman collection is provided covering:
- Role-specific access scenarios
- Positive and negative RBAC cases
- Task and audit endpoints

---

## Design Considerations

- Guards are the primary authorization boundary.
- Controllers remain thin; business logic resides in services.
- Audit logging is decoupled and injected where needed.
- SQLite chosen for portability and ease of review.

---

## Known Limitations

- SQLite is intended for development/demo only.
- No refresh token rotation (out of scope for assessment).
