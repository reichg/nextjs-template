import { describe, expect, it } from 'vitest';
import { createItemSchema } from '@/lib/schemas';

describe('createItemSchema', () => {
  it('accepts a valid { title, body }', () => {
    const result = createItemSchema.safeParse({
      title: 'A title',
      body: 'A body',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: 'A title', body: 'A body' });
    }
  });

  it('allows an omitted body', () => {
    const result = createItemSchema.safeParse({ title: 'A title' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body).toBeUndefined();
    }
  });

  it('rejects an empty title', () => {
    const result = createItemSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a title longer than 120 characters', () => {
    const result = createItemSchema.safeParse({ title: 'x'.repeat(121) });
    expect(result.success).toBe(false);
  });

  it('accepts a title of exactly 120 characters', () => {
    const result = createItemSchema.safeParse({ title: 'x'.repeat(120) });
    expect(result.success).toBe(true);
  });

  it('rejects a body longer than 2000 characters', () => {
    const result = createItemSchema.safeParse({
      title: 'A title',
      body: 'x'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
