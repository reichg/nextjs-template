import { z } from 'zod';

/**
 * Server-only environment access.
 *
 * Lives under `src/server/` because it reads and exposes secret credentials;
 * `src/server/` is the server-only directory, while `src/lib/` is browser-safe.
 * `process.env` is validated exactly once at module load. Never import this
 * module from a client component — it exposes secret credentials.
 */
const envSchema = z.object({
  DATABASE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // List offending keys by name only. Derive them from the top-level path
  // segment of each Zod issue. Never include values, which may be secrets,
  // in the thrown message or any log output.
  const invalidKeys = [
    ...new Set(
      parsed.error.issues
        .map((issue) => issue.path[0])
        .filter((key): key is string => typeof key === 'string'),
    ),
  ];
  throw new Error(
    `Invalid or missing environment variables: ${invalidKeys.join(', ')}`,
  );
}

export const env = parsed.data;
