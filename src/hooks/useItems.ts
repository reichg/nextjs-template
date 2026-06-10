'use client';

// DELETE-ME: example reference hook for the template's Item slice.

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { Item } from '@/lib/types';

interface UseItemsResult {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const GENERIC_ERROR = 'Unable to load items. Please try again.';

/**
 * Fetches items on mount, exposing loading/error/empty state.
 * Guards against setState-after-unmount via a cancellation flag.
 */
export function useItems(): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiClient
      .getItems()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : GENERIC_ERROR);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}
