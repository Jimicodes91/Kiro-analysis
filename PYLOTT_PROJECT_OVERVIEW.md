# Pylott — Project Overview

## What is Pylott?

Pylott is a client management and project tracking platform designed for professional services firms (immigration consultants, legal firms, accounting practices, etc.). It enables firms to manage client projects through customizable journeys (pipelines), track tasks and milestones, handle document management, and provide clients with a portal to view their project progress.

Think of it as a Pipedrive-style CRM tailored for project-based professional services, with a client-facing portal.

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript, Vite, TailwindCSS, Radix UI, React Query, React Hook Form |
| Backend | Node.js + TypeScript, Express, Objection.js (ORM), Knex (query builder/migrations) |
| Database | MySQL (staging on Aiven Cloud) |
| Cache | Redis (Aiven Cloud) — used for session/invitation caching |
| File Storage | Cloudinary |
| Email | Custom email service (SendGrid/SMTP) |
| Hosting | Render (staging) — separate services for frontend (static site) and backend (web service) |

### Repository Structure

Two separate repositories:

- **Pylott-Web-App** — Frontend React application
- **Pylott-Backend** — Backend Node.js API server

### Deployment

| Environment | Frontend | Backend |
|------------|----------|---------|
| Staging | `git push personal v1` → Render auto-deploys | `git push origin v1` → Render auto-deploys |
| Branch | `v1` (both repos) | `v1` |

Backend auto-runs database migrations on startup via `src/index.ts`.

---

## Core Modules

### 1. Authentication & Users
- Workspace signup (multi-step: email → OTP → company details)
- Email/password login with JWT tokens
- Role-based access: Super Admin, Admin, Client
- Client invitation system (email invite → accept → create account)
- Password reset flow

### 2. Projects
- Projects are created with a Journey (pipeline/template) that defines the workflow
- Each project has: name, client(s), start/end dates, milestone tracking, custom form fields
- Projects support multiple clients per project
- Project detail page shows: overview, tasks, documents, notes, events, milestones (board view)

### 3. Journeys (Pipelines/Templates)
- Admin-defined workflow templates (e.g., "Immigration Process", "Tax Filing")
- Each journey has ordered milestones (phases)
- Milestones can be reordered via drag-and-drop
- Projects are created from journey templates

### 4. Tasks
Tasks are the core activity tracking system, split into two categories:

**Internal Tasks** (admin-facing):
- Created from standalone task page or within project detail
- Category types: Activity, Meeting, Task, Follow Up, Message, Review
- Pipedrive-style activity modal with: subject, category icons, due date, notes, assignees, project link, contact link
- Configurable table with 14 columns (customizable via column settings)
- Automated status: Open (grey=future, green=due today, red=overdue) or Completed
- Time period filters: To-do, Overdue, Today, Tomorrow, This week, Next week, Custom date range

**External Tasks** (client-facing):
- Created from project detail page only
- Category types: Signing, Information Request, Document Upload
- Task name = category type label
- Assigned to project clients
- Client sees: task name, due date, status, and action area (upload/sign/fill form)
- Client cannot comment — only sees admin instructions as read-only

### 5. Contacts
- Company-wide contact directory
- Contacts are created when adding clients to projects
- Contact fields: name, email, phone, organization, status
- Contacts can be linked to tasks for tracking
- Separate from the Users table — contacts become users only when they accept an invitation

### 6. Documents
- Project-bound document management
- Upload, view, and manage documents per project
- Document types defined via metadata
- Attachments stored on Cloudinary

### 7. Events
- Project-bound event tracking
- Calendar events with dates, descriptions, and project association

### 8. Notes
- Project-bound notes with pinning support
- Comments on notes

### 9. Notifications
- Real-time notification system
- Task assignment notifications
- Email notifications for key events (task assigned, project created, client invited)

### 10. Finance (Org Finance)
- Organization-level financial tracking
- Payment records with proof upload
- Mark as paid workflow

### 11. Admin Panel
- Journey/pipeline management (create, edit, delete templates)
- Milestone management within journeys
- Task type management
- Pending invites management
- Form builder for project creation forms
- Company settings

### 12. Client Portal
- Separate client-facing views
- Client dashboard with project overview, task metrics, upcoming milestones
- Client task management (view and complete assigned tasks)
- Client journey view (see project progress through milestones)
- Client document access

---

## Database Schema (Key Tables)

| Table | Purpose |
|-------|---------|
| `users` | All registered users (admins + clients who accepted invites) |
| `companies` | Company/workspace records |
| `contacts` | Contact directory (all clients, invited or not) |
| `projects` | Client projects |
| `project_types` | Journey/pipeline templates |
| `milestones` | Phases within journeys |
| `project_tasks` | All tasks (internal + external, standalone + project-bound) |
| `project_task_assignees` | Task-to-user assignments |
| `task_comments` | Comments on tasks |
| `task_activity_log` | Task change history |
| `task_client_assignees` | External task client assignments |
| `task_client_responses` | Client responses to external tasks |
| `documents` | Project documents |
| `document_attachments` | File attachments on documents |
| `events` | Project events |
| `project_notes` | Project notes |
| `comments` | Comments on notes |
| `project_members` | Project team members |
| `project_settings` | Per-company project visibility settings |
| `project_forms` | Dynamic project creation form definitions |
| `project_form_fields` | Fields within project forms |
| `metadata` | Configurable types (task types, document types, etc.) |
| `notifications` | User notifications |
| `invitations` | Pending user invitations |
| `org_finance` | Financial records |
| `subscriptions` | Company subscription plans |
| `audit_trails` | System audit log |

---

## API Structure

Base URL: `/api/v1`

| Prefix | Module |
|--------|--------|
| `/auth` | Authentication (signup, login, invite, verify) |
| `/user` | User profile management |
| `/company` | Company/workspace management |
| `/contacts` | Contact CRUD |
| `/projects` | Projects, tasks, documents, events, notes, milestones |
| `/projects/tasks` | Standalone task creation + task listing |
| `/projects/:id/tasks` | Project-bound task CRUD |
| `/tasks/:id` | Standalone task operations (update, delete, comments) |
| `/metadata` | Configurable types management |
| `/settings` | Project settings |
| `/notifications` | Notification management |
| `/org-finance` | Financial records |
| `/billing` | Billing/subscription |
| `/admin` | System admin operations |
| `/forms` | Native form engine (templates, fields, submissions) |

---

## Frontend Page Structure

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/signup` | Multi-step workspace signup | Public |
| `/` | Admin Dashboard | Admin |
| `/task` | Standalone Task Table (Pipedrive-style) | Admin |
| `/task/internal` | Internal Task Creation Form | Admin |
| `/task/external` | External Task Creation Form | Admin |
| `/projects` | Project List | Admin |
| `/projects/:id` | Project Detail (tasks, docs, notes, events, milestones) | Admin |
| `/contacts` | Contact Directory | Admin |
| `/events` | Events | Admin |
| `/finance` | Organization Finance | Admin |
| `/notifications` | Notifications | Admin |
| `/admin` | Admin Panel (journeys, settings, invites) | Admin |
| `/profile` | User Profile | All |
| `/client/home` | Client Dashboard | Client |
| `/client/tasks` | Client Task List | Client |
| `/client/tasks/:id` | Client Task Detail (complete actions) | Client |
| `/client/journey` | Client Journey View | Client |
| `/client/documents` | Client Documents | Client |

---

## Key Business Rules

1. **Contacts vs Users**: Contacts are created when adding clients to projects. They become Users only when they accept an invitation and create an account.

2. **Task Visibility**: Internal tasks (`is_visible_to_client: false`) are only visible to admins. External tasks (`is_visible_to_client: true`) are visible to assigned clients.

3. **Standalone vs Project Tasks**: Tasks can exist without a project (standalone) or be bound to a specific project. Both appear in the unified task table.

4. **Journey Templates**: Projects are created from journey templates. Each template defines the milestones (phases) a project goes through.

5. **Automated Task Status**: Internal task status is computed from the due date at render time — no manual status management needed. External tasks use traditional status flow.

6. **Multi-Client Projects**: A single project can have multiple clients assigned. Each client gets their own portal view.

---

## Current State (as of May 2026)

### Deployed to Staging
- Pipedrive-style activity table with configurable columns
- Internal task form (standalone + project detail) with new category types
- External task form with category-based naming and client instructions
- Client task view (read-only instructions, action-based completion)
- Automated status colors based on due date
- Contact linking on tasks
- Time period filters (To-do, Overdue, Today, Tomorrow, This/Next week, Custom)
- Inline task editing (name, status, due date from table)
- Task comments system
- Notification system

### Known Issues
- Redis connection on staging (Aiven instance may need renewal)
- Backend has pre-existing TypeScript errors in `auth.service.ts` that prevent local `npm run dev`

### Infrastructure Notes
- Staging DB is MySQL on Aiven Cloud
- Migrations must check column existence before altering (staging DB has schema mismatches from manual changes)
- DateTime format for MySQL: `YYYY-MM-DD HH:MM:SS`
- Backend auto-runs migrations on startup
