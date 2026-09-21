import { test, expect } from '../../fixtures/booking.fixture';
import { buildCustomer } from '../../test-data/customer.factory';

const scenarioCount = 3;

test.describe('Public booking', () => {
  test('client can book an available service', async ({ bookingPage, page, request }, testInfo) => {
    const customer = buildCustomer();
    await bookingPage.open();
    await bookingPage.selectService();
    const slot = await bookingPage.selectAvailableSlot(testInfo.repeatEachIndex * scenarioCount + 0, testInfo.project.repeatEach * scenarioCount);
    await bookingPage.fillCustomer(customer);
    const appointment = await bookingPage.submit();

    await expect(bookingPage.confirmation).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/success/${appointment.id}(?:\\?|$)`));
    await expect(page.getByText(bookingPage.serviceName, { exact: true })).toBeVisible();
    await expect(page.getByText(`${slot.time}–`, { exact: false })).toBeVisible();
    const expectedAppointment = {
      status: 'created',
      price: 100,
      duration: 1800,
      client: { first_name: customer.name },
      branch: { slug: bookingPage.bookingPath.slice(1) },
      services: [{ title: bookingPage.serviceName, quantity: 1 }],
    };
    expect(appointment).toMatchObject(expectedAppointment);
    expect(appointment.start_at.slice(0, 16)).toBe(`${slot.date}T${slot.time}`);

    const persisted = await request.get(`https://api.natodi.com/api/v1/appointments/${appointment.id}`);
    expect(persisted.status()).toBe(200);
    expect((await persisted.json()).data).toMatchObject({
      ...expectedAppointment,
      id: appointment.id,
      start_at: appointment.start_at,
    });
    await testInfo.attach('created-appointment', {
      body: JSON.stringify({ id: appointment.id, customer: customer.name, ...slot }),
      contentType: 'application/json',
    });
  });

  test('incomplete phone number prevents submission', async ({ bookingPage, page }, testInfo) => {
    await bookingPage.open();
    await bookingPage.selectService();
    await bookingPage.selectAvailableSlot(testInfo.repeatEachIndex * scenarioCount + 1, testInfo.project.repeatEach * scenarioCount);
    await bookingPage.fillCustomer(buildCustomer());
    await bookingPage.phoneInput.fill('123');
    await bookingPage.phoneInput.press('Tab');

    await expect(page.getByText('Невірно введений номер', { exact: true })).toBeVisible();
    await expect(bookingPage.submitButton).toBeDisabled();
    await expect(page).toHaveURL(/\/confirmation\?/);
    await expect(bookingPage.confirmation).toBeHidden();
  });

  test('missing required name prevents submission with an otherwise complete form', async ({ bookingPage, page }, testInfo) => {
    await bookingPage.open();
    await bookingPage.selectService();
    await bookingPage.selectAvailableSlot(testInfo.repeatEachIndex * scenarioCount + 2, testInfo.project.repeatEach * scenarioCount);
    await bookingPage.fillCustomer(buildCustomer());
    await expect(bookingPage.submitButton).toBeEnabled();
    await bookingPage.nameInput.clear();
    await bookingPage.nameInput.press('Tab');

    await expect(bookingPage.nameInput).toHaveValue('');
    await expect(bookingPage.submitButton).toBeDisabled();
    await expect(page).toHaveURL(/\/confirmation\?/);
    await expect(bookingPage.confirmation).toBeHidden();
  });
});
