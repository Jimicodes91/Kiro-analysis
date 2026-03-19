# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Signup Seeds Immutable Journeys & No Templates Endpoint
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases:
    - Call `workspaceSignup` with valid data → assert zero project types (journeys) created for the new company
    - Call `workspaceSignup` with valid data → assert zero milestones created for the new company
    - Send GET to `projects/types/templates` → assert endpoint exists and returns templates array with length >= 2
  - Test that `workspaceSignup(validData)` does NOT create any project types with `is_system: true` (from Fault Condition: `workspaceSignup(input) creates journeys with is_system = true`)
  - Test that `getJourneyTemplates()` returns a non-empty array containing "IFZA Incorporation Journey" and "Residency/Immigration Journey" (from Fault Condition: `availableTemplates(input.context) = EMPTY`)
  - Run test on UNFIXED code - expect FAILURE (this confirms the bug exists)
  - Document counterexamples found (e.g., "workspaceSignup creates 2 project types with is_system: true and 12 milestones")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Signup Transaction Integrity & Journey CRUD Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe on UNFIXED code: `workspaceSignup(validData)` creates company, user, user_company, updates admin_id, and creates default task types ("Document upload", "General") with `is_system: true`
  - Observe on UNFIXED code: `createProjectType(journeyData)` creates a journey with milestones via the existing flow
  - Observe on UNFIXED code: editing and deleting non-system journeys works correctly
  - Write property-based test: for all valid `WorkspaceSignupData`, the signup transaction creates company + user + user_company + admin_id update + task types identically (from Preservation Requirements: 3.1, 3.2)
  - Write property-based test: for all valid journey creation inputs (without template), `createProjectType` produces the same result as before (from Preservation Requirements: 3.3)
  - Verify tests pass on UNFIXED code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix: Remove default journey seeding and add journey templates

  - [x] 3.1 Remove default journey seeding from `workspaceSignup`
    - In `Pylott-Backend/src/modules/auth/services/auth.service.ts`, remove the `defaultJourneys` array and the `for` loop that creates project types and milestones with `is_system: true` (~lines 450-480)
    - Keep the default task types seeding ("Document upload", "General") intact
    - Keep all other signup transaction steps (company, user, user_company, admin_id) intact
    - _Bug_Condition: isBugCondition(input) where workspaceSignup(input) creates journeys with is_system = true_
    - _Expected_Behavior: workspaceSignup(input) creates zero journeys and zero milestones_
    - _Preservation: Task types, company, user, user_company, admin_id creation unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.2 Add `getJourneyTemplates()` method to `TypeService`
    - In `Pylott-Backend/src/modules/projects/services/type.service.ts`, add a `getJourneyTemplates()` method
    - Return a hardcoded array of journey template definitions (same two journeys previously seeded):
      - "IFZA Incorporation Journey" with 6 milestones (names + durations)
      - "Residency/Immigration Journey" with 6 milestones (names + durations)
    - Each template: `{ name: string, milestones: Array<{ name: string, duration: number }> }`
    - No database interaction — static definitions only
    - _Expected_Behavior: getJourneyTemplates() returns array with >= 2 templates including IFZA and Residency_
    - _Requirements: 2.3_

  - [x] 3.3 Add controller method and route for journey templates
    - In `Pylott-Backend/src/modules/projects/projects.controller.ts`, add `getJourneyTemplates` handler calling `typeService.getJourneyTemplates()`
    - In `Pylott-Backend/src/modules/projects/project.route.ts`, add `GET {prefix}/types/templates` route BEFORE `/:project_type_id` to avoid param conflicts, protected by `authGuard`
    - _Expected_Behavior: GET projects/types/templates returns templates array_
    - _Requirements: 2.3_

  - [x] 3.4 Add frontend constants and hook for journey templates
    - In `Pylott-Web-App/src/lib/constants.ts`, add `GET_JOURNEY_TEMPLATES: "projects/types/templates"` to `ENDPOINTS` and `GET_JOURNEY_TEMPLATES: "GET_JOURNEY_TEMPLATES"` to `QUERYKEYS`
    - Create `Pylott-Web-App/src/hooks/project-modules/project-types/use-get-journey-templates.tsx` with `useGetJourneyTemplates` hook using `useQueryActionHook`
    - _Requirements: 2.3_

  - [x] 3.5 Add template selection UI in journey creation modal
    - In `Pylott-Web-App/src/pages/Home/Admin/journey/create-journey-form-modal.tsx`, add a template selection step before the blank form
    - Display template cards for "IFZA Incorporation Journey" and "Residency/Immigration Journey" plus a "Start from scratch" option
    - When a template is selected, pre-fill the form's `name` and `stages` fields using `form.reset()` with the template data
    - When "Start from scratch" is selected, show the existing blank form as-is
    - Created journeys from templates SHALL have `is_system: false` (default behavior of existing `createProjectType`)
    - _Expected_Behavior: Template selection pre-fills form; created journey has is_system = false_
    - _Preservation: Blank form creation flow unchanged_
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 3.3_

  - [x] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Signup Seeds No Journeys & Templates Endpoint Works
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Signup Transaction Integrity & Journey CRUD Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
