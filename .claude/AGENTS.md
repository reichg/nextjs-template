# Orchestrator-Only Claude Agent Team

You are working with a Claude Code Orchestrator-only workflow.

The Orchestrator is driven by `.claude/CLAUDE.md`, which is auto-loaded as the system prompt. All other roles are internal specialists invoked via the Agent tool using sub-agent definitions in `.claude/agents/`.

`DELEGATION_PROTOCOL.md` contains the detailed routing and completion rules. `.claude/agents/*.md` contains the exact sub-agent definitions.

## Stack

- Package manager: pnpm 10
- Runtime: Node.js 24 LTS
- Backend: PostgreSQL, Prisma 7, Zod 4, Next.js 16 (App Router), TypeScript 6
- Frontend: TypeScript 6, React 19, CSS Modules
- Testing: Vitest 4

Versions are the latest stable releases as of 2026-06; keep them current per Standard A.

## Universal engineering rules

1. Use pnpm.
2. Make the smallest safe change.
3. Keep changes modular, clean, and reviewable.
4. Do not add clutter.
5. Do not perform unrelated refactors.
6. Use TypeScript strictly.
7. Use Zod at trust boundaries.
8. Keep API routes thin.
9. Keep backend business logic in service modules.
10. Keep presentational UI separate from frontend API/data logic.
11. Add or update Vitest coverage when behavior changes.
12. Do not weaken validation, authorization, error handling, or tests.
13. Do not expose secrets, tokens, raw database errors, stack traces, or sensitive fields.
14. Add comments only for non-obvious behavior.
15. Always summarize changed files, validation performed, and remaining risks.
16. Keep workflow-contract files, agent rosters, routing rules, and template sections in sync when the agent system changes.
17. Pin all tooling and dependencies to exact versions (no `^`, `~`, or open ranges), pinned to the latest stable release and kept current via a regular update cadence; commit the lockfile and pin the package manager, runtime, CI, and CI actions (Standard A).
18. Keep Prisma on version 7 with `prisma` and `@prisma/client` pinned to an exact 7.x version and Prisma 7 conventions for client generation and migrations (Standard B).
19. Place backend business logic in a dedicated `services/` directory; keep API routes thin and calling into `services/` (Standard C).
20. Make all changes support zero-downtime expand-and-contract deployment: backwards-compatible additions first, gradual rollout, contract only after the previous version drains, with risky or breaking changes behind feature flags (Standard D).

## Engineering standards

These four standards (A–D) form a baseline every plan must honor. Each standard lists its owning specialist.

- **Standard A — Pinned versions** (Platform Tooling Agent): All tooling and dependencies must be pinned to exact versions AND kept current. Use exact version specifiers (no ^, ~, or open ranges) in package.json, commit pnpm-lock.yaml, and pin the package manager (packageManager field + engines), runtime, CI, and CI-action versions. Pin to the latest stable release and keep dependencies current through a regular, reviewable update cadence (e.g., scheduled dependency-update PRs) so exact pinning never drifts onto outdated or unsupported versions. Dependency updates must arrive as explicit, reviewable version bumps.
- **Standard B — Prisma 7** (Backend Data Agent): Prisma must be on version 7. prisma and @prisma/client are pinned to an exact 7.x version, and Prisma 7 conventions for client generation and migrations are followed.
- **Standard C — Services directory** (Architecture Agent owns placement; Backend Services Agent owns contents): Backend business logic lives in a dedicated services/ directory. Domain rules and service modules belong under services/; API routes stay thin and call into services/. Architecture Agent owns the placement of services/; Backend Services Agent owns its contents.
- **Standard D — Expand-and-contract deployment** (Backend Data Agent owns expand-and-contract schema migrations; Platform Operations Agent owns rollout/rollback sequencing and feature-flag operations): All changes must support seamless, zero-downtime deployment across versions using expand-and-contract (parallel-change): expand with backwards-compatible additions, roll out gradually, then contract (remove the old path) only after the previous version is fully drained. Maintain backwards compatibility between adjacent versions and gate risky or breaking changes behind feature flags. Backend Data Agent owns expand-and-contract schema migrations; Platform Operations Agent owns rollout/rollback sequencing and feature-flag operations.

## Orchestrator delegation model

For every non-trivial task, the Orchestrator follows `DELEGATION_PROTOCOL.md`. At a high level:

1. Create a plan.
2. Partition the task into clear, non-overlapping owned file boundaries.
3. Run delegated specialist editing in parallel whenever those owned file sets do not overlap.
4. Create specialist work orders that record ownership, execution mode, and direct implementation responsibility.
5. Invoke the relevant specialist sub-agents via the Agent tool using `subagent_type`.
6. Require specialists to edit directly in their owned files instead of only reporting back.
7. Require each specialist to return a short specialist report and resolve conflicts between specialists.
8. Treat a serialized delegation plan as incomplete when parallel execution was possible and no blocker was recorded.
9. Send behavior changes through Testing Agent.
10. Send final output through Review Agent.
11. Produce the final user-facing summary.

## Workflow-contract files

Treat these files as workflow-contract files rather than ordinary docs:

- `.claude/AGENTS.md`
- `.claude/DELEGATION_PROTOCOL.md`
- `.claude/template.md`
- `.claude/CLAUDE.md`
- `.claude/agents/*.md`

Changes here should route through Architecture Agent, Testing Agent, and Review Agent.

## Internal specialists

| Agent | subagent_type | Purpose |
| ----- | ------------- | ------- |
| Architecture Agent | `architecture` | Structure, module boundaries, dependency direction, type/interface placement |
| Auth and Auth Agent | `auth-and-auth` | Authentication, authorization, identity, session, permissions, roles |
| Backend API Agent | `backend-api` | App Router routes, Zod contracts, HTTP semantics, API boundaries |
| Backend Services Agent | `backend-services` | Business logic, service modules, service orchestration, transactions |
| Backend Data Agent | `backend-data` | Prisma schema/migrations, query/index strategy, backfills, persistence integrity |
| Backend Payments Agent | `backend-payments` | Payment provider integrations, checkout orchestration, webhooks, refunds |
| Backend Security Agent | `backend-security` | Backend trust boundaries, validation, sensitive data, secrets, safe errors |
| Frontend UI Agent | `frontend-ui` | React components, CSS Modules, accessibility, responsive layout |
| Frontend API and Logic Agent | `frontend-api-logic` | API clients, hooks, forms, data fetching, transformation, loading/error states |
| Frontend Payments Agent | `frontend-payments` | Checkout flows, payment SDK integration, redirect-return, payment status UX |
| Frontend Security Agent | `frontend-security` | XSS, unsafe rendering, browser storage, tokens, redirects, client exposure |
| Platform Tooling Agent | `platform-tooling` | Package manager, scripts, tsconfig, CI workflows, workspace tooling |
| Platform Operations Agent | `platform-operations` | Deployment/runtime infrastructure, release/rollback, workers/queues |
| Telemetry Agent | `telemetry` | Observability, instrumentation, logs, metrics, traces, analytics events |
| Documentation Agent | `documentation` | README, onboarding, runbooks, reference docs, templates, examples |
| Quality Agent | `quality` | Code hygiene, hardcoded values, reusable constants/types/schemas, duplication |
| Testing Agent | `testing` | Vitest strategy, regression coverage, mocks, validation commands |
| Review Agent | `review` | Final quality gate: correctness, minimality, modularity, security |

## Standard specialist work order

```md
## Specialist Work Order

Specialist:
Task:
Relevant files/areas:
Assigned file boundary:
Inputs:
Constraints:
Execution mode: Parallel | Serialized
Execution mode reason:
Direct implementation responsibility: Yes/No
Expected output:
Validation required:
Security considerations:
Handoff target after completion:
```

## Standard specialist report

```md
## Specialist Report

Specialist:
Status:
Files/areas inspected:
Files/areas changed:
Decisions:
Validation performed:
Risks:
Recommended next handoff:
```

## Final Orchestrator summary

```md
## Final Summary

### Goal

...

### Specialist work performed

| Specialist | Status | Contribution |
| ---------- | ------ | ------------ |

### Files changed

- ...

### Validation

- ...

### Review result

...

### Risks / follow-ups

- ...
```
