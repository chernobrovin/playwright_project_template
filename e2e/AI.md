# AI Usage

## What I delegated

I used AI to compare an earlier Playwright framework with the task, draft and revise the tests, inspect the live UI, perform the requested account setup, run the suite, and investigate failures. AI also drafted the README, strategy, and execution report. The existing framework was a reference for design experience; this submission uses a small standalone structure.

## What was rewritten and why

The implementation and the revisions were AI-assisted. I do not claim that the code below was typed without AI. My role was to set the scope, challenge the approach, authorize account changes, and review the result.

The initial implementation needed these corrections:

- Replace guessed, broad locator alternatives with controls observed in the live booking flow.
- Scope contact controls by observed form attributes after CI exposed duplicate generated IDs and broken accessible labels.
- Select an actual available date and time instead of assuming the first time label is a bookable slot.
- Verify the created appointment and its details, rather than treating any text matching "confirmed" as success.
- Add per-test appointment cleanup and separate date allocations after repeated runs exposed shared state.
- Use the account's own public URL, pinned dependencies, real TypeScript checking, and repeated parallel execution without retries.

The project stays small: one page object, a fixture, a customer factory, and Playwright's built-in HTTP client and reporting. There is no generic BasePage or extra HTTP library.

## One specific model error

The initial AI implementation combined a `baseURL` containing a company path with `page.goto('/')`. URL resolution discarded the path, so the browser opened the origin root. The earlier CI trace exposed the incorrect destination. The corrected approach keeps the origin in `baseURL` and passes the booking path explicitly.

A second error was more serious: the model treated `/barbershop-kyiv` as this account's tenant without verifying its ownership, then attributed that page's Free-plan limit to the supplied promo code. Reading the current task and inspecting account setup showed that the required target is the candidate's own booking page. The unsupported promo-account bug claim was removed.

## Proposed human review loop

A coverage agent can compare code, API contracts, documentation, and completed issues, then propose tests to add, change, or remove. QA reviews the proposals. Rejections update explicit instructions and examples; this is agent calibration, not model fine-tuning.

A separate investigation agent can classify failures using traces, logs, changes, and expected behavior. It must cite evidence, state uncertainty, and distinguish product, test, data, and environment failures. A human confirms the diagnosis before filing an issue or merging a fix. This is a proposed workflow, not a system implemented in this repository.
