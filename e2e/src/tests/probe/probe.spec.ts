import { test } from '@playwright/test';

test('non-destructive booking UI probe', async ({ page }) => {
  await page.goto('https://book.natodi.com/daniil-diumin');

  console.log('BODY_START');
  console.log((await page.locator('body').innerText()).slice(0, 8000));
  console.log('BODY_END');

  console.log('BUTTONS', await page.getByRole('button').allInnerTexts());
  console.log('LINKS', await page.getByRole('link').allInnerTexts());
});
