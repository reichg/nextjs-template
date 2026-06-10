import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/lib/apiClient';
import type { Item } from '@/lib/types';

const ITEM: Item = {
  id: 'item-1',
  title: 'A title',
  body: 'A body',
  createdAt: '2026-06-10T00:00:00.000Z',
};

/** Builds a minimal `Response`-like stub for the parser under test. */
function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiClient.getItems', () => {
  it('parses the { data } envelope into items', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: [ITEM] }));
    vi.stubGlobal('fetch', fetchMock);

    const items = await apiClient.getItems();

    expect(items).toEqual([ITEM]);
    expect(fetchMock).toHaveBeenCalledWith('/api/items', undefined);
  });

  it('throws the server-provided message on an { error } envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ error: 'Items unavailable' }, false, 503),
        ),
    );

    await expect(apiClient.getItems()).rejects.toThrow('Items unavailable');
  });

  it('throws a generic message on a non-ok response with no error body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(null, false, 500)),
    );

    await expect(apiClient.getItems()).rejects.toThrow(
      'Something went wrong. Please try again.',
    );
  });
});

describe('apiClient.createItem', () => {
  it('POSTs the input and parses the { data } envelope', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: ITEM }));
    vi.stubGlobal('fetch', fetchMock);

    const created = await apiClient.createItem({
      title: 'A title',
      body: 'A body',
    });

    expect(created).toEqual(ITEM);
    expect(fetchMock).toHaveBeenCalledWith('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'A title', body: 'A body' }),
    });
  });

  it('throws the server-provided message on an { error } envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(jsonResponse({ error: 'Invalid item' }, false, 400)),
    );

    await expect(apiClient.createItem({ title: 'A title' })).rejects.toThrow(
      'Invalid item',
    );
  });
});
