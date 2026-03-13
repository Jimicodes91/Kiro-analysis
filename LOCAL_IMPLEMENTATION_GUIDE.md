# Local Implementation & Testing Guide

## Overview

Yes, you CAN implement and test all these enhancements locally! Here's how:

---

## Prerequisites

### What You Have:
✅ Frontend repo: `/Users/jimi/PycharmProjects/Pylott-Web-App`
✅ Backend repo: `/Users/jimi/PycharmProjects/Pylott-Backend`
✅ Both repos cloned locally

### What You Need:
- [ ] PostgreSQL database running locally
- [ ] Node.js installed (v18-24)
- [ ] Backend .env configured
- [ ] Frontend .env configured

---

## Step 1: Set Up Local Database

### Install PostgreSQL (if not installed):

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Or download from: https://postgresapp.com/
```

**Create Database:**
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE pylot_local;

# Create user (optional)
CREATE USER pylot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pylot_local TO pylot_user;

# Exit
\q
```

---

## Step 2: Configure Backend

### Navigate to Backend:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
```

### Create .env File:
```bash
cp .env.example .env
```

### Edit .env:
```bash
# Database
DATABASE_URL=postgresql://pylot_user:your_password@localhost:5432/pylot_local

# Or if using default postgres user:
DATABASE_URL=postgresql://postgres@localhost:5432/pylot_local

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-local-secret-key-change-this
JWT_EXPIRES_IN=7d

# Email (use Mailtrap for testing)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Install Dependencies:
```bash
npm install
```

### Run Existing Migrations:
```bash
npm run db:migrate
```

This will create all existing tables in your local database.

---

## Step 3: Configure Frontend

### Navigate to Frontend:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
```

### Update .env:
```bash
# Point to local backend
VITE_API_BASE_URL = "http://localhost:5000/api/v1/"
```

### Install Dependencies:
```bash
npm install
```

---

## Step 4: Start Both Servers

### Terminal 1 - Backend:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run dev

# Should see:
# Server running on http://localhost:5000
```

### Terminal 2 - Frontend:
```bash
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm run dev

# Should see:
# Local: http://localhost:3000
```

### Test Connection:
Open browser: http://localhost:3000
- Frontend should load
- Check browser console for API calls to localhost:5000

---

## Step 5: Implement Features Incrementally

### Phase 1: Self-Serve Signup (Week 1)

#### Backend Changes:

**1. Create Workspaces Table Migration:**
```bash
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run db:migrate:make create_workspaces_table
```

**Edit the migration file:**
```typescript
// migrations/XXXXXX_create_workspaces_table.ts
export async function up(knex) {
  return knex.schema.createTable('workspaces', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 255).notNullable();
    table.string('status', 50).defaultTo('active');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('workspaces');
}
```

**2. Run Migration:**
```bash
npm run db:migrate
```

**3. Create Signup Endpoint:**
```typescript
// src/routes/auth.ts
router.post('/signup', async (req, res) => {
  const { email, password, name, workspace_name } = req.body;
  
  // 1. Check if email exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  
  // 2. Create workspace
  const [workspace] = await db('workspaces')
    .insert({ name: workspace_name })
    .returning('*');
  
  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 4. Create user
  const [user] = await db('users')
    .insert({
      email,
      password: hashedPassword,
      name,
      role: 'super_admin',
      workspace_id: workspace.id,
      is_primary_admin: true
    })
    .returning('*');
  
  // 5. Generate JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  // 6. Return response
  res.json({
    user: { id: user.id, email: user.email, role: user.role },
    workspace: { id: workspace.id, name: workspace.name },
    token
  });
});
```

**4. Test with Postman/Thunder Client:**
```bash
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "name": "Test User",
  "workspace_name": "Test Workspace"
}
```

#### Frontend Changes:

**1. Create Signup Page:**
```typescript
// src/pages/Auth/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    workspace_name: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/auth/signup',
        formData
      );
      
      // Save token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      navigate('/home');
    } catch (error) {
      console.error('Signup failed:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Create Your Workspace</h1>
        
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Workspace Name"
          value={formData.workspace_name}
          onChange={(e) => setFormData({...formData, workspace_name: e.target.value})}
          required
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Create Workspace
        </button>
      </form>
    </div>
  );
}
```

**2. Add Route:**
```typescript
// src/routes/app.tsx
import SignUp from '@/pages/Auth/SignUp';

// Add to routes array
{
  path: "/signup",
  element: <SignUp />,
  layout: null // No layout for auth pages
}
```

**3. Test in Browser:**
- Go to: http://localhost:3000/signup
- Fill in form
- Submit
- Check browser console for API call
- Check database for new workspace and user

---

## Step 6: Testing Workflow

### Manual Testing:

**1. Test Signup:**
```bash
# Open browser
http://localhost:3000/signup

# Fill form and submit
# Check database:
psql pylot_local
SELECT * FROM workspaces;
SELECT * FROM users;
```

**2. Test Login:**
```bash
http://localhost:3000/login

# Use credentials from signup
# Should redirect to dashboard
```

**3. Test API Directly:**
```bash
# Using curl
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "SecurePass123!",
    "name": "Test User 2",
    "workspace_name": "Test Workspace 2"
  }'
```

### Database Inspection:

```bash
# Connect to database
psql pylot_local

# Check tables
\dt

# Check workspaces
SELECT * FROM workspaces;

# Check users
SELECT id, email, role, workspace_id, is_primary_admin FROM users;

# Check specific user
SELECT * FROM users WHERE email = 'test@example.com';
```

---

## Step 7: Incremental Implementation

### Week 1: Workspaces & Signup
- [ ] Create workspaces table
- [ ] Modify users table
- [ ] Implement signup endpoint
- [ ] Create signup page
- [ ] Test locally

### Week 2: Permissions System
- [ ] Create user_permissions table
- [ ] Implement permission endpoints
- [ ] Add permission checks to existing endpoints
- [ ] Test locally

### Week 3: Contact Management
- [ ] Modify contacts table
- [ ] Create contact_invites table
- [ ] Implement invite endpoints
- [ ] Update contact UI
- [ ] Test locally

### Week 4: Task Updates
- [ ] Modify tasks table
- [ ] Update task endpoints
- [ ] Update task UI
- [ ] Test locally

### Week 5: Project Updates
- [ ] Modify projects table
- [ ] Update project endpoint
- [ ] Update project form
- [ ] Test locally

---

## Step 8: Testing Tools

### Backend Testing:

**1. Postman/Thunder Client:**
- Install Thunder Client extension in Kiro
- Create collection for all endpoints
- Test each endpoint individually

**2. Database Client:**
- Install "Database Client" extension in Kiro
- Connect to local PostgreSQL
- View tables and data in real-time

**3. Backend Logs:**
```bash
# Add logging to backend
console.log('Request received:', req.body);
console.log('User created:', user);
```

### Frontend Testing:

**1. Browser DevTools:**
- Network tab: See API calls
- Console: See errors and logs
- Application tab: Check localStorage

**2. React DevTools:**
- Install React DevTools extension
- Inspect component state
- Debug props and hooks

---

## Step 9: Common Issues & Solutions

### Issue: Database Connection Error

**Solution:**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Start if not running
brew services start postgresql@15

# Test connection
psql postgres -c "SELECT 1"
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process on port 5000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)

# Or change port in backend .env
PORT=5001
```

### Issue: CORS Error

**Solution:**
```typescript
// Backend: src/index.ts
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Migration Fails

**Solution:**
```bash
# Rollback last migration
npm run db:migrate:rollback

# Fix migration file
# Run again
npm run db:migrate
```

---

## Step 10: Development Workflow

### Daily Workflow:

**Morning:**
```bash
# Terminal 1: Start backend
cd /Users/jimi/PycharmProjects/Pylott-Backend
npm run dev

# Terminal 2: Start frontend
cd /Users/jimi/PycharmProjects/Pylott-Web-App
npm run dev

# Terminal 3: Database access
psql pylot_local
```

**During Development:**
1. Make backend changes
2. Test with Postman/Thunder Client
3. Make frontend changes
4. Test in browser
5. Check database for data changes
6. Commit when feature works

**End of Day:**
```bash
# Commit backend changes
cd /Users/jimi/PycharmProjects/Pylott-Backend
git add .
git commit -m "Add signup endpoint"

# Commit frontend changes
cd /Users/jimi/PycharmProjects/Pylott-Web-App
git add .
git commit -m "Add signup page"
```

---

## Step 11: Testing Checklist

### For Each Feature:

- [ ] Backend endpoint works (Postman)
- [ ] Database changes are correct (psql)
- [ ] Frontend UI displays correctly
- [ ] API calls succeed (Network tab)
- [ ] Error handling works
- [ ] Data persists after refresh
- [ ] No console errors
- [ ] Responsive design works

---

## Summary

**YES, you can implement and test everything locally!**

### What You Need:
1. ✅ Local PostgreSQL database
2. ✅ Backend running on localhost:5000
3. ✅ Frontend running on localhost:3000
4. ✅ Both repos on your machine (already done)

### Implementation Strategy:
1. Start with one feature (e.g., signup)
2. Implement backend first
3. Test with Postman
4. Implement frontend
5. Test in browser
6. Move to next feature

### Estimated Timeline:
- **Setup:** 1 day
- **Per Feature:** 2-5 days
- **Total:** 8-12 weeks (working incrementally)

**Recommendation:** Start with the signup feature this week. Once that works end-to-end, you'll have confidence to implement the rest!

Would you like me to help you set up the local database and start implementing the first feature?
