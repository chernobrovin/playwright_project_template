# Archived test reports

## Final setup and persisted-booking verification

These unmodified, self-contained HTML reports come from [GitHub Actions run 35554381567](https://github.com/chernobrovin/playwright_project_template/actions/runs/35554381567), September 21, 2026. CI used the README's `npm run setup` command and checked the expanded appointment read-back assertions.

| Report | Result | Duration |
| --- | --- | --- |
| [Normal suite](ci-35554381567/normal/index.html) | 5 passed, 0 failed/skipped/flaky | 10.3 s |
| [Reliability suite](ci-35554381567/reliability/index.html) | 10 passed, 0 failed/skipped/flaky | 17.4 s |

Both runs used two workers and zero retries. Their attachments record created appointments and verified cleanup: DELETE returned 200 and subsequent GET returned 404.

PR head: `ab38526a26c0b176c37aa466f253ea7955bcb14d`. GitHub checked out its PR merge revision, `4b7dc5e2a1ff465fa93f4231bf5f95f339c3e140`; both revisions have the same Git tree. The [machine-readable summary](ci-35554381567/summary.json) records that provenance, the original artifact, extracted results, and SHA-256 checksums.

## Open the reports

GitHub displays HTML as source. Download either `index.html` and open it in a browser, or after setup run from `e2e`:

```bash
npx playwright show-report reports/ci-35554381567/normal
npx playwright show-report reports/ci-35554381567/reliability
```

## Earlier baseline

The original reports remain available: [normal suite](ci-35546252608/normal/index.html), [reliability suite](ci-35546252608/reliability/index.html), and [summary](ci-35546252608/summary.json). [CI run 35546252608](https://github.com/chernobrovin/playwright_project_template/actions/runs/35546252608) verified PR head `c74f6d3886b6a779b257c16c99950a993e8759bd`: 5/5 and 10/10 passed with two workers and zero retries. Their original bytes and checksums are unchanged.

These snapshots remain available after CI artifacts expire. Each describes the revision identified above; current-commit results appear in the pull request's checks. The reports were inspected before publication and contain synthetic test contacts with no admin authentication state.
