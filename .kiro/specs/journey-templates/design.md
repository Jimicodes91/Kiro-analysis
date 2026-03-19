# Journey Templates Bugfix Design

## Overview

The `workspaceSignup` method in `auth.service.ts` auto-creates two default journeys ("IFZA Incorporation Journey" and "Residency/Immigration Journey") as system journeys (`is_system: true`) during workspace registration. These system journeys cannot be modified or deleted by the admin. The fix removes this auto-seeding and instead introduces a backend endpoint that serves journey templates, plus a frontend UI that presents these templates as suggestions when an admin creates a new journey. Journeys created from templates are fully editable (non-system).

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — `workspaceSignup` auto-creates two default journeys with `is_system: true`, making them immutable
- **Property (P)**: The desired behavior — no journeys are seeded at signup; templates are offered via a dedicated endpoint and UI when creating a journey
- **Preservation**: Existing signup transaction behavior (task types, company/user creation), existing journey CRUD, and existing journey list display must remain unchanged
- **workspaceSignup**: The method in `auth.service.ts` that handles workspace registration, currently seeding default journeys
- **TypeService**: The service in `type.service.ts` that manages journey (project type) CRUD operations
- **JourneyFormModal**: The React component in `create-journey-form-modal.tsx` that renders the journey creation form
- **Journey Template**: A predefined journey definition (name + milestones with durations) served by the backend as a suggestion, not persisted until the admin creates it

## Bug Details

### Fault Condition

The bug manifests when a new workspace is created via `workspaceSignup`. The method unconditionally creates two journey records with `is_system: true` and their associated milestones with `is_system: true`, preventing the admin from editing or deleting them. Additionally, the journey creation UI offers no template suggestions, so the admin has no way to leverage these predefined journey structures as editable starting points.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type WorkspaceSignupData | JourneyCreationContext
  OUTPUT: boolean

  // Condition 1: Signup seeds immutable journeys
  IF input IS WorkspaceSignupData THEN
    RETURN workspaceSignup(input) creates journeys with is_system = true
  END IF

  // Condition 2: No template suggestions in creation UI
  IF input IS JourneyCreationContext THEN
    RETURN input.action = "open_create_journey_form"
           AND availableTemplates(input.context) = EMPTY
  END IF

  RETURN false
END FUNCTION
```

### Examples

- Admin signs up a new workspace → two journeys ("IFZA Incorporation Journey", "Residency/Immigration Journey") appear in the journey list as system journeys that cannot be edited or deleted. **Expected**: No journeys exist after signup.
- Admin clicks "Create journey" → only a blank form appears with no template suggestions. **Expected**: A template selection step appears before the blank form, offering IFZA and Residency templates.
- Admin wants to customize the "IFZA Incorporation Journey" milestones → cannot edit because `is_system: true`. **Expected**: Admin creates from template, resulting in a fully editable journey.
- Admin selects "Residency/Immigration Journey" template → form is pre-filled with 6 milestones (Establishment Card Processing: 2 days, Entry Permit Application: 3 days, etc.), admin can modify before submitting. **Expected**: Journey is created with `is_system: false`.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Default task types ("Document upload", "General") must continue to be created during `workspaceSignup` as `is_system: true`
- The signup transaction must continue to create company, user, user_company records, and update admin_id atomically
- Creating a journey from scratch (without a template) must continue to work via the existing `createProjectType` flow
- The journey list table must continue to display all journeys with milestones, duration, and action columns
- Editing and deleting non-system journeys must continue to work as before

**Scope:**
All inputs that do NOT involve workspace signup journey seeding or the journey creation template flow should be completely unaffected by this fix. This includes:
- All other signup transaction steps (company, user, task types)
- Existing journey CRUD operations (edit, delete, reorder milestones)
- Project creation, task management, and all other modules
- Mouse/keyboard interactions with the journey table

## Hypothesized Root Cause

Based on the bug description, the issues are:

1. **Unconditional Journey Seeding in workspaceSignup**: Lines ~450-480 of `auth.service.ts` contain a `defaultJourneys` array and a loop that creates project types and milestones with `is_system: true` inside the signup transaction. This code runs for every new workspace with no opt-out mechanism.

2. **No Template Endpoint**: The backend has no endpoint to serve journey template definitions. The `TypeService` only manages persisted journeys, not template suggestions.

3. **No Template UI in Journey Creation**: The `JourneyFormModal` component opens directly to a blank form. There is no intermediate step or UI element that presents template options before the form.

4. **is_system Flag Prevents Editing**: Journeys created with `is_system: true` are treated as immutable by the frontend/backend, so the auto-seeded journeys cannot be customized by the admin.

## Correctness Properties

Property 1: Fault Condition - No Journeys Seeded at Signup

_For any_ workspace signup where `workspaceSignup` is called with valid `WorkspaceSignupData`, the fixed function SHALL NOT create any project type (journey) or milestone records. The resulting workspace SHALL have zero journeys immediately after signup.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Signup Transaction Integrity

_For any_ workspace signup where `workspaceSignup` is called with valid `WorkspaceSignupData`, the fixed function SHALL produce the same company, user, user_company, admin_id update, and default task type records as the original function, preserving all non-journey signup behavior.

**Validates: Requirements 3.1, 3.2**

Property 3: Fault Condition - Templates Endpoint Returns Definitions

_For any_ authenticated GET request to the journey templates endpoint, the fixed system SHALL return an array of template objects each containing a name and an array of milestones (with name and duration), including at minimum the "IFZA Incorporation Journey" and "Residency/Immigration Journey" templates.

**Validates: Requirements 2.3**

Property 4: Fault Condition - Template Pre-fills Journey Form

_For any_ admin action of selecting a journey template in the creation flow, the fixed system SHALL pre-fill the journey form with the template's name and milestones, and the resulting created journey SHALL have `is_system: false`.

**Validates: Requirements 2.4, 2.5**

Property 5: Preservation - Blank Journey Creation Unchanged

_For any_ admin action of creating a journey from scratch (without selecting a template), the fixed system SHALL produce the same result as the original `createProjectType` flow, preserving the existing blank form behavior.

**Validates: Requirements 2.6, 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `Pylott-Backend/src/modules/auth/services/auth.service.ts`

**Function**: `workspaceSignup`

**Specific Changes**:
1. **Remove Default Journey Seeding**: Delete the `defaultJourneys` array and the `for` loop that creates project types and milestones with `is_system: true` (approximately lines 450-480). Keep the default task types seeding intact.

---

**File**: `Pylott-Backend/src/modules/projects/services/type.service.ts`

**Function**: New method `getJourneyTemplates`

**Specific Changes**:
2. **Add Template Method**: Add a `getJourneyTemplates()` method to `TypeService` that returns a hardcoded array of journey template definitions (the same two journeys previously seeded). Each template includes `name` and `milestones` (array of `{ name, duration }`). No database interaction needed — these are static definitions.

---

**File**: `Pylott-Backend/src/modules/projects/projects.controller.ts`

**Function**: New method `getJourneyTemplates`

**Specific Changes**:
3. **Add Controller Method**: Add a `getJourneyTemplates` handler that calls `typeService.getJourneyTemplates()` and returns the result.

---

**File**: `Pylott-Backend/src/modules/projects/project.route.ts`

**Specific Changes**:
4. **Add Route**: Add `GET {prefix}/types/templates` route (before the `/:project_type_id` route to avoid param conflicts) mapped to the new controller method, protected by `authGuard`.

---

**File**: `Pylott-Web-App/src/lib/constants.ts`

**Specific Changes**:
5. **Add Endpoint Constant**: Add `GET_JOURNEY_TEMPLATES: "projects/types/templates"` to `ENDPOINTS` and `GET_JOURNEY_TEMPLATES: "GET_JOURNEY_TEMPLATES"` to `QUERYKEYS`.

---

**File**: `Pylott-Web-App/src/hooks/project-modules/project-types/use-get-journey-templates.tsx` (new)

**Specific Changes**:
6. **Add Hook**: Create a `useGetJourneyTemplates` hook that fetches from the new templates endpoint using `useQueryActionHook`.

---

**File**: `Pylott-Web-App/src/pages/Home/Admin/journey/create-journey-form-modal.tsx`

**Specific Changes**:
7. **Add Template Selection UI**: Before the blank form, show a template selection step. Display template cards (IFZA Incorporation Journey, Residency/Immigration Journey) and a "Start from scratch" option. When a template is selected, pre-fill the form's `name` and `stages` fields using `form.reset()` with the template data. When "Start from scratch" is selected, show the existing blank form as-is.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that call `workspaceSignup` and inspect the database for auto-created journeys, and tests that check for the absence of a templates endpoint. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Signup Seeds Journeys Test**: Call `workspaceSignup` with valid data, query project_types for the new company — expect to find 2 system journeys (will confirm bug on unfixed code)
2. **Seeded Journeys Are Immutable Test**: After signup, attempt to verify the seeded journeys have `is_system: true` (will confirm bug on unfixed code)
3. **No Templates Endpoint Test**: Send GET to `projects/types/templates` — expect 404 (will confirm missing feature on unfixed code)
4. **Journey Form Has No Templates Test**: Render `JourneyFormModal` — expect no template selection UI (will confirm missing feature on unfixed code)

**Expected Counterexamples**:
- `workspaceSignup` creates 2 project types with `is_system: true` and 12 milestones with `is_system: true`
- Possible causes: hardcoded `defaultJourneys` array in `workspaceSignup`, no templates endpoint or UI

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  IF input IS WorkspaceSignupData THEN
    result := workspaceSignup_fixed(input)
    ASSERT countJourneys(result.company) = 0
    ASSERT countMilestones(result.company) = 0
    ASSERT countTaskTypes(result.company) >= 2
  END IF

  IF input IS JourneyCreationContext THEN
    templates := getJourneyTemplates()
    ASSERT templates.length >= 2
    ASSERT templates CONTAINS "IFZA Incorporation Journey"
    ASSERT templates CONTAINS "Residency/Immigration Journey"
    FOR EACH template IN templates DO
      journey := createFromTemplate(template)
      ASSERT journey.is_system = false
      ASSERT journey.milestones = template.milestones
    END FOR
  END IF
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT workspaceSignup_original(input).company = workspaceSignup_fixed(input).company
  ASSERT workspaceSignup_original(input).user = workspaceSignup_fixed(input).user
  ASSERT workspaceSignup_original(input).taskTypes = workspaceSignup_fixed(input).taskTypes
  ASSERT createProjectType_original(input) = createProjectType_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for signup transaction outputs (excluding journeys) and journey CRUD operations, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Signup Transaction Preservation**: Verify that company, user, user_company, admin_id, and task types are created identically after the fix
2. **Journey CRUD Preservation**: Verify that creating, editing, deleting, and listing non-system journeys works identically after the fix
3. **Journey List Display Preservation**: Verify that the journey table renders correctly with the same columns and data after the fix

### Unit Tests

- Test that `workspaceSignup` no longer creates any project types or milestones
- Test that `workspaceSignup` still creates default task types
- Test that `getJourneyTemplates` returns the expected template definitions
- Test that `createProjectType` with template data creates a non-system journey
- Test that the template selection UI renders template cards and "Start from scratch" option

### Property-Based Tests

- Generate random valid `WorkspaceSignupData` and verify zero journeys are created post-signup
- Generate random valid `WorkspaceSignupData` and verify task types, company, and user records match expected output
- Generate random template selections and verify created journeys have `is_system: false` with correct milestones

### Integration Tests

- Test full signup flow followed by journey creation from template — verify end-to-end that no system journeys exist and template-created journeys are editable
- Test that the frontend fetches templates from the new endpoint and displays them in the creation modal
- Test that selecting a template pre-fills the form and submitting creates an editable journey
