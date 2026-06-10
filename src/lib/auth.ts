/**
 * Template auth seam — implement per project.
 *
 * Identity / session seam. This is the SINGLE place where real session/identity
 * resolution (cookie / JWT / auth provider) belongs, and it must never trust
 * client-supplied identity values. Server-only module: never import this into
 * client components.
 *
 * The template has no login system wired up, so `getCurrentUser` always
 * resolves to `null` until a real session backend is implemented here. Callers
 * MUST treat `null` as unauthenticated and deny access — this seam never
 * fabricates an authenticated user.
 */

export type CurrentUser = { id: string };

/**
 * Resolve the current authenticated user from trusted server-side context.
 *
 * Returns `null` until a real session backend is wired up. When real auth is
 * added, derive identity here from a verified cookie/JWT/provider session —
 * do not trust client-supplied identity values.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return null;
}
