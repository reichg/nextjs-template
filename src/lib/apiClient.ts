import type { ApiResponse, Item } from '@/lib/types';
import type { CreateItemInput } from '@/lib/schemas';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

/**
 * Parses a same-origin JSON `ApiResponse` envelope.
 * On a non-ok response, throws an `Error` carrying the server-provided
 * `{ error }` message, falling back to a generic message so no internals leak.
 */
async function parseEnvelope<T>(res: Response): Promise<T> {
  let body: ApiResponse<T> | null = null;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    body = null;
  }

  if (!res.ok || body === null || 'error' in body) {
    const message =
      body !== null && 'error' in body && typeof body.error === 'string'
        ? body.error
        : GENERIC_ERROR;
    throw new Error(message);
  }

  return body.data;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  return parseEnvelope<T>(res);
}

/** Typed, same-origin API client. Uses relative paths only. */
export const apiClient = {
  getItems(): Promise<Item[]> {
    return request<Item[]>('/api/items');
  },
  createItem(input: CreateItemInput): Promise<Item> {
    return request<Item>('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  },
};
