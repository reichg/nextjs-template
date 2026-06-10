import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, create } = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: { item: { findMany, create } },
}));

import { itemService } from '@/server/services/itemService';

beforeEach(() => {
  findMany.mockReset();
  create.mockReset();
});

describe('itemService.listItems', () => {
  it('maps rows to Items, converting createdAt Date to an ISO string', async () => {
    const createdAt = new Date('2026-06-10T12:00:00.000Z');
    findMany.mockResolvedValue([
      { id: 'a', title: 'First', body: 'Body', createdAt },
      { id: 'b', title: 'Second', body: null, createdAt },
    ]);

    const items = await itemService.listItems();

    expect(items).toEqual([
      {
        id: 'a',
        title: 'First',
        body: 'Body',
        createdAt: '2026-06-10T12:00:00.000Z',
      },
      {
        id: 'b',
        title: 'Second',
        body: null,
        createdAt: '2026-06-10T12:00:00.000Z',
      },
    ]);
    expect(items[0].createdAt).toBe('2026-06-10T12:00:00.000Z');
  });
});

describe('itemService.createItem', () => {
  it('creates an item and maps the row to an Item', async () => {
    const createdAt = new Date('2026-06-10T12:00:00.000Z');
    create.mockResolvedValue({
      id: 'c',
      title: 'New',
      body: 'Body',
      createdAt,
    });

    const item = await itemService.createItem({ title: 'New', body: 'Body' });

    expect(create).toHaveBeenCalledWith({
      data: { title: 'New', body: 'Body' },
      select: { id: true, title: true, body: true, createdAt: true },
    });
    expect(item).toEqual({
      id: 'c',
      title: 'New',
      body: 'Body',
      createdAt: '2026-06-10T12:00:00.000Z',
    });
  });

  it('defaults an omitted body to null when persisting', async () => {
    create.mockResolvedValue({
      id: 'd',
      title: 'No body',
      body: null,
      createdAt: new Date('2026-06-10T12:00:00.000Z'),
    });

    const item = await itemService.createItem({ title: 'No body' });

    expect(create).toHaveBeenCalledWith({
      data: { title: 'No body', body: null },
      select: { id: true, title: true, body: true, createdAt: true },
    });
    expect(item.body).toBeNull();
  });
});
