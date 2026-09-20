# Test Run Report

## Latest verified run

Environment: GitHub Actions, Ubuntu 24.04, Node.js 22, Chromium via Playwright.

Result:

- API tests: **2 passed**
- Booking UI tests: **3 blocked/failed at the environment precondition**
- Type/test discovery: **passed**
- Playwright HTML report and failure artifacts: **generated successfully**

The booking tests reached the real public page `https://book.natodi.com/barbershop-kyiv`. The page currently renders `Онлайн запис тимчасово недоступний`.

The trace shows the underlying request:

```text
GET https://api.natodi.com/api/v1/branches/barbershop-kyiv/slug
HTTP 400
error_code: 4181
You have exceeded the appointments limit for the free plan (20).
Please upgrade your subscription to add more appointments.
```

This conflicts with the test-task precondition that promo code `PRC1NJT` provides full access for the duration of the task. I kept the failed result instead of masking the environment/product state with a skip.

## Commands

The repository can be installed and executed with two commands:

```bash
npm install && npx playwright install chromium
npm test
```

Reliability check after the booking account is unblocked:

```bash
npm run test:reliability
```

## Report locations

```text
playwright-report/index.html
test-results/
```

Failures retain screenshot and video evidence. A trace is retained on the first retry.

## Note

The API checks are green. The UI failure is not being reported as a passing run because the required booking flow is currently unavailable on the supplied test tenant.
