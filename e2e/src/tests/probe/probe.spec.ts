import { test } from '@playwright/test';

test('non-destructive booking UI probe', async ({ page }) => {
  await page.goto('https://book.natodi.com/daniil-diumin');

  const serviceTrigger = page.getByText('Оберіть послуги', { exact: true });
  console.log('SERVICE_TRIGGER', await serviceTrigger.evaluate((el) => el.outerHTML));

  await serviceTrigger.click();
  console.log('AFTER_SERVICE_CLICK');
  console.log((await page.locator('body').innerText()).slice(0, 8000));
  console.log('BUTTONS_AFTER_SERVICE', await page.getByRole('button').allInnerTexts());
  console.log('OPTIONS_AFTER_SERVICE', await page.getByRole('option').allInnerTexts());
});
