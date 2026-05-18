PYLOTT — Platform Overview (Non-Technical)
============================================

1. WHAT IS PYLOTT?
------------------

Pylott is a web-based platform that helps professional services firms manage their client work from start to finish. Think of it as a combination of:

- A CRM (like Pipedrive) for tracking client relationships
- A project management tool (like Monday.com) for tracking work progress
- A client portal (like a secure login area) where clients can see their project status and complete tasks

It is designed for firms like immigration consultancies, law firms, accounting practices, and any business that manages client projects through defined steps.


2. WHO USES PYLOTT?
-------------------

There are three types of users:

ADMIN (the firm's team)
- Creates and manages projects
- Assigns tasks to team members and clients
- Tracks progress across all projects
- Manages contacts, documents, and billing

CLIENT (the firm's customers)
- Logs into their own portal
- Sees their project progress (which stage they're at)
- Completes tasks assigned to them (upload documents, sign forms, provide information)
- Views their documents

SYSTEM ADMIN
- Manages the overall platform
- Handles company accounts and subscriptions


3. HOW DOES IT WORK?
--------------------

Step 1: SETUP
The firm signs up, creates their company workspace, and sets up their "Journeys" (workflow templates). A Journey defines the steps a project goes through — for example, an immigration case might have steps like: Initial Consultation → Document Collection → Application Filing → Approval.

Step 2: CREATE A PROJECT
When a new client engagement starts, the admin creates a Project from a Journey template. They fill in client details, assign the project to a journey, and the system creates the milestone tracking automatically.

Step 3: MANAGE TASKS
The admin creates tasks — both internal (for the team) and external (for the client):

Internal tasks are things like "Review application", "Schedule meeting with John", "Follow up on documents". These show up in a Pipedrive-style activity table that the team uses daily.

External tasks are things the client needs to do — like "Upload passport copy", "Sign engagement letter", "Provide bank statements". These show up in the client's portal.

Step 4: CLIENT INTERACTION
Clients log into their portal and see:
- Their project progress (visual journey map showing which stage they're at)
- Tasks they need to complete
- Documents related to their project

Step 5: TRACK AND COMPLETE
As work progresses, tasks get completed, milestones advance, and the project moves through its journey until completion.


4. KEY FEATURES
---------------

DASHBOARD
- Overview of all projects, task counts, and recent activity
- Quick metrics: total projects, completed tasks, overdue items

PROJECTS
- Create projects from journey templates
- Each project has its own detail page with tasks, documents, notes, and events
- Support for multiple clients per project
- Milestone tracking with visual board view

TASK MANAGEMENT (Pipedrive-style)
- Activity table with customizable columns (you can show/hide columns like Contact, Project, Due Date, etc.)
- Six task types: Activity, Meeting, Task, Follow Up, Message, Review
- Quick-add modal for creating tasks
- Time filters: To-do, Overdue, Today, Tomorrow, This Week, Next Week
- Automated status colors: grey (future), green (due today), red (overdue)
- Tasks can be standalone (not tied to a project) or project-bound

CONTACTS
- Central contact directory for all clients
- Contacts are automatically created when adding clients to projects
- Link contacts to tasks for tracking

JOURNEYS (Workflow Templates)
- Define reusable workflow templates with ordered milestones
- Each milestone represents a phase of work
- Drag-and-drop reordering of milestones

DOCUMENTS
- Upload and manage documents per project
- Clients can upload documents through their portal

CLIENT PORTAL
- Separate login for clients
- Project progress visualization
- Task completion (upload docs, sign forms, provide info)
- Document access

NOTIFICATIONS
- Email notifications for task assignments and project updates
- In-app notification center

FINANCE
- Track organizational finances
- Payment records with proof of payment


5. CURRENT STATE
----------------

The platform is in active development with a staging environment for testing.

WHAT'S WORKING:
- Full authentication flow (signup, login, invite clients)
- Project creation from journey templates
- Internal task management with Pipedrive-style table
- External task creation and client task view
- Contact management
- Document management
- Client portal (dashboard, tasks, journey view)
- Notification system
- Milestone tracking

STAGING ENVIRONMENT:
- Frontend: https://pylott-staging-frontend.onrender.com
- Backend: https://pylott-staging-backend.onrender.com
- Database: MySQL on Aiven Cloud
- Both deploy automatically when code is pushed


6. PLATFORM STRUCTURE
---------------------

The platform has two main parts:

FRONTEND (what users see)
- Built with React (a modern web framework)
- Responsive design that works on desktop and mobile
- Separate views for Admin and Client users

BACKEND (the engine behind the scenes)
- REST API that handles all data operations
- Manages authentication, data storage, email sending, file uploads
- Connects to MySQL database for data storage
- Uses Redis for caching

The two parts communicate through API calls — the frontend sends requests to the backend, which processes them and returns data.


7. USER FLOWS
-------------

ADMIN DAILY WORKFLOW:
1. Log in → See dashboard with project overview and task summary
2. Go to Tasks page → See all activities in a table (like Pipedrive)
3. Click "Add Task" → Quick modal to create a meeting, follow-up, etc.
4. Go to a Project → See project details, create internal/external tasks
5. Check Contacts → See all client contacts
6. Check Notifications → See what needs attention

CLIENT WORKFLOW:
1. Receive invitation email → Click link → Create account
2. Log in → See dashboard with project progress
3. See assigned tasks → Complete them (upload docs, sign forms)
4. View journey → See which stage their project is at
5. Access documents → View project-related files


8. GLOSSARY
-----------

Journey: A workflow template that defines the steps a project goes through (also called a Pipeline)

Milestone: A single step/phase within a Journey

Project: A specific client engagement created from a Journey template

Internal Task: A task for the firm's team (not visible to clients)

External Task: A task for the client to complete (visible in client portal)

Standalone Task: A task not tied to any specific project

Contact: A client record in the system (may or may not have a login account)

User: Someone with a login account (admin or client who accepted an invite)
