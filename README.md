# fullstack-template

A reusable full-stack starter template for building typed, validated web apps with a clean
layer separation. Ships with a deletable example feature slice so you can replace it with your
own domain.

**Stack:** Next.js (App Router) · TypeScript · React · CSS Modules · Prisma + PostgreSQL · Zod · Vitest · pnpm

## What's included

The template provides the seams you usually rebuild on every project:

- **Startup env validation** — `src/server/env.ts` (server-only) validates `process.env` once at load
  via Zod and fails fast by KEY name (never by value, so secrets never leak into logs).
- **Safe error mapping** — `src/lib/errors.ts` maps internal errors to safe HTTP responses without
  leaking stack traces or raw database errors.
- **Auth seam** — `src/lib/auth.ts` is the single place to resolve identity. It returns `null`
  until you wire a real session backend (see [Auth](#auth)).
- **Typed API client** — `src/lib/apiClient.ts` for client-side fetches with shared types.
- **Service layer** — business logic lives in `src/server/services/*`, keeping route handlers thin.
- **Example "Item" slice** — a reference feature that exercises every layer end to end and is meant
  to be renamed or deleted (see [Example feature](#example-feature-item)).

### Project structure

```text
src/
  app/            Next.js App Router pages and api/** route handlers
  components/     Presentational React components (CSS Modules)
  hooks/          Client data hooks (e.g. useItems)
  lib/            errors, auth, schemas, types, apiClient (browser-safe / isomorphic)
  server/
    env.ts        Startup env validation (server-only, reads process.env)
    db/           Prisma client
    services/     Business logic / service modules
prisma/           schema.prisma and seed.ts
```

Modules under `src/server` are server-only (they read secrets or `process.env`, e.g.
`src/server/env.ts`) and must never be imported into client components; `src/lib` is for
browser-safe/isomorphic code.

## Prerequisites

- **Node.js** 24 LTS.
- **pnpm** 10.x (the repo pins `pnpm@10.34.2`; `engine-strict` is enabled).
- **PostgreSQL** 14+ running locally or reachable via `DATABASE_URL`.

## Getting started

```bash
pnpm install
cp .env.example .env       # then set DATABASE_URL in .env
pnpm prisma:migrate        # apply schema, create the local database
pnpm prisma:generate       # generate the Prisma client
pnpm db:seed               # seed example data
pnpm dev                   # start the dev server (http://localhost:3000)
```

> **Prisma 7 CLI note:** With the root `prisma.config.ts`, Prisma 7 no longer auto-loads `.env`
> for CLI commands, so `DATABASE_URL` must already be present in the shell environment before running
> `pnpm prisma:generate`, `pnpm prisma:migrate`, or `pnpm db:seed`. Locally, export `.env` into your
> shell first (the app runtime connects via the `@prisma/adapter-pg` driver adapter in
> `src/server/db/prisma.ts`); CI sets `DATABASE_URL` in the workflow environment.

## Environment

The only required variable is validated at startup by `src/server/env.ts`. A missing or malformed
value fails fast by name.

| Variable       | Description                         |
| -------------- | ----------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (URL). |

Use placeholders during local setup and never commit real secrets. `.env` is for local values only.

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `pnpm dev`             | Start the dev server.                    |
| `pnpm build`           | Production build.                        |
| `pnpm start`           | Run the production build.                |
| `pnpm lint`            | Lint with ESLint (flat config).          |
| `pnpm typecheck`       | `tsc --noEmit`, strict.                  |
| `pnpm test`            | Run Vitest once.                         |
| `pnpm test:watch`      | Run Vitest in watch mode.                |
| `pnpm format`          | Format with Prettier.                    |
| `pnpm format:check`    | Check formatting without writing.        |
| `pnpm prisma:generate` | Regenerate the Prisma client.            |
| `pnpm prisma:migrate`  | Apply migrations (`prisma migrate dev`). |
| `pnpm db:seed`         | Seed the database via `prisma/seed.ts`.  |

## API

| Method | Path          | Purpose         |
| ------ | ------------- | --------------- |
| `GET`  | `/api/health` | Liveness check. |
| `GET`  | `/api/items`  | List items.     |
| `POST` | `/api/items`  | Create an item. |

## Example feature: Item

The "Item" feature is a **reference slice**, not a real domain. It demonstrates the full path
through every layer:

```text
prisma/schema.prisma            Item model
src/lib/schemas.ts              Zod schemas (trust boundary)
src/server/services/itemService.ts   Business logic
src/app/api/items/route.ts      Thin route handler (GET/POST)
src/hooks/useItems.ts           Client data hook
src/components/ItemList.tsx     Presentational component
src/app/page.tsx                Page that renders the list
```

To build a real feature, copy this slice and rename `Item` to your domain across the schema,
service, schemas, route, hook, component, and page — then run `pnpm prisma:migrate`. To remove it
entirely, delete the files above (and the `Item` model) and replace the references in `page.tsx`.

## Auth

`src/lib/auth.ts` is an auth **seam**, not an implementation. `getCurrentUser` returns `null` until
you wire a real session backend (cookie / JWT / auth provider) inside that module. Treat a `null`
result as unauthenticated and deny access; the seam never fabricates an authenticated user, and it
must never trust client-supplied identity values.

## Conventions

- **Server-only modules stay server-only.** Modules under `src/server` that read secrets or
  `process.env` (e.g. `src/server/env.ts`) must never be imported into client components.
- **Validate at trust boundaries.** Parse external input (request bodies, env) with Zod before use.
- **Keep routes thin.** Route handlers should delegate to service modules and map errors safely.
- **Business logic lives in services.** Put domain rules in `src/server/services/*`, not in routes.
- **Separate UI from data logic.** Keep presentational components free of fetching; put data access
  in hooks and the typed API client.
- **Evolve schema and deployments with expand-and-contract.** Ship backward-compatible additions
  first, roll them out, and remove the old path only after the previous version has drained. Gate
  risky or breaking changes behind feature flags so adjacent versions stay compatible.

## CI

A GitHub Actions workflow runs `pnpm typecheck`, `pnpm lint`, and `pnpm test` on push.
