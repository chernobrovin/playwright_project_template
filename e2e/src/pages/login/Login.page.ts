import { Locator, Page, expect } from "@playwright/test";
export class LoginPage {

  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

//Locators

  get emailField() { return this.page.locator('...'); };
  get passwordField() { return this.page.locator('...'); };
  get loginBtn() { return this.page.locator('...'); };
  get forgotPasswordLink() { return this.page.getByRole('link', { name: 'Forgot password?' }); };

//Methods
async elementVisible(element: any): Promise<boolean> {
  try {
      await expect(element).toBeVisible();
      return true;
  } catch (error) {
      return false;
  }
}
}
