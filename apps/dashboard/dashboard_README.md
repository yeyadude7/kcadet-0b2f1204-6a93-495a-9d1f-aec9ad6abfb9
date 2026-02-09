# Task Management Dashboard

Angular-based frontend providing a role-aware task management experience.
Built with standalone components and Tailwind CSS.

---

## Technology Stack

- Angular (standalone components)
- Tailwind CSS
- Angular CDK (drag-and-drop)
- RxJS + Angular signals

---

## Features

### Authentication UI
- Login form authenticating against the backend
- JWT stored client-side after login
- JWT automatically attached to all API requests

---

### Task Board
- Kanban-style board (Todo / In Progress / Done)
- Drag-and-drop reordering and status transitions
- Category labeling
- Role-aware controls:
  - Owner/Admin: create, update, delete
  - Viewer: read-only

---

### Audit Log Viewer
- Accessible only to Owner/Admin
- Chronologically sorted audit events
- Clear visual distinction between ALLOW and DENY events

---

### Responsive Design
- Mobile-first layout
- Scales cleanly to desktop
- Intentional use of whitespace for clarity

---

## Application Structure

~~~text
dashboard/
├── core/
│   ├── api.service.ts      # API client
│   ├── auth.service.ts     # Auth + JWT handling
│   └── guards/             # Route guards
├── layout/
│   └── shell/              # Top-level layout
├── pages/
│   ├── login/
│   ├── tasks/
│   └── audit/
└── app.routes.ts
~~~

---

## Running Locally

~~~bash
npx nx serve dashboard
~~~

Access the app at:
http://localhost:4200

---

## State Management

- Angular signals for local state
- RxJS for async API interactions
- No global state library used (intentionally lightweight)

---

## Drag-and-Drop Behavior

- Implemented via Angular CDK
- Position updates are persisted to the backend
- Status changes are atomic and role-validated server-side

---

## Security Notes

- JWT visibility in browser dev tools is expected for SPAs
- No authorization logic is trusted on the client
- UI restrictions mirror backend enforcement but do not replace it

---

## Future Improvements

- Dark/light mode toggle
- Task analytics (completion visualization)
- Keyboard shortcuts for power users
