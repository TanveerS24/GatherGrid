/**
 * InfiniteList — renders list with scroll intersection trigger.
 */
import React, { useEffect, useRef } from 'react';
import styles from './InfiniteList.module.css';

export interface InfiniteListProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  className?: string;
}

export const InfiniteList: React.FC<InfiniteListProps> = ({
  onLoadMore,
  hasMore,
  isLoading,
  children,
  loader,
  className = '',
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className={styles.sentinel}>
          {isLoading && (loader || <div className={styles.spinner} />)}
        </div>
      )}
    </div>
  );
};
