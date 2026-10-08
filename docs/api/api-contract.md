# API Contract Guidelines — MVP 1 (proposed)

These are contracts for implementation, **not existing endpoints**. Refine payload fields with backend/frontend during Sprint 1.

## Conventions
- Prefix `/api/v1`; JSON camelCase; UTC ISO 8601 timestamps; stable string IDs.
- HTTP: 200 success, 201 created, 204 no content, 400 invalid input, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 429 rate limited, 500 unexpected.
- Use ASP.NET Core ProblemDetails (RFC 7807 / 9457) for errors; include field errors for validation, never leak stack traces or sensitive values.
- Paginated list response: `{ "items": [], "page": 1, "pageSize": 20, "totalCount": 0 }`; enforce maximum page size.
- Authenticate by default with JWT bearer; explicit anonymous exceptions only.

## Sprint 1 endpoints
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | Anonymous | Liveness (no secrets) |
| POST | `/api/v1/auth/login` | Anonymous, rate limited | Credentials → access token + refresh cookie |
| POST | `/api/v1/auth/refresh` | Refresh cookie + CSRF/origin protection | Rotate refresh cookie, issue new access token |
| POST | `/api/v1/auth/logout` | Authenticated | Revoke current refresh session, clear cookie |
| GET | `/api/v1/auth/me` | Authenticated | Current user id, display name, roles |
| GET | `/api/v1/users` | Admin | Paginated internal users |
| POST | `/api/v1/users` | Admin | Create internal user (no public signup) |
| PATCH | `/api/v1/users/{id}/status` | Admin | Enable/disable user |

## Example payloads (illustrative; do not hardcode values)

`POST /api/v1/auth/login`
```json
{ "email": "admin@example.invalid", "password": "<password>" }
```
Response 200:
```json
{ "accessToken": "<jwt>", "tokenType": "Bearer", "expiresIn": 900, "user": { "id": "<id>", "displayName": "Admin", "roles": ["Admin"] } }
```
Refresh token is set only in a Secure/HttpOnly cookie and never returned in JSON. Example `expiresIn` is illustrative, not a finalized token policy.

`POST /api/v1/auth/refresh` responds with the same access-token response shape and rotates the refresh cookie. For refresh/logout, use origin/CSRF protections consistent with cookie settings.

`GET /api/v1/auth/me`:
```json
{ "id": "<id>", "displayName": "Admin", "email": "admin@example.invalid", "roles": ["Admin"], "isActive": true }
```

`POST /api/v1/users` (Admin only):
```json
{ "email": "sales@example.invalid", "displayName": "Sales", "role": "Sales", "initialPassword": "<one-time-secret>" }
```
Provision credentials securely, require a password change before operational use if using an initial password. Never return password hashes or session tokens in user endpoints.

`PATCH /api/v1/users/{id}/status` (Admin only):
```json
{ "isActive": false }
```

## Authorization behavior
- No access token → 401; valid token without required role → 403.
- Invalid credentials → generic 401, no user enumeration.
- Expired/revoked/replayed refresh token → 401, clear refresh cookie and invalidate affected session as applicable.
- Disabling a user revokes refresh sessions and blocks protected API access.
- Never expose owner, buyer, commission or identity secrets through public/anonymous endpoints.

## Later business endpoints (Sprint 2+; do not implement in Sprint 1)
```http
GET    /api/v1/properties?page=1&pageSize=20
GET    /api/v1/properties/{propertyId}
POST   /api/v1/properties
PUT    /api/v1/properties/{propertyId}
POST   /api/v1/properties/{propertyId}/deactivate
POST   /api/v1/properties/{propertyId}/mark-ready-to-market
```
`mark-ready-to-market` must verify marketing permission and agreement server-side. Keep frontend TypeScript DTOs synchronized with implemented API contracts.
