import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '../test-data/customer.factory';

export class BookingPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    const bookingPath = process.env.BOOKING_PATH ?? '/barbershop-kyiv';
    await this.page.goto(bookingPath);
    await expect(this.page.locator('body')).toBeVisible();
  }

  async selectFirstService(): Promise<void> {
    const service = this.firstVisible([
      this.page.getByRole('button', { name: /обрати|вибрати|записат|book|select/i }),
      this.page.getByRole('link', { name: /обрати|вибрати|записат|book|select/i }),
    ]);

    await expect(service).toBeVisible();
    await service.click();
  }

  async selectFirstAvailableSlot(): Promise<string> {
    const slot = this.firstVisible([
      this.page.getByRole('button', { name: /^\d{1,2}:\d{2}$/ }),
      this.page.locator('button').filter({ hasText: /^\s*\d{1,2}:\d{2}\s*$/ }),
    ]);

    await expect(slot).toBeVisible();
    const label = (await slot.innerText()).trim();
    await slot.click();

    return label;
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.fillFirstAvailable(
      [
        this.page.getByLabel(/ім['’]?я|name/i),
        this.page.getByPlaceholder(/ім['’]?я|name/i),
        this.page.locator('input[name*="name" i]'),
      ],
      customer.name,
    );

    await this.fillFirstAvailable(
      [
        this.page.getByLabel(/телефон|phone/i),
        this.page.getByPlaceholder(/телефон|phone/i),
        this.page.locator('input[type="tel"]'),
      ],
      customer.phone,
    );

    const email = this.firstVisible([
      this.page.getByLabel(/email|e-mail|пошт/i),
      this.page.getByPlaceholder(/email|e-mail|пошт/i),
      this.page.locator('input[type="email"]'),
    ]);

    if (await email.count()) {
      await email.fill(customer.email);
    }
  }

  async submitBooking(): Promise<void> {
    const submit = this.firstVisible([
      this.page.getByRole('button', {
        name: /підтверд|записат|забронювати|confirm|book/i,
      }),
      this.page.locator('button[type="submit"]'),
    ]);

    await expect(submit).toBeEnabled();
    await submit.click();
  }

  async expectConfirmation(): Promise<void> {
    await expect(
      this.page.getByText(
        /успіш|підтвердж|запис створено|бронювання|confirmed|success/i,
      ).first(),
    ).toBeVisible();
  }

  async fillInvalidPhone(phone: string): Promise<void> {
    const phoneInput = this.firstVisible([
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
    const validation = this.page
      .getByText(/обов['’]?язков|required|заповніть|вкажіть/i)
      .first();

    await expect(validation).toBeVisible();
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

  private firstVisible(candidates: Locator[]): Locator {
    return candidates
      .reduce((combined, candidate) => combined.or(candidate))
      .first();
  }

  private async fillFirstAvailable(
    candidates: Locator[],
    value: string,
  ): Promise<void> {
    const input = this.firstVisible(candidates);
    await expect(input).toBeVisible();
    await input.fill(value);
  }
}
