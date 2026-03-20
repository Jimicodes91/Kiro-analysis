# Requirements Document

## Introduction

This feature adds the ability for admins and super admins to uninvite (deactivate) active clients from the Pylott platform via the contact table. When a client is uninvited, their user account and company membership are deactivated, a notification email is sent, and the client sees a clear deactivation message on login. To regain access, the admin must re-invite the client. This feature also fixes a styling bug where the invite button text is unreadable due to matching text and background colors.

## Glossary

- **Contact_Table**: The frontend table component displaying all contacts for a company, located at the `/contact` route.
- **Admin**: A user with role `admin` or `super_admin` who manages contacts and invitations.
- **Client**: A user with role `client` who was invited through the contact flow.
- **Contact_Record**: A row in the `contacts` database table, with a `status` field that can be `uninvited`, `invited`, or `active`.
- **User_Record**: A row in the `users` database table, with an `is_active` column and a `role` column.
- **User_Company_Record**: A row in the `user_companies` table linking a user to a company, with an `is_active` column.
- **Invitation_Record**: A row in the `invitations` table tracking invite status (`PENDING`, `ACCEPTED`, `EXPIRED`).
- **Uninvite_API**: The backend endpoint that processes the uninvite action for a contact.
- **Email_Service**: The backend utility responsible for sending transactional emails to users.
- **Login_Page**: The frontend authentication page where users enter credentials to access the platform.

## Requirements

### Requirement 1: Invite Button Styling Fix

**User Story:** As an admin, I want the invite button on the contact table to have readable text, so that I can clearly see and click the button to invite contacts.

#### Acceptance Criteria

1. THE Contact_Table SHALL render the "Send Invite" button with a text color that has sufficient contrast against the button background color.
2. WHEN the "Send Invite" button is displayed for an uninvited contact, THE Contact_Table SHALL use the `outline` variant styling with visible text on the button.

### Requirement 2: Uninvite Button on Contact Table

**User Story:** As an admin, I want to see an "Uninvite" button for active clients in the contact table, so that I can revoke a client's access to the platform.

#### Acceptance Criteria

1. WHEN a contact has status `active`, THE Contact_Table SHALL display an "Uninvite" button in the actions column for that contact row.
2. WHEN a contact has status `uninvited` or `invited`, THE Contact_Table SHALL NOT display an "Uninvite" button for that contact row.
3. WHEN the admin clicks the "Uninvite" button, THE Contact_Table SHALL display a confirmation dialog before proceeding with the uninvite action.
4. WHEN the admin confirms the uninvite action, THE Contact_Table SHALL send a request to the Uninvite_API and display a success toast message upon completion.
5. WHEN the admin cancels the uninvite confirmation dialog, THE Contact_Table SHALL take no action and close the dialog.
6. IF the Uninvite_API returns an error, THEN THE Contact_Table SHALL display the error message in a toast notification.

### Requirement 3: Uninvite API Endpoint

**User Story:** As a backend system, I want an API endpoint to process uninvite requests, so that the admin can deactivate a client's access through the frontend.

#### Acceptance Criteria

1. WHEN the Uninvite_API receives a valid uninvite request for an active contact, THE Uninvite_API SHALL set the Contact_Record status to `uninvited`.
2. WHEN the Uninvite_API processes an uninvite request, THE Uninvite_API SHALL set the associated User_Record `is_active` field to `false`.
3. WHEN the Uninvite_API processes an uninvite request, THE Uninvite_API SHALL set the associated User_Company_Record `is_active` field to `false`.
4. WHEN the Uninvite_API processes an uninvite request, THE Uninvite_API SHALL expire all active Invitation_Records for the contact's email within the company.
5. THE Uninvite_API SHALL only accept requests from users with role `admin` or `super_admin`.
6. IF the requesting user is not an admin or super_admin, THEN THE Uninvite_API SHALL return a 403 Forbidden error.
7. IF the contact does not belong to the requesting user's company, THEN THE Uninvite_API SHALL return a 403 Forbidden error.
8. IF the contact status is not `active`, THEN THE Uninvite_API SHALL return a 400 Bad Request error with the message "Contact is not currently active".
9. WHEN the uninvite action completes successfully, THE Uninvite_API SHALL return a success response with the updated contact data.

### Requirement 4: Uninvite Notification Email

**User Story:** As a client, I want to receive an email notification when my access is revoked, so that I understand why I can no longer log in.

#### Acceptance Criteria

1. WHEN the Uninvite_API successfully deactivates a client, THE Email_Service SHALL send a notification email to the client's email address.
2. THE notification email SHALL include the client's name, the company name, and a message explaining that their access has been revoked.
3. THE notification email SHALL include a support contact email address for the client to reach out if they have questions.
4. THE notification email SHALL use the existing Pylott email template styling consistent with other platform emails.

### Requirement 5: Deactivated Account Login Message

**User Story:** As a deactivated client, I want to see a clear message when I try to log in, so that I understand my account has been deactivated and I need to be re-invited.

#### Acceptance Criteria

1. WHEN a deactivated client attempts to log in with valid credentials, THE Login_Page SHALL display a message stating that the account has been deactivated and the client should contact their administrator to be re-invited.
2. THE Login_Page SHALL display the deactivation message as a toast error notification, consistent with other login error messages.
3. THE Uninvite_API login check SHALL verify the User_Company_Record `is_active` status for the user's companies to determine deactivation.

### Requirement 6: Re-invite Flow for Deactivated Clients

**User Story:** As an admin, I want to re-invite a previously uninvited client, so that the client can regain access to the platform.

#### Acceptance Criteria

1. WHEN a contact has status `uninvited` and was previously active, THE Contact_Table SHALL display the "Send Invite" button for that contact.
2. WHEN the admin sends a re-invite for a previously uninvited contact, THE Uninvite_API SHALL reactivate the User_Record by setting `is_active` to `true`.
3. WHEN the admin sends a re-invite for a previously uninvited contact, THE Uninvite_API SHALL reactivate the User_Company_Record by setting `is_active` to `true`.
4. WHEN the re-invite is processed, THE Email_Service SHALL send a new invitation email to the client.
5. WHEN the re-invite is processed, THE Uninvite_API SHALL update the Contact_Record status to `invited`.
6. WHEN the client accepts the re-invite, THE Contact_Record status SHALL transition to `active`.
