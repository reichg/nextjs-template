/**
 * Shared domain types and cross-module contracts.
 * Pure type definitions only — no runtime code, no imports.
 */

/** DELETE-ME example reference type: copy this Item pattern for your domain, then remove. */
export interface Item {
  id: string;
  title: string;
  body: string | null;
  createdAt: string;
}

/** Generic API response envelope. */
export type ApiResponse<T> = { data: T } | { error: string };
