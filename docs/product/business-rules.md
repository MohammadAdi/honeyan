# Business Rules — MVP 1

## Property acquisition
- Statuses: `Prospect`, `Owner Contacted`, `Agreement Pending`, `Ready to Market`, `Published`, `Reserved`, `Sold`, `Inactive`.
- Marketplace-sourced listings normally start as `Prospect`; sourcing a listing does not confer permission to market it.
- Record original source, URL/ID if available, owner/agent association, last verification, and factual listing data.
- `Ready to Market` requires documented permission to market, verified responsible owner/agent, and valid agreed commission terms; an active agreement is the normal mechanism. Do not infer approval from mere contact.
- `Published` requires `Ready to Market` eligibility at time of publication; if authorization expires, block new publication and flag existing posts for review.
- Store unknown fields as missing; no fabricated certificate status, facilities, pricing or availability.

## Contacts and agreements
- Contacts: Owner or Agent, WhatsApp/phone, notes and communication history.
- Agreement statuses: `Draft`, `Waiting Approval`, `Active`, `Expired`, `Closed`.
- Agreement: property, party, date, expiry, commission type (`Percentage`/`Fixed`), value, lead-protection days, document reference, notes.
- Only authorized internal roles may activate or change an agreement; retain audit history for material changes.
- Commission calculation must use the applicable agreed terms, not AI-generated text.

## Marketing and attribution
- Multiple marketing contents/angles may belong to one property.
- Initial channels: Facebook Page and Instagram. Manual publishing records are sufficient for MVP 1.
- Record property → content → campaign → channel → lead association where possible; preserve original lead source, plus later interactions separately.
- AI-generated copy is a draft requiring factual validation and human approval. Do not claim KPR approval or legal verification without trusted records.

## Leads and buyer requirements
- Pipeline: `New` → `Contacted` → `Qualified` → `Property Suggested` → `Site Visit` → `Negotiation` → `Booking` → `Closed Won` / `Closed Lost`.
- Temperature: `Hot`, `Warm`, `Cold`.
- A buyer may be associated with multiple interested/suggested properties; original lead property/source must remain traceable.
- Capture name, WhatsApp, source, assigned sales, budget range, location, type, bedrooms, land size, payment method, purpose, timeline and notes when provided. Missing qualification fields must remain missing.
- Matching initially deterministic: budget, location, type, bedrooms, land size and payment compatibility; explain matched/unmatched criteria.

## Conversion and commission
- Record follow-up owner, due date, outcome; site visit property, buyer, schedule and result.
- Booking and closing reference buyer/lead and property; record final selling price only from confirmed transaction data.
- Commission statuses: `Potential`, `Earned`, `Invoiced`, `Paid`. Payment status must not advance without corresponding business evidence/authorization.
- Preserve transaction and commission history for audit; avoid silent recalculation after agreement changes.

## Access and data protection
- Admin and Sales roles for MVP 1; restrict sensitive data by role and ownership where applicable.
- Backend enforces access; frontend visibility is not a security boundary.
- Log meaningful changes without logging secrets or full sensitive message contents unnecessarily.
