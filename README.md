# Natodi QA Test Task

A focused Playwright + TypeScript suite for Natodi's public booking flow. The approach prioritizes correct bookings, useful failure evidence, and repeatable execution with isolated test data.

The submission contains three UI scenarios and two public REST API tests. The [archived CI reports](e2e/reports/README.md) record 5/5 passing tests and 10/10 passing executions in the repeated suite, with two workers and zero retries. [PR checks](https://github.com/chernobrovin/playwright_project_template/pull/1) show results for the current revision.

**Submission:** [`natodi-test-task`](https://github.com/chernobrovin/playwright_project_template/tree/natodi-test-task). **Booking page:** [QA Barbershop 0921](https://book.natodi.com/qa-barbershop-0921).

## Quick start

Prerequisite: Node.js 22 or newer. Check out the submission branch and open its `e2e` directory, then install and run with two commands:

```bash
npm run setup
npm test
```

`setup` installs the locked npm dependencies, Chromium, and its required system libraries. Use the same two commands in PowerShell or bash. On Linux, installing system libraries may require sudo access.

```bash
npm run typecheck
npm run test:ui
npm run test:api
npm run test:headed
npm run test:reliability
npm run report
```

## Coverage and the risks it addresses

| Scenario | Evidence checked |
| --- | --- |
| Complete a booking | Select `QA Haircut`, an available future slot, and synthetic contact details. Check the confirmation, appointment identity, client, service, date/time, 100 UAH price, and 30-minute duration. Read the saved appointment through Natodi's API and verify the same business values. |
| Incomplete phone number | Check validation feedback, disabled submission, and that the client remains on the contact form. |
| Missing required name | Establish that the complete form can be submitted, clear the name, and check that submission becomes disabled. |
| Successful public REST request | Check HTTP 200, the todo's runtime schema, and expected field values. |
| Unknown REST resource | Check HTTP 404 and the empty response object. |

The two REST tests use JSONPlaceholder, as the assignment permits any public REST API. The booking scenario also checks Natodi's persisted data, connecting visible success to a saved business record.

The [strategy](e2e/STRATEGY.md) explains the wider product priorities, the division between automation and exploratory work, and the proposed process for maintaining coverage with AI under QA review.

## Architecture and engineering decisions

```text
e2e/
  src/fixtures/booking.fixture.ts
  src/pages/BookingPage.ts
  src/test-data/customer.factory.ts
  src/tests/booking/booking.spec.ts
  src/tests/api/public-api.spec.ts
  playwright.config.ts
  playwright.reliability.config.ts
  STRATEGY.md
  AI.md
  RUN_REPORT.md
```

| Responsibility | Reason for the boundary |
| --- | --- |
| Specs express business outcomes | A reviewer can see what must remain true for the client and the saved appointment. |
| The page object handles UI interactions | Locators, availability discovery, and navigation stay in one place when the UI changes. |
| The fixture owns appointment cleanup | Teardown runs after each case, including assertion failures, and verifies deletion with a subsequent HTTP 404. |
| A data factory creates synthetic contacts | Each scenario receives a unique name and reserved `example.com` address; non-subscriber phone numbers avoid contacting real clients. |

The fixture deletes only appointment IDs recorded by its own test. Synthetic client profiles can remain in this dedicated tenant. Admin credentials and browser authentication state are not required by the suite.

Locators use roles and visible text where the observed UI supports them. The unnamed add button is scoped to the matching service card. Contact fields use their `formcontrolname` containers because Natodi can generate duplicate IDs and incorrect accessible names. [NTD-002](e2e/BUGS.md#ntd-002-duplicate-input-ids-associate-both-contact-labels-with-the-name-field) documents the product issue separately from the locator workaround.

## Time, state, and reliability

The suite reads availability from live UI requests and selects a future date within 14 days in `Europe/Kyiv`. Calendar dates are partitioned by scenario and repetition, which prevents cases in the same run from competing for a slot. Each case creates its own browser context and contact data.

The reliability configuration repeats the entire suite twice with two workers, full parallelism, and zero retries. CI runs type checking, the normal suite, and the repeated suite. There are no fixed sleeps or skipped cases. Separate CI runs are serialized because they share one tenant; avoid overlapping a local run with CI.

This controls test-created conflicts. The live service still determines availability. For a controlled test environment, the strategy adds seeded schedules and a controllable backend clock to make exact time-boundary checks deterministic.

## Configuration and tenant prerequisites

The current assignment specifies a booking page created during registration. This suite uses the configured test company's page.

```text
BOOKING_ORIGIN=https://book.natodi.com
BOOKING_PATH=/qa-barbershop-0921
SERVICE_NAME=QA Haircut
```

Set environment variables to override these values. `.env.example` documents the names; the runner does not automatically load `.env` files. A replacement Natodi tenant must provide a service priced at 100 UAH with a 30-minute duration and an assigned employee with available hours.

Working hours are configured for 09:00-18:00 daily through October 31, 2026. Subscription renewal was cancelled on September 21; Natodi confirmed access through September 28, 2026. Before running after that date, verify booking access and extend the schedule when needed. A blocked tenant fails with the actual API status and error details.

## Reports and review material

`npm test` writes `e2e/playwright-report/index.html`. Failures retain a trace, screenshot, and video. CI stores the repeated run in `reliability-report` and uploads both reports as `playwright-reports`.

The [committed report archive](e2e/reports/README.md) preserves the original successful HTML reports, tested commit, and checksums. That evidence remains available after CI artifacts expire.

- [One-page QA strategy](e2e/STRATEGY.md) and [PDF](e2e/STRATEGY.pdf)
- [Three selected bug reports with evidence](e2e/BUGS.md)
- [Triage of six manual observations and additional findings](e2e/EXPLORATORY_REVIEW.md)
- [AI delegation, review decisions, and a corrected model error](e2e/AI.md)
- [Execution evidence and environment limits](e2e/RUN_REPORT.md)
