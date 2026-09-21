# Test strategy

## What to automate and what to keep manual

Automate frequent, stable rules with clear outcomes: booking, cancellation, slot conflicts, working hours, permissions, API contracts, notifications, and prices. Fast repeatable feedback protects these flows as the product changes. This submission covers booking, two form negatives, and public API success/schema/404 checks.

Keep requirement analysis, exploratory testing, usability, and ambiguous new behavior primarily manual: they require judgment before assertions are reliable. Automate critical checks before production once the contract stabilizes. AI may propose coverage and investigate failures; QA approves conclusions and changes.

## Deterministic time and state

In a controlled environment, seed known services, schedules, and appointments; control the backend clock; explicitly test timezone and midnight boundaries. Freezing only the browser cannot freeze server-side availability.

On this live tenant, use Europe/Kyiv, query availability within 14 future days, partition dates between concurrent cases, and generate unique synthetic contacts. Delete only each test's appointments and verify 404 afterward. Use no fixed sleeps or retries. Run twice with two workers; serialize separate CI runs. Live access remains an external dependency: maintain the plan and extend working hours beyond October 31, 2026.

## Findings

### NTD-001: A free-trial card also states a paid activation

**Steps:** Complete registration, apply the supplied promo, select `7 днів безкоштовно`, and inspect the activation price and checkout.

**Expected:** Consistent wording that distinguishes a free period from any activation charge.

**Actual:** The card also shows `1.00 грн`; checkout requests `Сплатити 1,00грн`. **Severity:** Low, pricing clarity. A separate Free-plan route was not established.

### NTD-002: Duplicate input IDs break contact labels

**Steps:** Reach booking contacts in repeated fresh sessions; inspect name/phone IDs and their labels when a collision occurs.

**Expected:** Unique IDs and the correct label for each input.

**Actual:** Both inputs received `input-25`; both labels targeted the name field. **Severity:** Medium, accessibility. Intermittent; captured in a CI trace.

Full reproduction details and evidence: [BUGS.md](BUGS.md). The suspected phone-paste defect was withdrawn after a real Ctrl+V preserved the number; the input-method comparison is recorded there. This document's matching [PDF](STRATEGY.pdf) is one A4 page.
