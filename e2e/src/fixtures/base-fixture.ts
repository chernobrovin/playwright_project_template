import { expect, test as base } from '@playwright/test';
import { BASE_URL } from "../../playwright.config";
import * as config from '../../playwright.config';
import { Utils } from '../utils/utils';
import { LoginPage } from '../pages/login/Login.page';

type adminTest = {
};

type noLoginTest = {
  loginPage: LoginPage;
};

export const test = base.extend<adminTest>({
  page: async ({ page }, use) => {
    const utils = new Utils();
    const login = new LoginPage(page);
    const email = config.EMAIL;
    const password = config.PASSWORD;

    await test.step(`OPEN admin`, async () => {
      await utils.signInToUrl(page, `${BASE_URL}`, email, password);
      await expect(login.loginBtn).not.toBeVisible();
    });
    await use(page);
  },
});

export const noLoginTest = base.extend<noLoginTest>({
  page: async ({ page }, use) => {
    const utils = new Utils();
    const login = new LoginPage(page);
    await test.step(`OPEN login Page`, async () => {
      await utils.goToPage(page, `${BASE_URL}`);
      await expect(login.loginBtn).toBeVisible();
    });
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
}); 

export { expect, base };