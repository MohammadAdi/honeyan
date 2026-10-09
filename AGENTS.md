# Honey-an — Codex Development Instructions

## Mission
Build Honey-an MVP 1 as an **internal property marketing and lead conversion backoffice** for Indonesia. Target soft launch: January 2027. Optimize for listing acquisition, permission to market, lead conversion, closing, and commission tracking. Public buyer website and affiliate portal are **MVP 2**, not MVP 1.

## Read before implementation
1. `docs/product/product-context.md`
2. `docs/product/business-rules.md`
3. `docs/product/mvp-scope.md`
4. `docs/architecture/backend.md` and `frontend.md`
5. `docs/api/api-contract.md`
6. Relevant sprint backlog.

## Repository and stack
- Monorepo: existing `frontend/` and future `backend/`.
- Existing frontend is React 19, Vite, TypeScript, Tailwind CSS. **Do not assume Next.js or TailAdmin is installed.** Preserve current layout/components unless task explicitly authorizes change.
- Backend target: ASP.NET Core Web API, EF Core, PostgreSQL; modular monolith with Domain, Application, Infrastructure, API and IOC projects.
- Keep business rules, authorization, and validation authoritative on backend. Frontend is a client.
- REQUIRED: controller-based ASP.NET Core Web API with `[ApiController]`; do not use Minimal APIs or `MapGet`/`MapPost` for business endpoints.
- REQUIRED: CQRS with MediatR and FluentValidation, feature-first organization, repository pattern, and manual mapping. No AutoMapper.
- Every use case lives in `Application/Features/{Feature}/Commands/{UseCase}` or `Queries/{UseCase}` and has exactly three primary files: `{UseCase}Command|Query.cs`, `{UseCase}Command|QueryValidator.cs`, `{UseCase}Command|QueryHandler.cs`.
- Register MediatR handlers and FluentValidation validators through IOC; use an Application `ValidationBehavior<TRequest,TResponse>` pipeline.
- HTTP request/response contracts belong in `Api/Contracts/{Feature}/Requests|Responses` when HTTP-specific. Application command/query and use-case result models belong in Application; Domain entities never serve as API contracts.
- Do not create a generic `Application/Contracts` bucket or duplicate command data in intermediary request DTOs. Put feature results in `Application/Features/{Feature}/Models`, shared application-only models in `Application/Common/Models`, and prefer explicit port parameters when a port is used by one use case.
- Application abstractions must never accept or return API contracts. Controllers map API contracts to commands/queries and map Application results back to API response contracts.
- HTTP contract-to-command and result-to-HTTP response mapping belongs in `Api/Mappings/{Feature}Mapper.cs`. Domain-to-application-result mapping may live in `Application/Features/{Feature}/Mappings`; mapping must be explicit and side-effect-free.
- Repository interfaces live in `Application/Abstractions/Persistence`; EF Core implementations live in `Infrastructure/Persistence/Repositories`. Handlers depend on interfaces, not DbContext or EF types.
- Avoid speculative generic repositories, unnecessary abstraction layers, brokers, and microservices.

## Authentication and authorization — Sprint 1 mandatory
- All backoffice API endpoints require authentication by default; explicitly allow anonymous only for login, refresh and health where appropriate.
- MVP 1 roles are `Admin` and `Sales`; no public registration, buyer accounts or affiliate login.
- Backend must enforce role policies and resource-level access; frontend menu visibility is never a security boundary.
- Store passwords using an established adaptive password hasher (prefer ASP.NET Core Identity); never store plaintext passwords.
- Use short-lived JWT access tokens with issuer, audience, signing key, expiry and algorithm validation.
- Refresh tokens must be cryptographically random, hashed at rest, rotated on use, revoked on logout and account disablement, and never returned in JSON or logged.
- For browser sessions, use Secure + HttpOnly refresh cookies; configure SameSite, CORS credentials and CSRF defenses based on deployment origins. Keep access tokens in memory, not localStorage.
- Rate-limit login/refresh, use generic invalid-login errors, avoid user enumeration and redact secrets/PII from logs.
- Provision the first Admin via explicit secure bootstrap, not hardcoded credentials or a public registration endpoint.
- Include automated tests for login, refresh rotation/replay, logout, invalid/expired tokens, disabled users, 401/403 and role policies.

## Safety and integrity
- Never invent property price, availability, address, facilities, legal/certificate facts, commission terms, or KPR approval. Unknown means unknown; do not substitute defaults presented as facts.
- Marketplace imports start as `Prospect`. Publishing requires verified owner/agent permission and valid marketing agreement/authorization.
- Restrict access to owner contact details, buyer PII, agreements and commissions. Never expose secrets in frontend or logs.
- Preserve property → content → campaign → channel → lead attribution where available; record manual source when not.
- Do not silently change existing data or overwrite attribution.

## Workflow
- Work one vertical slice per task; inspect existing code first.
- Before editing, summarize impacted files, rules and acceptance criteria.
- Implement tests for meaningful business rules and API behavior; run available build/tests and report results honestly.
- Avoid unrelated refactors, UI redesigns, speculative abstractions, and premature MVP 2 work.
- Never commit secrets, `.env` values, local DB files, or production data.
- Document schema changes and migration commands. Do not execute destructive database operations without approval.
- Use feature branches and pull requests; do not merge to `main` automatically.

## Known current-state gaps
- Existing frontend currently uses localStorage/mock data for CRM records; backend integration is future work.
- Existing `frontend/server.ts` marketing content generator includes fabricated defaults and claims. **Do not use generated copy for real publishing until this is corrected and reviewed against verified stored facts.**
