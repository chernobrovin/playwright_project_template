import { test, expect } from '../../fixtures/booking.fixture';
import { buildCustomer } from '../../test-data/customer.factory';

test.describe('Public booking', () => {
  test('client can book an available service', async ({ bookingPage }) => {
    const customer = buildCustomer();

    await test.step('Open the public booking page', async () => {
      await bookingPage.open();
    });

    await test.step('Select a service and an available time slot', async () => {
      await bookingPage.selectFirstService();
      const selectedTime = await bookingPage.selectFirstAvailableSlot();
      expect(selectedTime).toMatch(/^\d{1,2}:\d{2}$/);
    });

    await test.step('Provide valid client details and confirm', async () => {
      await bookingPage.fillCustomer(customer);
      await bookingPage.submitBooking();
    });

    await test.step('Verify booking confirmation', async () => {
      await bookingPage.expectConfirmation();
    });
  });

  test('client cannot submit a booking with an invalid phone number', async ({
    bookingPage,
  }) => {
    const customer = buildCustomer();

    await bookingPage.open();
    await bookingPage.selectFirstService();
    await bookingPage.selectFirstAvailableSlot();
    await bookingPage.fillCustomer(customer);
    await bookingPage.fillInvalidPhone('123');

    await bookingPage.submitBooking();

    await bookingPage.expectPhoneValidation();
    await bookingPage.expectNoConfirmation();
  });

  test('client cannot submit a booking without required customer details', async ({
    bookingPage,
  }) => {
    await bookingPage.open();
    await bookingPage.selectFirstService();
    await bookingPage.selectFirstAvailableSlot();

    await bookingPage.submitBooking();

    await bookingPage.expectRequiredFieldValidation();
    await bookingPage.expectNoConfirmation();
  });
});
