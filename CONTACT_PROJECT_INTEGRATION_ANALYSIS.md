# Contact & Project Integration - Technical Analysis

## Meeting Date
March 3, 2026

## Overview
Technical specification for implementing contact management improvements, focusing on:
- Auto-creating contacts from project creation
- Preventing duplicate contacts
- Managing invite flows
- Ensuring data integrity with concurrent operations

---

## 1. Data Model Changes

### Contact Table
**Required Fields:**
- `id` (UUID, primary key)
- `email` (VARCHAR, unique, indexed, NOT NULL)
- `phone` (VARCHAR, indexed, nullable)
- `name` (VARCHAR, nullable)
- `status` (ENUM: `draft`, `invited`, `active`)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `source` (ENUM: `project`, `manual`)

**Constraints:**
- Unique constraint on `email` (no nullable emails allowed)
- Index on `email` for fast lookups
- Index on `phone` for search functionality

### Project Table
**New/Modified Fields:**
- `id` (UUID, primary key)
- `name` (VARCHAR)
- `journey_id` (UUID, FK)
- `notes` (TEXT, nullable)
- `start_date` (DATE)
- `status` (ENUM: `draft`, `active`, `archived`)
- `client_contact_id` (UUID, nullable FK to contact)
- `invite_sent_at` (TIMESTAMP, nullable)
- `created_by` (UUID, FK to user)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Key Design Decision:**
- Projects can exist without `client_contact_id` initially
- Link established later through transactional upsert

### ContactProject Junction Table (Future)
For multiple contacts per project:
```sql
CREATE TABLE contact_projects (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  role VARCHAR(50),
  created_at TIMESTAMP,
  UNIQUE(project_id, contact_id)
);
```

### Audit/Change Log Table
```sql
CREATE TABLE contact_audit_log (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- 'created', 'invited', 'activated', 'merged'
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 2. Validation & Uniqueness Strategy

### Email Validation
1. **Syntactic validation** (RFC5322-lite) at API layer
2. **Normalization:**
   - Convert to lowercase
   - Trim whitespace
3. **Uniqueness:** Enforced at DB level with unique index

### Phone Handling
- Normalize to E.164 format where possible
- Index for search performance
- NOT required to be unique (multiple contacts can share phone)

### Idempotency & Race Conditions
**Transactional Upsert Pattern:**
```sql
BEGIN TRANSACTION;
  
  -- Lock row to prevent race conditions
  SELECT id FROM contacts 
  WHERE email = LOWER(TRIM($email))
  FOR UPDATE;
  
  -- If exists, reuse; else insert
  INSERT INTO contacts (email, phone, name, status, source)
  VALUES (LOWER(TRIM($email)), $phone, $name, 'draft', 'project')
  ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
  RETURNING id;
  
  -- Create project with contact_id
  INSERT INTO projects (name, client_contact_id, ...)
  VALUES ($name, $contact_id, ...);
  
COMMIT;
```

---

## 3. API & Backend Endpoints

### POST /projects
**Payload:**
```json
{
  "name": "Project Name",
  "journey_id": "uuid",
  "start_date": "2026-03-15",
  "contact_candidate": {
    "email": "client@example.com",
    "phone": "+1234567890",
    "name": "John Doe"
  }
}
```

**Server Behavior (Recommended: Strict with Transactional Upsert):**
1. Normalize email and phone
2. Begin transaction
3. Upsert contact (create if new, reuse if exists)
4. Create project linked to contact
5. Commit transaction
6. Return project with contact_id

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "Project Name",
    "client_contact_id": "uuid",
    "status": "draft"
  },
  "contact": {
    "id": "uuid",
    "email": "client@example.com",
    "status": "draft",
    "is_new": true
  }
}
```

### POST /projects/:id/send-invite
**Behavior:**
1. Verify contact exists and has email
2. Enqueue invite job
3. Set `invite_sent_at` timestamp
4. Update contact status to `invited`

**Response:**
```json
{
  "success": true,
  "invite_sent_at": "2026-03-03T10:30:00Z",
  "contact_status": "invited"
}
```

### GET /contacts?search=:query
**Query Parameters:**
- `search` - Search by email or phone
- `status` - Filter by status
- `source` - Filter by source

**Response:**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "email": "client@example.com",
      "phone": "+1234567890",
      "name": "John Doe",
      "status": "active",
      "source": "project"
    }
  ],
  "total": 1
}
```

### POST /contacts/merge (Admin Tool)
**Payload:**
```json
{
  "source_contact_id": "uuid",
  "target_contact_id": "uuid",
  "merge_strategy": {
    "keep_name": "target",
    "keep_phone": "source",
    "append_notes": true
  }
}
```

**Behavior:**
1. Verify admin permissions
2. Begin transaction
3. Update all projects to point to target_contact_id
4. Merge contact fields based on strategy
5. Soft delete or archive source contact
6. Log merge action in audit table
7. Commit transaction

---

## 4. Invite & Verification Mechanics

### Invite Flow
1. **Trigger:** POST /projects/:id/send-invite
2. **Background Job:** Enqueue `send_invite_email` job
3. **Email Content:**
   - Signed invite token (HMAC or JWT)
   - Expiration time (e.g., 7 days)
   - Confirmation link: `https://app.pylot.io/confirm?token=...`
4. **Status Update:** Contact status: `draft` → `invited`
5. **Record:** Set `invite_sent_at` timestamp

### Verification Flow
**POST /contacts/confirm**
```json
{
  "token": "signed_token_here"
}
```

**Behavior:**
1. Verify token signature and expiration
2. Extract contact_id from token
3. Update contact status: `invited` → `active`
4. Mark token as used (prevent replay)
5. Grant access to linked projects

### Security Measures
- **Token format:** JWT with signature
- **Expiration:** 7 days
- **Single-use:** Mark token as consumed
- **Rate limiting:** Max 3 invite sends per contact per day

### Project Visibility Policy
Projects visible to contact when:
- `contact.status == 'active'` OR
- `project.invite_sent_at IS NULL` AND contact already active

---

## 5. Background Jobs & Processing

### Queue System
**Technology Options:**
- Sidekiq (Ruby)
- Celery (Python)
- Bull (Node.js)
- AWS SQS + Lambda

### Jobs

#### send_invite_email
**Payload:**
```json
{
  "contact_id": "uuid",
  "project_id": "uuid",
  "idempotency_key": "unique_key"
}
```

**Behavior:**
1. Fetch contact and project details
2. Generate signed invite token
3. Send email via email service (SendGrid, AWS SES)
4. Update `invite_sent_at` on success
5. Retry on failure (exponential backoff: 1m, 5m, 15m, 1h)

#### reconcile_orphans (Periodic)
**Schedule:** Every 1 hour

**Behavior:**
1. Find projects with `contact_candidate` but no `client_contact_id`
2. Attempt transactional upsert for each
3. Flag for manual review if upsert fails
4. Log reconciliation actions

#### retry_failed_invites (Periodic)
**Schedule:** Every 30 minutes

**Behavior:**
1. Find contacts with status `invited` but no recent email delivery confirmation
2. Check email bounce status
3. Retry or mark as permanently failed

---

## 6. Permissions & Access Control

### Role-Based Access Control (RBAC)

| Action | super_admin | admin | project_manager | agent | client |
|--------|-------------|-------|-----------------|-------|--------|
| Create contact (manual) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create project (auto-create contact) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send invite | ✅ | ✅ | ✅ | ❌ | ❌ |
| Merge contacts | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all contacts | ✅ | ✅ | ✅ | ❌ | ❌ |
| View own projects | ✅ | ✅ | ✅ | ✅ | ✅ |

### Audit Logging
Log the following actions:
- Contact auto-created from project
- Contact manually created
- Invite sent
- Invite confirmed
- Contact merged
- Contact deleted

**Audit Log Entry:**
```json
{
  "id": "uuid",
  "contact_id": "uuid",
  "user_id": "uuid",
  "action": "auto_created",
  "details": {
    "source": "project",
    "project_id": "uuid",
    "email": "client@example.com"
  },
  "timestamp": "2026-03-03T10:30:00Z"
}
```

---

## 7. Duplicate Detection & Merge Policy

### Primary Dedupe Key
**Email** (normalized, lowercase, trimmed)

### Secondary Dedupe Key
**Phone** (fuzzy match using Levenshtein distance or phonetic algorithms)

### On Insert Conflict
1. Detect email conflict via unique constraint
2. Return existing contact_id
3. Link project to existing contact
4. Log "duplicate prevented" event

### Admin Merge Tool
**Use Cases:**
- Merge contacts created with typos
- Consolidate contacts from different sources
- Resolve phone number conflicts

**Merge Strategy:**
- Keep target contact as primary
- Transfer all project links to target
- Merge custom fields (configurable)
- Archive source contact
- Maintain audit trail

---

## 8. Database Migration & Deployment

### Migration Plan

#### Phase 1: Add New Columns (Nullable)
```sql
-- Migration 001: Add new columns
ALTER TABLE contacts 
  ADD COLUMN status VARCHAR(20) DEFAULT 'active',
  ADD COLUMN source VARCHAR(20) DEFAULT 'manual';

ALTER TABLE projects
  ADD COLUMN invite_sent_at TIMESTAMP NULL;

-- Add indices
CREATE INDEX idx_contacts_email ON contacts(LOWER(email));
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_status ON contacts(status);
```

#### Phase 2: Backfill Existing Data
```sql
-- Backfill existing contacts
UPDATE contacts 
SET status = 'active', source = 'manual'
WHERE status IS NULL;
```

#### Phase 3: Apply Constraints
```sql
-- Make status NOT NULL
ALTER TABLE contacts 
  ALTER COLUMN status SET NOT NULL;

-- Add unique constraint on email
CREATE UNIQUE INDEX idx_contacts_email_unique 
ON contacts(LOWER(TRIM(email)));
```

### Zero-Downtime Strategy
1. Deploy code that handles both old and new schema
2. Run migrations during low-traffic window
3. Monitor for errors
4. Rollback plan: remove constraints, drop columns

---

## 9. Testing & QA

### Unit Tests
- Transactional upsert logic
- Email normalization
- Phone normalization
- Status transitions
- Token generation and verification

### Integration Tests
- Full flow: project creation → contact upsert → invite job → confirm
- Concurrent project creations with same email (no duplicates)
- Invite retry logic
- Merge contacts with project reassignment

### Load Tests
- Create 1000 concurrent projects with same email
- Verify only 1 contact created
- Measure transaction throughput
- Test queue processing under load

### End-to-End QA Cases
1. ✅ Create project with existing contact → reuses contact
2. ✅ Create project with new email → creates contact once
3. ✅ Concurrent projects with same email → no duplicates
4. ✅ Send invite → job enqueued, status updated
5. ✅ Confirm invite → status active, project visible
6. ✅ Merge contacts → projects transferred, audit logged

---

## 10. Observability & Monitoring

### Metrics to Track
- `contacts_auto_created_total` (counter)
- `invite_sent_total` (counter)
- `invite_confirmed_total` (counter)
- `duplicate_prevented_total` (counter)
- `contact_merge_total` (counter)
- `invite_job_duration_seconds` (histogram)
- `email_delivery_failure_total` (counter)
- `queue_backlog_size` (gauge)

### Alerts
- High duplicate-create failures (> 10/min)
- Email delivery failure spike (> 5% failure rate)
- Queue processing lag (> 1000 jobs pending)
- Invite confirmation rate drop (< 20% within 7 days)

### Dashboards
- Contact creation trends
- Invite funnel (sent → confirmed)
- Duplicate prevention stats
- Queue health metrics

---

## 11. Estimated Effort & Prioritization

### Breakdown (Engineer-Days)

| Task | Effort | Priority |
|------|--------|----------|
| Core transactional upsert + DB schema + API | 3-6 days | P0 |
| Invite/job system + email templates + tokens | 2-4 days | P0 |
| Background reconciliation + admin merge tool | 4-8 days | P1 |
| RBAC adjustments + permissions + audit logs | 2-4 days | P1 |
| Testing (unit + integration + load) | 3-5 days | P0 |
| Documentation + API specs | 1-2 days | P1 |

**Total MVP:** 15-29 engineer-days (~2-3 weeks with 1 engineer, or 1-1.5 weeks with 2 engineers)

### Phased Rollout
**Phase 1 (MVP):**
- Transactional upsert
- Basic invite flow
- Duplicate prevention

**Phase 2:**
- Admin merge tool
- Advanced audit logging
- Reconciliation jobs

**Phase 3:**
- Multiple contacts per project (junction table)
- Advanced search and filtering
- Bulk operations

---

## 12. Security & Compliance

### Security Measures
- Invite tokens signed with HMAC-SHA256
- Tokens expire after 7 days
- Single-use tokens (mark as consumed)
- Rate limiting on invite sends
- No sensitive data in email content

### GDPR/PDPA Compliance
- Store purpose and consent for contact creation
- Log consent/opt-in timestamps
- Provide data subject access request (DSAR) endpoints:
  - `GET /contacts/:id/export` - Export all contact data
  - `DELETE /contacts/:id` - Delete contact and anonymize audit logs
- Email bounce handling:
  - Mark contacts with permanent bounce
  - Prevent repeated invites to bounced emails

---

## 13. Frontend Impact (Out of Scope)

This analysis focuses on backend changes only. Frontend changes are documented separately in:
- `DEAL_PIPELINE_INTEGRATION_ANALYSIS.md`
- Future UI/UX specifications

---

## 14. Next Steps & Deliverables

### Recommended Next Artifacts
1. **Sequence Diagram** - Project create → contact upsert → invite flow
2. **DB Migration Plan** - SQL snippets for safe migrations
3. **API Contract** - OpenAPI/Swagger specs for new endpoints
4. **Test Plan** - Detailed test cases with acceptance criteria

### Decision Points Requiring Clarification
1. **Project creation policy:** Strict (require contact) vs Permissive (allow without contact)?
   - **Recommendation:** Strict with transactional upsert
2. **Multiple contacts per project:** Implement now or later?
   - **Recommendation:** Later (Phase 3)
3. **Email service provider:** SendGrid, AWS SES, or other?
4. **Queue technology:** Based on existing stack

---

## 15. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Duplicate contacts created under load | High | Medium | Transactional upsert with FOR UPDATE lock |
| Email delivery failures | Medium | Medium | Retry logic + bounce handling |
| Token replay attacks | High | Low | Single-use tokens + expiration |
| Migration downtime | High | Low | Zero-downtime migration strategy |
| Performance degradation | Medium | Medium | Index optimization + load testing |

---

## Conclusion

This specification provides a comprehensive backend implementation plan for contact and project integration. The recommended approach uses:
- **Transactional upsert** to prevent duplicates
- **Asynchronous invite jobs** for scalability
- **Strict validation** for data integrity
- **Comprehensive audit logging** for compliance

**Estimated Timeline:** 2-3 weeks for MVP with 1 full-time engineer.

**Next Action:** Review with engineering lead and product team to finalize decision points and prioritize phases.
