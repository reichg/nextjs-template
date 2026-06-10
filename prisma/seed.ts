import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Standalone client for the seed script (runs outside the Next.js runtime,
// so the dev hot-reload singleton in src/server/db/prisma.ts does not apply).
// Prisma 7 requires a driver adapter; the schema no longer carries the URL.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// DELETE ME: example seed data for the template's `Item` example slice.
// Item has no unique business key, so idempotency uses a count-guard instead
// of upsert: rows are only inserted when the table is empty.
const items: ReadonlyArray<{ title: string; body: string }> = [
  { title: 'First example item', body: 'Replace this with your real data.' },
  { title: 'Second example item', body: 'Replace this with your real data.' },
];

async function main(): Promise<void> {
  const count = await prisma.item.count();
  if (count === 0) {
    await prisma.item.createMany({ data: [...items] });
  }
}

main()
  .catch((error: unknown) => {
    // Surface a generic failure without leaking connection details or raw
    // database internals. Only the safe message is logged; non-zero exit code
    // signals failure to the caller.
    const message =
      error instanceof Error ? error.message : 'Unknown seed error';
    console.error(`Seed failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
