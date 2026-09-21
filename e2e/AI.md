# AI Usage

## What I delegated

I used AI to compare an earlier Playwright framework with the assignment, draft the TypeScript implementation, inspect the live UI, configure the requested test tenant, run tests and CI, investigate failures, and prepare documentation. AI also performed the follow-up evidence review and prepared the screenshots, DOM extracts, and archived reports.

## What I rewrote by hand

I did not hand-write or manually rewrite the code in this submission. The implementation and subsequent revisions were AI-assisted. My contribution was to define the scope and quality expectations, provide my earlier framework as a reference, challenge conclusions, and request another requirement-by-requirement review before submission. The corrections below must not be interpreted as code I typed manually.

The AI-assisted revisions replaced guessed locators with observed controls, selected live availability, asserted persisted appointment data, added isolated date allocation and cleanup, and checked repeated parallel execution with no retries. Contact fields use observed form-control attributes because the product can generate duplicate IDs.

## One specific model error caught during review

An AI-generated bug report claimed that pasting an international phone number corrupted it. The initial observation actually used Playwright `fill()`, which is a different input method.

I requested a second review of the assignment and findings. The AI-assisted recheck used a real `Control+V` action and recorded a trusted browser paste event. Pasting `+380000000001` correctly produced `+38 (000) 000-0001`. Repeating `fill()` produced `+38 (380) 000-0000`.

The clipboard-paste defect was withdrawn. The [screenshots and recorded values](evidence/phone-input-recheck/results.json) preserve the correction. The test suite uses national digits as an automation workaround. A method-specific observation is insufficient evidence for a broader claim about user behavior.

An earlier model error also combined a company path in `baseURL` with `page.goto('/')`, which navigated to the origin root. The current implementation keeps the origin and explicit booking path separate. It also verifies ownership of the target tenant instead of attributing another tenant's plan limit to the supplied promo.

## Human exploratory findings and AI-assisted verification

I supplied six screenshots from my own exploratory testing and asked for their significance to be checked before inclusion. The follow-up reproduced the UI symptoms with fresh screenshots and DOM measurements, checked the functioning clear button, and treated the 20-appointment response as insufficient evidence of a bug. It selected analytics empty-state and long-name findings for the limited submission and documented the other observations separately. These symptoms were human-discovered; AI performed the follow-up verification and documentation. Temporary service/category records were cleaned up afterward.

## Proposed human review loop

A coverage agent could compare code changes, API contracts, documentation, and completed issues, then propose tests to add, update, or remove. QA approves proposals and translates rejected suggestions into explicit rules and examples. This is agent calibration, not model fine-tuning.

A second agent could investigate failures using traces, logs, code, and expected behavior, then show evidence and confidence in a dashboard. A human would approve test changes or issue creation. Requirement analysis and exploratory testing remain part of the workflow. These agents and the dashboard are a proposed approach, not implemented deliverables in this repository.
