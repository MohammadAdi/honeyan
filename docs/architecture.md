# Honey-an Architecture Overview

## Runtime topology

Honey-an is a modular monolith with two independently deployed processes:

- React 19/Vite frontend in `frontend/`; access tokens exist only in memory and refresh credentials use HttpOnly cookies.
- ASP.NET Core 9 controller-based API in `backend/`; PostgreSQL is the system of record.

```text
Browser -> React/Vite -> ASP.NET Core API -> PostgreSQL
                         |
                         +-> Controllers -> MediatR -> Application handler -> Application port
                                                                  |
                                                                  +-> Infrastructure implementation
```

## Backend layers

| Project | Current responsibility | Dependencies |
| --- | --- | --- |
| `HoneyAn.Domain` | Role constants and refresh-session domain state | None |
| `HoneyAn.Application` | CQRS commands/queries, FluentValidation validators, handlers, results, and ports | Domain |
| `HoneyAn.Infrastructure` | Identity, EF Core, PostgreSQL, JWT/session implementation, migrations, and seeding | Application, Domain |
| `HoneyAn.IOC` | MediatR, validation behavior, authentication, authorization, and infrastructure registration | Application, Infrastructure |
| `HoneyAn.Api` | Versioned controllers, HTTP contracts/mapping, cookies, CSRF, rate limits, and ProblemDetails | Application, IOC |

Dependencies point inward. Controllers never query EF Core, handlers never reference API types, and domain entities are not HTTP contracts.

## Request flow

1. A versioned `[ApiController]` receives and maps the HTTP contract.
2. `ISender` dispatches a command or query.
3. `ValidationBehavior<TRequest,TResponse>` executes all FluentValidation validators.
4. The use-case handler invokes an Application port.
5. Infrastructure performs Identity, token, or PostgreSQL work.
6. The controller explicitly maps the result to an HTTP response.

Authentication is required by the fallback policy. Health, login, and refresh are explicit anonymous exceptions. Errors use ProblemDetails. Login and refresh are rate-limited; refresh/logout validate CSRF and allowed origins.

## Persistence and seeding

`ApplicationDbContext` uses ASP.NET Core Identity tables plus `refresh_sessions`, PostgreSQL snake_case names, UUID keys, and UTC timestamps. Migrations are versioned under `Infrastructure/Persistence/Migrations` and are never applied automatically.

`DatabaseSeeder` is an explicit `--seed` operation. It always ensures `Admin` and `Sales` roles. Initial Admin credentials are accepted only through environment variables; no default user or password exists in source control. Seeding is idempotent and never resets an existing password.

## Current boundary

Sprint 1 implements identity, authentication, authorization, internal user management, and the frontend login gate. Property and CRM persistence starts in Sprint 2; existing CRM screens still use local browser data.
