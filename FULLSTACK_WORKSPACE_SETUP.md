# Full-Stack Pylot Workspace Setup Guide

## ✅ YES! You Can Have Both in One Place

You have **3 options** to work with both frontend and backend together:

---

## Option 1: Multi-Root Workspace (BEST for Kiro/VS Code) ⭐

### What is it?
A single Kiro window with both projects as separate folders in the sidebar.

### How to Set Up:

1. **Open the workspace file I just created:**
   - In Kiro: **File → Open Workspace from File**
   - Navigate to: `/Users/jimi/PycharmProjects/Pylott-Web-App/pylot-workspace.code-workspace`
   - Click **Open**

2. **You'll see both projects in the sidebar:**
   ```
   PYLOT WORKSPACE
   ├── Frontend (Pylott-Web-App)
   │   ├── src/
   │   ├── public/
   │   └── package.json
   └── Backend (Pylott-Backend)
       ├── src/
       ├── migrations/
       └── package.json
   ```

### Benefits:
- ✅ One Kiro window for everything
- ✅ Separate terminals for each project
- ✅ Search across both projects
- ✅ Git works independently for each
- ✅ Separate node_modules for each

### How to Use:

**Open Integrated Terminal:**
1. Press `Ctrl + `` (backtick) or View → Terminal
2. Click the dropdown in terminal → Select workspace folder
3. Choose "Frontend" or "Backend"

**Run both servers:**
```bash
# Terminal 1 (Frontend)
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm run dev

# Terminal 2 (Backend)
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run dev
```

---

## Option 2: Monorepo Structure (Advanced)

### What is it?
Move both projects into a single parent folder with shared configuration.

### Structure:
```
/Users/jimi/PycharmProjects/Pylot-Monorepo/
├── frontend/          (Pylott-Web-App)
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           (Pylott-Backend)
│   ├── src/
│   ├── migrations/
│   ├── package.json
│   └── ...
├── package.json       (Root - optional)
└── README.md
```

### How to Set Up:

```bash
# Create monorepo folder
mkdir -p /Users/jimi/PycharmProjects/Pylot-Monorepo

# Move frontend
mv /Users/jimi/PycharmProjects/Pylott-Web-App /Users/jimi/PycharmProjects/Pylot-Monorepo/frontend

# Move backend
mv /Users/jimi/PycharmProjects/Pylott-Backend /Users/jimi/PycharmProjects/Pylot-Monorepo/backend

# Open in Kiro
# File → Open Folder → /Users/jimi/PycharmProjects/Pylot-Monorepo
```

### Benefits:
- ✅ Everything in one folder
- ✅ Shared scripts and configuration
- ✅ Easier to manage
- ✅ Can use tools like Turborepo or Nx

### Drawbacks:
- ⚠️ Need to update Git remotes
- ⚠️ More complex setup

---

## Option 3: Side-by-Side Folders (Simple)

### What is it?
Keep them separate but in the same parent directory.

### Current Structure (Already Done!):
```
/Users/jimi/PycharmProjects/
├── Pylott-Web-App/     (Frontend)
└── Pylott-Backend/     (Backend)
```

### How to Use:

**Option A: Two Kiro Windows**
- Window 1: Frontend
- Window 2: Backend

**Option B: Use the workspace file (Option 1)**

---

## Recommended Setup: Multi-Root Workspace

I've created `pylot-workspace.code-workspace` for you. Here's how to use it:

### Step 1: Open the Workspace

```bash
# In Kiro, open the workspace file
File → Open Workspace from File
→ Navigate to: /Users/jimi/PycharmProjects/Pylott-Web-App/pylot-workspace.code-workspace
→ Click Open
```

### Step 2: Install Dependencies (Both Projects)

**Terminal 1 - Frontend:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm install
```

**Terminal 2 - Backend:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm install
```

### Step 3: Set Up Environment Variables

**Frontend (.env):**
```bash
# /Users/jimi/PycharmProjects/Pylott-Web-App/.env
VITE_API_BASE_URL = "http://localhost:5000/api/v1/"
```

**Backend (.env):**
```bash
# /Users/jimi/PycharmProjects/Pylott-Backend/.env
# Copy from .env.example and fill in:
DATABASE_URL=postgresql://user:password@localhost:5432/pylot
JWT_SECRET=your-secret-key
PORT=5000
# ... other variables
```

### Step 4: Run Both Servers

**Terminal 1 - Frontend:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run dev
# Runs on http://localhost:5000 (or whatever port is configured)
```

### Step 5: Test the Connection

1. Open browser: http://localhost:3000
2. Frontend should connect to backend at http://localhost:5000
3. Check browser console for API calls

---

## Terminal Management in Multi-Root Workspace

### Create Multiple Terminals:

1. **Open Terminal Panel:** `Ctrl + `` (backtick)
2. **Click "+" icon** to create new terminal
3. **Select folder** from dropdown (Frontend or Backend)
4. **Repeat** for as many terminals as you need

### Recommended Terminal Setup:

```
Terminal Panel:
├── Terminal 1: Frontend Dev Server (npm run dev)
├── Terminal 2: Backend Dev Server (npm run dev)
├── Terminal 3: Frontend Commands (git, npm install, etc.)
└── Terminal 4: Backend Commands (migrations, git, etc.)
```

---

## Git Management in Multi-Root Workspace

### Each project has its own Git:

**Frontend Git:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
git status
git add .
git commit -m "Frontend changes"
git push origin dev
```

**Backend Git:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
git status
git add .
git commit -m "Backend changes"
git push origin main
```

### Kiro Source Control Panel:

When you open the workspace, you'll see:
```
SOURCE CONTROL
├── Frontend (Pylott-Web-App)
│   └── Changes (3)
└── Backend (Pylott-Backend)
    └── Changes (2)
```

You can commit to each repository independently!

---

## File Navigation in Multi-Root Workspace

### Quick File Search:

1. **Press:** `Cmd + P` (Mac) or `Ctrl + P` (Windows/Linux)
2. **Type:** filename
3. **See results from both projects:**
   ```
   Frontend: src/App.tsx
   Backend: src/index.ts
   Frontend: src/pages/Home/index.tsx
   Backend: src/routes/projects.ts
   ```

### Search Across Both Projects:

1. **Press:** `Cmd + Shift + F` (Mac) or `Ctrl + Shift + F` (Windows/Linux)
2. **Type:** search term
3. **See results from both frontend and backend**

---

## Development Workflow

### Typical Day:

1. **Open Workspace:**
   - File → Open Workspace → `pylot-workspace.code-workspace`

2. **Start Servers:**
   - Terminal 1: `cd frontend && npm run dev`
   - Terminal 2: `cd backend && npm run dev`

3. **Make Changes:**
   - Edit frontend files in `Frontend (Pylott-Web-App)/`
   - Edit backend files in `Backend (Pylott-Backend)/`

4. **Test:**
   - Browser: http://localhost:3000
   - API: http://localhost:5000

5. **Commit:**
   - Frontend changes → commit to frontend repo
   - Backend changes → commit to backend repo

---

## Implementing Contact Management (Full-Stack)

### Step 1: Backend Changes

**Terminal (Backend):**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend

# Create migration
npm run db:migrate:make add_contact_status_and_invite

# Edit migration file in migrations/
# Add status, source, invite_sent_at columns

# Run migration
npm run db:migrate

# Edit API endpoints in src/routes/projects.ts
# Add transactional upsert logic
```

### Step 2: Frontend Changes

**Terminal (Frontend):**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App

# Edit form component
# src/pages/projects/components/project-dynamic-form.tsx

# Add contact fields
# Update useCreateProject hook
```

### Step 3: Test End-to-End

1. **Create project in frontend** (http://localhost:3000)
2. **Check backend logs** for API call
3. **Verify database** has new contact
4. **Test duplicate prevention**

---

## Debugging Full-Stack

### Frontend Debugging:
- Browser DevTools (F12)
- React DevTools extension
- Network tab for API calls
- Console for errors

### Backend Debugging:
- Terminal logs
- Add `console.log()` in code
- Use Postman to test API directly
- Check database with SQL client

### API Call Flow:
```
Frontend (localhost:3000)
    ↓ HTTP Request
Backend (localhost:5000)
    ↓ Database Query
PostgreSQL Database
    ↓ Response
Backend
    ↓ JSON Response
Frontend
```

---

## Useful Kiro Extensions for Full-Stack

### Recommended Extensions:

1. **ESLint** - Linting for both projects
2. **Prettier** - Code formatting
3. **GitLens** - Enhanced Git features
4. **Thunder Client** - API testing (like Postman)
5. **Database Client** - View database directly
6. **Error Lens** - Inline error messages
7. **Auto Rename Tag** - HTML/JSX tag renaming
8. **Path Intellisense** - File path autocomplete

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/v1/health

# Check frontend .env
cat /Users/jimi/PycharmProjects/Pylott-Web-App/.env
# Should have: VITE_API_BASE_URL = "http://localhost:5000/api/v1/"

# Restart frontend dev server
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find process using port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

### Issue: Database connection error

**Solution:**
```bash
# Check backend .env has correct DATABASE_URL
# Check PostgreSQL is running
# Run migrations: npm run db:migrate
```

---

## Quick Reference Commands

### Frontend Commands:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run lint         # Check code quality
```

### Backend Commands:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm install          # Install dependencies
npm run dev          # Start dev server (port 5000)
npm run build        # Build TypeScript
npm run db:migrate   # Run database migrations
npm run lint         # Check code quality
```

---

## Summary

✅ **Best Option:** Multi-Root Workspace (Option 1)
✅ **Workspace File Created:** `pylot-workspace.code-workspace`
✅ **Both Projects:** Already in `/Users/jimi/PycharmProjects/`

### Next Steps:

1. **Open workspace file in Kiro**
2. **Install dependencies for both projects**
3. **Set up .env files**
4. **Start both dev servers**
5. **Start coding!**

You now have a full-stack development environment ready to implement the contact management features! 🚀
