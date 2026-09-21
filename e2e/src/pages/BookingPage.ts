import { expect, type Locator, type Page, type Response } from '@playwright/test';
import type { Customer } from '../test-data/customer.factory';

export interface BookingSlot {
  date: string;
  time: string;
}

export interface Appointment {
  id: string;
  status: string;
  start_at: string;
  duration: number;
  price: number;
  client: { first_name: string };
  services: Array<{ title: string; quantity: number }>;
  branch: { slug: string };
}

export class BookingPage {
  readonly createdAppointmentIds: string[] = [];
  readonly bookingPath = process.env.BOOKING_PATH ?? '/qa-barbershop-0921';
  readonly serviceName = process.env.SERVICE_NAME ?? 'QA Haircut';
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;
  readonly confirmation: Locator;

  constructor(private readonly page: Page) {
    // Natodi can generate duplicate input ids, breaking label associations.
    // Scope by the observed form control instead of its unreliable accessible name.
    this.nameInput = page.locator('app-input[formcontrolname="first_name"]').getByRole('textbox');
    this.phoneInput = page.locator('app-input[formcontrolname="phone_number"]').getByRole('textbox');
    this.submitButton = page.getByRole('button', { name: 'Записатись', exact: true });
    this.confirmation = page.getByText('Ви успішно записалися!', { exact: true });
  }

  async open(): Promise<void> {
    const slug = this.bookingPath.replace(/^\/+|\/+$/g, '');
    const [response] = await Promise.all([
      this.page.waitForResponse((r) =>
        r.request().method() === 'GET' &&
        new URL(r.url()).pathname === `/api/v1/branches/${slug}/slug`,
      ),
      this.page.goto(this.bookingPath),
    ]);
    if (!response.ok()) {
      const body = await response.json().catch(() => ({}));
      const detail = body.detail ?? body;
      throw new Error(
        `Booking tenant "${slug}" unavailable: HTTP ${response.status()}, ` +
        `code ${detail.error_code ?? 'unknown'}: ${detail.message ?? 'no details'}`,
      );
    }
    await expect(this.page.getByText('Ваш запис', { exact: true })).toBeVisible();
  }

  async selectService(): Promise<void> {
    await this.page.getByText('Оберіть послуги', { exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Введіть назву послуги' }).fill(this.serviceName);
    // The app's add button has no accessible name. Scope it to the named card.
    const card = this.page.locator('app-short-info-card').filter({
      has: this.page.getByText(this.serviceName, { exact: true }),
    });
    await expect(card).toHaveCount(1);
    await card.getByRole('button').click();
    await expect(this.page.getByRole('contentinfo')).toContainText('1 послуга');
  }

  async selectAvailableSlot(lane: number, lanes: number): Promise<BookingSlot> {
    const [datesResponse] = await Promise.all([
      this.page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/book_dates/dates'),
      this.page.getByText('Дата та час', { exact: true }).click(),
    ]);
    const dates = await this.readAvailability(datesResponse);
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    const limit = new Date(`${today}T12:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + 14);
    const endDate = limit.toISOString().slice(0, 10);
    // Partition calendar dates, not array positions: fully booked dates cannot shift lanes.
    const candidates = dates.filter((date) => date > today && date <= endDate)
      .sort().filter((date) => Math.floor(Date.parse(date) / 86_400_000) % lanes === lane);

    for (const date of candidates) {
      const label = new Intl.DateTimeFormat('uk-UA', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
      }).format(new Date(`${date}T12:00:00Z`));
      const day = this.page.getByRole('cell', { name: label, exact: true });
      if (await day.count() === 0) {
        await this.page.getByRole('button', { name: 'Next Month', exact: true }).click();
      }
      const [timesResponse] = await Promise.all([
        this.page.waitForResponse((r) => {
          const url = new URL(r.url());
          return url.pathname === '/api/v1/book_dates/times' && url.searchParams.get('book_date') === date;
        }),
        day.click(),
      ]);
      const times = await this.readAvailability(timesResponse);
      if (times.length === 0) continue;
      const time = times[0].slice(0, 5);
      await this.page.getByText(time, { exact: true }).click();
      await this.page.getByRole('contentinfo').getByText('Продовжити', { exact: true }).click();
      await expect(this.page.getByText('Ваш запис', { exact: true })).toBeVisible();
      const [validation] = await Promise.all([
        this.page.waitForResponse((r) =>
          r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/v1/appointments/validate',
        ),
        this.page.getByRole('button', { name: 'Продовжити', exact: true }).click(),
      ]);
      expect(validation.status(), `Slot ${date} ${time} rejected: ${await validation.text()}`).toBe(200);
      await expect(this.nameInput).toBeVisible();
      return { date, time };
    }
    throw new Error(`No available slot for lane ${lane + 1}/${lanes} between ${today} and ${endDate}. Check tenant working hours.`);
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.nameInput.fill(customer.name);
    // Natodi adds +38 itself; passing an international number duplicates the prefix.
    await this.phoneInput.fill(customer.nationalPhone);
    await this.page.getByRole('textbox', { name: 'email@example.com', exact: true }).fill(customer.email);
  }

  async submit(): Promise<Appointment> {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) =>
        r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/v1/appointments/',
      ),
      this.submitButton.click(),
    ]);
    expect(response.status(), 'Appointment creation response').toBe(200);
    const body = await response.json() as { data: Appointment };
    expect(body.data.id).toMatch(/^[0-9a-f-]{36}$/i);
    this.createdAppointmentIds.push(body.data.id);
    return body.data;
  }

  private async readAvailability(response: Response): Promise<string[]> {
    expect(response.status(), 'Availability response').toBe(200);
    const body: { data?: unknown } = await response.json();
    if (!Array.isArray(body.data) || !body.data.every((item): item is string => typeof item === 'string')) {
      throw new Error('Availability response must contain a string array in data');
    }

    return body.data;
  }
}
