/* DELETE-ME: example reference UI — swap useItems/ItemList for your own slice, then remove. */
'use client';

import { useItems } from '@/hooks/useItems';
import { ItemList } from '@/components/ItemList';
import styles from './page.module.css';

export default function HomePage() {
  const { items, loading, error } = useItems();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Example
          </span>
          <h1 className={styles.title}>Items</h1>
          <p className={styles.subtitle}>
            Example data slice, listed most recent first. Delete it once your
            own domain is in place.
          </p>
        </header>

        <ItemList items={items} loading={loading} error={error} />
      </div>
    </main>
  );
}
