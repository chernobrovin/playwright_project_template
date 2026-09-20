# Test Strategy

## What I would automate and what I would keep manual

I would automate stable, repeatable, high-risk behavior with a clear expected result. For this product that includes booking creation, availability and double-booking protection, appointment rescheduling/cancellation, working-hour and staff availability rules, permissions, API contracts, notification triggers, and deterministic calculations.

I would keep early feature exploration, ambiguous requirements, usability, visual quality, unusual device behavior, and discovery of new edge cases primarily manual. AI can help propose risks and candidate scenarios, but a QA engineer should validate them against the product and business rules before they become regression tests.

I would use a stability gate rather than "automate only after production". While a feature is changing quickly, manual and AI-assisted exploration gives faster feedback and avoids disposable automation. Once behavior and contracts stabilize, critical checks can be automated before release. After production validation, proven scenarios become part of the long-lived regression suite.

For an established product I would add an AI-assisted coverage loop. A scheduled agent can review production code changes, OpenAPI, Confluence and completed Jira work, then propose tests to add, update or remove. A QA engineer approves or rejects every proposal. Rejections are captured as feedback that updates the agent's rules and examples. This is feedback-driven agent calibration, not model fine-tuning.

After execution, a second agent can investigate failures using Playwright evidence, logs, code, API documentation, database evidence and recent changes. It returns a classification such as product bug, test issue, data issue, environment issue or inconclusive, with evidence and confidence. A human confirms the result before a bug is filed or a test fix is merged. Suggested test fixes should go through a branch/PR and normal review.

## Making time-dependent tests deterministic

I would not hardcode "tomorrow at 10:00".

For E2E booking tests I would use a dedicated test tenant with controlled working hours and a fixed timezone. The test discovers a valid slot inside a bounded future window, stores the exact selected value in the test, and uses unique client data. Tests must not depend on records created by another test.

In a proper test environment I would create and clean up bookings through setup APIs so each test starts from a known state. For rules that depend on the current date, the strongest solution is a controllable backend clock or deterministic scheduling seed. Playwright's browser clock helps with client-side date logic, but it does not freeze Natodi's backend availability by itself.

I would verify isolation explicitly with:

```bash
npm run test:reliability
```

which runs the suite twice with full parallelism.

## Findings

### Bug: promo-enabled test account is blocked by the Free-plan appointment limit

**Severity:** Major

**Preconditions:** Account created for this test task, promo code `PRC1NJT` applied, public booking page `/barbershop-kyiv`.

**Steps to reproduce:**
1. Open `https://book.natodi.com/barbershop-kyiv`.
2. Wait for the booking widget to load.
3. Observe the public booking state and the branch lookup request.

**Expected:** The promo supplied with the test task grants full access for the task, so the booking widget is available and a client can start the booking flow.

**Actual:** The widget shows `Онлайн запис тимчасово недоступний`. The public request `GET /api/v1/branches/barbershop-kyiv/slug` returns HTTP 400 with error code `4181`: `You have exceeded the appointments limit for the free plan (20). Please upgrade your subscription to add more appointments.`

**Impact:** The required happy-path booking scenario cannot start on the test account even though the task states that the promo provides full access.

**Evidence:** Reproduced in CI on 2026-09-21. Playwright report, screenshot, trace and network evidence are attached to the failed run.
