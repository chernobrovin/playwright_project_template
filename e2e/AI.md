# AI Usage

## What I delegated

I used AI to review my older Playwright framework, compare it with the requirements of this task, challenge the amount of abstraction needed, draft edge-case candidates for the booking flow, review the selector strategy, and perform a second-pass review for shared state, time assumptions and unnecessary dependencies.

I also used AI to draft the first versions of this README, STRATEGY.md and the API schema guard. I reviewed and edited the result before keeping it.

I did not treat generated locators or product behavior as facts. Product-specific assumptions require verification against the live application.

## What I rewrote by hand and why

I kept this project materially smaller than my previous framework. The older framework was built for a large SaaS product and contains fixtures, reporting helpers, API utilities, database helpers, multiple page objects and investigation tooling. Copying that structure into a five-test exercise would make the solution harder to review.

I rewrote the architecture around one booking page object, one focused fixture and isolated per-test data. I kept assertions in the specs so a reviewer can understand the business expectation without opening several layers of helpers. I also removed the need for a second HTTP client and used Playwright's built-in `request` fixture.

## One specific thing the model got wrong

The model initially proposed freezing the browser clock with Playwright's `page.clock` as the main solution for a scenario such as "book tomorrow at 10:00".

That is incomplete for this product. Appointment availability is server-side state. Freezing JavaScript `Date` in the browser does not freeze the backend clock and does not make an occupied or available slot deterministic.

I corrected the approach to use controlled test data, a fixed timezone, bounded slot discovery and isolated bookings. In a dedicated test environment I would additionally control scheduling state through setup/cleanup APIs or a test-only backend clock.

## How I would use AI in the QA process

I prefer a human-in-the-loop model:

1. AI reviews changed code, API contracts, documentation and completed work items and proposes coverage changes.
2. QA approves or rejects proposals.
3. Rejections become explicit rules/examples for future agent runs.
4. Test execution publishes structured evidence.
5. A failure-investigation agent classifies failures with confidence and links to evidence.
6. A human confirms bug vs test issue before any external action.
7. Test fixes are proposed as reviewed PRs, while confirmed product defects can be sent to the task tracker from the same review interface.

The value of AI here is scale and investigation speed. Decision authority remains with QA.
