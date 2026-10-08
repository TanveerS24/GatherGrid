/**
 * DataTable — sortable, selectable table with pagination support.
 */
import React from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  selectedIds,
  onSelectRow,
  onSelectAll,
  isLoading = false,
  emptyMessage = 'No records found.',
  className = '',
}: DataTableProps<T>) {
  const hasSelection = Boolean(selectedIds && onSelectRow);
  const allSelected = hasSelection && data.length > 0 && selectedIds!.length === data.length;

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <table className={styles.table}>
        <thead>
          <tr>
            {hasSelection && (
              <th className={styles.checkboxCol}>
                <input type="checkbox" checked={allSelected} onChange={onSelectAll} />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (hasSelection ? 1 : 0)} className={styles.centerCell}>
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasSelection ? 1 : 0)} className={styles.centerCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.includes(id);

              return (
                <tr key={id} className={isSelected ? styles.selectedRow : ''}>
                  {hasSelection && (
                    <td className={styles.checkboxCol}>
                      <input type="checkbox" checked={isSelected} onChange={() => onSelectRow!(id)} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

