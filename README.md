# Natodi QA Test Task

Playwright + TypeScript test task for the Natodi public booking flow.

The implementation is intentionally small. The task contains a single business flow, so the project uses one page object, one focused fixture, isolated test data and Playwright's built-in API client/reporting rather than a large generic framework.

## Quick start

From the `e2e` directory:

```bash
npm ci
npx playwright install chromium
```

Run all tests:

```bash
npm test
```

Those are the only two setup/run commands required after cloning if Chromium is already available in the environment. The CI workflow installs the browser automatically.

## Useful commands

```bash
npm run test:ui
npm run test:api
npm run test:headed
npm run test:reliability
npm run report
```

`test:reliability` runs tests twice with full parallelism. It is intended to expose shared state and order dependencies.

## Project structure

```text
e2e/
  src/
    fixtures/
      booking.fixture.ts
    pages/
      BookingPage.ts
    test-data/
      customer.factory.ts
    tests/
      api/
        public-api.spec.ts
      booking/
        booking.spec.ts
  playwright.config.ts
  STRATEGY.md
  AI.md
  RUN_REPORT.md
```

### Why this structure

- **Tests describe behavior.** Assertions stay in specs where a reviewer can see the business expectation.
- **Page object owns interactions and locators.** Booking UI mechanics are centralized without hiding test intent.
- **Fixtures provide composition, not setup magic.** The custom fixture only constructs `BookingPage`.
- **Test data is generated per test.** No test depends on data created by another test.
- **No generic BasePage or utility bucket.** Five tests do not justify a large abstraction layer.
- **Playwright's request fixture is used for API tests.** No second HTTP client is introduced.
- **HTML report, traces and screenshots use Playwright built-ins.** This keeps the repository easy to run and review.

## Configuration

Default booking page:

```text
https://book.natodi.com/barbershop-kyiv
```

Override it when needed:

```bash
BOOKING_URL=https://book.natodi.com/another-company npm test
```

No Natodi password is required by the public booking tests. Credentials must not be committed if admin-side setup is later added.

## Selector strategy

The page object prefers accessible locators such as `getByRole`, `getByLabel` and `getByPlaceholder`. Text matching is limited to stable user-visible booking concepts. CSS/XPath tied to layout is avoided.

## Reporting

A normal run writes a Playwright HTML report to `playwright-report/`. On failures the configuration retains a trace, screenshot and video.

The repository also contains `RUN_REPORT.md` with the execution record and any environment limitation observed while preparing the task.

## Judgment documents

- [STRATEGY.md](e2e/STRATEGY.md)
- [AI.md](e2e/AI.md)
- [RUN_REPORT.md](e2e/RUN_REPORT.md)
