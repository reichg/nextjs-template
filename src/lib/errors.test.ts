import { describe, expect, it } from 'vitest';
import { AppError, toSafeErrorResponse } from '@/lib/errors';

describe('toSafeErrorResponse', () => {
  it('surfaces an AppError status and message', () => {
    const result = toSafeErrorResponse(new AppError(404, 'Item not found'));
    expect(result).toEqual({
      status: 404,
      body: { error: 'Item not found' },
    });
  });

  it('collapses a generic Error to a safe 500 without leaking internals', () => {
    const leaky = new Error('Connection string postgres://user:secret@host');
    const result = toSafeErrorResponse(leaky);
    expect(result).toEqual({
      status: 500,
      body: { error: 'Internal Server Error' },
    });
    expect(result.body.error).not.toContain('secret');
  });

  it('collapses non-Error throwables to a safe 500', () => {
    const result = toSafeErrorResponse('raw string failure');
    expect(result).toEqual({
      status: 500,
      body: { error: 'Internal Server Error' },
    });
  });
});
