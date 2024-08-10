import { noLoginTest as test, expect } from "../../fixtures/base-fixture";
import * as config from "../../../playwright.config";
import { BASE_URL } from "../../../playwright.config";

test.describe("Login Page", () => {

  test("CHECK fields", async ({ loginPage }) => {
    await test.step(`Email field`, async () => {
      await loginPage.elementVisible(loginPage.emailField);
    });

    await test.step(`Password field`, async () => {
      await loginPage.elementVisible(loginPage.passwordField);
    });
  });
});