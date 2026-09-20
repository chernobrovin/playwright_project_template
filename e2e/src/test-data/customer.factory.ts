import { randomInt, randomUUID } from 'node:crypto';

export interface Customer {
  name: string;
  nationalPhone: string;
  email: string;
}

export function buildCustomer(): Customer {
  const id = randomUUID();
  return {
    name: `QA-${id}`,
    // Synthetic 000 prefix: do not generate plausible subscriber numbers.
    nationalPhone: `000${randomInt(1, 10_000_000).toString().padStart(7, '0')}`,
    email: `qa-${id}@example.com`,
  };
}
