import { test as base, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';

interface BookingFixtures {
  bookingPage: BookingPage;
}

export const test = base.extend<BookingFixtures>({
  bookingPage: async ({ page, request }, use, testInfo) => {
    const bookingPage = new BookingPage(page);
    try {
      await use(bookingPage);
    } finally {
      for (const id of bookingPage.createdAppointmentIds) {
        const url = `https://api.natodi.com/api/v1/appointments/${id}`;
        const deleted = await request.delete(url);
        expect(deleted.status(), `Cleanup of this test's appointment ${id}`).toBe(200);
        const readback = await request.get(url);
        expect(readback.status(), 'Deleted appointment is no longer retrievable').toBe(404);
        await testInfo.attach('appointment-cleanup', {
          body: JSON.stringify({ id, deleteStatus: deleted.status(), readbackStatus: readback.status() }),
          contentType: 'application/json',
        });
      }
    }
  },
});

export { expect } from '@playwright/test';
