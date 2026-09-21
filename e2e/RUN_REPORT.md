# Test Run Report

## Verified CI execution and permanent reports

[CI run 35546252608](https://github.com/chernobrovin/playwright_project_template/actions/runs/35546252608) passed TypeScript, 5/5 normal tests (11.9 s), and 10/10 reliability executions (21.1 s), with two workers and zero retries. Tested commit: `c74f6d3886b6a779b257c16c99950a993e8759bd`.

The original [HTML reports and machine-readable summary](reports/README.md) are committed in this repository. Their embedded test results were read back and their SHA-256 hashes match the downloaded CI files. These snapshots describe that tested commit; current-commit status is shown in the PR checks.

## Verified local execution

Date: September 21, 2026 (Europe/Kyiv). Environment: Windows, Node.js 22.14.0, npm 10.9.2, Playwright 1.63.0, Chromium, Ukrainian UI.

Target: https://book.natodi.com/qa-barbershop-0921

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm test` | 5 passed in 13.1 seconds: 3 UI and 2 API |
| `npm run test:reliability` | 10 passed in 17.9 seconds: all five cases repeated twice |
| Parallel workers / retries | 2 / 0 |
| Appointment teardown | Created records deleted; subsequent GET returns 404 |

The normal run and then the reliability run passed sequentially, confirming that teardown permits the next run. No tests were skipped or marked as expected failures.

The happy path verified the actual success screen, appointment identity, client name, selected date/time, service, 100 UAH price, and 30-minute duration. A separate GET verified persisted data before fixture teardown. The HTML report includes `created-appointment` and `appointment-cleanup` attachments. Validation cases reached the real contact form and asserted disabled submission.

## CI and report access

The [Playwright workflow](../.github/workflows/playwright.yml) runs dependency installation, TypeScript checking, the five-test suite, and the ten-execution reliability suite on Ubuntu with Node.js 22. Download `playwright-reports` from the corresponding [GitHub Actions run](https://github.com/chernobrovin/playwright_project_template/actions/workflows/playwright.yml?query=branch%3Anatodi-test-task), extract it, and open either HTML report. Artifacts are retained for 14 days. The [pull request](https://github.com/chernobrovin/playwright_project_template/pull/1) shows the current commit's checks.

Local report paths, relative to `e2e`:

- `playwright-report/index.html`
- `reliability-report/index.html`
- `test-results/` and `reliability-results/` contain any failure evidence.

Traces, screenshots, and video are retained on failures without enabling retries. The selected successful HTML reports are intentionally archived in git. Raw failure traces and browser session state are not committed. Sanitized, focused evidence is included in BUGS.md.

## Setup and remaining external limits

The old company deletion was confirmed by Natodi's UI. A new alias account was registered, the supplied promo was applied, and the user completed the 1 UAH Pro activation. `QA Haircut` is assigned to the employee; public booking is enabled. Working hours are 09:00-18:00 every day through October 31, 2026. The booking page and a complete real appointment were verified.

The registration flow did not present an email-confirmation step, and no confirmation email was found. Access and booking work, but email verification is not claimed. Optional Telegram integration and optional street address were left unset.

The initial Pro period is seven days. Continued booking availability depends on the tenant's subscription and schedule. This report does not guarantee indefinite access or establish that a separate Free route is unavailable.

## Failures investigated before the final runs

The earlier implementation targeted `/barbershop-kyiv` without proving ownership. Its plan-limit response was incorrectly attributed to the test account. The suite now uses the new account's verified slug.

Early live runs exposed shared-slot conflicts and an incorrect repetition count in worker configuration. Date partitioning, explicit reliability configuration, and verified per-test appointment deletion resolved the observed test failures. They were not hidden with sleeps, retries, or skips. Product findings and their limits are documented in [STRATEGY.md](STRATEGY.md).

The first CI reliability run exposed intermittent duplicate HTML IDs for the name and phone inputs. Its trace confirmed that both labels targeted the name field. The page object now scopes inputs by their observed form control attributes, and the defect is recorded as NTD-002. Both local suites passed after this adjustment.

## Evidence review correction

A real Control+V paste preserved the international phone number. The earlier corruption occurred with Playwright fill(), so the clipboard-paste claim was withdrawn. BUGS.md records the comparison and screenshots. The selected reports now cover duplicate contact-input IDs, raw null analytics values, and long-name display problems. The earlier pricing observation is retained in EXPLORATORY_REVIEW.md outside the three-report selection. The subscription remains active at the owner's request.

## Follow-up to manual exploratory screenshots

The six user-supplied observations were checked in live Chromium 153.0.8010.48 on Windows. Analytics displayed two `null` values with zero appointment counters after reload. A temporary service/category reproduced three long-name layout symptoms; the clear button and category switching still worked. The service was disabled in the public widget, and both temporary records were deleted with successful responses and follow-up checks. `QA Haircut` remained present.

The referral-card label overlapped at 1280/1366 px and fit at 1920 px. The separate `barbershop-kyiv` page returned HTTP 400 / business code 4181 and a handled unavailable-booking state; this was not classified as a confirmed bug. Full decisions and privacy-safe evidence are in [EXPLORATORY_REVIEW.md](EXPLORATORY_REVIEW.md). Test implementation and subscription settings were unchanged.
