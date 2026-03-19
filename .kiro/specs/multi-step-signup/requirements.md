# Requirements Document

## Introduction

The current workspace signup flow uses a single-page form that creates a user and company in one step, with OTP verification happening post-signup via the users table. This feature refactors the signup into a 3-step wizard (Credentials → Verify OTP → Profile & Company) on the existing `/signup` route. OTP storage moves to Redis (since the user doesn't exist yet), a short-lived signup_token JWT bridges OTP verification to final account creation, and all database writes happen in a single atomic transaction at the final step — eliminating half-created user records.

## Glossary

- **Signup_Wizard**: The frontend React component managing the 3-step signup flow via internal state on the `/signup` route
- **SendOTP_Endpoint**: The backend HTTP route at `POST /api/v1/auth/send-otp` that validates email availability and sends a 6-digit OTP
- **VerifyOTP_Endpoint**: The backend HTTP route at `POST /api/v1/auth/verify-otp` that validates the OTP and returns a signup_token
- **Signup_Endpoint**: The modified backend HTTP route at `POST /api/v1/auth/signup` that creates user + company atomically using a signup_token
- **Auth_Service**: The backend service (`auth.service.ts`) that orchestrates OTP generation, verification, and workspace signup
- **OTP**: A 6-digit one-time password stored in Redis and sent via email for email ownership verification
- **Signup_Token**: A short-lived JWT (15-minute expiry) containing the verified email and purpose claim, bridging OTP verification to final signup
- **Redis_OTP_Store**: Redis keys with pattern `signup_otp:{email}` storing OTP values with 600-second TTL
- **Rate_Limit_Store**: Redis keys with pattern `signup_otp_rate:{email}` tracking OTP request counts with 900-second TTL
- **Credentials_Schema**: The Yup validation schema for Step 1 (email, password, confirm password)
- **OTP_Schema**: The Yup validation schema for Step 2 (6-digit OTP)
- **Profile_Company_Schema**: The Yup validation schema for Step 3 (name, company details)
- **Workspace**: A company entity in the Pylott database representing an organization (maps to the `companies` table)

## Requirements

### Requirement 1: Send OTP Endpoint

**User Story:** As a new user, I want to receive an OTP at my email address during signup, so that I can prove I own the email before creating an account.

#### Acceptance Criteria

1. THE SendOTP_Endpoint SHALL accept POST requests at path `/api/v1/auth/send-otp` without authentication
2. WHEN a valid email is submitted, THE Auth_Service SHALL normalize the email to lowercase and trim whitespace before processing
3. WHEN the submitted email already exists in the users table, THE Auth_Service SHALL return a 409 status with the message "Email is already registered"
4. WHEN the email is available, THE Auth_Service SHALL generate a 6-digit numeric OTP and store it in the Redis_OTP_Store with key `signup_otp:{email}` and a 600-second TTL
5. WHEN the OTP is stored successfully, THE Auth_Service SHALL send the OTP to the email address via SendGrid using the existing `otpEmailTemplate`
6. WHEN the OTP email is sent successfully, THE SendOTP_Endpoint SHALL return a 200 status with `{ message: "OTP sent successfully" }`

### Requirement 2: OTP Rate Limiting

**User Story:** As a platform operator, I want to limit OTP requests per email, so that the system is protected from abuse and excessive SendGrid costs.

#### Acceptance Criteria

1. WHEN an OTP send request is received, THE Auth_Service SHALL increment the Rate_Limit_Store counter at key `signup_otp_rate:{email}` and set a 900-second TTL on first request
2. WHEN the Rate_Limit_Store counter for an email exceeds 5 within the 15-minute window, THE Auth_Service SHALL return a 429 status with the message "Too many OTP requests. Try again later."
3. THE Auth_Service SHALL check the rate limit before checking email availability or generating an OTP

### Requirement 3: Verify OTP Endpoint

**User Story:** As a new user, I want to verify my OTP to prove email ownership, so that I can proceed to complete my signup.

#### Acceptance Criteria

1. THE VerifyOTP_Endpoint SHALL accept POST requests at path `/api/v1/auth/verify-otp` without authentication
2. WHEN a valid email and 6-digit OTP are submitted, THE Auth_Service SHALL retrieve the stored OTP from Redis_OTP_Store at key `signup_otp:{email}`
3. WHEN the Redis key does not exist or has expired, THE Auth_Service SHALL return a 400 status with the message "OTP expired or not found"
4. THE Auth_Service SHALL compare the submitted OTP against the stored OTP using constant-time comparison (`crypto.timingSafeEqual`)
5. WHEN the OTP does not match, THE Auth_Service SHALL return a 400 status with the message "Invalid OTP"
6. WHEN the OTP matches, THE Auth_Service SHALL delete the Redis key `signup_otp:{email}` to enforce single-use
7. WHEN the OTP is verified successfully, THE Auth_Service SHALL sign and return a Signup_Token JWT containing `{ email, purpose: "signup" }` with a 15-minute expiry

### Requirement 4: Signup Token Validation

**User Story:** As a platform operator, I want the signup token to securely bridge OTP verification to account creation, so that only email-verified users can complete signup.

#### Acceptance Criteria

1. WHEN the Signup_Endpoint receives a request, THE Auth_Service SHALL verify and decode the Signup_Token JWT before processing
2. WHEN the Signup_Token is expired or has an invalid signature, THE Auth_Service SHALL return a 401 status with the message "Invalid or expired signup token"
3. WHEN the Signup_Token `purpose` claim is not `"signup"`, THE Auth_Service SHALL return a 401 status with the message "Invalid token purpose"
4. THE Auth_Service SHALL extract the email from the verified Signup_Token and use it as the user's email for account creation

### Requirement 5: Modified Workspace Signup Endpoint

**User Story:** As a new user, I want to complete my signup by providing my profile and company details, so that my account and workspace are created together.

#### Acceptance Criteria

1. THE Signup_Endpoint SHALL accept POST requests at path `/api/v1/auth/signup` with a request body containing `signup_token`, `password`, `name`, `workspace_name`, `industry_type`, `size`, `country`, `address`, and `city`
2. WHEN the email extracted from the Signup_Token already exists in the users table, THE Auth_Service SHALL return a 409 status with the message "Email is already registered"
3. WHEN all validations pass, THE Auth_Service SHALL hash the password using bcrypt before storing it
4. WHEN all validations pass, THE Auth_Service SHALL create the user record with `is_verified` set to true and `role` set to SUPER_ADMIN
5. WHEN all validations pass, THE Auth_Service SHALL create the Workspace record with the provided company details (name, industry_type, size, country, address, city)
6. WHEN all validations pass, THE Auth_Service SHALL create a user_company association linking the new user to the new Workspace with role SUPER_ADMIN
7. WHEN all validations pass, THE Auth_Service SHALL update the Workspace `admin_id` to reference the new user
8. WHEN signup completes successfully, THE Signup_Endpoint SHALL return a 200 status with the user object, workspace object, and a JWT auth token

### Requirement 6: Atomic Transaction Guarantee

**User Story:** As a platform operator, I want all signup database writes to happen in a single transaction, so that no half-created user or orphaned records exist.

#### Acceptance Criteria

1. THE Auth_Service SHALL execute all database inserts (user, company, user_company, default data) within a single database transaction
2. IF any insert within the transaction fails, THEN THE Auth_Service SHALL roll back all changes so that no partial records remain in the database
3. IF the transaction is rolled back, THEN THE Signup_Endpoint SHALL return a 500 status with an error message indicating signup failed

### Requirement 7: Default Data Seeding

**User Story:** As a new workspace owner, I want my workspace to come with default project types and task types, so that I can start using the platform immediately.

#### Acceptance Criteria

1. WHEN a new Workspace is created during signup, THE Auth_Service SHALL insert default project types (journeys) with their associated milestones into the database within the same transaction
2. WHEN a new Workspace is created during signup, THE Auth_Service SHALL insert default task types into the database within the same transaction

### Requirement 8: Frontend Wizard State Management

**User Story:** As a new user, I want to complete signup in clear sequential steps on a single page, so that the process feels guided and I don't lose my progress.

#### Acceptance Criteria

1. THE Signup_Wizard SHALL render on the existing `/signup` route without creating new routes
2. THE Signup_Wizard SHALL manage three steps (Credentials, Verify OTP, Profile & Company) using internal React state
3. WHEN Step 1 is submitted successfully, THE Signup_Wizard SHALL store the email and password in component state and transition to Step 2
4. WHEN Step 2 is submitted successfully, THE Signup_Wizard SHALL store the Signup_Token in component state and transition to Step 3
5. WHEN Step 3 is submitted successfully, THE Signup_Wizard SHALL set authentication cookies and navigate to the onboarding page
6. WHEN an unrecoverable error occurs (expired Signup_Token), THE Signup_Wizard SHALL reset state and return to Step 1

### Requirement 9: Frontend Validation

**User Story:** As a new user, I want immediate feedback on invalid input, so that I can correct mistakes before submitting each step.

#### Acceptance Criteria

1. THE Credentials_Schema SHALL require a valid email format, a password of at least 8 characters containing an uppercase letter, a number, and a special character, and a confirm password field matching the password
2. THE OTP_Schema SHALL require exactly 6 numeric digits
3. THE Profile_Company_Schema SHALL require non-empty values for full name, company name, industry type, company size (one of "startup", "small", "medium", "large", "enterprise"), country, address, and city
4. WHEN a validation error occurs on any step, THE Signup_Wizard SHALL display the error message inline on the corresponding field

### Requirement 10: OTP Resend Capability

**User Story:** As a new user, I want to resend the OTP if I didn't receive it, so that I can still complete email verification.

#### Acceptance Criteria

1. WHILE on Step 2, THE Signup_Wizard SHALL display a "Resend Code" action
2. WHEN the user triggers resend, THE Signup_Wizard SHALL call the SendOTP_Endpoint with the stored email
3. WHEN the resend succeeds, THE Signup_Wizard SHALL display a confirmation message to the user

### Requirement 11: Password Security

**User Story:** As a platform operator, I want passwords to be securely handled throughout the signup flow, so that user credentials are protected.

#### Acceptance Criteria

1. THE Signup_Wizard SHALL hold the password in React component state only (not in localStorage or sessionStorage)
2. THE Auth_Service SHALL validate password strength using the existing `validatePasswordStrength` method before creating the user
3. THE Auth_Service SHALL hash the password using bcrypt before storing it in the database
4. THE Signup_Endpoint SHALL exclude the password hash from the response body

### Requirement 12: DB Migration for OTP Column

**User Story:** As a developer, I want the users.otp column widened to support 6-digit OTPs, so that existing OTP flows (admin/company-admin signup) remain compatible.

#### Acceptance Criteria

1. THE database migration SHALL alter the `users.otp` column from `varchar(4)` to `varchar(6)`
2. THE database migration SHALL not drop or modify existing OTP data in the users table

### Requirement 13: Response Format

**User Story:** As a frontend developer, I want the signup response to match the expected format, so that the frontend works without modifications to cookie-setting and navigation logic.

#### Acceptance Criteria

1. THE Signup_Endpoint SHALL return the `user` object with fields: `id`, `email`, `name`, `role`, `is_primary_admin` (set to true), and `workspace_id`
2. THE Signup_Endpoint SHALL return the `workspace` object with fields: `id`, `name`, and `status`
3. THE Signup_Endpoint SHALL return the `token` field as a valid JWT string
4. THE Signup_Endpoint SHALL exclude the user's password hash from the response
