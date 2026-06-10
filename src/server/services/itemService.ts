// DELETE-ME: example reference service for the Item example slice; remove when building real domain logic.
import { prisma } from '@/server/db/prisma';
import type { CreateItemInput } from '@/lib/schemas';
import type { Item } from '@/lib/types';

// Shared projection: keeps the read and create paths returning the same shape.
const itemSelect = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
} as const;

type ItemRow = {
  id: string;
  title: string;
  body: string | null;
  createdAt: Date;
};

function toItem(row: ItemRow): Item {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

async function listItems(): Promise<Item[]> {
  const rows = await prisma.item.findMany({
    select: itemSelect,
    orderBy: { createdAt: 'desc' },
  });

  return rows.map(toItem);
}

async function createItem(input: CreateItemInput): Promise<Item> {
  const row = await prisma.item.create({
    data: { title: input.title, body: input.body ?? null },
    select: itemSelect,
  });

  return toItem(row);
}

export const itemService = { listItems, createItem };
