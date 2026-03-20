---
inclusion: auto
---

# Frontend ↔ Backend Data Alignment Rules

All string constants compared against API responses MUST use **lowercase** values. The backend DB stores roles and statuses in lowercase, and JavaScript comparisons are case-sensitive.

## Key values from the API

### User roles (from `user.role`)
- `super_admin`, `admin`, `consultant`, `client`
- Never compare against `CLIENT`, `ADMIN`, etc.

### Contact statuses (from `contact.status`)
- `uninvited`, `invited`, `active`
- Never compare against `Active`, `Invited`, etc.

## Rules
1. In `switch` statements and `if` checks, always use lowercase: `case "client"` not `case "CLIENT"`.
2. When the frontend sends a role or status to the backend, use lowercase.
3. If unsure about casing from an API response, normalize with `.toLowerCase()` before comparing.
4. The `UserType` type in `src/lib/constants.ts` uses uppercase keys (`"ADMIN" | "CLIENT"`) for TypeScript type names — these are NOT the values from the API. The actual API values are lowercase.
