# Archived test reports

These are unmodified, self-contained Playwright HTML reports produced by [GitHub Actions run 35546252608](https://github.com/chernobrovin/playwright_project_template/actions/runs/35546252608), September 21, 2026.

Tested commit: `c74f6d3886b6a779b257c16c99950a993e8759bd`.

| Report | Result | Duration |
| --- | --- | --- |
| [Normal suite](ci-35546252608/normal/index.html) | 5 passed, 0 failed/skipped/flaky | 11.9 s |
| [Reliability suite](ci-35546252608/reliability/index.html) | 10 passed, 0 failed/skipped/flaky | 21.1 s |

Both runs used two workers and zero retries. Their embedded attachments record created appointments and successful cleanup. The [machine-readable summary](ci-35546252608/summary.json) contains statistics extracted from the reports and SHA-256 checksums of the original files.

GitHub displays HTML as source. Download either `index.html` and open it in a browser, or after installing dependencies run from `e2e`:

```bash
npx playwright show-report reports/ci-35546252608/normal
npx playwright show-report reports/ci-35546252608/reliability
```

These committed snapshots remain available after CI artifacts expire. They describe the exact tested commit above; subsequent documentation changes do not change that provenance. Current-commit results are available in the pull request's checks. The reports were inspected before publication; they contain synthetic test contacts and no admin authentication state.
