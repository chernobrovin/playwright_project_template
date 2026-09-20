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

I do not invent bug reports to fill a quota. A bug belongs here only after I reproduce it against the actual product and capture evidence.

During preparation of this submission I could not run an interactive browser against the Natodi page from the restricted execution environment used for AI assistance. Therefore I have not labeled any unverified observation as a product defect.

### Feature request

**Title:** Provide stable test hooks or a documented test-data API for public booking E2E automation

**Reason:** Booking behavior depends on live services, staff schedules and occupied time slots. A small supported test-data surface would allow deterministic setup/cleanup, reliable concurrency checks and safer CI without coupling tests to private implementation details.

**Expected benefit:** Faster, isolated regression tests and less test data pollution in shared environments.
