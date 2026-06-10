/* DELETE-ME: example reference UI — replace ItemList with your own domain component, then remove. */
import type { Item } from '@/lib/types';
import styles from './ItemList.module.css';

export interface ItemListProps {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const SKELETON_COUNT = 4;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Presentational item list. Renders loading, error, empty, and populated
 * states. Receives all data via props and holds no data-fetching logic.
 */
export function ItemList({ items, loading, error }: ItemListProps) {
  if (error) {
    return (
      <div className={`${styles.status} ${styles.error}`} role="alert">
        <p className={styles.statusTitle}>Couldn&apos;t load items</p>
        <p className={styles.statusBody}>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Loading items">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true">
            <span className={styles.skelThumb} />
            <span className={styles.skelLines}>
              <span className={styles.skelLine} />
              <span className={`${styles.skelLine} ${styles.skelLineShort}`} />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`${styles.status} ${styles.empty}`} role="status">
        <p className={styles.statusTitle}>No items yet</p>
        <p className={styles.statusBody}>Items you add will appear here.</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid} aria-label="Items">
      {items.map((item) => {
        const hasBody = Boolean(item.body?.trim());
        const date = formatDate(item.createdAt);
        return (
          <li key={item.id} className={styles.card}>
            <span className={styles.thumb} aria-hidden="true">
              {item.title.charAt(0).toUpperCase()}
            </span>
            <span className={styles.meta}>
              <span className={styles.label}>{item.title}</span>
              <span className={styles.sub}>
                {hasBody && <span className={styles.body}>{item.body}</span>}
                {date && <span className={styles.date}>{date}</span>}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
