## Description

The framework is a POC of the automation tests for graphio.ai admin and dashboard product

## Configuration

Use playwright.config.ts file to change configuration of the test runs and some test data
Use gitlab.yml to configure the CI runs rules

## Prepare local environment

Make sure you have installed npm via npm -v command. If not please install it in accordance to your OS following instructions in https://nodejs.org/en/download/
Install VSCode and 'Playwright Test for VSCode' extension

## Run E2E tests locally

- Install node: `npm install`
- Install playwright: `npx playwright install --with-deps`
- Run full test suite: `npx playwright test`
- Run specific spec file: `npx playwright test "login.spec.ts"` (use your test name)

Add --headed parameter to run Headed mode - Headless mode is the default one.

Also you can run tests using VSCode test runners

## CI
Please make sure you use mcr.microsoft.com/playwright:v1.28.0-focal docker image that has all required conditions for the environment to be ready for the CI test run