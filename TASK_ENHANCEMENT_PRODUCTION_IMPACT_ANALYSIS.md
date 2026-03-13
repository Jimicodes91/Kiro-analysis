# Task Enhancement Production Impact Analysis

## Executive Summary

Deploying the current enhancement spec to production will introduce **BREAKING CHANGES** that affect the task management system across the entire application. This analysis identifies all impacted areas, required changes, data migration needs, and rollback considerations.

**Risk Level: HIGH** ⚠️
**Estimated Effort: 3-5 days**
**Recommended Approach: Phased rollout with feature flags**

---

## 1. DATABASE SCHEMA CHANGES

### 1.1 Required Schema Modifications

#### Table: `project_tasks`

**BREAKING CHANGES:**

| Action | Field | Current | New | Impact |
|--------|-------|---------|-----|--------|
| DROP | `start_date` | timestamp | N/A | **HIGH** - Data loss, breaks existing queries |
| RENAME | `end_date` | timestamp | `due_date` | **HIGH** - Breaks all queries using end_date |
| MODIFY | `is_visible_to_client` | boolean | `visibility` enum('inhouse', 'client_facing') | **HIGH** - Type change, data transformation needed |
| MODIFY | `description` | string NOT NULL | string NULL | **LOW** - Makes field optional |
| MODIFY | `status` | enum(pending, in_progress, completed) | enum(pending, completed) | **MEDIUM** - Removes in_progress status |
| ADD | `document_url` | N/A | varchar(500) NULL | **LOW** - New optional field |

**Migration Script Required:**
```sql
-- Step 1: Add new columns
ALTER TABLE project_tasks 
  ADD COLUMN visibility ENUM('inhouse', 'client_facing') DEFAULT 'inhouse' AFTER status,
  ADD COLUMN document_url VARCHAR(500) NULL AFTER visibility,
  ADD COLUMN due_date TIMESTAMP NULL AFTER description;

-- Step 2: Migrate data
UPDATE project_tasks 
  SET visibility = CASE 
    WHEN is_visible_to_client = 1 THEN 'client_facing'
    ELSE 'inhouse'
  END,
  due_date = end_date;

-- Step 3: Handle in_progress status
UPDATE project_tasks 
  SET status = 'pending' 
  WHERE status = 'in_progress';

-- Step 4: Make description nullable
ALTER TABLE project_tasks 
  MODIFY COLUMN description TEXT NULL;

-- Step 5: Drop old columns (POINT OF NO RETURN)
ALTER TABLE project_tasks 
  DROP COLUMN start_date,
  DROP COLUMN end_date,
  DROP COLUMN is_visible_to_client;

-- Step 6: Make due_date NOT NULL
ALTER TABLE project_tasks 
  MODIFY COLUMN due_date TIMESTAMP NOT NULL;
```

**Data Loss:**
- ✅ `start_date` - **PERMANENT DATA LOSS** (no equivalent in new schema)
- ✅ `in_progress` status - **CONVERTED TO pending** (status granularity reduced)

**Rollback Complexity:** **VERY HIGH** - Cannot restore start_date data after migration

---

## 2. BACKEND CODE IMPACT

### 2.1 Affected Files (Direct Changes Required)

#### Core Task Service
- **File:** `Pylott-Backend/src/modules/projects/services/task.service.ts`
- **Changes:**
  - Remove all `start_date` references
  - Replace `end_date` with `due_date` (15+ occurrences)
  - Replace `is_visible_to_client` boolean logic with `visibility` enum
  - Update status validation to only allow 'pending' | 'completed'
  - Add `document_url` handling
  - Update date formatting logic
- **Impact:** **CRITICAL** - Core business logic

#### Task Repository
- **File:** `Pylott-Backend/src/repositories/project_task.repository.ts`
- **Changes:**
  - Update `getAllTasks()` query to use `visibility` enum
  - Replace `is_visible_to_client` filtering with `visibility = 'client_facing'`
  - Update `getTaskStatusCounts()` to use `due_date` instead of `end_date`
  - Remove `in_progress` from status counts
- **Impact:** **CRITICAL** - Data access layer

#### Type Definitions
- **File:** `Pylott-Backend/src/shared/types/projects.type.ts`
- **Changes:**
  ```typescript
  // BEFORE
  export type CreateTask = {
    name: string;
    description: string;
    status?: string;
    start_date: string;
    end_date: string;
    assignees: [string];
    attachments?: [string];
    is_visible_to_client: boolean;
    task_type_id: string;
    project_type_id: string;
  };

  // AFTER
  export type CreateTask = {
    name: string;
    description?: string;  // Now optional
    status?: 'pending' | 'completed';  // Restricted enum
    due_date: string;  // Renamed from end_date
    assignees: string[];  // Fixed array type
    attachments?: string[];
    visibility: 'inhouse' | 'client_facing';  // New enum
    document_url?: string;  // New field
    task_type_id: string;
    project_type_id: string;
  };
  ```
- **Impact:** **CRITICAL** - Breaks TypeScript compilation across entire backend

#### Task Model
- **File:** `Pylott-Backend/src/models/project_task.model.ts`
- **Changes:**
  - Remove `start_date` property
  - Rename `end_date` to `due_date`
  - Change `is_visible_to_client: boolean` to `visibility: 'inhouse' | 'client_facing'`
  - Add `document_url?: string`
  - Update `status` type to exclude 'in_progress'
- **Impact:** **CRITICAL** - ORM model definition

#### Project Controller
- **File:** `Pylott-Backend/src/modules/projects/projects.controller.ts`
- **Changes:**
  - Update request/response types for task endpoints
  - Update validation middleware
- **Impact:** **HIGH** - API contract changes

### 2.2 Affected Files (Indirect Impact)

#### Audit Trail Service
- **File:** `Pylott-Backend/src/modules/audit_trail/services/audit_trail.service.ts`
- **Impact:** **LOW** - Uses `start_date`/`end_date` for filtering audit logs (different context, not task-related)
- **Action:** No changes needed (different domain)

#### Project Members Repository
- **File:** `Pylott-Backend/src/repositories/project_members.repository.ts`
- **Impact:** **MEDIUM** - Uses `is_visible_to_client` for member visibility
- **Action:** Evaluate if this should also use enum or keep boolean

#### Documents Repository
- **File:** `Pylott-Backend/src/repositories/documents.repository.ts`
- **Impact:** **MEDIUM** - Uses `is_visible_to_client` for document visibility
- **Action:** Evaluate consistency with task visibility model

#### Project Settings
- **File:** Database table `project_settings`
- **Impact:** **MEDIUM** - Has `client_can_view_task` boolean setting
- **Action:** Evaluate if this interacts with new visibility enum

---

## 3. FRONTEND CODE IMPACT

### 3.1 Affected Components (Direct Changes Required)

#### Add Task Modal
- **File:** `Pylott-Web-App/src/pages/Home/Task/add-task-modal.tsx`
- **Changes:**
  - **REMOVE:** Start date field and date picker
  - **RENAME:** End date field to "Due date"
  - **REPLACE:** `is_visible_to_client` checkbox with visibility dropdown
  - **ADD:** Document URL field (conditional on task type)
  - **UPDATE:** Status options to only show Pending/Completed
  - **UPDATE:** Form validation schema
- **Lines Affected:** ~50 lines
- **Impact:** **CRITICAL** - User-facing form

#### Edit Task Modal
- **File:** `Pylott-Web-App/src/pages/Home/Task/edit-task-modal.tsx`
- **Changes:**
  - **REMOVE:** Lines 81, 352-393 (start_date field)
  - **RENAME:** Lines 82, 396-432 (end_date to due_date)
  - **REPLACE:** Lines 627-638 (is_visible_to_client checkbox to visibility dropdown)
  - **UPDATE:** Lines 279 (status options)
  - **UPDATE:** Default values mapping
  - **UPDATE:** Form submission payload
- **Lines Affected:** ~80 lines
- **Impact:** **CRITICAL** - User-facing form

#### Task Table Row
- **File:** `Pylott-Web-App/src/pages/Home/Task/task-table-row.tsx`
- **Changes:**
  - Update display of `end_date` to `due_date`
  - Add visibility badge display
- **Lines Affected:** ~5 lines
- **Impact:** **MEDIUM** - Display only

#### Task Table
- **File:** `Pylott-Web-App/src/pages/Home/Task/task-table.tsx`
- **Changes:**
  - Update column headers if needed
  - Add visibility filtering
- **Lines Affected:** ~10 lines
- **Impact:** **MEDIUM** - Display and filtering

### 3.2 Affected Hooks

#### Create Task Hook
- **File:** `Pylott-Web-App/src/hooks/project-modules/tasks/use-create-project-task.tsx`
- **Changes:**
  - Update `CreateTaskRequest` interface:
    ```typescript
    // BEFORE
    export interface CreateTaskRequest {
      name: string;
      description?: string;
      status: string;
      due_date: string;  // Already renamed!
      attachments: (string | null)[];
      visibility: 'inhouse' | 'client_facing';  // Already updated!
      document_url?: string;  // Already added!
      is_visible_to_client?: boolean;  // Marked deprecated
      task_type_id?: string;
      project_type_id: string;
      assignees?: string[];
    }
    ```
- **Impact:** **HIGH** - Hook already partially updated but has deprecated field

#### Update Task Hook
- **File:** `Pylott-Web-App/src/hooks/project-modules/tasks/use-update-project-task.tsx`
- **Changes:** Similar to create hook
- **Impact:** **HIGH**

#### Get Tasks Hook
- **File:** `Pylott-Web-App/src/hooks/project-modules/tasks/use-get-all-tasks.tsx`
- **Changes:** Update response type to match new schema
- **Impact:** **MEDIUM**

### 3.3 Validation Schema

#### Task Validation
- **File:** `Pylott-Web-App/src/utils/validation-schema/task.ts`
- **Changes:**
  - Remove `start_date` validation
  - Rename `end_date` to `due_date`
  - Replace `is_visible_to_client` boolean with `visibility` enum
  - Make `description` optional
  - Update `status` enum to only include pending/completed
  - Add `document_url` validation (max 500 chars)
- **Impact:** **HIGH** - Form validation

### 3.4 Type Definitions

#### Task Types
- **File:** `Pylott-Web-App/src/types/task.types.ts`
- **Changes:**
  - Update `Task` interface to match new schema
  - Remove `start_date`
  - Rename `end_date` to `due_date`
  - Change `is_visible_to_client` to `visibility`
  - Add `document_url`
- **Impact:** **CRITICAL** - TypeScript compilation

---

## 4. API CONTRACT CHANGES

### 4.1 Breaking Changes

#### POST /api/v1/projects/:project_id/tasks

**Request Body Changes:**
```json
// BEFORE
{
  "name": "Task name",
  "description": "Required description",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "status": "in_progress",
  "is_visible_to_client": true,
  "task_type_id": "uuid",
  "project_type_id": "uuid",
  "assignees": ["uuid1", "uuid2"]
}

// AFTER
{
  "name": "Task name",
  "description": "Optional description",  // Now optional
  "due_date": "2024-01-31T23:59:59Z",  // Renamed, no start_date
  "status": "pending",  // Only pending or completed
  "visibility": "client_facing",  // Enum instead of boolean
  "document_url": "https://...",  // New optional field
  "task_type_id": "uuid",
  "project_type_id": "uuid",
  "assignees": ["uuid1", "uuid2"]
}
```

**Response Body Changes:**
```json
// BEFORE
{
  "id": "uuid",
  "name": "Task name",
  "description": "Description",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "status": "in_progress",
  "is_visible_to_client": true,
  ...
}

// AFTER
{
  "id": "uuid",
  "name": "Task name",
  "description": "Description",  // Can be null
  "due_date": "2024-01-31",  // Renamed
  "status": "pending",  // Only pending or completed
  "visibility": "client_facing",  // Enum
  "document_url": "https://...",  // New field
  ...
}
```

#### GET /api/v1/projects/tasks

**Query Parameters Changes:**
- Add `visibility` filter: `?visibility=inhouse` or `?visibility=client_facing`
- Remove `is_visible_to_client` filter

**Response Changes:** Same as POST response

#### PATCH /api/v1/projects/:project_id/tasks/:task_id

**Request/Response Changes:** Same as POST

---

## 5. EXISTING DATA MIGRATION

### 5.1 Data Transformation Requirements

#### Task Records
**Estimated Records:** Unknown (depends on production data)

**Transformations:**
1. **start_date → DELETED**
   - Action: Drop column
   - Data Loss: YES - Cannot be recovered
   - Mitigation: Export to archive table before migration

2. **end_date → due_date**
   - Action: Copy data, rename column
   - Data Loss: NO
   - Complexity: LOW

3. **is_visible_to_client → visibility**
   - Action: Transform boolean to enum
   - Mapping:
     - `true` → `'client_facing'`
     - `false` → `'inhouse'`
     - `NULL` → `'inhouse'` (default)
   - Data Loss: NO
   - Complexity: LOW

4. **status: in_progress → pending**
   - Action: Update all in_progress tasks to pending
   - Data Loss: YES - Status granularity reduced
   - Mitigation: Log affected task IDs before migration
   - Complexity: LOW

5. **description: NOT NULL → NULL**
   - Action: Alter column constraint
   - Data Loss: NO
   - Complexity: LOW

### 5.2 Migration Script

```sql
-- BACKUP FIRST!
CREATE TABLE project_tasks_backup_20240307 AS SELECT * FROM project_tasks;

-- Step 1: Add new columns
ALTER TABLE project_tasks 
  ADD COLUMN visibility ENUM('inhouse', 'client_facing') DEFAULT 'inhouse' AFTER status,
  ADD COLUMN document_url VARCHAR(500) NULL AFTER visibility,
  ADD COLUMN due_date TIMESTAMP NULL AFTER description;

-- Step 2: Migrate data
UPDATE project_tasks 
  SET visibility = CASE 
    WHEN is_visible_to_client = 1 THEN 'client_facing'
    WHEN is_visible_to_client = 0 THEN 'inhouse'
    ELSE 'inhouse'
  END,
  due_date = end_date;

-- Step 3: Log tasks with in_progress status
INSERT INTO migration_log (entity_type, entity_id, old_value, new_value, migrated_at)
SELECT 'task', id, 'in_progress', 'pending', NOW()
FROM project_tasks 
WHERE status = 'in_progress';

-- Step 4: Update in_progress status
UPDATE project_tasks 
  SET status = 'pending' 
  WHERE status = 'in_progress';

-- Step 5: Make description nullable
ALTER TABLE project_tasks 
  MODIFY COLUMN description TEXT NULL;

-- Step 6: Verify data migration
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN due_date IS NULL THEN 1 ELSE 0 END) as missing_due_date,
  SUM(CASE WHEN visibility IS NULL THEN 1 ELSE 0 END) as missing_visibility
FROM project_tasks;

-- Step 7: Drop old columns (POINT OF NO RETURN)
ALTER TABLE project_tasks 
  DROP COLUMN start_date,
  DROP COLUMN end_date,
  DROP COLUMN is_visible_to_client;

-- Step 8: Make due_date NOT NULL
ALTER TABLE project_tasks 
  MODIFY COLUMN due_date TIMESTAMP NOT NULL;

-- Step 9: Add indexes
CREATE INDEX idx_project_tasks_visibility ON project_tasks(visibility);
CREATE INDEX idx_project_tasks_due_date ON project_tasks(due_date);
```

### 5.3 Rollback Plan

**Before Step 7 (dropping columns):**
```sql
-- Easy rollback - just drop new columns
ALTER TABLE project_tasks 
  DROP COLUMN visibility,
  DROP COLUMN document_url,
  DROP COLUMN due_date;
```

**After Step 7 (columns dropped):**
```sql
-- CANNOT FULLY ROLLBACK - start_date data is lost
-- Restore from backup
DROP TABLE project_tasks;
RENAME TABLE project_tasks_backup_20240307 TO project_tasks;

-- WARNING: This loses all tasks created after migration!
```

---

## 6. TESTING IMPACT

### 6.1 Unit Tests to Update

#### Backend Tests
- `task.service.spec.ts` - Update all test cases
- `task.repository.spec.ts` - Update query tests
- `projects.controller.spec.ts` - Update endpoint tests

**Estimated Tests Affected:** 30-50 tests

#### Frontend Tests
- `add-task-modal.spec.tsx` - Update form tests
- `edit-task-modal.spec.tsx` - Update form tests
- `task-table.spec.tsx` - Update display tests
- `use-create-project-task.spec.tsx` - Update hook tests

**Estimated Tests Affected:** 20-30 tests

### 6.2 Integration Tests to Update

- Task creation flow tests
- Task update flow tests
- Task visibility filtering tests
- Client user task access tests

**Estimated Tests Affected:** 10-15 tests

### 6.3 E2E Tests to Update

- Complete task lifecycle tests
- User role-based task visibility tests

**Estimated Tests Affected:** 5-10 tests

---

## 7. THIRD-PARTY INTEGRATIONS

### 7.1 Email Notifications

**Files Affected:**
- `Pylott-Backend/src/shared/utils/email.ts`
- Email templates

**Changes:**
- Update task assignment emails to use `due_date` instead of `end_date`
- Update email templates to show visibility status

**Impact:** **LOW** - Template updates only

### 7.2 Notification System

**Files Affected:**
- `Pylott-Backend/src/modules/notifications/notification.service.ts`

**Changes:**
- Update notification messages to use new field names
- Update notification data payload

**Impact:** **MEDIUM** - Notification content changes

---

## 8. DOCUMENTATION IMPACT

### 8.1 API Documentation

**Files to Update:**
- API documentation (Swagger/OpenAPI specs)
- Postman collections
- API integration guides

**Changes:**
- Update all task-related endpoint documentation
- Add migration guide for API consumers
- Update example requests/responses

### 8.2 User Documentation

**Files to Update:**
- User guides
- Help documentation
- Training materials

**Changes:**
- Remove references to start date
- Update screenshots showing task forms
- Update visibility terminology

---

## 9. DEPLOYMENT STRATEGY

### 9.1 Recommended Approach: Blue-Green Deployment

**Phase 1: Preparation (Day 1)**
1. Create database backup
2. Deploy new code to staging
3. Run migration on staging database
4. Perform comprehensive testing
5. Validate rollback procedure

**Phase 2: Migration (Day 2)**
1. Schedule maintenance window (2-4 hours)
2. Put application in read-only mode
3. Create production database backup
4. Run migration script
5. Verify data integrity
6. Deploy new backend code
7. Deploy new frontend code
8. Run smoke tests
9. Enable write access
10. Monitor for errors

**Phase 3: Monitoring (Days 3-7)**
1. Monitor error logs
2. Monitor user feedback
3. Track API error rates
4. Verify data consistency
5. Be ready for rollback

### 9.2 Alternative: Feature Flag Approach

**Advantages:**
- Gradual rollout
- Easy rollback
- A/B testing capability

**Implementation:**
```typescript
// Backend
const useNewTaskSchema = featureFlags.isEnabled('new-task-schema', user);

if (useNewTaskSchema) {
  // Use visibility enum
  task.visibility = payload.visibility;
} else {
  // Use old boolean
  task.is_visible_to_client = payload.is_visible_to_client;
}

// Frontend
const useNewTaskForm = useFeatureFlag('new-task-schema');

return useNewTaskForm ? <NewTaskForm /> : <OldTaskForm />;
```

**Challenges:**
- Requires maintaining both schemas temporarily
- Database must support both fields during transition
- More complex code

---

## 10. RISK ASSESSMENT

### 10.1 High-Risk Areas

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss (start_date) | **HIGH** | **HIGH** | Archive before migration, communicate to users |
| API breaking changes | **HIGH** | **HIGH** | Version API, provide migration guide |
| Status data loss (in_progress) | **MEDIUM** | **MEDIUM** | Log affected tasks, notify users |
| Rollback complexity | **HIGH** | **CRITICAL** | Maintain backup, test rollback procedure |
| User confusion | **MEDIUM** | **MEDIUM** | Update documentation, provide training |
| Integration failures | **LOW** | **HIGH** | Test all integrations in staging |

### 10.2 Critical Success Factors

1. ✅ Complete database backup before migration
2. ✅ Tested rollback procedure
3. ✅ All tests passing in staging
4. ✅ API consumers notified of changes
5. ✅ User documentation updated
6. ✅ Monitoring and alerting in place
7. ✅ Support team trained on changes

---

## 11. EFFORT ESTIMATION

### 11.1 Development Effort

| Task | Effort | Priority |
|------|--------|----------|
| Database migration script | 4 hours | P0 |
| Backend type definitions | 2 hours | P0 |
| Backend service layer | 8 hours | P0 |
| Backend repository layer | 4 hours | P0 |
| Backend controller layer | 2 hours | P0 |
| Frontend type definitions | 2 hours | P0 |
| Frontend forms (add/edit) | 8 hours | P0 |
| Frontend display components | 4 hours | P0 |
| Frontend hooks | 4 hours | P0 |
| Validation schemas | 2 hours | P0 |
| Unit tests (backend) | 8 hours | P1 |
| Unit tests (frontend) | 6 hours | P1 |
| Integration tests | 4 hours | P1 |
| E2E tests | 4 hours | P1 |
| Documentation | 4 hours | P1 |
| **TOTAL** | **66 hours** | **~8-9 days** |

### 11.2 Testing Effort

| Task | Effort |
|------|--------|
| Staging deployment | 2 hours |
| Manual testing | 8 hours |
| Regression testing | 4 hours |
| Performance testing | 2 hours |
| User acceptance testing | 4 hours |
| **TOTAL** | **20 hours** | **~2-3 days** |

### 11.3 Deployment Effort

| Task | Effort |
|------|--------|
| Deployment planning | 2 hours |
| Backup procedures | 1 hour |
| Migration execution | 2 hours |
| Rollback testing | 2 hours |
| Production deployment | 4 hours |
| Post-deployment monitoring | 8 hours |
| **TOTAL** | **19 hours** | **~2-3 days** |

**GRAND TOTAL: 105 hours (~13-15 days with 1 developer)**

---

## 12. RECOMMENDATIONS

### 12.1 Option A: Proceed with Migration (Recommended if spec is final)

**Pros:**
- Aligns with spec requirements
- Simplifies task model
- Removes unused start_date field
- Cleaner visibility model

**Cons:**
- High risk and effort
- Permanent data loss
- Breaking changes for API consumers
- Requires maintenance window

**When to choose:**
- Spec is finalized and approved
- Start date is truly not needed
- 3-status model is not required
- Team has capacity for 2-3 weeks of work

### 12.2 Option B: Update Spec to Match Production (Recommended for faster delivery)

**Pros:**
- No breaking changes
- No data loss
- No migration needed
- Faster to production

**Cons:**
- Spec doesn't match implementation
- Keeps potentially unused start_date field
- Boolean visibility model less clear

**When to choose:**
- Need to ship quickly
- Start date might be useful
- 3-status model is valuable
- Want to minimize risk

### 12.3 Option C: Hybrid Approach (Recommended for gradual transition)

**Phase 1: Non-breaking additions**
- Add `visibility` enum alongside `is_visible_to_client`
- Add `document_url` field
- Make `description` optional
- Support both field names in API

**Phase 2: Deprecation period (3-6 months)**
- Mark old fields as deprecated
- Update frontend to use new fields
- Notify API consumers
- Monitor usage of old fields

**Phase 3: Breaking changes**
- Remove deprecated fields
- Drop `start_date` column
- Enforce new schema

**When to choose:**
- Have external API consumers
- Want to minimize risk
- Can afford longer timeline
- Need backward compatibility

---

## 13. DECISION MATRIX

| Criteria | Option A (Migrate) | Option B (Update Spec) | Option C (Hybrid) |
|----------|-------------------|----------------------|-------------------|
| Time to Production | 3-4 weeks | 1 week | 6-12 months |
| Risk Level | HIGH | LOW | MEDIUM |
| Data Loss | YES | NO | NO (initially) |
| Breaking Changes | YES | NO | EVENTUALLY |
| Spec Alignment | PERFECT | NONE | EVENTUAL |
| Effort Required | HIGH | LOW | MEDIUM |
| Rollback Complexity | HIGH | N/A | MEDIUM |
| User Impact | HIGH | NONE | LOW |

---

## 14. CONCLUSION

The current enhancement spec introduces **significant breaking changes** to the task management system. The impact spans:

- ✅ **Database schema** (5 column changes, 2 with data loss)
- ✅ **Backend code** (10+ files, 200+ lines)
- ✅ **Frontend code** (8+ files, 150+ lines)
- ✅ **API contracts** (breaking changes to 4 endpoints)
- ✅ **Tests** (60+ tests to update)
- ✅ **Documentation** (API docs, user guides)

**Recommended Action:** Choose **Option B (Update Spec)** or **Option C (Hybrid)** unless there's a compelling business reason to remove start_date and simplify the status model.

**If proceeding with Option A:**
1. Get stakeholder approval for data loss
2. Notify all API consumers
3. Schedule 4-hour maintenance window
4. Have rollback plan ready
5. Monitor closely for 1 week post-deployment

**Next Steps:**
1. Review this analysis with stakeholders
2. Make go/no-go decision
3. If go: Create detailed implementation plan
4. If no-go: Update spec to match production
