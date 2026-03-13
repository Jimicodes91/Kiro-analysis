# Backend Repository Setup Guide

## ✅ Backend Repository Cloned Successfully!

**Location:** `/Users/jimi/PycharmProjects/Pylott-Backend`

**Repository:** https://github.com/segunallen/Pylott.git

---

## Backend Technology Stack

Based on the repository structure:

- **Runtime:** Node.js (>=17.x.x <24.0.0)
- **Language:** TypeScript
- **Database ORM:** Knex.js
- **Framework:** Likely Express.js (need to verify in src/)
- **Migrations:** 63 migration files found

---

## How to Open Backend in Kiro

### Option 1: Open in New Kiro Window (Recommended)

1. **In Kiro, go to:** File → Open Folder (or Cmd+O on Mac)
2. **Navigate to:** `/Users/jimi/PycharmProjects/Pylott-Backend`
3. **Click:** Open

This will open the backend in a new Kiro window while keeping your frontend window open.

### Option 2: Add to Current Workspace

1. **In Kiro, go to:** File → Add Folder to Workspace
2. **Navigate to:** `/Users/jimi/PycharmProjects/Pylott-Backend`
3. **Click:** Add

This will add the backend folder to your current workspace (multi-root workspace).

### Option 3: Use Command Line

```bash
# Open backend in new Kiro window
kiro /Users/jimi/PycharmProjects/Pylott-Backend

# Or if you're using VS Code
code /Users/jimi/PycharmProjects/Pylott-Backend
```

---

## Backend Setup Steps

Once you open the backend in Kiro:

### 1. Install Dependencies

```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
# You'll need:
# - Database connection string
# - API keys
# - JWT secrets
# etc.
```

### 3. Run Database Migrations

```bash
# Run all migrations
npm run db:migrate

# Or rollback if needed
npm run db:migrate:rollback
```

### 4. Start Development Server

```bash
npm run dev
```

---

## Key Files to Check

### Database Migrations
- **Location:** `/migrations/` (63 files)
- **Check for:** Contact table, Project table, existing schema

### Source Code
- **Location:** `/src/`
- **Check for:** 
  - API routes/controllers
  - Database models
  - Business logic
  - Existing contact/project endpoints

### Configuration
- **knexfile.ts** - Database configuration
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

---

## What to Look For (Contact Management Implementation)

### 1. Database Schema

Check migrations for:
- `contacts` table structure
- `projects` table structure
- Existing columns and constraints
- Foreign key relationships

### 2. API Endpoints

Look in `src/` for:
- `POST /projects` endpoint
- `GET /contacts` endpoint
- `POST /contacts` endpoint
- Existing validation logic

### 3. Models/Services

Find:
- Contact model/service
- Project model/service
- Validation schemas
- Business logic

---

## Implementing Contact Management Features

Once you have the backend open, you can:

### Phase 1: Database Changes

1. **Create migration for new columns:**
```bash
npm run db:migrate:make add_contact_status_and_source
```

2. **Edit the migration file** to add:
   - `status` column to contacts
   - `source` column to contacts
   - `invite_sent_at` column to projects
   - `client_contact_id` column to projects

3. **Run migration:**
```bash
npm run db:migrate
```

### Phase 2: API Changes

1. **Update POST /projects endpoint** to accept `contact_candidate`
2. **Implement transactional upsert logic**
3. **Create POST /projects/:id/send-invite endpoint**
4. **Update contact validation**

### Phase 3: Testing

1. **Test with Postman/Insomnia**
2. **Test duplicate prevention**
3. **Test invite flow**

---

## Connecting Frontend to Backend

### Current Setup:
- **Frontend:** http://localhost:3000
- **Backend API:** https://staging-api.pylott.io/api/v1/

### For Local Development:

1. **Start backend locally:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run dev
# Backend likely runs on http://localhost:5000 or similar
```

2. **Update frontend .env:**
```bash
# In /Users/jimi/PycharmProjects/Pylott-Web-App/.env
VITE_API_BASE_URL = "http://localhost:5000/api/v1/"
```

3. **Restart frontend:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm run dev
```

Now frontend will connect to your local backend!

---

## Repository Structure

```
Pylott-Backend/
├── .env.example          # Environment variables template
├── knexfile.ts          # Database configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config
├── migrations/          # Database migrations (63 files)
│   ├── 001_create_users.ts
│   ├── 002_create_contacts.ts
│   ├── 003_create_projects.ts
│   └── ...
└── src/                 # Source code
    ├── index.ts         # Entry point
    ├── routes/          # API routes
    ├── controllers/     # Request handlers
    ├── models/          # Database models
    ├── services/        # Business logic
    ├── middleware/      # Express middleware
    └── utils/           # Helper functions
```

---

## Next Steps

1. ✅ **Backend cloned** - `/Users/jimi/PycharmProjects/Pylott-Backend`
2. ⏳ **Open in Kiro** - Use File → Open Folder
3. ⏳ **Install dependencies** - `npm install`
4. ⏳ **Set up .env** - Copy from .env.example
5. ⏳ **Explore codebase** - Check migrations, routes, models
6. ⏳ **Implement features** - Follow CONTACT_PROJECT_INTEGRATION_ANALYSIS.md

---

## Useful Commands

```bash
# Navigate to backend
cd /Users/jimi/PycharmProjects/Pylott-Backend

# Install dependencies
npm install

# Run development server
npm run dev

# Run migrations
npm run db:migrate

# Create new migration
npm run db:migrate:make migration_name

# Rollback last migration
npm run db:migrate:rollback

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

---

## Troubleshooting

### If npm install fails:
```bash
# Check Node version (should be >=17.x.x <24.0.0)
node --version

# If wrong version, use nvm to switch
nvm use 20
```

### If migrations fail:
- Check database connection in .env
- Ensure database exists
- Check database credentials

### If dev server won't start:
- Check if port is already in use
- Check .env configuration
- Check for syntax errors in code

---

## Working with Both Repos

### Recommended Workflow:

1. **Two Kiro Windows:**
   - Window 1: Frontend (`Pylott-Web-App`)
   - Window 2: Backend (`Pylott-Backend`)

2. **Two Terminals:**
   - Terminal 1: Frontend dev server (`npm run dev`)
   - Terminal 2: Backend dev server (`npm run dev`)

3. **Development Flow:**
   - Make backend changes → Test with Postman
   - Update frontend to use new API → Test in browser
   - Commit both repos separately

---

## Git Workflow

### Backend Repo:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend

# Check current branch
git branch

# Create feature branch
git checkout -b feature/contact-management

# Make changes, then commit
git add .
git commit -m "Add contact management features"

# Push to GitHub
git push origin feature/contact-management
```

### Frontend Repo:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App

# Same workflow as backend
git checkout -b feature/contact-management-ui
git add .
git commit -m "Add contact management UI"
git push origin feature/contact-management-ui
```

---

## Summary

✅ Backend repository cloned successfully
✅ Located at: `/Users/jimi/PycharmProjects/Pylott-Backend`
✅ Technology: Node.js + TypeScript + Knex.js
✅ 63 database migrations found
✅ Ready to open in Kiro

**Next Action:** Open the backend folder in Kiro and start exploring!
