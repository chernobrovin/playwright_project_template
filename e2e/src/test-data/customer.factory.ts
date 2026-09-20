export interface Customer {
  name: string;
  phone: string;
  email: string;
}

function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
}

export function buildCustomer(): Customer {
  const suffix = uniqueSuffix();

  return {
    name: `QA Candidate ${suffix.slice(-6)}`,
    phone: `+38067${suffix.slice(-7).padStart(7, '0')}`,
    email: `qa+${suffix}@example.com`,
  };
}
