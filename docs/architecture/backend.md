# Backend Architecture — MVP 1

## Runtime and layout
ASP.NET Core Web API, EF Core, PostgreSQL. Modular monolith; no microservices or message broker for MVP 1. Use a supported stable .NET version verified against deployment environment.

```text
backend/
  HoneyAn.sln
  src/
    HoneyAn.Api/
    HoneyAn.Application/
    HoneyAn.Domain/
    HoneyAn.Infrastructure/
    HoneyAn.IOC/
  tests/
    HoneyAn.UnitTests/
    HoneyAn.IntegrationTests/
```

## Dependency rules
- Domain: no project dependencies.
- Application → Domain.
- Infrastructure → Application, Domain.
- IOC → Application, Infrastructure.
- API → Application, IOC.

Domain owns invariants; Application owns use cases and ports; Infrastructure owns EF Core, identity persistence and provider adapters; IOC composes dependencies; API owns HTTP, authentication middleware and policies. Do not put business rules in controllers.

## Identity and security (Sprint 1)
- Roles: `Admin`, `Sales`. No public registration. Internal Admin creates users.
- Prefer ASP.NET Core Identity for user management/password hashing and EF Core storage; avoid writing custom password hashing.
- Authentication: short-lived signed JWT bearer access token; validate signature, issuer, audience, expiry and permitted algorithms. Do not put sensitive PII in claims.
- Refresh sessions: cryptographically random opaque refresh tokens, hash stored in PostgreSQL with user/session identifiers, expiry, revoked/replaced timestamps. Rotate on every successful refresh; detect replay and revoke the affected session/token family.
- Browser transport: refresh token only in Secure, HttpOnly cookie; choose SameSite policy based on actual frontend/API origin layout. For cross-site cookies, use SameSite=None + Secure, strict CORS origin allowlist with credentials, and CSRF protection (origin checks plus anti-CSRF mechanism) on cookie-authenticated mutations. Never use wildcard origin with credentials.
- Access tokens are held in browser memory (not localStorage). Frontend calls protected endpoints with bearer token; refresh uses credentials-included request. Decide cookie path/domain in environment-specific config.
- Login throttling and generic invalid credentials errors. Do not log passwords, access/refresh tokens, cookie values or user PII.
- Bootstrap initial Admin through explicit CLI/one-time secure initialization requiring secret input, not public API or default password. No auto-bootstrap in production startup.
- Disable user: invalidate outstanding refresh sessions and ensure disabled users cannot access APIs even if an access token remains valid (via server-side status validation or equivalent revocation mechanism).
- Authorization: require authenticated user globally, explicitly opt out for login, refresh and health; Admin-only user management. Future business modules add resource-specific policies/ownership checks.

## Persistence and API standards
- Choose a consistent key strategy; PostgreSQL `snake_case` columns; UTC timestamps.
- EF Core migrations in Infrastructure, versioned in Git. Do not automatically run destructive migrations in production.
- Error handling via ProblemDetails; JSON camelCase; structured logs with sensitive values redacted.
- Environment-based configuration, secret manager/environment variables, strict CORS allowlist, rate limiting.
- Provider-neutral interfaces for future publishing, WhatsApp, AI, and storage only as required.
- Avoid mandatory MediatR/CQRS, AutoMapper, custom identity crypto or speculative tables.

## Sprint sequencing
- Sprint 1: solution, identity persistence, auth lifecycle, authorization, frontend login, tests.
- Sprint 2: Properties vertical slice from PostgreSQL through API to existing frontend, with owner/source/status validation.
