# Imbewenhle Digital Solutions Hub

## Product Requirements Document

**Version:** 1.1  
**Product:** Imbewenhle Digital Solutions Hub — MVP 1.0  
**Organisation:** Imbewenhle Technologies  
**Status:** Proposed; subject to stakeholder validation  
**Prepared:** 28 October 2026  
**Design project:** [Imbewenhle Digital Solutions Hub on Stitch](https://stitch.withgoogle.com/projects/7278328502339602161)

> Version 1.1 is the 28 October 2026 MVP 1.0 baseline together with the recommended decisions recorded in Section 18 of the implementation plan. Those decisions remain subject to human confirmation before implementation.

## Product principle

Start with a demonstrable client problem, define observable outcomes, and build only the smallest coherent product scope that can test the value proposition.

## 1. Purpose and control

This PRD defines proposed behaviour, boundaries, and acceptance conditions for the Imbewenhle Digital Solutions Hub MVP. It is a baseline for design, implementation, testing, and review—not approval to build every future capability.

- **Product owner:** Imbewenhle Technologies
- **Primary users:** Prospective and existing business clients, consultants, and administrators
- **Status:** Proposed, requiring stakeholder validation

## 2. Product summary

The Hub is a client-facing web application for businesses to describe technology needs, submit service enquiries, follow engagement status, and access agreed project information. Internal staff use a protected workspace to review enquiries, request clarification, record proposals, and coordinate delivery.

## 3. Problem statement

Small and medium-sized organisations may struggle to identify appropriate technology responses and coordinate work across fragmented communication channels. Enquiries, requirements, decisions, project updates, and support requests can become difficult to trace. The Hub aims to create a consistent engagement record from initial enquiry through proposal and delivery.

## 4. Goals and non-goals

### Goals

- Standardise service enquiry intake and capture actionable requirements.
- Improve client visibility into enquiry status.
- Trace client communication and decisions.
- Support hand-off from enquiry to delivery.

### Non-goals for the MVP

- Executing automation jobs or performing migrations inside the application.
- A full project-management suite.
- Billing or payment processing.
- Marketplace matching or autonomous AI recommendations.
- Native mobile applications.

## 5. Target users

- **Prospective client:** A business owner or manager who knows the problem but may not know the appropriate technology.
- **Existing client:** A client who needs to review an enquiry, provide information, or consult agreed project details.
- **Consultant:** A staff member who qualifies enquiries, clarifies requirements, prepares proposals, and coordinates work.
- **Administrator:** An authorised staff member who manages access, service categories, and configuration.

## 6. User stories

1. As a prospective client, I want to submit a structured service enquiry so Imbewenhle can understand my problem and respond with relevant next steps.
2. As a client, I want to see my enquiry status so I know whether action is required from me.
3. As a consultant, I want to classify and review enquiries so requests are triaged consistently.
4. As a consultant, I want to record clarification requests and decisions so the engagement history is traceable.
5. As an administrator, I want to manage service categories and access so the platform remains controlled.

## 7. Functional requirements

- **FR-01 — Service catalogue:** Show six categories: Digital & IT Advisory; Automation; Systems Integration; Migration; Systems & Software Development; and Technical Solutions & Support. Each has a title, description, and enquiry action.
- **FR-02 — Enquiry submission:** Capture name, organisation, email, category, problem description, desired outcome, urgency, and optional budget range. Mark required fields and validate before submission.
- **FR-03 — Confirmation:** After successful submission, show a unique reference ID. On failure, preserve entered values and state that the request was not submitted.
- **FR-04 — Status:** Support New, Under Review, Awaiting Client, Proposal Prepared, Accepted, In Delivery, Completed, and Closed. Only authorised staff can change status; record actor and timestamp.
- **FR-05 — Staff queue:** Authorised staff can view, search, filter, and open enquiries. Minimum filters are status, category, and submission date.
- **FR-06 — Updates:** Authorised staff can add client-visible updates. Internal notes must be distinguished and never shown to clients. Clients may reply only while an enquiry is Awaiting Client.
- **FR-07 — Proposal record:** Record title, scope, deliverables, assumptions, exclusions, estimated timeline, and decision status. E-signature and payment are out of scope.
- **FR-08 — Milestones:** Accepted engagements can have named milestones, target dates, status, and description. Clients can view their own engagement milestones.
- **FR-09 — Access control:** Users access only records allowed by role and relationship. Protected operations require authentication.
- **FR-10 — Audit history:** Record material status, proposal, and milestone changes with actor and timestamp.
- **FR-11 — Administration:** Administrators manage service categories and user roles. Consultants and clients cannot perform these operations.

## 8. Business rules and validation

- Every enquiry receives a unique, non-guessable public reference.
- Problem descriptions contain 30–3,000 characters.
- Email must pass format validation; this does not prove that the address exists.
- Clients can access only their own enquiries and associated client-visible records.
- Internal notes are private and excluded from client-facing API responses.
- Only authorised staff can change status, edit proposals, or create milestones.
- Show submission success only after the server confirms persistence.
- Enforce submission idempotency so repeated submissions do not silently create duplicates.
- Enforce a limit of five submissions per email in a rolling hour in the database; do not store IP addresses. CAPTCHA is deferred.

### 8.1 Enquiry form fields

Name, organisation, email, category, problem description, desired outcome, and urgency are required. Budget range is optional.

- Name: 2–100 characters
- Organisation: 2–150 characters
- Email: at most 254 characters
- Desired outcome: 10–1,000 characters
- Update: 1–2,000 characters
- Proposal text fields: 1–5,000 characters
- Proposal title: 3–150 characters
- Proposal timeline: 1–200 characters
- Milestone name: 3–120 characters
- Milestone description: at most 1,000 characters
- Urgency: Low, Medium, or High
- Budget range: Under R50 000; R50 000–R150 000; R150 000–R500 000; Over R500 000; or Not sure yet

### 8.2 Status transitions and engagement records

The supported statuses are New, Under Review, Awaiting Client, Proposal Prepared, Accepted, In Delivery, Completed, and Closed. Accepted requires an accepted proposal; Closed is terminal. Milestone statuses are Planned, In progress, and Completed.

There is one editable proposal per enquiry. Proposal decisions are Draft, Shared with client, Accepted, and Declined. Staff record the client's decision; clients see non-draft proposals read-only.

## 9. UX and screen requirements

- **Public landing:** Value proposition, services, process overview, and enquiry action.
- **Service enquiry:** Selected category, form labels, validation, privacy explanation, and submit state.
- **Confirmation:** Reference ID, next steps, and return link.
- **Sign in:** Email magic-link authentication.
- **Client dashboard and detail:** The client's own enquiries, status, latest update, proposal summary, and milestones.
- **Staff queue and detail:** Queue, filters, enquiry details, internal notes, client updates, status, proposal, and milestone controls.
- **Administration:** Service category management and user/role management.
- **Privacy notice:** Static `/privacy` page based on `content/privacy.md`, written and approved by Imbewenhle before release.

See [the Stitch design project](https://stitch.withgoogle.com/projects/7278328502339602161) and the [designs directory](./designs/). The implementation plan lists the screen exports and their expected filenames.

## 10. Non-functional requirements

- **Security:** Server-side authorisation for every protected resource, server-side validation, secure authentication, and no secrets in source control.
- **Privacy:** Minimise collection, explain use, define retention and deletion before production, and comply with applicable South African privacy obligations, including POPIA where applicable.
- **Accessibility:** Labelled forms, keyboard operation, visible focus, and readable errors; target WCAG 2.2 AA.
- **Reliability:** Failed requests show recoverable errors; repeated submissions must not silently create duplicates.
- **Performance:** Primary pages usable within three seconds at the 75th percentile on representative broadband during acceptance testing.
- **Maintainability:** Consistent conventions, documented environment configuration, automated tests, and repeatable deployment.

## 11. Conceptual data model

- **User:** id, name, email, role, organisation, created_at.
- **Enquiry:** id, public_reference, requester_id, requester_name, requester_email, organisation, category, problem_description, desired_outcome, urgency, budget_range, status, idempotency_key, created_at, updated_at.
- **Update:** id, enquiry_id, author_id, visibility, body, created_at.
- **Proposal:** id, enquiry_id, title, scope, deliverables, assumptions, exclusions, estimated_timeline, decision_status, created_at, updated_at.
- **Milestone:** id, enquiry_id, name, description, target_date, status, created_at, updated_at.
- **Audit event:** id, actor_id, entity_type, entity_id, action, details, timestamp.
- **Service category:** managed category details, including title, description, and active state.

## 12. Analytics and success metrics

- Enquiry completion rate = successful submissions / started forms; establish a pilot baseline.
- Triage time = submission to first staff review; report median and 90th percentile. The target for first staff review is within two business days.
- Status coverage = active enquiries with a current status and an update within the agreed interval.
- Task success = test participants who submit an enquiry without moderator intervention.
- Operational quality = duplicate/failed submissions, unauthorised-access test failures, and defects by severity.

Measure metrics with SQL queries; an in-app analytics dashboard is deferred.

## 13. Dependencies, assumptions, and risks

**Assumptions:** Staff initially qualify and deliver services manually; the MVP is a responsive web application; proposals can be managed without integrated billing.

**Dependencies:** Hosting, domain, authentication, database, service content, privacy notice, and an assigned enquiry owner.

**Risks:** Broad scope, client expectations beyond the MVP, sensitive business information, and stale status data. Mitigate through scope control, clear expectations, least-privilege access, and assigned operational ownership.

## 14. Acceptance criteria and release gate

- A valid enquiry persists and returns a unique reference only after server confirmation.
- Invalid required fields show specific messages and prevent submission.
- Client A cannot access Client B's records by changing URL or API identifiers.
- Internal notes never appear in client-facing screens or API responses.
- Authorised staff can filter enquiries, update status, and view audit history.
- Proposal and milestone records are visible only to authorised users.
- Automated tests cover validation, authorisation, status transitions, and the main enquiry flow.
- No unresolved critical/high-severity security defects remain at release approval.

## 15. Confirmed planning decisions

The following recommended decisions are incorporated in this v1.1 baseline and require human confirmation before implementation:

1. Use Supabase Auth email magic links for every role; passwords, social sign-in, and MFA are deferred.
2. Host the app on Vercel and use Supabase Cloud PostgreSQL in the closest South African region available. Disclose any transfer outside South Africa in the privacy notice.
3. Allow anonymous enquiry submission. Clients sign in with the same email to see their enquiries; link earlier enquiries after email confirmation.
4. Target first staff review within two business days.
5. Keep enquiry records for up to 24 months after Closed, then delete on request or through manual review. Automated purge is deferred.
6. Require all enquiry fields except budget range.
7. Consultants and administrators see all enquiries; only administrators manage categories and roles. Assignment to a named consultant is deferred.
8. Use custom SMTP with Supabase Auth in production; use the Supabase mail viewer in local development.
9. Keep the privacy notice at `/privacy`; Imbewenhle supplies and approves its content before release.
10. Use one editable proposal per enquiry; staff record client decisions, and clients see non-draft proposals read-only.
11. Clients may reply only while an enquiry is Awaiting Client; client replies are never internal notes.
12. No modals; staff editing uses panels. Confirm with the human if a design requires a modal.
13. Imbewenhle supplies a 10–500 character description for each service category before the catalogue phase.

## 16. Submission checklist

- [x] Problem, target users, goals, and non-goals are stated.
- [x] MVP requirements are separated from future possibilities.
- [x] Requirements describe observable, testable behaviour.
- [x] Core screens, flows, roles, and data boundaries are documented.
- [x] Success metrics, acceptance criteria, dependencies, and risks are included.
- [ ] Stakeholders review open decisions and approve release scope.

## Change log

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 28 October 2026 | Product requirements baseline. |
| 1.1 | 4 November 2026 | Incorporated the recommended decisions from Section 18 of the implementation plan; stakeholder confirmation remains required. |
