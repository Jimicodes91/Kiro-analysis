# Bugfix Requirements Document

## Introduction

The `workspaceSignup` method in `auth.service.ts` auto-creates two default journeys ("IFZA Incorporation Journey" and "Residency/Immigration Journey") as system journeys (`is_system: true`) during workspace registration. These system journeys cannot be modified or deleted by the admin, which is undesirable. Instead, no journeys should be seeded at signup. The same journey definitions should be offered as selectable templates when an admin creates a new journey, producing fully editable (non-system) journeys.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a new workspace is created via `workspaceSignup` THEN the system automatically creates an "IFZA Incorporation Journey" with 6 milestones marked as `is_system: true`

1.2 WHEN a new workspace is created via `workspaceSignup` THEN the system automatically creates a "Residency/Immigration Journey" with 6 milestones marked as `is_system: true`

1.3 WHEN default journeys are auto-created during signup THEN the admin cannot modify or delete these journeys because they are flagged as system journeys

1.4 WHEN an admin navigates to the journey creation UI THEN the system only offers a blank form with no template suggestions or starting points

### Expected Behavior (Correct)

2.1 WHEN a new workspace is created via `workspaceSignup` THEN the system SHALL NOT create any default journeys — the workspace starts with zero journeys

2.2 WHEN a new workspace is created via `workspaceSignup` THEN the system SHALL NOT create any default milestones associated with journeys

2.3 WHEN an admin opens the journey creation flow THEN the system SHALL display template suggestions including "IFZA Incorporation Journey" (with its 6 milestones) and "Residency/Immigration Journey" (with its 6 milestones) as starting points

2.4 WHEN an admin selects a journey template THEN the system SHALL pre-fill the journey creation form with the template's name and milestones (name + duration), allowing the admin to review and modify before submitting

2.5 WHEN an admin creates a journey from a template THEN the created journey and its milestones SHALL NOT be marked as `is_system` — they shall be fully editable and deletable

2.6 WHEN an admin chooses not to use a template THEN the system SHALL allow creating a journey from scratch using the existing blank form

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a workspace is created via `workspaceSignup` THEN the system SHALL CONTINUE TO create default task types ("Document upload", "General") as part of the signup transaction

3.2 WHEN a workspace is created via `workspaceSignup` THEN the system SHALL CONTINUE TO create the company, user, user_company records, and update admin_id within a single transaction

3.3 WHEN an admin creates a journey from scratch (without a template) THEN the system SHALL CONTINUE TO validate and create the journey with milestones using the existing `createProjectType` flow

3.4 WHEN an admin views the journey list THEN the system SHALL CONTINUE TO display all journeys with their milestones, duration, and action columns as before

3.5 WHEN an admin edits or deletes a non-system journey THEN the system SHALL CONTINUE TO allow those operations as before
