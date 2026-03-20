# Implementation Plan: Contact Uninvite

## Overview

Implement the ability for admins/super admins to uninvite active clients from the platform. This spans backend (uninvite endpoint, email template, re-invite modifications, audit enum) and frontend (uninvite button, confirmation dialog, invite button styling fix). Tasks are ordered so backend work lands first, then frontend wires to it.

## Tasks

- [x] 1. Backend: Add enum and email template
  - [x] 1.1 Add `CLIENT_UNINVITED` to `AUDIT_TRAIL_ACTION` enum
    - Add `CLIENT_UNINVITED = 'CLIENT_UNINVITED'` to the `AUDIT_TRAIL_ACTION` enum in `Pylott-Backend/src/shared/enums/index.ts`
    - _Requirements: 3.1 (audit trail for uninvite action)_

  - [x] 1.2 Create `uninviteNotificationEmail` template function
    - Add a new exported function `uninviteNotificationEmail(clientName: string, companyName: string)` in `Pylott-Backend/src/shared/utils/email.ts`
    - Use the existing `authEmailTemplate` helper, passing: `mainTitle: 'Account Access Revoked'`, a message explaining the client's access to `companyName` has been revoked by their administrator, `actionText: 'Visit Pylott'`, `actionLink: 'https://pylott.io'`, and `supportEmail: 'ava@pylott.io'`
    - The message body must include `clientName`, `companyName`, and the support email address
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2. Backend: Implement uninvite endpoint
  - [x] 2.1 Add `uninviteContact` method to `AuthService`
    - Add `public async uninviteContact(adminUserId: string, contactId: string)` in `Pylott-Backend/src/modules/auth/services/auth.service.ts`
    - Validate requesting user exists and has role `admin` or `super_admin` (return 403 otherwise)
    - Validate requesting user has a `company_id` (return 400 otherwise)
    - Validate contact exists (return 404 otherwise) and belongs to the admin's company (return 403 otherwise)
    - Validate contact status is `Active` (return 400 with message "Contact is not currently active" otherwise)
    - Look up the user record by `contact.email`; if no user found, return 400 "No user account found for this contact"
    - In a single flow: set `contact.status = 'Uninvited'`, set `users.is_active = false`, set `user_companies.is_active = false` for the user+company pair, expire all `PENDING` invitations for the contact's email in the company (set status to `EXPIRED`)
    - Send uninvite notification email using the new `uninviteNotificationEmail` template (non-blocking — catch and log email errors)
    - Log audit trail with `AUDIT_TRAIL_ACTION.CLIENT_UNINVITED`
    - Return `{ status: 'success', message: 'Contact uninvited successfully', data: { contactId, email, status: 'Uninvited' } }`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.1_

  - [ ]* 2.2 Write property test: uninvite authorization rejects non-admin roles
    - **Property 3: Uninvite authorization rejects non-admin roles**
    - **Validates: Requirements 3.5, 3.6**

  - [ ]* 2.3 Write property test: uninvite rejects non-active contacts
    - **Property 5: Uninvite rejects non-active contacts**
    - **Validates: Requirements 3.8**

  - [ ]* 2.4 Write property test: uninvite deactivates all associated records
    - **Property 2: Uninvite deactivates all associated records**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.9**

  - [ ]* 2.5 Write property test: uninvite notification email contains required information
    - **Property 6: Uninvite notification email contains required information**
    - **Validates: Requirements 4.1, 4.2, 4.3**

  - [x] 2.6 Add `uninviteContact` method to `AuthController`
    - Add `public uninviteContact = async (req: Request, res: Response) => { ... }` in `Pylott-Backend/src/modules/auth/auth.controller.ts`
    - Extract `contactId` from `req.params`, `adminUserId` from `req.user.id`
    - Call `this.authService.uninviteContact(adminUserId, contactId)` and return the result with status 200
    - _Requirements: 3.1_

  - [x] 2.7 Register the uninvite route
    - Add `server.post(\`\${prefix}/contacts/:contactId/uninvite\`, authenticateUser, authController.uninviteContact)` in `Pylott-Backend/src/modules/auth/auth.route.ts`, placed near the existing `contacts/:contactId/send-invite` route
    - _Requirements: 3.1_

- [x] 3. Backend: Modify re-invite flow for previously uninvited contacts
  - [x] 3.1 Update `sendContactInvite` in `AuthService` to handle re-invite
    - In `Pylott-Backend/src/modules/auth/services/auth.service.ts`, modify `sendContactInvite`:
    - Remove or adjust the guard that rejects `Active` contacts — keep it, but add a new branch before it: when `contact.status === 'Uninvited'`, check if a user exists with the contact's email (or `contact.user_id`). If so, reactivate `users.is_active = true` and `user_companies.is_active = true` for that user+company pair before proceeding to `createAndSendInvite`
    - After sending the invite, set `contact.status = 'Invited'` (this already happens in the existing code)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 3.2 Write property test: re-invite reactivates user and company membership
    - **Property 8: Re-invite reactivates user and company membership**
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 3.3 Write property test: re-invite updates contact status and sends email
    - **Property 9: Re-invite updates contact status and sends email**
    - **Validates: Requirements 6.4, 6.5**

- [x] 4. Checkpoint - Backend verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Frontend: Add uninvite endpoint constant and hook
  - [x] 5.1 Add `UNINVITE_CONTACT` endpoint to constants
    - In `Pylott-Web-App/src/lib/constants.ts`, add to the `ENDPOINTS` object: `UNINVITE_CONTACT: (contactId: string) => \`auth/contacts/\${contactId}/uninvite\``
    - _Requirements: 2.4_

  - [x] 5.2 Create `useUninviteContact` hook
    - Create `Pylott-Web-App/src/hooks/contacts/use-uninvite-contact.tsx`
    - Follow the same pattern as `use-send-invite.tsx`: use `useCustomMutation` with method `post`, endpoint `ENDPOINTS.UNINVITE_CONTACT(contactId)`, and on success invalidate `QUERYKEYS.GET_COMPANY_CONTACTS`
    - _Requirements: 2.4_

- [x] 6. Frontend: Add uninvite button and confirmation dialog to contact table row
  - [x] 6.1 Add uninvite UI to `ContactTableRow`
    - In `Pylott-Web-App/src/pages/Home/Contact/contact-table-row.tsx`:
    - Import `useUninviteContact` hook and shadcn `AlertDialog` components (`AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger`)
    - Add state `const [isUninviteDialogOpen, setIsUninviteDialogOpen] = useState(false)`
    - When `contact.status === 'active'`, render an "Uninvite" button (variant `destructive`, size `sm`) in the actions cell alongside the existing dropdown
    - Wrap the button in an `AlertDialog` that asks "Are you sure you want to uninvite this contact?" with confirm/cancel actions
    - On confirm, call `uninviteContact.mutateAsync({})`, show `toast.success("Contact uninvited successfully")` on success, show `toast.error(error.message || "Failed to uninvite contact")` on error
    - On cancel, close the dialog with no API call
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 6.2 Write property test: uninvite button visibility matches contact status
    - **Property 1: Uninvite button visibility matches contact status**
    - **Validates: Requirements 2.1, 2.2**

- [x] 7. Frontend: Fix invite button styling
  - [x] 7.1 Fix "Send Invite" button text contrast
    - In `Pylott-Web-App/src/pages/Home/Contact/contact-table-row.tsx`, the existing "Send Invite" button already uses `variant="outline"`. Add an explicit text color class (e.g., `className="text-foreground"`) to ensure the text is readable against the button background
    - Verify the button renders with sufficient contrast for both `uninvited` status contacts
    - _Requirements: 1.1, 1.2_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The existing `signIn` method already blocks users with no active company memberships, so no login-side code changes are needed for Requirement 5
- Contact status values in the database use title-case (`Uninvited`, `Invited`, `Active`) but the frontend compares lowercase — the existing `getStatusBadge` switch already handles this
- All property tests reference specific properties from the design document
- Backend tasks come first so the frontend can wire to a working API
