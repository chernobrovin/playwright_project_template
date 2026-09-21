# Test strategy

## What to automate and what to keep manual

Automate frequent, stable rules with clear outcomes: booking, cancellation, slot conflicts, working hours, permissions, API contracts, notifications, and prices. Repeatable feedback protects these flows. This submission covers booking, two form negatives, and public API success/schema/404 checks.

Keep requirement analysis, exploration, usability, and ambiguous new behavior primarily manual. Automate critical checks once their contract stabilizes. AI may propose coverage and investigate failures; QA approves conclusions and changes.

## Deterministic time and state

In a controlled environment, seed known schedules and appointments, control the backend clock, and test timezone/midnight boundaries. Freezing the browser does not freeze server availability.

On this live tenant, use Europe/Kyiv, query the next 14 days, partition dates between concurrent cases, and generate unique synthetic contacts. Delete each test's appointments and verify 404. Use no fixed sleeps or retries; repeat twice with two workers and serialize separate CI runs. Maintain the plan and extend working hours beyond October 31, 2026.

## Three selected findings

### NTD-002: Duplicate input IDs break contact labels

**Steps:** Reach booking contacts in repeated fresh sessions; inspect name/phone IDs and labels when a collision occurs. **Expected:** Unique IDs and correct label associations. **Actual:** Both inputs received `input-25`; both labels targeted the name field. **Severity:** Medium; intermittent, captured in CI.

### NTD-003: Empty analytics displays null

**Steps:** Open analytics overview for a period with zero appointments; reload. **Expected:** Meaningful localized no-data values. **Actual:** Profit and average check display literal `null`. **Severity:** Low, empty-state presentation; reproduced after reload.

### NTD-004: Accepted long names overflow admin controls

**Steps:** Save a 152-character service and 156-character category; inspect the category input, service details and employee services at 1366 x 900. **Expected:** Contained, readable text and unobstructed controls. **Actual:** Text overlaps the clear icon and overflows/clips in both detail views. **Severity:** Low; clearing still works.

Full steps, screenshots and limits: [BUGS.md](BUGS.md). [Review notes](EXPLORATORY_REVIEW.md) explain prioritization and the handled plan-limit response. The phone-paste claim was withdrawn after real Ctrl+V preserved the number. This document's [PDF](STRATEGY.pdf) is one A4 page.
