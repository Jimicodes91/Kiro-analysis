# Pylot Project - Technical Design Specification

## 1. Project Overview

### 1.1 Project Identity
- **Name**: Pylot (Pylott)
- **Type**: SaaS Web Application
- **Domain**: Project Management & Client Collaboration Platform
- **Target Users**: Relocation & Business Setup Consultancies

### 1.2 Purpose
Pylot is an all-in-one platform designed for consultancies managing relocation and business setup projects. It provides integrated project management, CRM, document management, and compliance tracking capabilities in a single solution.

### 1.3 Core Value Proposition
- Centralized project lifecycle management
- Multi-role collaboration (Admins, Consultants, Clients)
- Client visibility controls
- Subscription-based SaaS model
- Comprehensive audit trails and compliance tracking

---

## 2. Technology Stack

### 2.1 Frontend Framework
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.7.2** - Type-safe development
- **Vite 6.1.0** - Fast build tooling and HMR

### 2.2 State Management & Data Fetching
- **TanStack Query (React Query) 5.72.0** - Server state management
- **React Context API** - Local state (Onboarding, Projects)

### 2.3 Routing & Navigation
- **React Router DOM 7.3.0** - Client-side routing with nested routes

### 2.4 UI Component Libraries
- **Radix UI** - Headless accessible components
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Popover, Select, Separator, Switch, Toggle, Tooltip
- **Lucide React 0.487.0** - Icon library
- **React Icons 5.5.0** - Additional icon sets

### 2.5 Form Management
- **React Hook Form 7.55.0** - Performant form handling
- **@hookform/resolvers 4.1.3** - Schema validation integration
- **Yup 1.6.1** - Schema validation
- **Zod 3.24.2** - TypeScript-first schema validation

### 2.6 Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **tailwindcss-animate 1.0.7** - Animation utilities
- **class-variance-authority 0.7.1** - Component variant management
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.2.0** - Merge Tailwind classes

### 2.7 HTTP Client & API Integration
- **Axios 1.8.4** - HTTP client with interceptors
- **cookies-next 5.1.0** - Cookie management for auth tokens

### 2.8 Additional Libraries
- **Framer Motion 12.6.5** - Animation library
- **date-fns 3.0.0** - Date manipulation
- **react-day-picker 9.7.0** - Date picker component
- **react-toastify 11.0.5** - Toast notifications
- **react-phone-number-input 3.4.12** - Phone input with validation
- **react-simple-wysiwyg 3.2.2** - Rich text editor
- **@hello-pangea/dnd 18.0.1** - Drag and drop functionality

### 2.9 Development Tools
- **ESLint 9.19.0** - Code linting
- **Prettier 3.3.2** - Code formatting
- **Husky 9.1.7** - Git hooks
- **lint-staged** - Pre-commit linting

### 2.10 Backend Integration
- **API Base URL**: `https://staging-api.pylott.io/api/v1/`
- **Authentication**: Bearer token (JWT)
- **Session Management**: Cookie-based with automatic token refresh

---

## 3. Architecture Overview

### 3.1 Application Structure

```
src/
├── assets/          # Static assets (icons, SVGs, images)
├── components/      # Reusable UI components
│   ├── Form/        # Form components (Button, Input, Select, Search)
│   ├── ui/          # Radix UI wrappers and custom components
│   ├── Header/      # Header component
│   ├── Sidebar/     # Sidebar navigation
│   ├── Modal/       # Modal dialogs
│   ├── Table/       # Data table components
│   └── Toast/       # Toast notification templates
├── hooks/           # Custom React hooks (organized by feature)
│   ├── admin/       # System admin operations
│   ├── auth/        # Authentication hooks
│   ├── company/     # Company management
│   ├── contacts/    # Contact/CRM hooks
│   ├── finance/     # Financial records
│   ├── project-modules/ # Project-related hooks
│   └── user/        # User profile hooks
├── layouts/         # Layout components
│   ├── auth-layout/     # Authentication pages layout
│   ├── dashboard-layout/ # Main app layout with sidebar
│   └── OnboardingLayout/ # Onboarding flow layout
├── lib/             # Utility libraries and constants
├── pages/           # Page components
│   ├── Auth/        # Login, Signup, Password Reset
│   ├── Home/        # Dashboard and main features
│   ├── Onboarding/  # User onboarding flow
│   ├── profile/     # User profile management
│   ├── projects/    # Project pages
│   └── sysadmin/    # System admin pages
├── routes/          # Route configuration
├── services/        # API service layer
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### 3.2 Design Patterns

#### 3.2.1 Custom Hooks Pattern
All API interactions are encapsulated in custom hooks following the pattern:
- `use-[action]-[entity].tsx` (e.g., `use-get-all-projects.tsx`)
- Hooks use TanStack Query for caching and state management
- Centralized error handling and loading states

#### 3.2.2 Component Composition
- Atomic design principles
- Radix UI primitives wrapped with custom styling
- Compound components for complex UI patterns

#### 3.2.3 Route Protection
- `ProtectedRoute` component for role-based access control
- Automatic redirect to login for unauthenticated users
- Role-specific route rendering

---

## 4. User Roles & Permissions

### 4.1 Role Hierarchy

1. **SUPER_ADMIN (System Administrator)**
   - Platform-wide administration
   - Manage all companies/organizations
   - User management across platform
   - Subscription management
   - System analytics and monitoring

2. **ADMIN (Company Administrator)**
   - Company-level management
   - Manage company settings and users
   - Oversee all projects within company
   - Financial management
   - Invite consultants and clients

3. **CONSULTANT**
   - Project execution and management
   - Task and event management
   - Document uploads
   - Client collaboration
   - CRM access

4. **CLIENT**
   - Limited read-only access
   - View assigned projects
   - Visibility controlled by project settings
   - Can view tasks, documents, notes based on permissions

### 4.2 Navigation by Role

**SUPER_ADMIN Routes:**
- `/sysadmin` - Dashboard
- `/sysadmin/users` - User management
- `/sysadmin/subscription` - Subscription plans
- `/sysadmin/:companyId/companies` - Company details
- `/profile-setting` - Profile management

**ADMIN Routes:**
- `/home` - Dashboard
- `/projects` - Project management
- `/contact` - CRM/Contacts
- `/task` - Task overview
- `/finance` - Financial records
- `/admin` - Admin panel
- `/profile-setting` - Profile management

**CONSULTANT Routes:**
- `/home` - Dashboard
- `/projects` - Project management
- `/contact` - CRM/Contacts
- `/task` - Task overview
- `/finance` - Financial records
- `/profile-setting` - Profile management

**CLIENT Routes:**
- `/projects` - View assigned projects only
- `/profile-setting` - Profile management

---

## 5. Core Features & Modules

### 5.1 Authentication & Authorization

#### 5.1.1 Authentication Flows

- **Admin Signup**: Company admin registration
- **Login**: Email/password authentication
- **Email Verification**: Token-based verification
- **Forgot Password**: Email-based password reset
- **Reset Password**: Token-based password reset
- **Consultant Invite**: Email invitation system
- **Complete Registration**: Invited user registration
- **Client Addition**: Admin adds clients to projects

#### 5.1.2 Session Management
- JWT tokens stored in cookies (`user_session_token`)
- User session data stored in cookies (`user_session`)
- Axios interceptors for automatic token attachment
- 401 response triggers automatic logout
- Callback URL preservation for post-login redirect

#### 5.1.3 Hooks
- `use-auth-login` - User authentication
- `use-admin-signup` - Admin registration
- `use-company-admin-signup` - Company admin signup
- `use-verify-email` - Email verification
- `use-forgot-password` - Password reset request
- `use-reset-password` - Password reset completion
- `use-send-consultant-invite` - Invite consultants
- `use-complete-registration` - Complete invited user signup
- `use-add-client` - Add client users
- `use-update-password` - Change password

### 5.2 Onboarding

#### 5.2.1 Flow
- Step 1: Company information (name, industry, size, location)
- Step 2: Invite team members (consultants)
- Context-based state management
- Progressive form validation

### 5.3 Dashboard (Home)

#### 5.3.1 Metrics Display
- **Project Report**
  - Total projects
  - Completed projects
  - In-progress projects
  - Month-over-month growth percentage
  
- **Task Report**
  - Total tasks
  - Completed tasks
  - In-progress tasks
  - Overdue tasks

- **Recent Projects**
  - Project name and status
  - Start and end dates
  - Current milestone
  - Progress percentage
  - Days to completion

- **Top Pipelines**
  - Pipeline name
  - Project count
  - Active project count
  - Average completion days

- **Top Clients**
  - Client name and company
  - Total projects
  - Active projects

#### 5.3.2 Hooks
- `use-get-dashboard-metrics` - Fetch dashboard data

### 5.4 Project Management

#### 5.4.1 Project Lifecycle

**Project Statuses:**
- `not_started` - Project created but not begun
- `in_progress` - Active project
- `blocked` - Project blocked by dependencies
- `completed` - Project finished
- `due` - Project approaching deadline
- `on_track` - Project progressing as planned
- `late` - Project behind schedule

**Project Attributes:**
- Name, description
- Client assignment
- Consultant assignment
- Project type (pipeline)
- Milestone tracking
- Start and end dates
- Custom form fields
- Status tracking
- Timeline visualization

#### 5.4.2 Project Types (Pipelines)
- Custom project templates
- Company-specific or system-wide
- Associated milestones
- Custom form fields per type

#### 5.4.3 Milestones
- Sequential project phases
- Milestone-based progress tracking
- Update project milestone status

#### 5.4.4 Custom Form Fields
- Dynamic form builder
- Field types: text, number, date, select, etc.
- Required/optional field configuration
- Project type-specific fields

#### 5.4.5 Project Settings
- Client visibility controls:
  - Can view tasks
  - Can view notes
  - Can view documents
  - Can view activity logs

#### 5.4.6 Hooks
- `use-create-project` - Create new project
- `use-get-all-projects` - List projects with filters
- `use-get-client-projects` - Client-specific projects
- `use-get-project-details` - Single project details
- `use-update-project` - Update project info
- `use-update-project-milestone` - Change milestone

**Project Types:**
- `use-get-all-project-types` - List pipelines
- `use-create-project-type` - Create pipeline
- `use-update-project-type` - Update pipeline

**Milestones:**
- `use-get-all-project-type-milestones` - List milestones
- `use-create-milestone` - Create milestone
- `use-update-milestone` - Update milestone

**Forms:**
- `use-get-project-forms` - Get form templates
- `use-get-project-form-fields` - Get form fields
- `use-add-form-fields` - Add custom fields
- `use-toggle-field-requirement` - Toggle required status

### 5.5 Task Management

#### 5.5.1 Task Features

- Task name and description
- Task type categorization
- Multiple assignees
- Start and end dates
- Status tracking: `pending`, `in_progress`, `completed`
- Client visibility toggle
- Document attachments
- Project and company association

#### 5.5.2 Task Types
- Custom task categories
- Company-specific or system-wide
- Type-based filtering

#### 5.5.3 Hooks
- `use-create-task` - Create task
- `use-get-all-project-tasks` - Tasks by project
- `use-get-all-tasks` - All tasks with search
- `use-get-task-details` - Single task details
- `use-update-task` - Update task
- `use-delete-task` - Delete task
- `use-delete-task-attachment` - Remove attachment

**Task Types:**
- `use-create-task-type` - Create task category
- `use-get-task-types` - List task types
- `use-update-task-type` - Update task type

### 5.6 Event Management

#### 5.6.1 Event Features
- Event name and description
- Event type categorization
- Start and end datetime
- Venue information
- Invitee management
- Attendance tracking:
  - Total invites
  - Accepted
  - Declined
  - Tentative
  - No response
- Client visibility toggle
- Creator and attendee status

#### 5.6.2 Event Types
- Custom event categories
- Meeting types, milestone events, etc.

#### 5.6.3 Hooks
- `use-create-event` - Create event
- `use-get-all-project-events` - Events by project
- `use-get-event-details` - Single event details
- `use-update-event` - Update event
- `use-delete-event` - Delete event

**Event Types:**
- `use-create-event-type` - Create event category
- `use-get-event-types` - List event types
- `use-update-event-type` - Update event type

### 5.7 Notes & Comments

#### 5.7.1 Notes Features
- Rich text content
- Author tracking
- Pin/unpin functionality
- Project association
- Comment threads

#### 5.7.2 Comments
- Nested comments on notes
- Author information
- Timestamp tracking
- Delete capability

#### 5.7.3 Hooks
**Notes:**
- `use-create-note` - Create note
- `use-get-all-project-notes` - Notes by project
- `use-get-note-details` - Single note details
- `use-toggle-note-pin` - Pin/unpin note

**Comments:**
- `use-add-note-comment` - Add comment
- `use-get-note-comments` - List comments
- `use-delete-note-comment` - Delete comment

**Note Types:**
- `use-create-note-type` - Create note category
- `use-get-note-types` - List note types
- `use-update-note-type` - Update note type

### 5.8 Document Management

#### 5.8.1 Document Features

- Document name and description
- Document type categorization
- Multiple file attachments
- Client visibility toggle
- Task and note associations
- Media URL storage
- Soft delete support

#### 5.8.2 Document Types
- Custom document categories
- Contracts, invoices, compliance docs, etc.

#### 5.8.3 Document Requests
- Request documents from clients
- Track document submission status

#### 5.8.4 Hooks
**Documents:**
- `use-upload-document` - Upload document
- `use-get-all-project-documents` - Documents by project
- `use-get-document-details` - Single document details
- `use-update-document` - Update document info
- `use-delete-document` - Delete document
- `use-delete-document-attachment` - Remove attachment
- `use-update-document-attachment` - Update attachment

**Document Types:**
- `use-create-document-type` - Create document category
- `use-get-document-types` - List document types
- `use-update-document-type` - Update document type

**Document Requests:**
- `use-create-document-request` - Request document from client

### 5.9 Project Members

#### 5.9.1 Member Management
- Add consultants and clients to projects
- Track who added each member
- Client visibility settings
- Remove members from projects

#### 5.9.2 Hooks
- `use-add-project-member` - Add member
- `use-get-project-members` - List members
- `use-remove-project-member` - Remove member

### 5.10 Activity Logs (Audit Trail)

#### 5.10.1 Audit Features
- Comprehensive activity tracking
- User action logging
- Entity change tracking
- Timestamp and author information
- Paginated history
- Project-specific trails

#### 5.10.2 Tracked Activities
- Project updates
- Task changes
- Document uploads
- Member additions/removals
- Status changes
- All CRUD operations

#### 5.10.3 Hooks
- `use-get-audit-trail` - Fetch activity logs with pagination

### 5.11 Contact Management (CRM)

#### 5.11.1 Contact Features

- Contact name, email, phone
- Organization affiliation
- Address information
- Project statistics:
  - Active projects
  - Total projects
  - Closed projects
- Assignee tracking
- Search functionality
- Pagination support

#### 5.11.2 Hooks
- `use-create-contact` - Create contact
- `use-get-all-contacts` - List all contacts
- `use-get-company-contacts` - Company-specific contacts
- `use-search-contacts` - Search contacts
- `use-update-contact` - Update contact info

### 5.12 Finance Management

#### 5.12.1 Finance Features
- Project cost tracking
- Payment records
- Outstanding balance calculation
- Payment status tracking
- Payment proof uploads
- Due date management
- Client and organization association
- Pagination support

#### 5.12.2 Payment Statuses
- Paid
- Pending
- Overdue
- Partial payment

#### 5.12.3 Hooks
- `use-create-finance-record` - Create finance record
- `use-get-all-finance-records` - List records with pagination
- `use-get-individual-finance-record` - Single record details
- `use-update-finance-record` - Update record
- `use-mark-finance-record-as-paid` - Mark as paid

### 5.13 System Administration

#### 5.13.1 Company Management
- View all companies
- Company details and statistics
- Active/inactive status toggle
- Subscription management
- User count tracking
- Industry and size information

#### 5.13.2 User Management
- View all platform users
- Active users tracking
- System admin management
- Add/deactivate system admins
- User blocking capability

#### 5.13.3 Subscription Management
- Subscription plans (CRUD)
- Plan features configuration
- Pricing per seat
- Company subscription assignment
- Subscription renewal
- Subscription cancellation
- Expiry date tracking

#### 5.13.4 Dashboard Analytics
- Active/inactive organizations
- Total users and active users
- Company statistics
- Platform-wide metrics

#### 5.13.5 Hooks
**Company Management:**
- `use-get-all-companies` - List companies
- `use-get-company` - Company details
- `use-update-company-status` - Toggle active status
- `use-subscribe-company` - Assign subscription
- `use-cancel-subscription` - Cancel subscription
- `use-renew-subscription` - Renew subscription
- `use-get-active-organizations` - Active companies
- `use-get-inactive-organizations` - Inactive companies

**User Management:**
- `use-get-all-users` - All platform users
- `use-get-all-active-users` - Active users only
- `use-get-all-admins` - System admins
- `use-add-system-admin` - Create system admin
- `use-deactivate-system-admin` - Deactivate admin

**Dashboard:**
- `use-get-dashboard-details` - System admin dashboard data

### 5.14 Company Administration

#### 5.14.1 Company User Management

- View company users
- Toggle user active/inactive status
- Pagination support

#### 5.14.2 Hooks
- `use-get-company-users` - List company users
- `use-toggle-company-user-status` - Activate/deactivate user

### 5.15 Subscription Plans

#### 5.15.1 Plan Features
- Plan name and display name
- Pricing configuration
- Price per seat
- Currency support
- Feature toggles
- Active/inactive status

#### 5.15.2 Hooks
- `use-get-all-plans` - List all plans
- `use-get-plan` - Single plan details
- `use-create-plan` - Create plan
- `use-update-plan` - Update plan
- `use-delete-plan` - Delete plan
- `use-get-company-subscription-plan` - Company's current plan

### 5.16 User Profile

#### 5.16.1 Profile Features
- Personal information
- Profile picture
- Timezone and language preferences
- Currency settings
- Security settings (password change)
- Email verification status

#### 5.16.2 Hooks
- `use-get-user` - Fetch user details
- `use-update-profile` - Update profile information

---

## 6. API Integration

### 6.1 API Service Layer

#### 6.1.1 Base Configuration
- Base URL: `https://staging-api.pylott.io/api/v1/`
- Content-Type: `application/json`
- Authorization: `Bearer {token}`

#### 6.1.2 Axios Interceptors

**Request Interceptor:**
- Automatically attaches bearer token from cookies
- Adds authorization header to all requests

**Response Interceptor:**
- Handles 401 unauthorized responses
- Triggers automatic logout on auth failure
- Prevents infinite retry loops

#### 6.1.3 Secure Request Wrapper
- Unified request function for all HTTP methods
- Automatic header management
- Query parameter handling for GET requests
- Request body handling for POST/PUT/PATCH
- Special handling for DELETE with body

### 6.2 API Endpoints Organization

All endpoints are centralized in `src/lib/constants.ts` under the `ENDPOINTS` object, organized by feature:

- Authentication (11 endpoints)
- Home/Dashboard (1 endpoint)
- Admin (14 endpoints)
- Company (1 endpoint)
- Company Admin (2 endpoints)
- User (2 endpoints)
- Contacts (5 endpoints)
- Finance (5 endpoints)
- Projects (6 endpoints)
- Project Types (4 endpoints)
- Milestones (4 endpoints)
- Events (5 endpoints)
- Notes (4 endpoints)
- Note Comments (3 endpoints)
- Tasks (6 endpoints)
- Documents (7 endpoints)
- Document Requests (1 endpoint)
- Project Members (3 endpoints)
- Project Settings (2 endpoints)
- Document Types (3 endpoints)
- Event Types (3 endpoints)
- Task Types (3 endpoints)
- Note Types (3 endpoints)
- Activity Logs (1 endpoint)
- Project Forms (4 endpoints)
- Subscription (5 endpoints)

**Total: 100+ API endpoints**

### 6.3 Query Keys

Centralized query keys for TanStack Query cache management in `QUERYKEYS` object.

---

## 7. Data Models

### 7.1 Core Entities

#### User

```typescript
interface UserDetails {
  id: string;
  email: string;
  name?: string;
  pfp?: string;
  role: "ADMIN" | "SUPER_ADMIN" | "CLIENT" | "CONSULTANT";
  company_id?: string;
  is_blocked: number;
  is_verified: number;
  is_active: number;
  timezone?: string;
  language: string;
  currency: string;
  last_login?: string;
  login_count: number;
  created_at: string;
  updated_at: string;
}
```

#### Project
```typescript
interface ProjectDetails {
  id: string;
  name: string;
  status: ProjectStatus;
  client_id?: string;
  company_id: string;
  consultant_id?: string;
  milestone_id?: string;
  project_type_id: string;
  start_date: string;
  end_date: string;
  completed_at?: string;
  form_data: ProjectFormData;
  project_type: ProjectType;
  milestone?: ProjectTypeMilestone;
  form_fields: FormField[];
  timeline: string;
  created_at: string;
  updated_at: string;
}
```

#### Task
```typescript
interface TaskDetails {
  id: string;
  project_id: string;
  company_id: string;
  author_id: string;
  task_type_id: string;
  name: string;
  description: string;
  status: "in_progress" | "completed" | "pending";
  start_date: string;
  end_date: string;
  is_visible_to_client: number;
  assignees: Author[];
  document: IDocument[];
  task_type: TaskTypeDetails;
  created_at: string;
  updated_at: string;
}
```

#### Event
```typescript
interface EventDetails {
  id: string;
  project_id: string;
  company_id: string;
  event_type_id: string;
  created_by: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  description: string;
  venue: string;
  invites: string[];
  is_visible_to_client: number;
  is_creator: boolean;
  is_attendee: boolean;
  attendance_stats: AttendanceStats;
  created_at: string;
  updated_at: string;
}
```

#### Document
```typescript
interface IDocument {
  id: string;
  company_id: string;
  project_id: string;
  document_type_id: string;
  name: string;
  description?: string;
  task_id: string;
  note_id: string;
  type: string;
  is_visible_to_client: number;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}
```

#### Contact
```typescript
interface ContactDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  active_projects: number;
  total_projects: number;
  closed_projects: number | null;
  assigned_to: { id: string; name: string }[];
  created_at: string;
  updated_at: string;
}
```

#### Finance Record
```typescript
interface FinanceDetails {
  id: string;
  organization_id: string;
  client_name: string;
  project_title: string;
  total_project_cost: string;
  amount_paid: string;
  outstanding_balance: string;
  payment_status: string | null;
  payment_date: string | null;
  next_payment_due_date: string;
  payment_proof_url: string | null;
  has_paid: number;
  created_at: string;
  updated_at: string;
}
```

#### Company
```typescript
interface CompanyDetails {
  id: string;
  name: string;
  industry_type: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  admin_id: string;
  is_active: number;
  subscription_status: string;
  subscription_expiry_date: string;
  active_users_count: number;
  created_at: string;
  updated_at: string;
}
```

---

## 8. UI/UX Design

### 8.1 Layout System

#### 8.1.1 Authentication Layout
- Split-screen design (40/60 split on desktop)
- Left: Branding with background image and tagline
- Right: Form content area
- Fully responsive (mobile shows form only)

#### 8.1.2 Dashboard Layout
- Collapsible sidebar navigation
- Top header with company name and user menu
- Main content area with outlet for nested routes
- Mobile: Sheet-based sidebar drawer
- Sticky header at 70px height

### 8.2 Navigation Structure

#### Sidebar Navigation
- Role-based menu items
- Icon + label format
- Active state highlighting
- Collapsible for more screen space
- Persistent state via cookies

#### Top Navigation
- Company name display
- User avatar with dropdown
- Logout functionality
- Notification placeholder (commented out)

### 8.3 Component Library

#### Form Components
- Custom Input with validation
- Select with search
- Button variants (primary, secondary, outline, ghost)
- Search with debounce
- Date picker
- Phone input with country codes
- Rich text editor (WYSIWYG)
- File upload with drag-and-drop

#### Data Display
- Table with pagination
- Simple table for basic data
- Skeleton loaders
- Avatar with fallback
- Badge for status indicators
- Progress bars
- Cards for content grouping

#### Feedback
- Toast notifications (4 types: success, error, warning, info)
- Modal dialogs
- Alert dialogs for confirmations
- Loading spinners
- Skeleton screens

#### Navigation
- Breadcrumbs
- Tabs
- Accordion
- Collapsible sections

### 8.4 Theming

#### Color System
- Primary color for brand
- Semantic colors (success, error, warning, info)
- Neutral grays for text and backgrounds
- Consistent color usage across components

#### Typography
- Heading component with size variants (h1-h6)
- Consistent font sizing
- Proper hierarchy

#### Spacing
- Tailwind spacing scale
- Consistent padding and margins
- Responsive spacing

---

## 9. State Management Strategy

### 9.1 Server State (TanStack Query)

- All API data managed by React Query
- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- Query key organization by feature
- DevTools for debugging

### 9.2 Client State (React Context)
- Onboarding flow state
- Project context for shared project data
- Modal open/close states
- Form state (React Hook Form)

### 9.3 URL State
- Route parameters for IDs
- Query parameters for filters and pagination
- Search parameters for search functionality

### 9.4 Cookie State
- Authentication tokens
- User session data
- Sidebar collapse state
- Persistent UI preferences

---

## 10. Security Considerations

### 10.1 Authentication Security
- JWT token-based authentication
- HttpOnly cookies for token storage
- Automatic token refresh (placeholder for implementation)
- Session expiration handling
- Secure logout with cookie cleanup

### 10.2 Authorization
- Role-based access control (RBAC)
- Protected routes by role
- API-level permission checks
- Client visibility controls at project level

### 10.3 Data Security
- HTTPS for all API communication
- Bearer token in authorization header
- Input validation with Yup/Zod schemas
- XSS prevention through React's built-in escaping
- CSRF protection considerations

### 10.4 API Security
- Request interceptors for auth
- Response interceptors for error handling
- Automatic logout on 401
- Rate limiting (backend responsibility)

---

## 11. Performance Optimizations

### 11.1 Code Splitting
- Route-based code splitting via React Router
- Lazy loading of page components
- Dynamic imports for heavy components

### 11.2 Caching Strategy
- React Query automatic caching
- Stale-while-revalidate pattern
- Background refetching
- Cache invalidation on mutations

### 11.3 Asset Optimization
- Vite's built-in optimizations
- Tree shaking
- Minification in production
- SVG optimization

### 11.4 Rendering Optimizations
- React 19 concurrent features
- Memoization where appropriate
- Virtual scrolling for large lists (potential)
- Debounced search inputs

---

## 12. Development Workflow

### 12.1 Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for git hooks
- lint-staged for pre-commit checks

### 12.2 Git Workflow
- Pre-commit hooks run linting and formatting
- Conventional commits (recommended)
- Feature branch workflow

### 12.3 Build Process
- Development: `npm run dev` (Vite dev server)
- Production: `npm run build` (TypeScript + Vite build)
- Preview: `npm run preview` (Preview production build)
- Linting: `npm run lint` or `npm run lint:fix`
- Formatting: `npm run prettify`

### 12.4 Environment Configuration
- `.env` file for environment variables
- `VITE_` prefix for client-side variables
- Staging API URL configured

---

## 13. Testing Strategy (Recommended)

### 13.1 Unit Testing
- Test custom hooks with React Testing Library
- Test utility functions
- Test form validation schemas

### 13.2 Integration Testing
- Test component interactions
- Test API integration with MSW (Mock Service Worker)
- Test authentication flows

### 13.3 E2E Testing
- Critical user journeys
- Authentication flows
- Project creation and management
- Multi-role scenarios

---

## 14. Deployment Considerations

### 14.1 Build Output
- Static files generated by Vite
- Optimized for CDN deployment
- `_redirects` file for SPA routing (Netlify)

### 14.2 Environment Variables
- Separate configs for staging/production
- API base URL configuration
- Feature flags (if needed)

### 14.3 Hosting Requirements
- Static file hosting (Netlify, Vercel, S3+CloudFront)
- SPA routing support
- HTTPS required
- CORS configuration on backend

---

## 15. Future Enhancements (Potential)

### 15.1 Features
- Real-time notifications (WebSocket)
- Calendar integration (Google Calendar, Outlook)
- Advanced reporting and analytics
- Export functionality (PDF, Excel)
- Mobile app (React Native)
- Offline support (PWA)
- Multi-language support (i18n)
- Dark mode

### 15.2 Technical Improvements
- Implement token refresh mechanism
- Add comprehensive test coverage
- Performance monitoring (Sentry, LogRocket)
- Analytics integration (Google Analytics, Mixpanel)
- Error boundary implementation
- Accessibility audit and improvements
- SEO optimization for public pages

### 15.3 Scalability
- Implement virtual scrolling for large datasets
- Optimize bundle size
- Implement service workers for caching
- Add pagination to all list views
- Implement infinite scroll where appropriate

---

## 16. Known Technical Debt

### 16.1 Code Organization
- Some duplicate route definitions in `AppRoutes.tsx`
- Commented-out refresh token logic needs implementation
- Notification feature commented out in header

### 16.2 Type Safety
- Some `any` types may exist (needs audit)
- API response types could be more granular

### 16.3 Error Handling
- Global error boundary not implemented
- Inconsistent error message display
- Need standardized error handling patterns

### 16.4 Accessibility
- Accessibility audit needed
- ARIA labels may be incomplete
- Keyboard navigation needs testing

---

## 17. Documentation Needs

### 17.1 Developer Documentation
- API integration guide
- Component usage examples
- Custom hooks documentation
- State management patterns
- Deployment guide

### 17.2 User Documentation
- User manual for each role
- Admin guide
- Feature tutorials
- FAQ section

---

## 18. Dependencies Summary

### 18.1 Production Dependencies (40)
- React ecosystem: react, react-dom, react-router-dom
- State management: @tanstack/react-query
- UI components: @radix-ui/* (15 packages)
- Forms: react-hook-form, yup, zod
- HTTP: axios
- Styling: tailwindcss, clsx, tailwind-merge
- Utilities: date-fns, cookies-next, framer-motion
- Icons: lucide-react, react-icons

### 18.2 Development Dependencies (15)
- TypeScript and types
- Build tools: vite, @vitejs/plugin-react
- Linting: eslint, prettier
- Git hooks: husky
- CSS: tailwindcss, autoprefixer, postcss



## 19. Conclusion

Pylot is a comprehensive, well-architected SaaS platform for project management and client collaboration. The application demonstrates:

- **Modern tech stack** with React 19, TypeScript, and Vite
- **Scalable architecture** with feature-based organization
- **Robust API integration** with 100+ endpoints
- **Role-based access control** for multi-tenant usage
- **Comprehensive feature set** covering project lifecycle management
- **Production-ready** code quality tools and practices

The platform is designed for consultancies managing complex, multi-stakeholder projects with strong emphasis on client collaboration, document management, and compliance tracking.

---

**Document Version**: 1.0  
**Last Updated**: March 2, 2026  
**Author**: Technical Documentation Team
