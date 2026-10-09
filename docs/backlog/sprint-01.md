# Sprint 1 — Backend Foundation, Authentication & Frontend Login

## Goal
Create a secure, runnable backoffice foundation in the existing monorepo. **Properties CRUD is Sprint 2**, not Sprint 1. Do not migrate all CRM data yet.

## Scope / work packages

### S1-01 — Backend solution and API baseline
- Create `backend/HoneyAn.sln` with Api, Application, Domain, Infrastructure, IOC and UnitTests/IntegrationTests.
- Follow dependency direction in `docs/architecture/backend.md`.
- Configure DI, typed settings, development OpenAPI, ProblemDetails, logging, CORS allowlist, health endpoint.
- Use controller-based API only (including HealthController); no Minimal API.
- Configure MediatR, FluentValidation, `ValidationBehavior`, feature folders and CQRS conventions; register through IOC.
- Acceptance: solution builds, API starts, `GET /api/v1/health` returns success; no secrets in repository.

### S1-02 — PostgreSQL and EF Core identity persistence
- Add DbContext and migrations in Infrastructure.
- Persist users, roles (Admin/Sales) and refresh sessions/token hashes; choose documented key/naming conventions.
- Prefer ASP.NET Core Identity primitives and standard password hashing rather than custom cryptography.
- Acceptance: migrations create schema in a clean local PostgreSQL database; DB setup documented.

### S1-03 — Authentication lifecycle
- Implement login, refresh (rotation), logout (revocation), current user as MediatR Commands/Queries with three files per use case: request, validator, handler.
- Add HTTP DTOs under `Api/Contracts/Auth`, Application result models under `Application/Features/Auth/Models`, and explicit manual mapping under `Api/Mappings`.
- Access token: short-lived JWT; refresh token: random, hashed in DB, HttpOnly/Secure cookie.
- Revoke refresh sessions when user is disabled; handle expired/replayed tokens safely.
- Provide explicit secure one-time Admin bootstrap using environment/secret-store supplied credentials (never hardcoded).
- Acceptance: valid login works, invalid login fails generically, refresh rotates, logout revokes, disabled user cannot authenticate.

### S1-04 — Authorization and internal user management
- Admin and Sales policies enforced server-side; protected endpoints default to authenticated.
- Implement Users commands/queries with MediatR + FluentValidation, `IUserRepository` in Application and EF implementation in Infrastructure.
- Implement Admin-only list/create/enable-disable users. No public signup.
- Document initial role permissions; defer advanced record-level rules to their respective business modules.
- Acceptance: unauthenticated requests return 401; authenticated users without permission receive 403; Sales cannot manage users.

### S1-05 — Existing frontend login integration
- Preserve React/Vite UI and existing module screens.
- Add login view, auth state, protected navigation, `me` loading, logout and typed auth API client.
- Keep access token in memory; refresh via credentials-included cookie with CSRF/SameSite configuration appropriate to deployment.
- On auth failure, show login instead of exposing backoffice; menu hiding does not replace API authorization.
- Acceptance: Admin/Sales can login, refresh and logout in browser; unauthenticated user cannot enter protected views; session expiry handled.

### S1-06 — Automated tests and developer setup
- Add unit and integration tests for CQRS handlers, validators, mapping, repository behavior, token lifecycle, role restrictions, session revocation and error responses.
- Add safe sample configuration, migration commands, local run instructions, and test commands.
- Acceptance: build and tests pass in configured environment; record actual verification and any external dependency not available.

## API scope
- `GET /api/v1/health` (anonymous)
- `POST /api/v1/auth/login` (anonymous)
- `POST /api/v1/auth/refresh` (anonymous endpoint with refresh cookie + CSRF/origin protection)
- `POST /api/v1/auth/logout` (authenticated; revoke current refresh session)
- `GET /api/v1/auth/me` (authenticated)
- `GET /api/v1/users`, `POST /api/v1/users`, `PATCH /api/v1/users/{id}/status` (Admin only)

## Out of scope
- Properties CRUD and other business modules (Sprint 2 onward).
- Buyer website, affiliate portal, self-service registration, social login, password reset email flow, multi-tenancy, fine-grained dynamic permission editor.
- Production-ready marketing content generation; existing generator contains unverified fallback claims and must not be used for real advertising.

## Execution order for Codex
1. S1-01 (build and health)
2. S1-02 (identity persistence/migrations)
3. S1-03 (auth lifecycle and security tests)
4. S1-04 (authorization/user management)
5. S1-05 (frontend integration)
6. S1-06 (end-to-end checks and documentation)

Keep PRs small and report build/test results. Do not claim completion without running relevant checks.
