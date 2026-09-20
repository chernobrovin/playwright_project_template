import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '../test-data/customer.factory';

interface ApiErrorResponse {
  error_code?: number;
  message?: string;
}

export class BookingPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    const bookingPath = process.env.BOOKING_PATH ?? '/barbershop-kyiv';
    const slug = bookingPath.replace(/^\/+|\/+$/g, '');

    const branchResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes(`/api/v1/branches/${slug}/slug`),
    );

    await this.page.goto(bookingPath);
    const response = await branchResponse;

    if (!response.ok()) {
      let details = `HTTP ${response.status()}`;

      try {
        const body = (await response.json()) as ApiErrorResponse;
        const errorCode =
          body.error_code === undefined ? '' : `, error_code ${body.error_code}`;
        const message = body.message ? `: ${body.message}` : '';
        details += `${errorCode}${message}`;
      } catch {
        // The HTTP status is still enough to diagnose an unavailable tenant.
      }

      throw new Error(
        `Booking environment precondition failed for "${slug}": ${details}`,
      );
    }

    await expect(this.page.getByText('Ваш запис', { exact: true })).toBeVisible();
  }

  async selectFirstService(): Promise<void> {
    const servicePicker = this.page.getByText('Оберіть послуги', { exact: true });

    await expect(servicePicker).toBeVisible();
    await servicePicker.click();

    const serviceName = process.env.SERVICE_NAME;
    const service = serviceName
      ? this.page.getByText(serviceName, { exact: true })
      : this.page
          .locator('app-list-items-by-category')
          .getByRole('button')
          .first();

    await expect(service).toBeVisible();
    await service.click();
  }

  async selectFirstAvailableSlot(): Promise<string> {
    const timePicker = this.page.getByText('Оберіть час', { exact: true });

    if (await timePicker.isVisible()) {
      await timePicker.click();
    }

    const slot = this.firstMatch([
      this.page.getByRole('button', { name: /^\d{1,2}:\d{2}$/ }),
      this.page.getByText(/^\d{1,2}:\d{2}$/, { exact: true }),
    ]);

    await expect(slot).toBeVisible();
    const label = (await slot.innerText()).trim();
    await slot.click();

    return label;
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.fillFirstMatch(
      [
        this.page.getByLabel(/ім['’]?я|name/i),
        this.page.getByPlaceholder(/ім['’]?я|name/i),
        this.page.locator('input[name*="name" i]'),
      ],
      customer.name,
    );

    await this.fillFirstMatch(
      [
        this.page.getByLabel(/телефон|phone/i),
        this.page.getByPlaceholder(/телефон|phone/i),
        this.page.locator('input[type="tel"]'),
      ],
      customer.phone,
    );

    const email = this.firstMatch([
      this.page.getByLabel(/email|e-mail|пошт/i),
      this.page.getByPlaceholder(/email|e-mail|пошт/i),
      this.page.locator('input[type="email"]'),
    ]);

    if (await email.count()) {
      await email.fill(customer.email);
    }
  }

  async submitBooking(): Promise<void> {
    const submit = this.firstMatch([
      this.page.getByRole('button', {
        name: /продовжити|підтверд|записат|забронювати|confirm|book/i,
      }),
      this.page.locator('button[type="submit"]'),
    ]);

    await expect(submit).toBeEnabled();
    await submit.click();
  }

  async expectConfirmation(): Promise<void> {
    await expect(
      this.page
        .getByText(
          /успіш|підтвердж|запис створено|бронювання|confirmed|success/i,
        )
        .first(),
    ).toBeVisible();
  }

  async fillInvalidPhone(phone: string): Promise<void> {
    const phoneInput = this.firstMatch([
      this.page.getByLabel(/телефон|phone/i),
      this.page.getByPlaceholder(/телефон|phone/i),
      this.page.locator('input[type="tel"]'),
    ]);

    await expect(phoneInput).toBeVisible();
    await phoneInput.fill(phone);
  }

  async expectPhoneValidation(): Promise<void> {
    await expect(
      this.page
        .getByText(/телефон.*(невір|некорект|invalid)|invalid.*phone/i)
        .first(),
    ).toBeVisible();
  }

  async expectRequiredFieldValidation(): Promise<void> {
    await expect(
      this.page
        .getByText(/обов['’]?язков|required|заповніть|вкажіть/i)
        .first(),
    ).toBeVisible();
  }

  async expectNoConfirmation(): Promise<void> {
    await expect(
      this.page
        .getByText(
          /успіш|підтвердж|запис створено|бронювання.*створ|confirmed|success/i,
        )
        .first(),
    ).toBeHidden();
  }

  private firstMatch(candidates: Locator[]): Locator {
    return candidates
      .reduce((combined, candidate) => combined.or(candidate))
      .first();
  }

  private async fillFirstMatch(
    candidates: Locator[],
    value: string,
  ): Promise<void> {
    const input = this.firstMatch(candidates);
    await expect(input).toBeVisible();
    await input.fill(value);
  }
}
