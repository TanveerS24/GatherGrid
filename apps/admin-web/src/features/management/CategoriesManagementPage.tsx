import React, { useState } from 'react';
import { Card, Switch, CategoryChip, useToast } from '@gathergrid/ui';

interface CategoryRow {
  slug: string;
  label: string;
  emoji: string;
  active: boolean;
}

const INITIAL_CATEGORIES: CategoryRow[] = [
  { slug: 'sports', label: 'Sports', emoji: '⚽', active: true },
  { slug: 'hackathons', label: 'Hackathons', emoji: '💻', active: true },
  { slug: 'gaming', label: 'Gaming', emoji: '🎲', active: true },
  { slug: 'workshops', label: 'Workshops', emoji: '🛠️', active: true },
  { slug: 'trips', label: 'Trips', emoji: '🏕️', active: true },
  { slug: 'social', label: 'Social', emoji: '🎉', active: true },
];

export const CategoriesManagementPage: React.FC = () => {
  const toast = useToast();
  const [categories, setCategories] = useState<CategoryRow[]>(INITIAL_CATEGORIES);

  const toggleCategory = (slug: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.slug === slug) {
          const next = !c.active;
          toast.success(`${c.label} category is now ${next ? 'enabled' : 'disabled'}.`);
          return { ...c, active: next };
        }
        return c;
      })
    );
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>System Categories</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Toggle activity categories available for city events.</p>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Chip Preview</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Slug</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Active Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <CategoryChip slug={c.slug} label={c.label} emoji={c.emoji} isActive />
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{c.label}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{c.slug}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <Switch checked={c.active} onChange={() => toggleCategory(c.slug)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
