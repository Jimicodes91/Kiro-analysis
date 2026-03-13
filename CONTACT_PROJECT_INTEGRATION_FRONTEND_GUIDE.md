# Contact & Project Integration - Frontend Implementation Guide

## Current State Analysis

### Existing Project Creation Flow

**Current Components:**
1. `src/pages/projects/components/project-dynamic-form.tsx` - Main dynamic form (ACTIVE)
2. `src/pages/projects/components/project-creation-form.tsx` - Legacy static form (UNUSED)

**Current Hook:**
- `src/hooks/project-modules/use-create-project.tsx`

**Current API Payload:**
```typescript
interface CreateProjectSchema {
  name: string;
  project_type_id: string;
  start_date: string;
  end_date: string;
  custom_fields?: CustomFields; // Dynamic fields from backend
}
```

**Current Contact Management:**
- Separate `/contact` page exists
- Contacts stored independently
- No automatic contact creation from project
- Manual contact selection via `project_client` field (multi-select)

---

## Gap Analysis: Current vs Required

| Feature | Current State | Required State | Gap |
|---------|---------------|----------------|-----|
| Contact creation | Manual only | Auto-create from project | ❌ Missing |
| Email validation | Basic | RFC5322-lite + normalization | ⚠️ Partial |
| Duplicate prevention | None | Transactional upsert | ❌ Missing |
| Invite flow | None | Send invite + status tracking | ❌ Missing |
| Contact status | None | draft → invited → active | ❌ Missing |
| Project-contact link | Multi-select existing | Auto-link on creation | ⚠️ Partial |

---

## How Current System Can Include New Requirements

### Phase 1: Backend API Changes (Required First)

**The backend must implement:**
1. Modified `POST /projects` endpoint to accept `contact_candidate`
2. Transactional upsert logic for contacts
3. New `POST /projects/:id/send-invite` endpoint
4. Contact status tracking

**New API Contract:**
```typescript
// Request
POST /projects
{
  "name": "Project Name",
  "project_type_id": "uuid",
  "start_date": "2026-03-15",
  "end_date": "2026-06-15",
  "custom_fields": { ... },
  "contact_candidate": {
    "email": "client@example.com",
    "phone": "+1234567890",
    "name": "John Doe"
  }
}

// Response
{
  "success": true,
  "data": {
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
      "is_new": true,
      "is_duplicate": false
    }
  }
}
```

---

### Phase 2: Frontend Changes

#### 2.1 Update Type Definitions

**File:** `src/types/api.types.ts`

```typescript
// Add to existing ContactDetails interface
export interface ContactDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  
  // NEW FIELDS
  status: 'draft' | 'invited' | 'active';
  source: 'project' | 'manual';
  
  active_projects: number;
  total_projects: number;
  no_of_projects: number | null;
  closed_projects: number | null;
  assigne: string | null;
  assigned_to: {
    id: string;
    name: string;
  }[];
}

// NEW: Contact candidate for project creation
export interface ContactCandidate {
  email: string;
  phone?: string;
  name?: string;
}

// NEW: Project creation response
export interface CreateProjectResponse {
  project: {
    id: string;
    name: string;
    client_contact_id: string | null;
    status: 'draft' | 'active' | 'archived';
  };
  contact?: {
    id: string;
    email: string;
    status: 'draft' | 'invited' | 'active';
    is_new: boolean;
    is_duplicate: boolean;
  };
}
```

#### 2.2 Update Create Project Hook

**File:** `src/hooks/project-modules/use-create-project.tsx`

```typescript
import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Given } from "@/lib/utils";
import { ContactCandidate, CreateProjectResponse } from "@/types/api.types";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateProjectSchema {
  name: string;
  project_type_id: string;
  start_date: string;
  end_date: string;
  custom_fields?: CustomFields;
  
  // NEW: Contact candidate
  contact_candidate?: ContactCandidate;
}

export interface CustomFields {
  company_name: string;
  legal_structure: string;
  tax_id: string;
  incorporation_date: string;
  articles_file: string[];
}

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<CreateProjectResponse, CreateProjectSchema>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PROJECT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
      });
      // NEW: Invalidate contacts cache
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS],
      });
    },
  });
};

export default useCreateProject;
```

#### 2.3 Update Project Dynamic Form

**File:** `src/pages/projects/components/project-dynamic-form.tsx`

**Changes needed:**

1. **Add contact fields to form schema:**

```typescript
// Add to existing fieldSchema
const contactFieldsSchema = {
  client_email: z.string().email("Must be a valid email").min(1, "Email is required"),
  client_phone: z.string().optional(),
  client_name: z.string().optional(),
};

const formSchema = z.object({
  ...fieldSchema,
  ...contactFieldsSchema,
});
```

2. **Update form submission:**

```typescript
function onSubmit(values: z.infer<typeof formSchema>) {
  // Extract contact fields
  const { client_email, client_phone, client_name, ...projectFields } = values;
  
  // Build contact_candidate if email provided
  const contact_candidate = client_email ? {
    email: client_email,
    phone: client_phone,
    name: client_name,
  } : undefined;
  
  createProject
    .mutateAsync({
      ...convertDatesToYMD(projectFields),
      contact_candidate,
    })
    .then((response) => {
      // NEW: Handle response with contact info
      if (response?.data?.contact?.is_new) {
        // Show success message: "New contact created"
      }
      if (response?.data?.contact?.is_duplicate) {
        // Show info message: "Linked to existing contact"
      }
      
      if ("journey" in values) changeActiveProjectType(values?.journey as string);
      form.reset();
      navigate(PAGES.PROJECT_PAGE);
    })
    .catch(console.error);
}
```

3. **Add contact input fields to form:**

```tsx
{/* NEW: Contact Information Section */}
<div className="space-y-4 border-t pt-4">
  <Heading size="h4">Client Contact Information</Heading>
  
  <FormField
    control={form.control}
    name="client_email"
    render={({ field }) => (
      <FormItem>
        <FormLabel isRequired>Client Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="client@example.com"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  
  <FormField
    control={form.control}
    name="client_phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Client Phone</FormLabel>
        <FormControl>
          <Input
            type="tel"
            placeholder="+1234567890"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  
  <FormField
    control={form.control}
    name="client_name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Client Name</FormLabel>
        <FormControl>
          <Input
            placeholder="John Doe"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
```

#### 2.4 Create Send Invite Hook

**File:** `src/hooks/project-modules/use-send-project-invite.tsx` (NEW)

```typescript
import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface SendInviteResponse {
  success: boolean;
  invite_sent_at: string;
  contact_status: 'invited';
}

const useSendProjectInvite = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<SendInviteResponse, {}>({
    method: "post",
    endpoint: `${ENDPOINTS.CREATE_PROJECT}/${projectId}/send-invite`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_DETAILS, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS],
      });
    },
  });
};

export default useSendProjectInvite;
```

#### 2.5 Add Send Invite Button to Project Details

**File:** `src/pages/Home/project-details/sections/project-info-section.tsx`

```tsx
import useSendProjectInvite from "@/hooks/project-modules/use-send-project-invite";

// Inside component
const sendInvite = useSendProjectInvite(projectDetails.id);

const handleSendInvite = () => {
  sendInvite
    .mutateAsync({})
    .then(() => {
      toast.success("Invite sent successfully!");
    })
    .catch((error) => {
      toast.error(error.message || "Failed to send invite");
    });
};

// In JSX
{projectDetails.client_contact_id && !projectDetails.invite_sent_at && (
  <Button
    onClick={handleSendInvite}
    isLoading={sendInvite.isPending}
    variant="outline"
  >
    Send Client Invite
  </Button>
)}

{projectDetails.invite_sent_at && (
  <Badge variant="success">
    Invite sent on {format(new Date(projectDetails.invite_sent_at), "PPP")}
  </Badge>
)}
```

#### 2.6 Update Contact List to Show Status

**File:** `src/pages/Home/Contact/contact-table-row.tsx`

```tsx
// Add status badge
<Badge 
  variant={
    contact.status === 'active' ? 'success' : 
    contact.status === 'invited' ? 'warning' : 
    'default'
  }
>
  {contact.status}
</Badge>

// Add source indicator
<span className="text-xs text-gray-500">
  {contact.source === 'project' ? '📋 From Project' : '✍️ Manual'}
</span>
```

---

### Phase 3: Email Validation Enhancement

**File:** `src/utils/validation-schema/project.ts`

```typescript
import { z } from "zod";

// Enhanced email validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Must be a valid email")
  .transform((email) => email.toLowerCase().trim()) // Normalize
  .refine(
    (email) => {
      // RFC5322-lite validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    },
    { message: "Invalid email format" }
  );

// Phone validation (E.164)
const phoneSchema = z
  .string()
  .optional()
  .refine(
    (phone) => {
      if (!phone) return true;
      // E.164 format: +[country code][number]
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      return phoneRegex.test(phone);
    },
    { message: "Phone must be in E.164 format (e.g., +1234567890)" }
  );

export const createProjectWithContactSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  project_type_id: z.string().min(1, "Project type is required"),
  start_date: z.date(),
  end_date: z.date(),
  client_email: emailSchema,
  client_phone: phoneSchema,
  client_name: z.string().optional(),
});
```

---

### Phase 4: User Experience Enhancements

#### 4.1 Duplicate Contact Warning

When backend returns `is_duplicate: true`, show a friendly message:

```tsx
{response?.data?.contact?.is_duplicate && (
  <Alert variant="info">
    <InfoIcon className="h-4 w-4" />
    <AlertTitle>Existing Contact Found</AlertTitle>
    <AlertDescription>
      This project has been linked to an existing contact with email{" "}
      <strong>{response.data.contact.email}</strong>
    </AlertDescription>
  </Alert>
)}
```

#### 4.2 Contact Search Before Creation

Add a "Check if contact exists" button:

```tsx
const [existingContact, setExistingContact] = useState<ContactDetails | null>(null);

const checkContactExists = async (email: string) => {
  const response = await fetch(
    `${ENDPOINTS.SEARCH_COMPANY_CONTACTS}?search=${email}`
  );
  const data = await response.json();
  if (data.contacts.length > 0) {
    setExistingContact(data.contacts[0]);
  }
};

// In form
<Button
  type="button"
  variant="outline"
  onClick={() => checkContactExists(form.watch("client_email"))}
>
  Check if contact exists
</Button>

{existingContact && (
  <Alert>
    <AlertDescription>
      Contact found: {existingContact.name} ({existingContact.email})
      <br />
      Status: {existingContact.status}
      <br />
      Projects: {existingContact.total_projects}
    </AlertDescription>
  </Alert>
)}
```

#### 4.3 Invite Status Indicator

Add visual indicator for invite status in project list:

```tsx
// In project card/row
{project.invite_sent_at ? (
  <Tooltip content={`Invite sent on ${format(new Date(project.invite_sent_at), "PPP")}`}>
    <Badge variant="success">
      <CheckCircle className="h-3 w-3 mr-1" />
      Invited
    </Badge>
  </Tooltip>
) : project.client_contact_id ? (
  <Badge variant="warning">
    <Clock className="h-3 w-3 mr-1" />
    Pending Invite
  </Badge>
) : (
  <Badge variant="default">
    <User className="h-3 w-3 mr-1" />
    No Contact
  </Badge>
)}
```

---

## Implementation Roadmap

### Week 1: Backend Foundation
- [ ] Backend implements transactional upsert
- [ ] Backend adds `contact_candidate` to POST /projects
- [ ] Backend implements POST /projects/:id/send-invite
- [ ] Backend adds status tracking to contacts table
- [ ] API testing and documentation

### Week 2: Frontend Integration
- [ ] Update type definitions
- [ ] Update useCreateProject hook
- [ ] Add contact fields to project form
- [ ] Create useSendProjectInvite hook
- [ ] Update contact list to show status
- [ ] Add email/phone validation

### Week 3: UX Enhancements
- [ ] Add duplicate contact warning
- [ ] Add contact search before creation
- [ ] Add invite status indicators
- [ ] Add send invite button to project details
- [ ] Update project list with invite status
- [ ] Add loading states and error handling

### Week 4: Testing & Polish
- [ ] Unit tests for validation
- [ ] Integration tests for create flow
- [ ] E2E tests for invite flow
- [ ] Performance testing
- [ ] Bug fixes and polish

---

## Migration Strategy

### For Existing Projects

**Option 1: Backfill (Recommended)**
```sql
-- Link existing projects to contacts via email match
UPDATE projects p
SET client_contact_id = c.id
FROM contacts c
WHERE p.custom_fields->>'client_email' = c.email
AND p.client_contact_id IS NULL;
```

**Option 2: Manual Review**
- Admin tool to review projects without contacts
- Bulk link or create contacts
- Send invites in batches

### For Existing Contacts

```sql
-- Set status for existing contacts
UPDATE contacts
SET status = 'active', source = 'manual'
WHERE status IS NULL;
```

---

## Testing Checklist

### Unit Tests
- [ ] Email normalization (lowercase, trim)
- [ ] Phone validation (E.164 format)
- [ ] Form validation with contact fields
- [ ] Hook mutation logic

### Integration Tests
- [ ] Create project with new contact
- [ ] Create project with existing contact (duplicate)
- [ ] Send invite after project creation
- [ ] Contact status transitions

### E2E Tests
- [ ] Full flow: Create project → Auto-create contact → Send invite
- [ ] Duplicate prevention: Create 2 projects with same email
- [ ] Contact search before creation
- [ ] Invite confirmation (requires backend)

---

## Security Considerations

### Frontend Validation
- Email format validation (RFC5322-lite)
- Phone format validation (E.164)
- XSS prevention in contact name/email display
- Rate limiting on invite sends (UI-level)

### Data Privacy
- Mask email in UI (show first 3 chars + domain)
- Don't log sensitive contact info
- Clear form data on unmount
- Secure token handling for invites

---

## Performance Optimization

### Caching Strategy
```typescript
// Cache contact search results
const { data: contacts } = useQuery({
  queryKey: ['contacts', 'search', email],
  queryFn: () => searchContacts(email),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Debounced Search
```typescript
const debouncedSearch = useMemo(
  () =>
    debounce((email: string) => {
      checkContactExists(email);
    }, 500),
  []
);
```

---

## Rollback Plan

If issues arise:

1. **Backend rollback:**
   - Revert API changes
   - Keep old POST /projects endpoint

2. **Frontend rollback:**
   - Remove `contact_candidate` from payload
   - Hide contact fields in form
   - Disable send invite button

3. **Database rollback:**
   - Drop new columns (status, source)
   - Remove unique constraint on email

---

## Success Metrics

### KPIs to Track
- Contact creation rate (auto vs manual)
- Duplicate prevention rate
- Invite send rate
- Invite confirmation rate
- Time to first invite
- Project creation completion rate

### Monitoring
- Track API errors for duplicate contacts
- Monitor invite delivery success rate
- Alert on high duplicate-create attempts
- Dashboard for contact status distribution

---

## Conclusion

The current project creation system can be enhanced to include the new contact management requirements through:

1. **Backend API changes** (transactional upsert, invite flow)
2. **Frontend form updates** (contact fields, validation)
3. **New hooks** (send invite, contact search)
4. **UX improvements** (duplicate warnings, status indicators)

**Estimated Effort:** 3-4 weeks with 1 full-time frontend engineer + 1 backend engineer

**Risk Level:** Medium (requires careful migration of existing data)

**Recommendation:** Implement in phases with feature flags for gradual rollout.
