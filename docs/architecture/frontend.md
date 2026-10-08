# Frontend Architecture — Existing React + Vite

## Current repository state
`frontend/` uses React 19, Vite 8, TypeScript, Tailwind CSS 4, Lucide and an Express Gemini endpoint. It is **not** Next.js/TailAdmin. Preserve existing layout, navigation and responsive components.

CRM data currently lives in `src/App.tsx`, `src/services/storage.ts` and `src/services/mockData.ts` using localStorage. Matching logic also resides in frontend. `frontend/server.ts` contains marketing AI defaults/fallbacks that can invent property facts: do not publish generated content until corrected.

## Sprint 1 authentication integration
- Add login page/view using existing visual patterns; no public signup or affiliate login.
- Add a small auth API client and shared auth state/context, without unnecessary packages.
- On app initialization call `/api/v1/auth/me`; if access token has expired, attempt refresh using cookie and retry once.
- Hold access token in memory, not localStorage/sessionStorage. Refresh token must never be readable from JavaScript.
- Add protected navigation/routes and unauthorized/forbidden/session-expired handling. Current `App.tsx` uses custom navigation; adapt it carefully rather than imposing a new routing library without need.
- Use `Authorization: Bearer <accessToken>` for protected API calls; use `credentials: include` only when required for refresh/logout cookie operations.
- Account for CSRF and CORS with deployment-specific origin/cookie policy. A hidden menu is not an authorization control.
- Handle loading, invalid credentials, disabled account, 401/403, network errors and logout cleanly.
- Avoid modifying existing CRM screens beyond the minimum needed to gate access.

## Later integrations
From Sprint 2, migrate one module at a time from localStorage to backend API; Properties first. Backend/database becomes the source of truth. Do not silently fall back to mock data for production writes or move business validation into frontend.
