# AI Usage

## What I delegated

I used AI to review my older Playwright framework, compare it with the requirements of this task, challenge the amount of abstraction needed, draft edge-case candidates for the booking flow, review the selector strategy, and perform a second-pass review for shared state, time assumptions and unnecessary dependencies.

I also used AI to draft the first versions of this README, STRATEGY.md and the API schema guard. I reviewed and edited the result before keeping it.

I did not treat generated locators or product behavior as facts. Product-specific assumptions require verification against the live application.

## What I rewrote by hand and why

I kept this project materially smaller than my previous framework. The older framework was built for a large SaaS product and contains fixtures, reporting helpers, API utilities, database helpers, multiple page objects and investigation tooling. Copying that structure into a five-test exercise would make the solution harder to review.

I rewrote the architecture around one booking page object, one focused fixture and isolated per-test data. I kept assertions in the specs so a reviewer can understand the business expectation without opening several layers of helpers. I also removed the need for a second HTTP client and used Playwright's built-in `request` fixture.

## One specific thing the model got wrong

The first AI-generated navigation used `page.goto('/')` while the Playwright `baseURL` was set to `https://book.natodi.com/barbershop-kyiv`.

That looks harmless, but URL resolution turns the leading slash into the origin root, so CI opened `https://book.natodi.com/` and rendered an empty widget instead of the company booking page. The failure was caught in the Playwright trace and network log.

I rewrote the configuration to keep only the origin in `baseURL` and made the company path explicit:

```ts
baseURL: 'https://book.natodi.com'
await page.goto('/barbershop-kyiv')
```

This is a concrete example of why I do not accept generated Playwright code without executing it and inspecting the evidence.

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
