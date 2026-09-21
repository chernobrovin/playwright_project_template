import { expect, test } from '@playwright/test';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.userId === 'number' &&
    typeof todo.id === 'number' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean'
  );
}

test.describe('Public REST API', () => {
  test('GET /todos/1 returns a successful response with the expected schema', async ({
    request,
  }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/todos/1',
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);

    const body: unknown = await response.json();

    expect(isTodo(body)).toBe(true);

    if (!isTodo(body)) {
      throw new Error('Response does not match the Todo schema');
    }

    expect(body.id).toBe(1);
    expect(body.title.length).toBeGreaterThan(0);
  });

  test('GET an unknown todo returns 404', async ({ request }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/todos/999999',
    );

    expect(response.status()).toBe(404);
    expect(await response.text()).toBe('{}');
  });
});
