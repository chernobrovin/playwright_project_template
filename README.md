# Natodi QA Test Task

Five focused Playwright + TypeScript tests: three checks of the real Natodi booking UI and two public REST API checks.

Public booking: https://book.natodi.com/qa-barbershop-0921

Submission branch: [`natodi-test-task`](https://github.com/chernobrovin/playwright_project_template/tree/natodi-test-task). Start with the [one-page strategy](e2e/STRATEGY.pdf), [detailed findings](e2e/BUGS.md), [AI disclosure](e2e/AI.md), and [archived reports](e2e/reports/README.md).

## Quick start

Prerequisite: Node.js 22 or newer. From `e2e`, install and run with two commands:

```bash
npm ci && npx playwright install chromium
npm test
```

On Windows PowerShell 5, run the two parts of the first line separately. Linux CI installs Chromium system dependencies with `--with-deps`.

```bash
npm run typecheck
npm run test:ui
npm run test:api
npm run test:headed
npm run test:reliability
npm run report
```

The reliability configuration runs the whole suite twice with two workers, full parallelism, and zero retries. CI runs type checking, the normal suite, and the reliability suite, then uploads both HTML reports and any failure evidence.

## Coverage

- A client selects `QA Haircut`, an available future slot, and valid synthetic contact details. The test checks the success page and persisted appointment, including client, service, date, time, price, and duration.
- An incomplete phone number shows validation feedback and prevents submission.
- A missing name prevents submission when the remaining contact fields are valid.
- JSONPlaceholder returns a successful todo with the expected schema and values.
- An unknown todo returns HTTP 404 and an empty response object.

These REST checks use a separate public API, as allowed by the assignment. The UI happy path additionally verifies persistence through Natodi's API.

## Structure and isolation

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

The page object owns observed UI interactions. Specs express business assertions. A fixture records and deletes only appointments created by its own test, including after an assertion failure, and checks that they return 404 afterward. Synthetic client profiles can remain in this dedicated tenant; no broad customer deletion is attempted.

Tests generate unique names, reserved `example.com` email addresses, and non-subscriber phone numbers. No admin credentials are needed. Service selection uses accessible locators and visible text; the unnamed add button is scoped to the matching `app-short-info-card`. Contact inputs use observed `formcontrolname` containers because duplicate product-generated IDs can break their accessible names (see NTD-002 in BUGS.md).

Availability comes from the live UI requests. Tests use future dates within 14 days in `Europe/Kyiv`; calendar dates are partitioned by scenario and repetition so concurrent checks do not compete for a slot. No fixed sleeps, skipped tests, or retries conceal failures. Separate CI runs are serialized because they share a tenant. Avoid running a local suite while CI is active.

## Configuration and prerequisites

Defaults:

```text
BOOKING_ORIGIN=https://book.natodi.com
BOOKING_PATH=/qa-barbershop-0921
SERVICE_NAME=QA Haircut
```

Set environment variables to override these values. `.env.example` documents the names; the runner does not automatically load `.env` files. A replacement tenant must provide a service priced at 100 UAH with a 30-minute duration and an assigned employee with available hours.

The configured employee works 09:00-18:00 daily through October 31, 2026. Extend the schedule before that date. The live tenant must have an active plan allowing bookings; its initial Pro period is seven days from September 21, 2026. These are external prerequisites, not guarantees of indefinite availability. A blocked tenant fails with the API status and error details.

## Reports and notes

`npm test` writes `e2e/playwright-report/index.html`. Failures retain a trace, screenshot, and video. CI puts the repeated run in a separate `reliability-report` directory. The [committed report archive](e2e/reports/README.md) contains the original successful HTML reports and their checksums, so evidence remains available after CI artifacts expire. Current runs also upload the `playwright-reports` artifact.

- [Test strategy](e2e/STRATEGY.md) and [one-page PDF](e2e/STRATEGY.pdf)
- [Three selected bug reports and evidence](e2e/BUGS.md)
- [Review of six manual observations and additional findings](e2e/EXPLORATORY_REVIEW.md)
- [AI contribution and corrected mistakes](e2e/AI.md)
- [Execution evidence and environment limits](e2e/RUN_REPORT.md)
