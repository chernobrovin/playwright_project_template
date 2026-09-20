import { test } from '@playwright/test';

test('non-destructive booking UI probe', async ({ page }) => {
  page.on('response', async (response) => {
    if (!response.url().includes('api.natodi.com')) return;

    let body = '';
    try {
      body = (await response.text()).slice(0, 4000);
    } catch {}

    console.log('NATODI_API', response.status(), response.request().method(), response.url(), body);
  });

  await page.goto('https://book.natodi.com/daniil-diumin');

  const serviceTrigger = page.getByText('Оберіть послуги', { exact: true });
  console.log('SERVICE_TRIGGER', await serviceTrigger.evaluate((el) => el.outerHTML));

  await serviceTrigger.click();
  await page.waitForTimeout(1000);

  console.log('AFTER_SERVICE_CLICK_HTML');
  console.log((await page.locator('body').innerHTML()).slice(0, 12000));
});
