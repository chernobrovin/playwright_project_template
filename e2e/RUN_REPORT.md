# Test Run Report

## Submission environment

The project was statically reviewed while preparing the submission.

The AI execution environment used during preparation could not establish an interactive connection to `https://book.natodi.com/barbershop-kyiv`, so I did not fabricate a green E2E result or invent product bugs. The repository is configured to produce a Playwright HTML report, trace, screenshot and video evidence when executed in a normal environment.

## Commands

```bash
npm ci
npx playwright install chromium
npm test
npm run test:reliability
```

## Expected report location

```text
e2e/playwright-report/index.html
```

Failure artifacts:

```text
e2e/test-results/
```

## Reliability check

`npm run test:reliability` executes every test twice with full parallelism. This is the check I use to expose hidden order dependencies and shared test data.

## Note for reviewer

I prefer an explicit "not executed in this restricted environment" record over reporting results I could not verify. The CI run for the submitted commit should be treated as the source of truth.
