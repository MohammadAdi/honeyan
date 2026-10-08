# Honey-an Backend Architecture

## Project structure

- `HoneyAn.Domain` contains enterprise rules and domain types. It has no project dependencies.
- `HoneyAn.Application` contains use cases and application contracts. It depends only on Domain.
- `HoneyAn.Infrastructure` implements persistence and external integrations. It depends on Application and Domain.
- `HoneyAn.IOC` is the composition registration layer. It depends on Application and Infrastructure.
- `HoneyAn.Api` is the HTTP host. It depends on Application and IOC and does not reference Infrastructure directly.

Sprint 1 adds only identity and refresh-session persistence. Property and CRM business features remain deferred. New dependencies must point inward; Domain and Application must not depend on infrastructure or ASP.NET Core.

## API conventions

Errors use ProblemDetails and never expose stack traces. Authentication is required by the fallback policy; `/api/v1/health`, login, and refresh are explicit anonymous exceptions. Access tokens are short-lived JWTs. Opaque refresh tokens are hashed in PostgreSQL, rotated on use, and transported only in HttpOnly cookies.

## Frontend observation

At foundation time, the checked-in frontend is React 19 with Vite and Express, not a Next.js project. Its UI source was preserved without modification. If a TailAdmin Pro Next.js source tree is expected, it must be supplied or identified before any framework migration.
