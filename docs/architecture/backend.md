# Backend Architecture — MVP 1 (Foundation v3)

## Mandatory stack and style
- ASP.NET Core **Controller-based Web API** (`ControllerBase`, `[ApiController]`, attribute routing). **No Minimal API** for business endpoints.
- Clean/Onion Architecture, modular monolith, PostgreSQL, EF Core.
- **CQRS using MediatR**, **FluentValidation** through MediatR pipeline behavior, **Repository Pattern**, **manual mapping** (no AutoMapper).
- Use `CancellationToken` through controller → MediatR → repository.
- Use explicit feature-specific repositories where needed; avoid a speculative generic repository for every entity.

## Target structure
```text
backend/
├── HoneyAn.sln
├── src/
│   ├── HoneyAn.Api/
│   │   ├── Controllers/V1/
│   │   │   ├── AuthController.cs
│   │   │   ├── UsersController.cs
│   │   │   └── HealthController.cs
│   │   ├── Contracts/
│   │   │   ├── Auth/
│   │   │   │   ├── Requests/LoginRequest.cs
│   │   │   │   └── Responses/LoginResponse.cs
│   │   │   └── Users/
│   │   │       ├── Requests/CreateUserRequest.cs
│   │   │       └── Responses/UserResponse.cs
│   │   ├── Mappings/
│   │   │   ├── AuthMapper.cs
│   │   │   └── UserMapper.cs
│   │   ├── Middlewares/
│   │   ├── Extensions/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── HoneyAn.Application/
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── Login/
│   │   │   │   │   │   ├── LoginCommand.cs
│   │   │   │   │   │   ├── LoginCommandValidator.cs
│   │   │   │   │   │   └── LoginCommandHandler.cs
│   │   │   │   │   ├── RefreshToken/
│   │   │   │   │   │   ├── RefreshTokenCommand.cs
│   │   │   │   │   │   ├── RefreshTokenCommandValidator.cs
│   │   │   │   │   │   └── RefreshTokenCommandHandler.cs
│   │   │   │   │   └── Logout/
│   │   │   │   │       ├── LogoutCommand.cs
│   │   │   │   │       ├── LogoutCommandValidator.cs
│   │   │   │   │       └── LogoutCommandHandler.cs
│   │   │   │   ├── Queries/GetCurrentUser/
│   │   │   │   │   ├── GetCurrentUserQuery.cs
│   │   │   │   │   ├── GetCurrentUserQueryValidator.cs
│   │   │   │   │   └── GetCurrentUserQueryHandler.cs
│   │   │   │   └── Models/
│   │   │   │       ├── AuthResult.cs
│   │   │   │       └── CurrentUserResult.cs
│   │   │   └── Users/
│   │   │       ├── Commands/
│   │   │       │   ├── CreateUser/
│   │   │       │   └── UpdateUserStatus/
│   │   │       ├── Queries/
│   │   │       │   ├── GetUsers/
│   │   │       │   └── GetUserById/
│   │   │       ├── Models/
│   │   │       └── Mappings/UserMapper.cs
│   │   ├── Abstractions/
│   │   │   ├── Persistence/
│   │   │   │   ├── IUserRepository.cs
│   │   │   │   └── IRefreshTokenRepository.cs
│   │   │   └── Authentication/
│   │   │       ├── ITokenService.cs
│   │   │       └── ICurrentUserService.cs
│   │   └── Common/
│   │       ├── Behaviors/ValidationBehavior.cs
│   │       ├── Models/
│   │       └── Exceptions/
│   ├── HoneyAn.Domain/
│   │   ├── Entities/
│   │   ├── Enums/
│   │   └── ValueObjects/
│   ├── HoneyAn.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── HoneyAnDbContext.cs
│   │   │   ├── Configurations/
│   │   │   ├── Repositories/
│   │   │   └── Migrations/
│   │   └── Authentication/
│   └── HoneyAn.IOC/
│       └── DependencyInjection.cs
└── tests/
    ├── HoneyAn.UnitTests/
    └── HoneyAn.IntegrationTests/
```
`Users` and later business-feature folder examples are templates: implement only sprint-approved use cases. Each concrete use case uses the same three-file pattern.

## Responsibilities
| Layer | Owns | Must not do |
|---|---|---|
| API | Controllers, HTTP contracts, HTTP mapping, authentication middleware, status codes | Business rules or EF queries |
| Application | MediatR commands/queries, validators, handlers, use-case results, repository/service interfaces | Reference API, EF Core or Infrastructure |
| Domain | Entities, invariants, domain rules | Reference other project layers |
| Infrastructure | EF Core, repositories, JWT/password infrastructure, provider adapters | Own business use cases |
| IOC | DI registration for MediatR, validators, repositories and services | Own business logic |

Project references: Domain → none; Application → Domain; Infrastructure → Application + Domain; IOC → Application + Infrastructure; API → Application + IOC.

## Request, response and mapping rules
1. `Api/Contracts/{Feature}/Requests/{Action}Request.cs` is the external HTTP request DTO.
2. `Application/Features/{Feature}/Commands/{UseCase}/{UseCase}Command.cs` or `Queries/...Query.cs` implements `IRequest<TResult>` and is the internal use-case request.
3. `Application/Features/{Feature}/Models/{Name}Result.cs` is the use-case result; it must not depend on HTTP.
4. `Api/Contracts/{Feature}/Responses/{Action}Response.cs` is the HTTP response DTO if a separate wire contract is useful.
5. `Api/Mappings/{Feature}Mapper.cs` maps HTTP request → command/query and application result → HTTP response. Use explicit static methods.
6. If entity → application result mapping is shared/complex, put it under `Application/Features/{Feature}/Mappings`; otherwise inline simple projection in the handler. No mapping that queries databases, generates facts or mutates domain invariants.
7. Do not create a generic `Application/Contracts` folder. Feature result models belong in `Application/Features/{Feature}/Models`; reusable application-only wrappers such as pagination belong in `Application/Common/Models`.
8. Application ports must use Domain/Application types or explicit parameters. They must never reference API DTOs, and should not introduce request-shaped records that merely duplicate a command or query.
9. API response contracts remain API-owned even when their current fields match an Application result. This keeps serialization, versioning and HTTP evolution outside Application. Never expose Domain entities directly.

The similarly shaped API response and Application result types are intentional boundary models, not competing contracts. An Application result describes a use-case outcome; an API response describes the public wire format. Mapping between them is explicit in the API layer.

## CQRS and validation rules
- Commands change state; queries read state without changing state. Authentication login/refresh/logout are commands due to session/token side effects.
- Three files per use case: `XCommand.cs`, `XCommandValidator.cs`, `XCommandHandler.cs` (or Query equivalents).
- Validator may have no rules if validation is not applicable; keep the file to preserve convention, but do not add meaningless rules.
- `ValidationBehavior<TRequest,TResponse>` executes all registered `IValidator<TRequest>` before handlers. Invalid input maps to HTTP 400 with structured validation details.
- Handlers orchestrate domain behavior and ports; repositories encapsulate persistence. Avoid EF Core access from handlers.
- For query-heavy reads, use dedicated read repository/projection interfaces; CQRS does **not** require separate databases.
- Controller sends commands/queries using `ISender.Send(request, cancellationToken)`; no domain logic in controller.

## Authentication and authorization — Sprint 1
- `Admin` and `Sales`; no public signup. Admin-only user management.
- Prefer ASP.NET Core Identity password hashing/user storage. Do not implement password cryptography yourself.
- JWT bearer access token short-lived; validate signature, issuer, audience, expiry, allowed algorithm.
- Refresh token: cryptographically random, hash at rest, rotate on use, detect replay, revoke on logout and account disablement.
- Browser refresh cookie: Secure, HttpOnly, appropriate SameSite and CSRF protection. Access token stays in memory.
- All backoffice endpoints authenticated by default; explicitly anonymous login/refresh/health. Enforce 401/403 server-side.
- Rate-limit login/refresh, redact secrets, use secure initial Admin bootstrap.
- Verify MediatR package version/license compatibility before pinning; do not silently add a paid dependency.

## Persistence, API and quality
- PostgreSQL `snake_case` columns and UTC timestamps; migrations versioned in Infrastructure.
- ProblemDetails for errors, camelCase JSON, structured redacted logs, environment-based secrets, strict CORS.
- Tests cover handlers, validators, mapping, repository behavior and API authorization.
- Sprint 1 builds foundation, Auth/Users and frontend login; Properties starts Sprint 2.

## Implemented Sprint 1 structure

The repository now follows the target flow for every Sprint 1 endpoint:

```text
Api/Controllers/V1
  -> Api/Contracts + Api/Mappings
  -> Application/Features/{Auth|Users}/{Commands|Queries}/{UseCase}
  -> ValidationBehavior
  -> use-case Handler
  -> Application identity/persistence port
  -> Infrastructure Identity/EF implementation
```

MediatR is pinned to the Apache-2.0 licensed 12.x line. FluentValidation validators are discovered from the Application assembly. Both registrations and the validation pipeline are centralized in `HoneyAn.IOC`.

Database initialization is deliberately separate from API startup. `Infrastructure/Persistence/Seeding/DatabaseSeeder` ensures the fixed roles and optionally provisions an Admin from secret-backed environment variables when the API is invoked with `--seed`. It is idempotent, does not contain default credentials, and does not update existing passwords.
