# MVP Scope and Release Gates

## MVP 1 — Internal backoffice (January 2027 target)
**P0:** internal authentication (login/refresh/logout), Admin/Sales role authorization, Admin-only user management, secure first-Admin provisioning; properties; owners/agents; agreements and marketing permission; content drafts; manual publishing records; lead intake and pipeline; buyer requirements; follow-ups; site visits; booking/closing; commission tracking.

**P1 (only if P0 stable):** dashboard KPIs, deterministic property matching UI, basic campaign reporting and analytics.

**Operational shortcuts:** manual Facebook/Instagram posting, manual WhatsApp lead entry, simple role model, human approval of AI content, basic commission workflow.

## Sprint 1 security baseline
- All internal routes and APIs require login, except explicit anonymous endpoints.
- Admin manages internal accounts; Sales uses assigned operational modules. No self-registration.
- Short-lived access tokens, revocable/rotating refresh sessions, secure password storage, login rate limits and tests are required.
- Frontend login integration belongs to Sprint 1; Properties CRUD starts in Sprint 2.

## Explicitly deferred to MVP 2
- Public buyer property search and property detail website
- Affiliate registration, portal, referral link and affiliate revenue sharing
- Public buyer account system

## Deferred beyond launch unless validated
- Automated Meta publishing, WhatsApp provider integration/chatbot, complex AI matching, payment gateway, elaborate workflow engines and multi-tenant architecture.

## MVP 1 acceptance / launch gate
1. Authorized staff can log in and access appropriate modules.
2. Prospect listing and owner contact can be created and maintained in PostgreSQL.
3. Permission/agreement is required before marking a listing market-ready or recording publication.
4. Marketing content and Facebook/Instagram post URLs can be tracked.
5. WhatsApp-originated leads can be entered and attributed to a source/property where known.
6. Buyer can move through qualification, follow-up, visit, booking and closing.
7. Earned/invoiced/paid commission is traceable to agreement and closing.
8. API validation, permissions, tests, backups, deployment and operational monitoring are verified.
