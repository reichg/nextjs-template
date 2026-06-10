import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/server/env';

// Reuse a single PrismaClient across Next.js dev hot-reloads. Without the
// global guard, each reload would instantiate a new client and exhaust the
// database connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires a driver adapter; the schema no longer carries the URL.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Avoid emitting the connection string; only surface high-level events.
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
