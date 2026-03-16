# Pylot Platform Enhancement - Technical Analysis

## Executive Summary

This document analyzes a comprehensive platform enhancement covering:
- Self-serve account creation with Super Admin role
- Role-based access control (RBAC) improvements
- Contact/Client lifecycle management
- Task management enhancements
- Project creation workflow simplification

**Estimated Effort:** 8-12 weeks (2-3 engineers)
**Complexity:** High
**Risk Level:** Medium-High (affects core authentication and authorization)

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Contact & Client Management](#2-contact--client-management)
3. [Task Management](#3-task-management)
4. [Project Creation](#4-project-creation)
5. [Database Schema Changes](#5-database-schema-changes)
6. [API Changes](#6-api-changes)
7. [Frontend Changes](#7-frontend-changes)
8. [Migration Strategy](#8-migration-strategy)
9. [Testing Strategy](#9-testing-strategy)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Authentication & Authorization

### 1.1 Self-Serve Account Creation

**User Story:** Allow new users to create workspace accounts and become Super Admin

**Current State:**
- Unknown signup flow
- Role assignment unclear

**Required Changes:**

#### Backend:

**Database Schema:**
```sql
-- Users table modifications
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'super_admin';
ALTER TABLE users ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_primary_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);

-- Workspaces table (new)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active'
);
```

**API Endpoint:**
```typescript
POST /auth/signup
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "workspace_name": "Acme Corp"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "super_admin",
    "is_primary_admin": true
  },
  "workspace": {
    "id": "uuid",
    "name": "Acme Corp"
  },
  "token": "jwt_token"
}
```

**Business Logic:**
1. Validate email uniqueness
2. Create workspace
3. Create user with role='super_admin', is_primary_admin=true
4. Link user to workspace
5. Seed default journeys and task types
6. Return JWT token

---

### 1.2 Role Hierarchy & Permissions

**Roles:**
1. **Super Admin** (Primary Admin)
   - Cannot be deleted
   - Cannot be downgraded
   - Can promote/demote other admins
   - Full system access

2. **Admin**
   - Can be created by Super Admin
   - Configurable permissions
   - Can invite consultants and clients (if permitted)

3. **Consultant**
   - Zero permissions by default
   - Permissions assigned by Super Admin/Admin
   - Can work on assigned projects

4. **Client**
   - Created via Contacts only
   - Limited to own projects
   - Cannot invite others

**Permission Matrix:**

| Action | Super Admin | Admin | Consultant | Client |
|--------|-------------|-------|------------|--------|
| Create workspace | ✅ | ❌ | ❌ | ❌ |
| Invite Admin | ✅ | ❌ | ❌ | ❌ |
| Invite Consultant | ✅ | ✅* | ❌ | ❌ |
| Invite Client | ✅ | ✅* | ✅* | ❌ |
| Approve client invites | ✅ | ✅* | ❌ | ❌ |
| Deactivate users | ✅ | ❌ | ❌ | ❌ |
| Manage journeys | ✅ | ✅* | ❌ | ❌ |
| Create projects | ✅ | ✅ | ✅ | ❌ |
| View all projects | ✅ | ✅ | ❌ | ❌ |
| View own projects | ✅ | ✅ | ✅ | ✅ |

*If permission granted by Super Admin

**Database Schema:**
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  permission_key VARCHAR(100) NOT NULL,
  granted_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, permission_key)
);

-- Permission keys
-- 'invite_admin', 'invite_consultant', 'invite_client', 
-- 'approve_client_invites', 'manage_journeys', etc.
```

---

### 1.3 User Deactivation

**User Story:** Super Admin can deactivate/reactivate users

**Database Schema:**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
-- Values: 'active', 'deactivated', 'invited'

ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_by UUID REFERENCES users(id);
```

**API Endpoints:**
```typescript
POST /users/:id/deactivate
{
  "reason": "No longer with company"
}

POST /users/:id/reactivate
{}
```

**Business Logic:**
- Deactivated users cannot login
- Sessions are invalidated
- Reactivation requires password reset
- Audit trail maintained

---

## 2. Contact & Client Management

### 2.1 User vs Contact Separation

**Problem:** Duplicate client creation paths (Users and Contacts)

**Solution:** Clients can ONLY be created via Contacts

**Changes Required:**

#### Remove Client from User Creation:
```typescript
// Admin → Manage Users → Add User
// Available roles: ['admin', 'consultant']
// Remove: 'client'
```

#### Contact Creation Flow:
```typescript
POST /contacts
{
  "name": "John Client",
  "email": "client@example.com",
  "phone": "+1234567890"
}

Response:
{
  "id": "uuid",
  "name": "John Client",
  "email": "client@example.com",
  "phone": "+1234567890",
  "status": "uninvited",
  "created_at": "2026-03-05T..."
}
```

**Database Schema:**
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'uninvited';
-- Values: 'uninvited', 'invited', 'active'

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP NULL;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) NULL;
-- Links contact to user account when they accept invite
```

---

### 2.2 Controlled Client Activation

**User Story:** Manually send invites to contacts

**Workflow:**
1. Contact created → Status: "uninvited"
2. Admin/Consultant clicks "Send Invite" → Status: "invited"
3. Client sets password → Status: "active", user account created

**API Endpoints:**
```typescript
POST /contacts/:id/send-invite
{
  "message": "Optional custom message"
}

Response:
{
  "success": true,
  "invite_sent_at": "2026-03-05T...",
  "status": "invited"
}

// Client accepts invite
POST /contacts/accept-invite
{
  "token": "invite_token",
  "password": "SecurePass123!"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "client@example.com",
    "role": "client"
  },
  "token": "jwt_token"
}
```

**Database Schema:**
```sql
CREATE TABLE contact_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2.3 Client Invite Approval Workflow

**User Story:** Consultant invites require admin approval

**Workflow:**
1. Consultant sends invite → Status: "pending_approval"
2. Admin approves → Status: "invited", email sent
3. Admin rejects → Status: "uninvited"

**Database Schema:**
```sql
ALTER TABLE contact_invites ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
-- Values: 'pending', 'approved', 'rejected', 'sent'

ALTER TABLE contact_invites ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);
ALTER TABLE contact_invites ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL;
```

**API Endpoints:**
```typescript
// Consultant sends invite (requires approval)
POST /contacts/:id/request-invite
{
  "message": "Please approve this client"
}

// Admin approves
POST /contact-invites/:id/approve
{}

// Admin rejects
POST /contact-invites/:id/reject
{
  "reason": "Not ready yet"
}
```

---

## 3. Task Management

### 3.1 Task Structure Changes

**Changes:**
1. Make description optional
2. Add "Inhouse" vs "Client Facing" classification
3. Remove start date
4. Rename end_date to due_date
5. Remove "in_progress" status (only "pending" and "completed")
6. Add document upload field for document upload task type

**Database Schema:**
```sql
ALTER TABLE tasks ALTER COLUMN description DROP NOT NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'client_facing';
-- Values: 'inhouse', 'client_facing'

ALTER TABLE tasks DROP COLUMN IF EXISTS start_date;
ALTER TABLE tasks RENAME COLUMN end_date TO due_date;

-- Update status enum
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('pending', 'completed'));

-- Document upload
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS document_url TEXT NULL;
```

**Migration for Existing Tasks:**
```sql
-- Set all existing tasks to 'inhouse' by default
UPDATE tasks SET visibility = 'inhouse' WHERE visibility IS NULL;

-- Map old statuses to new
UPDATE tasks SET status = 'pending' WHERE status = 'in_progress';
```

---

### 3.2 Task Notifications

**User Story:** Notify users when tasks are assigned

**Database Schema:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(255),
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread 
  ON notifications(user_id, read_at) 
  WHERE read_at IS NULL;
```

**API Endpoints:**
```typescript
GET /notifications
Response: {
  "notifications": [...],
  "unread_count": 5
}

POST /notifications/:id/mark-read
{}

POST /notifications/mark-all-read
{}
```

---

### 3.3 Default Task Types

**User Story:** Auto-create default task types on workspace creation

**Default Task Types:**
1. Document Upload (with upload field)
2. Review
3. Approval
4. Meeting
5. Follow-up

**Implementation:**
```typescript
// On workspace creation
async function seedDefaultTaskTypes(workspaceId: string) {
  const defaultTypes = [
    { name: 'Document Upload', has_upload: true },
    { name: 'Review', has_upload: false },
    { name: 'Approval', has_upload: false },
    { name: 'Meeting', has_upload: false },
    { name: 'Follow-up', has_upload: false }
  ];
  
  for (const type of defaultTypes) {
    await db('task_types').insert({
      workspace_id: workspaceId,
      name: type.name,
      has_upload_field: type.has_upload
    });
  }
}
```

---

## 4. Project Creation

### 4.1 Simplified Project Form

**Removed Fields:**
- Description (use notes instead)
- Client organization
- Resident country
- Postcode
- End date

**Optional Fields:**
- Project value
- Nationality
- Client name

**Required Fields:**
- Project name
- Journey
- Client email
- Client phone
- Start date

**New Form Structure:**
```typescript
interface CreateProjectRequest {
  name: string;                    // Required
  project_type_id: string;         // Required (journey)
  start_date: string;              // Required
  
  // Contact information (creates/links contact)
  client_email: string;            // Required
  client_phone: string;            // Required
  client_name?: string;            // Optional
  
  // Optional fields
  project_value?: number;
  nationality?: string;
  notes?: string;
}
```

**API Endpoint:**
```typescript
POST /projects
{
  "name": "Acme Corp Setup",
  "project_type_id": "uuid",
  "start_date": "2026-03-15",
  "client_email": "client@acme.com",
  "client_phone": "+1234567890",
  "client_name": "John Doe",
  "project_value": 50000,
  "nationality": "US",
  "notes": "Urgent project"
}

Response:
{
  "project": {
    "id": "uuid",
    "name": "Acme Corp Setup",
    "client_contact_id": "uuid"
  },
  "contact": {
    "id": "uuid",
    "email": "client@acme.com",
    "status": "uninvited",
    "is_new": true
  }
}
```

**Business Logic:**
1. Search for existing contact by email
2. If found, link to project
3. If not found, create new contact with status='uninvited'
4. Create project
5. Return both project and contact info

---

## 5. Database Schema Changes

### Summary of All Schema Changes:

```sql
-- 1. Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active'
);

-- 2. Users modifications
ALTER TABLE users ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_primary_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_by UUID REFERENCES users(id);

-- 3. User permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  permission_key VARCHAR(100) NOT NULL,
  granted_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, permission_key)
);

-- 4. Contacts modifications
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'uninvited';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP NULL;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) NULL;

-- 5. Contact invites
CREATE TABLE IF NOT EXISTS contact_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tasks modifications
ALTER TABLE tasks ALTER COLUMN description DROP NOT NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'client_facing';
ALTER TABLE tasks DROP COLUMN IF EXISTS start_date;
ALTER TABLE tasks RENAME COLUMN end_date TO due_date;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS document_url TEXT NULL;

-- Update task status constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('pending', 'completed'));

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(255),
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON notifications(user_id, read_at) 
  WHERE read_at IS NULL;

-- 8. Projects modifications
ALTER TABLE projects DROP COLUMN IF EXISTS description;
ALTER TABLE projects DROP COLUMN IF EXISTS client_organization;
ALTER TABLE projects DROP COLUMN IF EXISTS resident_country;
ALTER TABLE projects DROP COLUMN IF EXISTS postcode;
ALTER TABLE projects DROP COLUMN IF EXISTS end_date;
ALTER TABLE projects ALTER COLUMN project_value DROP NOT NULL;
ALTER TABLE projects ALTER COLUMN nationality DROP NOT NULL;
```

---

## 6. API Changes

### New Endpoints:

```
Authentication:
POST   /auth/signup                    # Self-serve account creation

User Management:
POST   /users/:id/deactivate          # Deactivate user
POST   /users/:id/reactivate          # Reactivate user
GET    /users/:id/permissions         # Get user permissions
POST   /users/:id/permissions         # Grant permission
DELETE /users/:id/permissions/:key    # Revoke permission

Contact Management:
POST   /contacts/:id/send-invite      # Send invite to contact
POST   /contacts/:id/request-invite   # Request invite (consultant)
POST   /contact-invites/:id/approve   # Approve invite request
POST   /contact-invites/:id/reject    # Reject invite request
POST   /contacts/accept-invite        # Client accepts invite

Notifications:
GET    /notifications                 # Get user notifications
POST   /notifications/:id/mark-read   # Mark as read
POST   /notifications/mark-all-read   # Mark all as read
```

### Modified Endpoints:

```
POST   /projects                      # Simplified payload
POST   /tasks                         # New fields (visibility, document_url)
GET    /tasks                         # Filter by visibility
```

---

## 7. Frontend Changes

### 7.1 Authentication Pages

**New: Self-Serve Signup Page**
- Email + Password fields
- Workspace name field
- Terms acceptance
- Auto-login after signup

**Location:** `src/pages/Auth/SignUp.tsx`

---

### 7.2 User Management

**Admin → Manage Users → Add User**
- Remove "Client" from role dropdown
- Only show: Admin, Consultant
- Add permission checkboxes for Admin/Consultant

**Location:** `src/pages/Home/Admin/user/add-user-model-form.tsx`

**Admin → Manage Users → User Table**
- Show role badge (Super Admin, Admin, Consultant)
- Disable delete for Super Admin
- Add "Deactivate" button
- Show status (Active, Deactivated)

**Location:** `src/pages/Home/Admin/user/user-table-row.tsx`

---

### 7.3 Contact Management

**Contacts → Add Contact**
- Name, Email, Phone fields only
- No invite sent automatically
- Show "Status: Uninvited" after creation

**Contacts → Contact Table**
- Add "Status" column (Uninvited, Invited, Active)
- Add "Send Invite" button (if uninvited)
- Add "Resend Invite" button (if invited)
- Show approval status (if consultant invite)

**Location:** `src/pages/Home/Contact/`

---

### 7.4 Project Creation

**Projects → Create Project**
- Remove fields: description, client_organization, resident_country, postcode, end_date
- Make optional: project_value, nationality, client_name
- Add: client_email, client_phone (required)
- Replace description with notes

**Location:** `src/pages/projects/components/project-dynamic-form.tsx`

---

### 7.5 Task Management

**Tasks → Create Task**
- Make description optional
- Add "Visibility" dropdown (Inhouse, Client Facing)
- Remove start_date field
- Rename end_date to due_date
- Remove "In Progress" status
- Add document upload field (if task type supports it)

**Tasks → Task Table**
- Add visibility filter
- Show visibility badge
- Update status options (Pending, Completed only)

**Location:** `src/pages/Home/Task/`

---

### 7.6 Notifications

**New: Notification Bell Icon**
- Show unread count badge
- Dropdown with recent notifications
- "Mark all as read" button
- Link to notification center

**Location:** `src/layouts/dashboard-layout/` (Header)

---

## 8. Migration Strategy

### Phase 1: Database Migrations (Week 1-2)

```bash
# Create migrations
npm run db:migrate:make add_workspaces_table
npm run db:migrate:make modify_users_table
npm run db:migrate:make add_user_permissions
npm run db:migrate:make modify_contacts_table
npm run db:migrate:make add_contact_invites
npm run db:migrate:make modify_tasks_table
npm run db:migrate:make add_notifications_table
npm run db:migrate:make modify_projects_table

# Run migrations
npm run db:migrate
```

### Phase 2: Data Migration (Week 2)

```sql
-- Migrate existing users to workspaces
-- Assume each organization is a workspace
INSERT INTO workspaces (id, name, created_at)
SELECT DISTINCT 
  organization_id as id,
  organization_name as name,
  MIN(created_at) as created_at
FROM users
GROUP BY organization_id, organization_name;

-- Link users to workspaces
UPDATE users 
SET workspace_id = organization_id
WHERE workspace_id IS NULL;

-- Set primary admin (first user in each workspace)
WITH first_users AS (
  SELECT DISTINCT ON (workspace_id) 
    id, workspace_id
  FROM users
  ORDER BY workspace_id, created_at ASC
)
UPDATE users
SET is_primary_admin = true
WHERE id IN (SELECT id FROM first_users);

-- Migrate existing tasks
UPDATE tasks 
SET visibility = 'inhouse',
    status = 'pending'
WHERE status = 'in_progress';

-- Migrate existing contacts
UPDATE contacts
SET status = 'active'
WHERE status IS NULL;
```

### Phase 3: Backend Implementation (Week 3-6)

1. Authentication endpoints
2. User management endpoints
3. Contact management endpoints
4. Permission system
5. Notification system
6. Updated project/task endpoints

### Phase 4: Frontend Implementation (Week 7-10)

1. Signup page
2. User management updates
3. Contact management updates
4. Project form updates
5. Task form updates
6. Notification UI

### Phase 5: Testing & QA (Week 11-12)

1. Unit tests
2. Integration tests
3. E2E tests
4. UAT with stakeholders

---

## 9. Testing Strategy

### Unit Tests

```typescript
// Authentication
describe('Self-serve signup', () => {
  it('should create workspace and super admin user');
  it('should seed default journeys and task types');
  it('should prevent duplicate email signup');
});

// Permissions
describe('User permissions', () => {
  it('should prevent non-super-admin from deleting super admin');
  it('should allow super admin to grant permissions');
  it('should enforce permission checks on endpoints');
});

// Contact lifecycle
describe('Contact management', () => {
  it('should create contact with uninvited status');
  it('should send invite and update status');
  it('should create user account on invite acceptance');
});
```

### Integration Tests

```typescript
// Full workflow tests
describe('Client onboarding flow', () => {
  it('should create contact → send invite → accept → login');
});

describe('Project creation with contact', () => {
  it('should create project and link to existing contact');
  it('should create project and create new contact');
});
```

### E2E Tests

```typescript
// User journeys
describe('Super admin journey', () => {
  it('should signup → create workspace → invite admin → create project');
});

describe('Consultant journey', () => {
  it('should accept invite → create contact → request approval → send invite');
});
```

---

## 10. Implementation Roadmap

### Week 1-2: Foundation
- [ ] Database schema design
- [ ] Create migrations
- [ ] Run migrations on staging
- [ ] Data migration scripts

### Week 3-4: Authentication & Authorization
- [ ] Self-serve signup endpoint
- [ ] Workspace creation logic
- [ ] Permission system
- [ ] User deactivation

### Week 5-6: Contact Management
- [ ] Contact invite flow
- [ ] Approval workflow
- [ ] Client activation
- [ ] Email templates

### Week 7-8: Task & Project Updates
- [ ] Task structure changes
- [ ] Project form simplification
- [ ] Notification system
- [ ] Default seeding

### Week 9-10: Frontend Implementation
- [ ] Signup page
- [ ] User management UI
### Week 11-12: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] UAT
- [ ] Production deployment

---

## 11. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Data migration errors | High | Medium | Thorough testing, rollback plan |
| Permission system bugs | High | Medium | Comprehensive unit tests |
| User confusion with new flow | Medium | High | Clear documentation, training |
| Performance degradation | Medium | Low | Load testing, indexing |
| Breaking existing features | High | Medium | Regression testing |

---

## 12. Success Metrics

- [ ] 100% of new signups create workspace successfully
- [ ] 0 permission bypass incidents
- [ ] < 5% support tickets related to new flow
- [ ] < 2s average page load time
- [ ] 95% user satisfaction score

---

## Conclusion

This is a comprehensive platform enhancement requiring careful planning and execution. The changes affect core authentication, authorization, and user workflows. Estimated effort is 8-12 weeks with 2-3 engineers.

**Recommendation:** Implement in phases with feature flags for gradual rollout and easy rollback if issues arise.
