import { expect, BrowserContext, Locator, Page, test } from "@playwright/test";
import { LoginPage } from "../pages/login/Login.page";
import { BASE_URL } from "../../playwright.config";

export class Utils {

  async signInToUrl(page: Page, url: string, email: string, password: string): Promise<void> {
    const loginPage = new LoginPage(page);
    await page.goto(`${url}`);
    await loginPage.emailField.fill(email);
    await loginPage.passwordField.fill(password);
    await loginPage.loginBtn.click();
  }

  async goToPage(page: Page, url: string = ""): Promise<void> {
    if (url) {
      await page.goto(url);
      return;
    }
    await page.goto(`${BASE_URL}`);
  }
}

