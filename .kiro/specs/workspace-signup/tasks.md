# Implementation Plan: Workspace Signup

## Overview

Implement a unified `POST /api/v1/auth/signup` endpoint in the Pylott backend that atomically creates a user (ADMIN role) and workspace (company), seeds default project types and task types, generates an OTP for email verification, and returns a JWT with user/workspace data matching the frontend's expected response format. Also update CORS config for staging deployment.

## Tasks

- [x] 1. Add WorkspaceSignupData interface and validation
  - [x] 1.1 Add `WorkspaceSignupData` interface to `src/shared/interface/user.ts`
    - Add the interface with fields: `email`, `password`, `name`, `workspace_name` (all strings)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.1_

  - [x] 1.2 Add `workspaceSignupValidator` to `src/shared/validations/auth.ts`
    - Use `validateName('name')` for the name field
    - Add `body('email')` rules: not empty ("Email is required"), isEmail ("Invalid email")
    - Add `body('password')` rules: not empty ("Password is required"), isLength min 8
    - Use `validateName('workspace_name')` for the workspace name field
    - Export the validator array
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_


  - [ ]* 1.3 Write property test: Invalid email format rejection
    - **Property 1: Invalid email format rejection**
    - Generate random non-email strings via `fc.string()` filtered to exclude valid email patterns
    - Assert validation rejects all of them with 400 status
    - **Validates: Requirements 2.5**

  - [ ]* 1.4 Write property test: Short password rejection
    - **Property 2: Short password rejection**
    - Generate random strings of length 0-7 via `fc.string({ maxLength: 7 })`
    - Assert validation rejects all with 400 status
    - **Validates: Requirements 2.6**

- [x] 2. Implement the signup service method
  - [x] 2.1 Add `workspaceSignup` method to `src/modules/auth/services/auth.service.ts`
    - Check for duplicate email using `userRepository.findOne({ email })`; throw HttpError 400 if found
    - Call `validatePasswordStrength(password)` before any DB writes
    - Hash password with bcrypt via existing `hashPassword` method
    - Generate OTP via existing `generateOTP()` utility with 10-minute expiry
    - Start an Objection.js `Model.startTransaction()`
    - Inside transaction: create user (role=ADMIN), create company via `companyRepository.create`, update user's `company_id`
    - Call `seedDefaultData(companyId, trx)` inside transaction wrapped in try/catch (non-fatal)
    - Commit transaction; rollback on failure and throw HttpError 500
    - Send verification email outside transaction via `sendVerificationEmail` (non-fatal)
    - Generate JWT with `userId`, `email`, `role`, `company_id` claims, 7-day expiry
    - Return `{ user, workspace, token }` matching the response format from design
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 10.1, 10.2_

  - [x] 2.2 Add `seedDefaultData` private method to `src/modules/auth/services/auth.service.ts`
    - Insert 3 project_types rows: "Business Setup", "Relocation", "Compliance" with `workspace_id`
    - Insert 5 task_types rows: "Document Upload" (has_upload_field=true), "Review", "Approval", "Meeting", "Follow-up" (has_upload_field=false)
    - Use `knex('table').transacting(trx).insert(...)` pattern with UUID v4 IDs
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 2.3 Write property test: Duplicate email rejection with no side effects
    - **Property 3: Duplicate email rejection with no side effects**
    - Generate random valid signup data, insert a user with that email first, then attempt signup
    - Assert 400 response and unchanged DB record counts
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 2.4 Write property test: Successful signup creates correct records
    - **Property 4: Successful signup creates correct user and company records**
    - Generate random valid signup data (valid email, strong password, valid name, valid workspace_name)
    - Assert user record has correct fields, company record has correct fields, user.company_id = company.id
    - Verify password is bcrypt-hashed (not plaintext)
    - **Validates: Requirements 4.1, 4.2, 4.3, 10.1**

  - [ ]* 2.5 Write property test: Default data seeding correctness
    - **Property 5: Default data seeding correctness**
    - After successful signup, query project_types and task_types for the new workspace
    - Assert exactly 3 project_types with correct names and 5 task_types with correct names
    - Assert only "Document Upload" has `has_upload_field = true`
    - **Validates: Requirements 5.1, 5.2, 5.3**

  - [ ]* 2.6 Write property test: OTP generation and storage
    - **Property 6: OTP generation and storage**
    - After successful signup, query the user record
    - Assert otp is a numeric string and otp_expires is within expected 10-minute range
    - **Validates: Requirements 6.1**

  - [ ]* 2.7 Write property test: Weak password rejection at service level
    - **Property 8: Weak password rejection at service level**
    - Generate passwords ≥8 chars that fail strength (e.g., all lowercase, no special chars)
    - Assert service rejects them with an error
    - **Validates: Requirements 10.2**

- [x] 3. Checkpoint - Ensure service layer is solid
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add controller handler and route registration
  - [x] 4.1 Add `workspaceSignup` handler to `src/modules/auth/auth.controller.ts`
    - Create async method that calls `authService.workspaceSignup(req.body)`
    - On success, return via `successResponse(res, 'Workspace created successfully', result)`
    - On error, return via `errorResponse` with the error's message and statusCode (default 500)
    - _Requirements: 7.2, 8.1, 8.2, 8.3_

  - [x] 4.2 Register `POST /signup` route in `src/modules/auth/auth.route.ts`
    - Import `workspaceSignupValidator` from shared validations
    - Add `server.post(\`${prefix}/signup\`, schemaValidator(workspaceSignupValidator), ...)` calling `workspaceSignup`
    - No `authenticateUser` middleware — this is a public endpoint
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 4.3 Write property test: Response format correctness
    - **Property 7: Response format correctness**
    - Generate random valid signup data, call the endpoint
    - Assert response has status 200, `success: true`, correct `user`/`workspace`/`token` structure
    - Assert JWT decodes correctly with expected claims
    - Assert no `password` field anywhere in response
    - **Validates: Requirements 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4**

- [x] 5. Update CORS configuration for staging
  - [x] 5.1 Add Render staging URLs to `allowedOrigins` in `src/app.ts`
    - Add `https://pylott-staging-frontend.onrender.com` to the array
    - Add `https://pylott-staging-backend.onrender.com` to the array
    - Verify all existing origins remain unchanged
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The design uses TypeScript throughout, matching the existing Pylott backend codebase
- Property tests use `fast-check` as specified in the design's testing strategy
- Seeding failures and email failures are non-fatal by design (Requirements 5.4, 6.2)
- The frontend code requires no changes — it already expects this endpoint and response format
