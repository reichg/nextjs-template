/**
 * Application error with an associated HTTP status. Throw this for known,
 * client-safe failure conditions; the message is surfaced to the client.
 */
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Maps any thrown value to a safe, client-facing error response.
 *
 * Only `AppError` messages are surfaced. Everything else collapses to a
 * generic 500 so stack traces, raw database errors, and secrets never leak.
 */
export function toSafeErrorResponse(err: unknown): {
  status: number;
  body: { error: string };
} {
  if (err instanceof AppError) {
    return { status: err.status, body: { error: err.message } };
  }

  return { status: 500, body: { error: 'Internal Server Error' } };
}
