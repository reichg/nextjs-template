import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ItemList } from '@/components/ItemList';
import type { Item } from '@/lib/types';

const ITEMS: Item[] = [
  {
    id: 'a',
    title: 'Alpha',
    body: 'First body',
    createdAt: '2026-06-10T12:00:00.000Z',
  },
];

describe('ItemList', () => {
  it('renders the empty state when there are no items', () => {
    const html = renderToStaticMarkup(
      <ItemList items={[]} loading={false} error={null} />,
    );
    expect(html).toContain('No items yet');
    expect(html).toContain('role="status"');
  });

  it('renders item titles and bodies in the populated state', () => {
    const html = renderToStaticMarkup(
      <ItemList items={ITEMS} loading={false} error={null} />,
    );
    expect(html).toContain('Alpha');
    expect(html).toContain('First body');
    expect(html).toContain('aria-label="Items"');
  });

  it('renders the error state when an error is present', () => {
    const html = renderToStaticMarkup(
      <ItemList items={[]} loading={false} error="boom" />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('boom');
  });
});
