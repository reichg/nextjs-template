# Strict Delegation Protocol

This repository uses an Orchestrator-only Claude Code workflow.

The Orchestrator is driven by `.claude/CLAUDE.md`. It is responsible for deciding which internal specialists are required and invoking them via the Agent tool using `subagent_type` set to the specialist's kebab-case name.

## Workflow-contract files

Treat these files as workflow-contract files because they change how the agent system behaves:

- `.claude/AGENTS.md`
- `.claude/DELEGATION_PROTOCOL.md`
- `.claude/template.md`
- `.claude/CLAUDE.md`
- `.claude/agents/*.md`

## How invocation is enforced

The Orchestrator profile contains:

1. The Agent tool for spawning specialist sub-agents.
2. A mandatory routing matrix.
3. Required assigned file boundaries before delegated implementation begins.
4. Fail-closed rules.
5. Required specialist work orders.
6. Required specialist reports describing actual owned-slice changes.
7. Required parallel delegation for disjoint specialist-owned file sets.
8. A final Review Agent gate.

## Delegated implementation ownership

- The Orchestrator must delegate each applicable slice to the proper specialist before implementation begins.
- Every invoked specialist must receive a clear, non-overlapping assigned file boundary before delegated implementation starts.
- Specialists assigned implementation files must edit those files directly rather than only recommend changes.
- Parallel specialist editing is required whenever multiple required specialists can work on disjoint file sets. This requirement takes priority over Orchestrator convenience.
- The Orchestrator must not reclaim or overlap a specialist-owned file slice unless it explicitly reassigns ownership because of a blocker.
- If assigned ownership overlaps or becomes ambiguous, specialists must stop and return a boundary conflict instead of editing overlapping files.
- Specialist reports must describe the concrete edits made inside the owned slice, not just recommendations.

## Required routing

| Work type | Specialist |
| --------- | ---------- |
| Structure, modules, shared contracts | Architecture Agent |
| Authentication, authorization, identity, session handling, permissions, or roles | Auth and Auth Agent |
| API routes, Zod API validation, HTTP semantics | Backend API Agent |
| Business logic, service modules, transaction orchestration, or domain rules | Backend Services Agent & Quality Agent |
| Database schema, Prisma schema/migrations, query or index strategy, backfills, seed/data-repair work, retention/archive work, or persistence integrity | Backend Data Agent & Quality Agent |
| Backend payment-provider integrations, checkout/session/payment intent orchestration, captures/refunds/voids, payment webhooks, reconciliation, or idempotent payment operations | Backend Payments Agent |
| Backend validation, safe-error behavior, secrets, sensitive data, or backend auth/authorization enforcement | Backend Security Agent & Auth and Auth Agent |
| React UI, CSS Modules, accessibility | Frontend UI Agent |
| Frontend fetch, hooks, forms, data handling | Frontend API and Logic Agent & Quality Agent |
| Frontend checkout, payment forms, payment method selection, wallet buttons, payment-provider client SDKs/components, redirect-return handling, or payment confirmation/pending/failure states | Frontend Payments Agent |
| XSS, browser storage, redirects, client exposure | Frontend Security Agent |
| Package manager, scripts, tsconfig, build/lint/test config, CI workflows, workspace tooling, local env/config loading, or repo scaffolding | Platform Tooling Agent |
| Deployment/runtime infrastructure, containers/orchestration, runtime secret delivery, release/rollback workflows, workers/queues/schedulers, scaling/failover, or operational runbooks | Platform Operations Agent |
| Telemetry, observability providers, logs, metrics, traces, analytics events, dashboards, alerting, sampling, correlation IDs, or telemetry schemas | Telemetry Agent |
| Documentation, onboarding, README, reference docs, runbooks, templates, examples, or migration notes | Documentation Agent |
| Workflow-contract files | Architecture Agent, Testing Agent, and Review Agent |
| Behavior changes and regressions | Testing Agent |
| All code changes | Review Agent |

## Boundary clarification rules

- Architecture Agent owns file placement, module boundaries, dependency direction, and ownership of exported or shared contracts. Quality Agent reviews correctness, maintainability, duplication, and extraction quality inside that chosen structure, but does not own structural placement decisions.
- Auth and Auth Agent owns identity, session, role, permission, and authorization-policy semantics. Backend Security Agent owns backend trust-boundary hardening, untrusted-input validation, secret handling, safe errors, sensitive-data exposure review, and secure enforcement of those auth decisions.
- Backend Data Agent owns persistence-model design, Prisma schema/migrations, query/index strategy, backfills, retention/archive flows, and integrity constraints. Backend Services Agent owns business rules, service orchestration, and transaction use inside application flows; Architecture Agent owns file placement and shared-contract boundaries; Quality Agent owns reuse and duplication hygiene across both.
- Backend Payments Agent owns provider-specific payment orchestration, checkout/session/payment intent lifecycle, refunds, webhook/event reconciliation, and idempotent payment operations. Backend API Agent owns payment route contracts, Backend Services Agent owns service placement and business-flow orchestration, Backend Data Agent owns payment persistence schema/index/migration work, Backend Security Agent owns webhook verification, secret handling, safe errors, and sensitive payment-field review, and Auth and Auth Agent owns billing access and entitlement semantics.
- Frontend Payments Agent owns payment-specific client flow correctness, provider SDK/component integration, payment method selection, redirect-return handling, and confirmation/pending/failure states. Frontend UI Agent owns markup, accessibility, and CSS; Frontend API and Logic Agent owns generic client data fetching and transformation; Frontend Security Agent owns browser exposure, redirect safety, storage, and public env-var review.
- Testing Agent owns executable validation, dry runs, and scenario evidence. Review Agent owns the final quality gate and consumes Testing evidence rather than replacing it.
- Documentation Agent owns authoritative wording, examples, prerequisites, and document placement. Testing Agent verifies whether documented commands, examples, and dry-run steps have credible validation behind them.
- Platform Operations Agent owns deployed runtime topology, hosting/infrastructure resources, release and rollback mechanics, workers/queues/schedulers, runtime secret delivery, and operational procedures. Platform Tooling Agent owns repo-local tooling, CI, shared scripts, and developer configuration; Telemetry Agent owns observability design; Backend Security Agent and Frontend Security Agent own exposure and secret-handling review.
- Telemetry Agent owns instrumentation intent, event, log, metric, and trace schemas, naming, correlation strategy, and sampling decisions. Backend Security Agent and Frontend Security Agent own leakage and exposure review, Platform Tooling Agent owns repo-level telemetry transport and configuration wiring, Platform Operations Agent owns deployed runtime rollout/topology for telemetry infrastructure, and Quality Agent owns extraction and reuse quality for telemetry-related constants and schemas rather than telemetry design itself.
- Engineering standards ownership is unambiguous: Standard A (pinned versions) is owned by Platform Tooling Agent; Standard B (Prisma 7 pinning and conventions) is owned by Backend Data Agent; Standard C splits as Architecture Agent owns the placement of the `services/` directory while Backend Services Agent owns its contents; Standard D splits as Backend Data Agent owns expand-and-contract schema migrations while Platform Operations Agent owns rollout/rollback sequencing and feature-flag operations. Architecture Agent additionally owns the structural placement of feature-flag seams and expand-and-contract boundaries that preserve backwards compatibility across versions.

## Engineering standards

These four standards (A–D) are a baseline that applies to every task. Each has a single owning specialist for enforcement:

- **Standard A — Pinned versions**: Platform Tooling Agent. All tooling and dependencies pinned to exact versions (no `^`, `~`, or open ranges) in package.json AND kept current: lockfile committed, package manager / runtime / CI / CI-action versions pinned, pinned to the latest stable release and kept current through a regular, reviewable update cadence (e.g., scheduled dependency-update PRs) so exact pinning never drifts onto outdated or unsupported versions, updates as explicit version bumps.
- **Standard B — Prisma 7**: Backend Data Agent. `prisma` and `@prisma/client` pinned to an exact 7.x version, Prisma 7 conventions for client generation and migrations followed.
- **Standard C — Services directory**: Architecture Agent owns placement of `services/`; Backend Services Agent owns its contents. Backend business logic lives under `services/`; API routes stay thin and call into `services/`.
- **Standard D — Expand-and-contract deployment**: Backend Data Agent owns expand-and-contract schema migrations; Platform Operations Agent owns rollout/rollback sequencing and feature-flag operations. Changes expand with backwards-compatible additions, roll out gradually, then contract only after the previous version drains; risky or breaking changes are gated behind feature flags.

## Required artifacts

Every non-trivial task must include:

- an `Orchestrator Plan`;
- a `Delegation Routing` table;
- one `Specialist Work Order` for each invoked specialist with an assigned file boundary and execution mode;
- one `Specialist Report` for each invoked specialist that describes the actual changes inside the owned slice;
- a validation record;
- a `Final Summary`.

## Completion requirements

A task is incomplete if:

- a required specialist was not delegated or internally applied;
- code changed without Review Agent;
- behavior changed without Testing Agent;
- backend service, backend data, or Prisma changed without Quality Agent;
- database schema, Prisma schema/migration, or persistence behavior changed without Backend Data Agent;
- backend payment-provider integration, checkout/payment orchestration, or payment webhooks changed without Backend Payments Agent;
- frontend API or data-handling changes happened without Quality Agent;
- frontend checkout, payment-provider client flow, or payment confirmation behavior changed without Frontend Payments Agent;
- protected backend data changed without Backend Security Agent;
- user-controlled frontend rendering changed without Frontend Security Agent;
- API contract changed without Backend API Agent;
- platform or tooling changed without Platform Tooling Agent;
- deployment/runtime infrastructure or operational workflow changed without Platform Operations Agent;
- telemetry, observability, or instrumentation changed without Telemetry Agent;
- documentation, onboarding, or operational guidance changed without Documentation Agent;
- workflow-contract files changed without Architecture Agent, Testing Agent, and Review Agent;
- structural boundaries changed without Architecture Agent;
- delegated implementation started without clear, non-overlapping specialist file boundaries;
- a specialist with assigned implementation files returned recommendations without editing the owned slice;
- the Orchestrator or another specialist reclaimed or overlapped a specialist-owned slice without explicit reassignment because of a blocker;
- partitionable delegated work was serialized without a documented blocker;
- overlapping specialist ownership was not stopped and returned as a boundary conflict;
- a required routing, work-order, report, validation, or final-summary artifact is missing.

## Workflow-contract validation

When workflow-contract files change and no executable test exists, validation must still include:

1. routing coverage verification;
2. agent parity verification (`.claude/agents/` roster matches routing table);
3. template contract verification;
4. at least one documented scenario-based dry run.

## Recommended prompt

```md
Before implementation, complete the Orchestrator Plan and Delegation Routing table, assign clear non-overlapping file boundaries, and run disjoint required specialists in parallel via the Agent tool. Invoke every required specialist, keep each specialist editing its own slice, and do not finalize until Testing Agent and Review Agent have completed their gates.
```
