# Implementation Plan: Multi-Step Signup

## Overview

Refactor the workspace signup from a single-page form into a 3-step wizard (Credentials → Verify OTP → Profile & Company). Backend gets two new endpoints (`send-otp`, `verify-otp`), the existing `signup` endpoint is modified to accept a `signup_token` + company details, and OTP storage moves to Redis. Frontend rewrites `SignUp.tsx` as a wizard with per-step validation. Implementation starts with backend (DB migration → new endpoints → modified signup), then frontend (validation → hooks → wizard UI), and wires everything together.

## Tasks

- [x] 1. Backend: DB migration and OTP infrastructure
  - [x] 1.1 Create DB migration to widen `users.otp` column from `varchar(4)` to `varchar(6)`
    - Create new migration file in `Pylott-Backend/migrations/` following existing naming convention (timestamp-based)
    - Use `knex.schema.alterTable('users', ...)` to change column type
    - Ensure migration does not drop or modify existing OTP data
    - _Requirements: 12.1, 12.2_

  - [x] 1.2 Add Redis key patterns and rate limiting logic to `auth.service.ts`
    - Add `sendSignupOtp()` method to `Pylott-Backend/src/modules/auth/services/auth.service.ts`
    - Implement rate limiting: increment `signup_otp_rate:{email}` key, set 900s TTL on first request, reject with 429 if count > 5
    - Check email availability against users table, return 409 if taken
    - Generate 6-digit numeric OTP, store in Redis at `signup_otp:{email}` with 600s TTL
    - Send OTP via SendGrid using existing `otpEmailTemplate`
    - Normalize email to lowercase + trim before all operations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3_

  - [ ]* 1.3 Write property test for email normalization idempotency
    - **Property 1: Email normalization is idempotent**
    - **Validates: Requirement 1.2**

  - [ ]* 1.4 Write property test for rate limiting enforcement
    - **Property 4: Rate limiting enforcement**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 2. Backend: Verify OTP endpoint and signup token
  - [x] 2.1 Add `verifySignupOtp()` method to `auth.service.ts`
    - Retrieve stored OTP from Redis key `signup_otp:{email}`
    - Return 400 if key missing/expired
    - Use `crypto.timingSafeEqual` for constant-time OTP comparison
    - Delete Redis key on successful match (single-use enforcement)
    - Sign and return `signup_token` JWT with `{ email, purpose: "signup" }` and 15-minute expiry
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 2.2 Write property test for invalid OTP rejection
    - **Property 5: Invalid OTP rejection**
    - **Validates: Requirements 3.3, 3.5**

  - [ ]* 2.3 Write property test for OTP single-use enforcement
    - **Property 6: OTP single-use enforcement**
    - **Validates: Requirement 3.6**

  - [ ]* 2.4 Write property test for signup token contents
    - **Property 7: Signup token contains verified email**
    - **Validates: Requirements 3.7, 4.4**

- [x] 3. Backend: Modify workspace signup endpoint
  - [x] 3.1 Modify `workspaceSignup()` in `auth.service.ts` to accept `signup_token`
    - Verify and decode `signup_token` JWT, check `purpose === "signup"`
    - Return 401 if token invalid/expired or wrong purpose
    - Extract email from token (not from request body)
    - Double-check email not taken (race condition guard), return 409 if taken
    - Accept `password`, `name`, `workspace_name`, `industry_type`, `size`, `country`, `address`, `city` from request body
    - Validate password strength, hash with bcrypt
    - Execute single transaction: create company → create user (is_verified=true, role=SUPER_ADMIN) → create user_company → update company admin_id → seed default journeys + task types
    - Return user object (excluding password hash), workspace object, and auth JWT
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.1, 6.2, 6.3, 7.1, 7.2, 11.2, 11.3, 11.4, 13.1, 13.2, 13.3, 13.4_

  - [x] 3.2 Update `WorkspaceSignupData` interface and `workspaceSignupValidator`
    - Modify the interface to include `signup_token`, `password`, `name`, `workspace_name`, `industry_type`, `size`, `country`, `address`, `city`
    - Update the validator to validate the new fields
    - _Requirements: 5.1_

  - [ ]* 3.3 Write property test for invalid token rejection
    - **Property 8: Invalid token rejection**
    - **Validates: Requirements 4.2, 4.3**

  - [ ]* 3.4 Write property test for atomic transaction guarantee
    - **Property 9: Atomic transaction — all or nothing**
    - **Validates: Requirements 6.1, 6.2**

  - [ ]* 3.5 Write property test for correctly linked records
    - **Property 10: Signup creates correctly linked records**
    - **Validates: Requirements 5.4, 5.5, 5.6, 5.7**

- [x] 4. Backend: Register new routes and controller methods
  - [x] 4.1 Add controller methods for `sendOtp` and `verifyOtp` in `auth.controller.ts`
    - Add `sendOtp` handler: extract email from body, call `sendSignupOtp()`, return response
    - Add `verifyOtp` handler: extract email + otp from body, call `verifySignupOtp()`, return response
    - _Requirements: 1.1, 3.1_

  - [x] 4.2 Register `POST /auth/send-otp` and `POST /auth/verify-otp` routes in `auth.route.ts`
    - Both routes are unauthenticated (no authGuard)
    - Wire to the new controller methods
    - _Requirements: 1.1, 3.1_

- [ ] 5. Checkpoint — Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Frontend: Validation schemas and API hooks
  - [x] 6.1 Create validation schemas for each signup step
    - Create `credentialsSchema` (email, password with strength rules, confirmPassword matching)
    - Create `otpSchema` (exactly 6 numeric digits)
    - Create `profileCompanySchema` (name, workspace_name, industry_type, size enum, country, address, city — all required)
    - Place in appropriate location near `SignUp.tsx` or in a shared validation file
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 6.2 Write property test for validation schema acceptance/rejection
    - **Property 13: Validation schemas accept valid and reject invalid input**
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [x] 6.3 Add `SEND_SIGNUP_OTP` and `VERIFY_SIGNUP_OTP` to ENDPOINTS in `src/lib/constants.ts`
    - Add `SEND_SIGNUP_OTP: "auth/send-otp"` and `VERIFY_SIGNUP_OTP: "auth/verify-otp"` to the Auth Endpoint section
    - _Requirements: 1.1, 3.1_

  - [x] 6.4 Create `use-send-signup-otp.tsx` hook in `src/hooks/auth/`
    - Use `useCustomMutation` with POST method and `ENDPOINTS.SEND_SIGNUP_OTP`
    - Type: request `{ email: string }`, response `{ message: string }`
    - _Requirements: 1.1, 10.2_

  - [x] 6.5 Create `use-verify-signup-otp.tsx` hook in `src/hooks/auth/`
    - Use `useCustomMutation` with POST method and `ENDPOINTS.VERIFY_SIGNUP_OTP`
    - Type: request `{ email: string; otp: string }`, response `{ signup_token: string }`
    - _Requirements: 3.1_

  - [x] 6.6 Update `use-workspace-signup.tsx` hook to send new request shape
    - Modify the mutation to send `signup_token`, `password`, `name`, `workspace_name`, `industry_type`, `size`, `country`, `address`, `city`
    - _Requirements: 5.1_

- [x] 7. Frontend: Rewrite SignUp.tsx as 3-step wizard
  - [x] 7.1 Implement wizard state management in `SignUp.tsx`
    - Add `step` state (1 | 2 | 3), `email`, `password`, `signupToken` to component state
    - Implement `goToStep2`, `goToStep3`, `reset` transition functions
    - Conditionally render step components based on current step
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6, 11.1_

  - [x] 7.2 Implement Step 1: Credentials form
    - Render email, password, confirm password fields with `credentialsSchema` validation via react-hook-form
    - On submit: call `useSendSignupOtp` mutation, on success store email+password in state and transition to Step 2
    - Show inline validation errors and API errors (409 duplicate email)
    - _Requirements: 8.3, 9.1, 9.4_

  - [x] 7.3 Implement Step 2: Verify OTP form
    - Render 6-digit OTP input with `otpSchema` validation
    - On submit: call `useVerifySignupOtp` mutation with stored email + entered OTP
    - On success: store `signup_token` in state, transition to Step 3
    - Show "Resend Code" button that calls `useSendSignupOtp` with stored email
    - Show inline errors for invalid/expired OTP
    - _Requirements: 8.4, 9.2, 9.4, 10.1, 10.2, 10.3_

  - [x] 7.4 Implement Step 3: Profile & Company form
    - Render name, workspace_name, industry_type, size (dropdown), country (selector), address, city fields with `profileCompanySchema` validation
    - On submit: call `useWorkspaceSignup` mutation with `signup_token` + `password` from state + form fields
    - On success: set cookies (`user_session_token`, `user_session`), navigate to onboarding page
    - On 401 (expired token): reset wizard to Step 1 with error message
    - _Requirements: 8.5, 8.6, 9.3, 9.4, 13.1, 13.2, 13.3_

  - [ ]* 7.5 Write unit tests for wizard state transitions
    - Test step progression: 1→2→3
    - Test reset on expired token error
    - Test data persistence across steps
    - _Requirements: 8.2, 8.3, 8.4, 8.6_

- [x] 8. Frontend: Update onboarding context
  - [x] 8.1 Update onboarding flow to handle company details already collected at signup
    - Since company name, industry, size, country, address, city are now collected during signup Step 3, ensure the onboarding context does not re-ask for these fields
    - Adjust any onboarding forms that previously collected company details to skip or pre-fill them
    - _Requirements: 8.5_

- [ ] 9. Final checkpoint — Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Backend tasks (1–4) should be completed before frontend tasks (6–8)
- Both repos are on branch `v1` (staging)
- Frontend commits should use `--no-verify` flag
- The design uses TypeScript throughout — all code examples should be TypeScript
- Property tests use `fast-check` library
- Each task references specific requirements for traceability
