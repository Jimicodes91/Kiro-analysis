# Staging Environment Deployment Guide

## Executive Summary

This guide explains how to use your staging environment (v1 branch) to test the enhancement code before production deployment, avoiding production risks while validating the implementation.

**Staging URL:** https://staging.pylott.io
**Backend Branch:** `v1` (staging)
**Production Branch:** `main`
**Risk Level:** LOW 🟢 (isolated from production)

---

## 1. Current Environment Setup

### Git Workflow

```
Feature/Bugfix Branches
  ↓ (PR)
v1 Branch (Staging)
  ↓ (PR after testing)
main Branch (Production)
```

**Branch Purpose:**
- `v1` branch = Staging environment
- `main` branch = Production environment
- Feature branches = Development work

### Deployment Targets

| Environment | Branch | Frontend URL | Backend URL | Database |
|-------------|--------|--------------|-------------|----------|
| **Local** | Any | http://localhost:3000 | http://localhost:5001 | Local MySQL |
| **Staging** | v1 | https://staging.pylott.io | Backend staging URL | Staging DB |
| **Production** | main | https://www.pylott.io | Production backend | Production DB |


### Current CORS Configuration

**Backend allows these origins:**
```typescript
// Pylott-Backend/src/app.ts
cors({
  origin: [
    'https://www.pylott.io',      // Production
    'https://pylott.io',           // Production (alt)
    'https://staging.pylott.io',   // Staging ✅
    'http://localhost:3000',       // Local dev
    'https://pylot-tkrh.vercel.app' // Vercel preview
  ]
})
```

**Good News:** Staging is already configured in CORS! ✅

---

## 2. Why Use Staging for Enhancement Testing

### Benefits of Staging Deployment

**Safety:**
- ✅ Isolated from production data
- ✅ No risk to real users
- ✅ Can test breaking changes safely
- ✅ Easy rollback (just revert branch)

**Validation:**
- ✅ Test database migrations on real infrastructure
- ✅ Validate API changes with real network conditions
- ✅ Test email delivery (SendGrid staging)
- ✅ Verify frontend/backend integration
- ✅ Load testing without affecting production

**Learning:**
- ✅ Identify issues before production
- ✅ Refine deployment process
- ✅ Train team on new features
- ✅ Gather feedback from internal users

---

## 3. Staging Deployment Strategy for Enhancement

### Option 1: Deploy Enhancement to Staging (Recommended)

**Purpose:** Test the enhancement spec implementation in a production-like environment

**Steps:**

#### Step 1: Prepare Staging Database (1 hour)
```bash
# Connect to staging database
mysql -h staging-db-host -u username -p

# Create backup
mysqldump -h staging-db-host -u username -p database_name > staging_backup_$(date +%Y%m%d).sql

# Run migration script
mysql -h staging-db-host -u username -p database_name < migration_script.sql
```

#### Step 2: Deploy Backend to v1 Branch (30 min)
```bash
# In Pylott-Backend directory
git checkout v1
git pull origin v1

# Merge your enhancement branch
git merge feature/task-enhancement

# Push to v1 (triggers staging deployment)
git push origin v1
```

#### Step 3: Deploy Frontend to Staging (30 min)
```bash
# In Pylott-Web-App directory
git checkout v1
git pull origin v1

# Merge your enhancement branch
git merge feature/task-enhancement

# Update .env for staging
# VITE_API_BASE_URL=https://staging-api.pylott.io/api/v1

# Push to v1 (triggers staging deployment)
git push origin v1
```

#### Step 4: Verify Deployment (1 hour)
- [ ] Check staging.pylott.io loads
- [ ] Test user login
- [ ] Test task creation with new schema
- [ ] Test task editing
- [ ] Test task visibility
- [ ] Test email notifications
- [ ] Check browser console for errors
- [ ] Check backend logs for errors

#### Step 5: Test Enhancement Features (2-4 hours)
- [ ] Create task without start_date (should work)
- [ ] Create task with only due_date (should work)
- [ ] Set visibility to 'inhouse' or 'client_facing' (should work)
- [ ] Test with optional description (should work)
- [ ] Test document_url field (should work)
- [ ] Verify only 2 status options (pending, completed)
- [ ] Test as different user roles (admin, consultant, client)

#### Step 6: Load Testing (2 hours)
```bash
# Use Apache Bench or similar
ab -n 1000 -c 10 https://staging-api.pylott.io/api/v1/tasks

# Monitor:
# - Response times
# - Error rates
# - Database connections
# - Memory usage
```

#### Step 7: Gather Feedback (1 week)
- Share staging URL with team
- Collect feedback on new task model
- Identify any issues or confusion
- Document user experience

**Total Time:** 1-2 days setup + 1 week testing

---

### Option 2: Deploy Production Fixes to Staging First (Recommended)

**Purpose:** Fix the 14 critical production issues in staging before production

**Why This First:**
- Staging currently mirrors production (same issues)
- Fix issues in safe environment
- Validate fixes work correctly
- Then deploy fixes to production
- Then test enhancement in staging

**Steps:**

#### Step 1: Create Fix Branch
```bash
git checkout v1
git pull origin v1
git checkout -b fix/production-critical-issues
```

#### Step 2: Apply Backend Fixes (2-3 days)
1. Fix email error handling
2. Move file uploads outside transactions
3. Fix N+1 queries (assignees, project clients)
4. Increase connection pool to 50
5. Add rate limiting
6. Add health check endpoint
7. Add database indexes

#### Step 3: Apply Frontend Fixes (2-3 days)
1. Configure QueryClient
2. Add error boundaries
3. Add Sentry error tracking
4. Add axios request timeout
5. Remove duplicate dependencies
6. Add build optimizations

#### Step 4: Deploy to Staging
```bash
# Push fixes to v1 branch
git checkout v1
git merge fix/production-critical-issues
git push origin v1
```

#### Step 5: Test in Staging (1 day)
- [ ] All critical issues resolved
- [ ] No new issues introduced
- [ ] Performance improved
- [ ] Error tracking working
- [ ] Health checks responding

#### Step 6: Deploy to Production
```bash
# After staging validation
git checkout main
git merge v1
git push origin main
```

**Total Time:** 5-7 days

---

## 4. Staging Environment Configuration

### Backend Staging Setup

**Required Environment Variables (Vercel/Hosting):**
```env
# Staging Backend Environment
NODE_ENV=staging
PORT=5001
APP_NAME=Pylott Staging
APP_EMAIL=staging@pylott.io

# Staging Database
DB_CLIENT=mysql2
DB_DATABASE=pylott_staging
DB_USERNAME=staging_user
DB_PASSWORD=<staging_password>
DB_HOST=<staging_db_host>
DB_PORT=3306

# SendGrid (can use same key or separate)
SENDGRID_API_KEY=<staging_sendgrid_key>

# Cloudinary (can use same or separate)
CLOUDINARY_CLOUD_NAME=<staging_cloud>
CLOUDINARY_API_KEY=<staging_key>
CLOUDINARY_API_SECRET=<staging_secret>

# Frontend URL
FRONTEND_URL=https://staging.pylott.io

# JWT Secret (use different from production!)
JWT_SECRET=<staging_jwt_secret>
```

### Frontend Staging Setup

**Required Environment Variables (Vercel):**
```env
# Staging Frontend Environment
VITE_API_BASE_URL=https://staging-api.pylott.io/api/v1
VITE_APP_NAME=Pylott Staging
VITE_ENVIRONMENT=staging
VITE_SENTRY_DSN=<staging_sentry_dsn>
```

### Vercel Configuration

**If using Vercel for both frontend and backend:**

1. **Create Staging Project in Vercel:**
   - Go to Vercel dashboard
   - Import repository
   - Name: "pylott-staging"
   - Branch: v1
   - Environment: Preview/Staging

2. **Set Environment Variables:**
   - Go to Settings → Environment Variables
   - Add all staging variables
   - Select "Preview" environment
   - Link to v1 branch

3. **Configure Domains:**
   - Production: www.pylott.io (main branch)
   - Staging: staging.pylott.io (v1 branch)

---

## 5. Staging Database Setup

### Option A: Separate Staging Database (Recommended)

**Pros:**
- ✅ Complete isolation from production
- ✅ Can test migrations safely
- ✅ Can reset/wipe data anytime
- ✅ No risk to production data

**Cons:**
- 🟡 Need to maintain separate database
- 🟡 Need to seed with test data
- 🟡 Additional hosting cost (~$10-20/month)

**Setup:**
```bash
# Create new database
mysql -u root -p
CREATE DATABASE pylott_staging;
CREATE USER 'staging_user'@'%' IDENTIFIED BY 'staging_password';
GRANT ALL PRIVILEGES ON pylott_staging.* TO 'staging_user'@'%';
FLUSH PRIVILEGES;

# Run migrations
cd Pylott-Backend
npm run db:migrate

# Seed with test data
npm run db:seed
```

### Option B: Clone Production Data to Staging

**Pros:**
- ✅ Real production data for testing
- ✅ Realistic testing scenarios
- ✅ Identify real-world issues

**Cons:**
- 🔴 Contains real user data (privacy concerns)
- 🔴 Need to anonymize PII
- 🟡 Larger database size

**Setup:**
```bash
# Dump production database
mysqldump -h prod-db-host -u username -p pylott_prod > prod_dump.sql

# Anonymize sensitive data
sed -i 's/real@email.com/test@example.com/g' prod_dump.sql

# Import to staging
mysql -h staging-db-host -u username -p pylott_staging < prod_dump.sql
```

**IMPORTANT:** Always anonymize PII before using production data in staging!

---

## 6. Testing Enhancement in Staging

### Test Plan

#### Phase 1: Smoke Tests (1 hour)
- [ ] Application loads
- [ ] User can login
- [ ] Dashboard displays
- [ ] No console errors
- [ ] API responds

#### Phase 2: Task Feature Tests (2 hours)
- [ ] Create task without start_date
- [ ] Create task with only due_date
- [ ] Set visibility to 'inhouse'
- [ ] Set visibility to 'client_facing'
- [ ] Leave description empty (optional)
- [ ] Add document_url
- [ ] Assign multiple users
- [ ] Upload attachments
- [ ] Edit existing task
- [ ] Delete task
- [ ] Filter by visibility
- [ ] View as client user (only see client_facing tasks)

#### Phase 3: Integration Tests (2 hours)
- [ ] Task creation sends email notification
- [ ] Task assignment sends email to assignees
- [ ] Task completion triggers notification
- [ ] Audit log records task changes
- [ ] Task appears in project details
- [ ] Task counts update correctly

#### Phase 4: Regression Tests (2 hours)
- [ ] Existing features still work
- [ ] Projects still work
- [ ] Contacts still work
- [ ] Invitations still work
- [ ] Notifications still work
- [ ] User management still works

#### Phase 5: Performance Tests (1 hour)
- [ ] Task list loads quickly (<2 seconds)
- [ ] Task creation completes quickly (<1 second)
- [ ] No N+1 query issues
- [ ] Database connections stable
- [ ] Memory usage stable

**Total Testing Time:** 8 hours (1 day)

---

## 7. What You'll Learn from Staging

### Questions Staging Will Answer

1. **Does the migration work?**
   - Can you successfully migrate from old schema to new?
   - Is data transformed correctly?
   - Are there any edge cases?

2. **Do the breaking changes work?**
   - Does removing start_date cause issues?
   - Is 2-status model sufficient?
   - Does visibility enum work better than boolean?

3. **Is the UX acceptable?**
   - Do users miss the start date field?
   - Is the new visibility dropdown clear?
   - Are 2 statuses enough?

4. **Are there performance issues?**
   - Does the new schema perform well?
   - Are queries optimized?
   - Is the frontend responsive?

5. **What breaks unexpectedly?**
   - Are there hidden dependencies on old fields?
   - Do integrations still work?
   - Are there edge cases?

---

## 8. Staging Deployment Workflow

### Workflow A: Test Enhancement in Staging

**Timeline:** 2 weeks

**Week 1: Deploy Enhancement**
```bash
# Day 1: Prepare
- Create staging database backup
- Review migration script
- Update environment variables

# Day 2: Deploy Backend
- Merge enhancement to v1 branch
- Run database migration
- Deploy backend to staging
- Verify health checks

# Day 3: Deploy Frontend  
- Merge enhancement to v1 branch
- Update API base URL for staging
- Deploy frontend to staging
- Verify application loads

# Day 4-5: Testing
- Run smoke tests
- Run feature tests
- Run integration tests
- Run regression tests
- Run performance tests
```

**Week 2: Evaluate & Decide**
```bash
# Day 6-10: Gather Feedback
- Share with team
- Collect feedback
- Document issues
- Identify improvements

# Day 11-12: Decision
- Review findings
- Decide: Deploy to prod OR Update spec
- Create action plan
```

---

### Workflow B: Fix Production Issues in Staging First

**Timeline:** 1-2 weeks

**Week 1: Fix Critical Issues**
```bash
# Day 1-3: Backend Fixes
- Fix email error handling
- Move file uploads outside transactions
- Fix N+1 queries
- Increase connection pool
- Add rate limiting
- Add health checks
- Add database indexes

# Day 4-5: Frontend Fixes
- Configure QueryClient
- Add error boundaries
- Add Sentry
- Add request timeout
- Remove duplicate dependencies
- Add build optimizations
```

**Week 2: Test & Deploy**
```bash
# Day 6-7: Test in Staging
- Deploy fixes to v1 branch
- Run full test suite
- Verify all issues resolved
- Monitor for new issues

# Day 8-10: Deploy to Production
- Merge v1 to main
- Deploy to production
- Monitor closely
```

---

## 9. Staging Environment Checklist

### Before Deploying to Staging

- [ ] Create staging database backup
- [ ] Review all code changes
- [ ] Update environment variables
- [ ] Verify CORS configuration includes staging.pylott.io
- [ ] Prepare rollback plan
- [ ] Notify team of staging deployment

### During Staging Deployment

- [ ] Run database migration
- [ ] Deploy backend to v1 branch
- [ ] Deploy frontend to v1 branch
- [ ] Verify health checks pass
- [ ] Check application loads
- [ ] Review logs for errors

### After Staging Deployment

- [ ] Run smoke tests
- [ ] Run feature tests
- [ ] Run integration tests
- [ ] Run regression tests
- [ ] Monitor for 24 hours
- [ ] Gather team feedback
- [ ] Document findings

---

## 10. Staging vs Production Deployment

### Key Differences

| Aspect | Staging | Production |
|--------|---------|------------|
| **Risk** | LOW | HIGH |
| **Data** | Test data or anonymized | Real user data |
| **Users** | Internal team only | All customers |
| **Rollback** | Easy (revert branch) | Complex (data loss risk) |
| **Downtime** | Acceptable | Must minimize |
| **Testing** | Extensive | Limited |
| **Monitoring** | Optional | Critical |

### What Staging Can't Test

**Limitations:**
- 🟡 Production load (fewer users)
- 🟡 Production data volume (smaller dataset)
- 🟡 Real user behavior patterns
- 🟡 Peak traffic scenarios
- 🟡 Long-term stability (days/weeks)

**Mitigation:**
- Use load testing tools
- Clone production data (anonymized)
- Run staging for 1-2 weeks before production
- Monitor metrics closely

---

## 11. Recommended Staging Workflow

### Phase 1: Fix Production Issues in Staging (Week 1-2)

**Goal:** Stabilize current production code

**Actions:**
1. Create branch: `fix/production-critical-issues`
2. Apply all 14 critical fixes
3. Deploy to v1 branch (staging)
4. Test thoroughly
5. Deploy to main branch (production)

**Outcome:** Stable production with no critical issues

---

### Phase 2: Test Enhancement in Staging (Week 3-4)

**Goal:** Validate enhancement spec implementation

**Actions:**
1. Create branch: `feature/task-enhancement`
2. Implement enhancement changes
3. Deploy to v1 branch (staging)
4. Run migration on staging database
5. Test for 1-2 weeks
6. Gather feedback

**Outcome:** Know if enhancement works and is worth deploying

---

### Phase 3: Decision Point (Week 5)

**Option A: Deploy Enhancement to Production**
- If staging tests successful
- If team approves changes
- If users like new model
- Follow production deployment plan

**Option B: Update Spec to Match Production**
- If staging reveals issues
- If users prefer current model
- If enhancement not worth the effort
- Update spec documents instead

---

## 12. Staging Database Migration Testing

### Test Migration Script

**Purpose:** Validate migration works before production

**Steps:**

#### 1. Backup Staging Database
```bash
mysqldump -h staging-db-host -u user -p pylott_staging > staging_backup.sql
```

#### 2. Run Migration
```bash
mysql -h staging-db-host -u user -p pylott_staging < migration_script.sql
```

#### 3. Verify Data Integrity
```sql
-- Check all tasks have due_date
SELECT COUNT(*) FROM project_tasks WHERE due_date IS NULL;
-- Should return 0

-- Check all tasks have visibility
SELECT COUNT(*) FROM project_tasks WHERE visibility IS NULL;
-- Should return 0

-- Check no in_progress status remains
SELECT COUNT(*) FROM project_tasks WHERE status = 'in_progress';
-- Should return 0

-- Verify data transformation
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN visibility = 'inhouse' THEN 1 ELSE 0 END) as inhouse,
  SUM(CASE WHEN visibility = 'client_facing' THEN 1 ELSE 0 END) as client_facing
FROM project_tasks;
```

#### 4. Test Rollback
```bash
# Drop new columns
mysql -h staging-db-host -u user -p pylott_staging < rollback_script.sql

# Verify rollback worked
mysql -h staging-db-host -u user -p pylott_staging -e "DESCRIBE project_tasks;"
```

#### 5. Re-run Migration
```bash
# After successful rollback, run migration again
mysql -h staging-db-host -u user -p pylott_staging < migration_script.sql
```

**If all steps succeed:** Migration script is production-ready ✅

---

## 13. Monitoring Staging Environment

### Metrics to Track

**Backend:**
- Response times (should be <500ms)
- Error rates (should be <1%)
- Database connections (should be <40/50)
- Memory usage (should be stable)
- Email delivery rate (should be >98%)

**Frontend:**
- Page load time (should be <3 seconds)
- Time to interactive (should be <5 seconds)
- Error rate (should be <0.5%)
- Bundle size (should be <500KB)

**Database:**
- Query performance (should be <100ms)
- Connection pool usage (should be <80%)
- Slow query log (should be empty)

### Tools for Monitoring

**Backend:**
```bash
# Check health endpoint
curl https://staging-api.pylott.io/health

# Monitor logs
tail -f /var/log/backend.log

# Check database connections
mysql -e "SHOW PROCESSLIST;"
```

**Frontend:**
```bash
# Check bundle size
npm run build
ls -lh dist/assets/*.js

# Test performance
lighthouse https://staging.pylott.io --view
```

---

## 14. Rollback Plan for Staging

### If Enhancement Breaks Staging

**Easy Rollback (No Data Loss):**
```bash
# Revert v1 branch to previous commit
git checkout v1
git reset --hard HEAD~1
git push origin v1 --force

# Rollback database migration
mysql -h staging-db-host -u user -p pylott_staging < rollback_script.sql
```

**No Impact on Production:** Production (main branch) remains untouched ✅

---

## 15. Cost Considerations for Staging

### Additional Costs

| Service | Staging Cost | Notes |
|---------|--------------|-------|
| Database | $10-20/month | Separate staging database |
| Vercel | $0 | Included in free/pro plan |
| SendGrid | $0 | Use same free tier key |
| Cloudinary | $0 | Use same free tier account |

**Total Additional Cost:** $10-20/month for staging database

### Cost Optimization

**Option 1: Share Services**
- Use same SendGrid key (staging emails count toward 3,000/month limit)
- Use same Cloudinary account (staging uploads count toward 25 credits/month)
- **Savings:** $0 additional cost

**Option 2: Separate Services**
- Separate SendGrid account (another 3,000 emails/month free)
- Separate Cloudinary account (another 25 credits/month free)
- **Savings:** More headroom, better isolation

**Recommendation:** Share services for now, separate later if needed

---

## 16. Recommended Action Plan

### Immediate Next Steps (This Week)

**Step 1: Verify Staging Setup (1 hour)**
- [ ] Confirm v1 branch exists
- [ ] Confirm staging.pylott.io is accessible
- [ ] Confirm staging backend URL
- [ ] Confirm staging database exists
- [ ] Review environment variables

**Step 2: Choose Deployment Path**

**Path A: Test Enhancement in Staging**
- Deploy enhancement to v1 branch
- Test for 1-2 weeks
- Decide based on results

**Path B: Fix Production Issues First**
- Deploy fixes to v1 branch
- Test for 1 week
- Deploy fixes to production
- Then test enhancement in staging

**Recommendation:** Path B (fix issues first)

---

## 17. Success Criteria for Staging

### Enhancement Deployment Success

- [ ] All tests pass
- [ ] No critical errors in logs
- [ ] Task creation works without start_date
- [ ] Task visibility enum works correctly
- [ ] Only 2 status values work fine
- [ ] Email notifications work
- [ ] Performance is acceptable
- [ ] Team approves changes
- [ ] No major issues found

### Production Fix Deployment Success

- [ ] All 14 critical issues resolved
- [ ] Error rate <1%
- [ ] Response time <500ms
- [ ] No memory leaks
- [ ] No N+1 queries
- [ ] Email delivery reliable
- [ ] QueryClient configured
- [ ] Error boundaries working

---

## 18. Timeline Comparison

### Option 1: Deploy Enhancement to Staging Now

```
Week 1-2: Deploy enhancement to staging
Week 3-4: Test and gather feedback
Week 5: Decision point
Week 6-8: Deploy to production (if approved)

Total: 6-8 weeks
Risk: MEDIUM (staging isolated, but production deployment still risky)
```

### Option 2: Fix Issues, Then Test Enhancement

```
Week 1-2: Fix critical issues in staging
Week 3: Deploy fixes to production
Week 4-5: Test enhancement in staging
Week 6: Decision point
Week 7-9: Deploy enhancement to production (if approved)

Total: 7-9 weeks
Risk: LOW (production stabilized first)
```

### Option 3: Fix Issues, Update Spec (Recommended)

```
Week 1-2: Fix critical issues in staging
Week 3: Deploy fixes to production
Week 4: Update spec to match production
Week 5: Done

Total: 5 weeks
Risk: LOW (no breaking changes)
```

---

## Conclusion

**Staging Environment:** You have `v1` branch configured as staging with https://staging.pylott.io already in CORS. This is perfect for testing.

**Recommended Approach:**
1. Use staging to fix the 14 critical production issues (Week 1-2)
2. Deploy fixes to production (Week 3)
3. Then use staging to test enhancement if desired (Week 4-5)
4. OR update spec to match production (Week 4)

**Key Insight:** Staging lets you test safely without risking production. Use it to validate fixes first, then decide on enhancement deployment based on staging results.

**Next Steps:**
1. Verify staging environment is accessible
2. Confirm staging database exists
3. Choose: Fix issues first OR Test enhancement first
4. Deploy to v1 branch
5. Test thoroughly
6. Deploy to main branch when ready

