# QA strategy

## Coverage by product risk

Prioritize lost bookings, incorrect prices, double-booking, and unauthorized changes. Automate stable business rules at API/service level; keep UI coverage focused on client journeys. Extend coverage to cancellation, availability, permissions, and notification delivery. This submission checks booking, two validation cases, and public API success/schema/404 behavior.

Keep requirement analysis, exploratory testing of new features, usability, and accessibility assessment human-led. AI can suggest cases; QA evaluates their relevance and evidence. Add lasting UI regression as behavior stabilizes; automate critical contracts and regression risks before release. Review business impact, change frequency, and maintenance cost when choosing coverage.

## Maintaining coverage with AI

I propose a daily review of code changes, API contracts, documentation, and completed issues. One agent proposes tests to add, revise, or retire; another investigates failures from traces, logs, and expected behavior. A dashboard presents evidence, uncertainty, and proposed actions. QA approves test changes and bug creation, then turns rejected proposals into improved rules and examples. This operating model extends the submitted suite; the agents and dashboard are future work.

## Deterministic time and state

In a controlled environment, seed schedules and appointments, control the backend clock, and cover timezone, midnight, and daylight-saving boundaries. Browser clock control alone cannot determine server availability.

Here, discover live slots within 14 days in `Europe/Kyiv`, partition dates between scenarios/repeats, and create unique contacts. Delete each test's appointments and verify HTTP 404. Repeat twice with two workers and zero retries; serialize separate CI runs. Live availability remains an external dependency; [README](../README.md#configuration-and-tenant-prerequisites) records access and schedule limits.

## Three selected findings

### NTD-002: Duplicate IDs break contact label associations

**Steps:** Reach booking contacts in fresh sessions; inspect IDs and labels when a collision occurs. **Expected:** Unique IDs and correct labels. **Actual:** Both inputs received `input-25`; both labels targeted the name field. **Severity:** Medium; intermittent, captured in CI.

### NTD-003: Empty analytics displays null

**Steps:** Open analytics overview with zero appointments; reload. **Expected:** Meaningful localized no-data values. **Actual:** Profit and average check display literal `null`. **Severity:** Low; reproduced after reload.

### NTD-004: Accepted long names overflow admin controls

**Steps:** Save a 152-character service and 156-character category; inspect category input, service details, and employee services at 1366 x 900. **Expected:** Contained text and unobstructed controls. **Actual:** Text overlaps the clear icon and overflows/clips detail views. **Severity:** Low; clearing still works.

[BUGS.md](BUGS.md) contains reproduction details and evidence. [Review notes](EXPLORATORY_REVIEW.md) explain selection by demonstrated impact; an HTTP error alone did not establish a defect.
