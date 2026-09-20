import { test as base } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

interface BookingFixtures {
  bookingPage: BookingPage;
}

export const test = base.extend<BookingFixtures>({
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
});

export { expect } from '@playwright/test';
