import React from 'react';
import { CategoryChip, Slider, Button, Input } from '@gathergrid/ui';
import { Search, Compass } from 'lucide-react';

const CATEGORIES = [
  { slug: '', label: 'All', emoji: '🌟' },
  { slug: 'sports', label: 'Sports', emoji: '⚽' },
  { slug: 'hackathons', label: 'Hackathons', emoji: '💻' },
  { slug: 'gaming', label: 'Gaming', emoji: '🎲' },
  { slug: 'workshops', label: 'Workshops', emoji: '🛠️' },
  { slug: 'trips', label: 'Trips', emoji: '🏕️' },
];

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  formatFilter: string;
  onFormatChange: (fmt: string) => void;
  isFreeOnly: boolean;
  onToggleFreeOnly: () => void;
}

export const DiscoverFilterBar: React.FC<Props> = ({
  query,
  onQueryChange,
  selectedCategory,
  onSelectCategory,
  radiusKm,
  onRadiusChange,
  formatFilter,
  onFormatChange,
  isFreeOnly,
  onToggleFreeOnly,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '240px' }}>
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search activities by keyword, tag..."
            leftAddon={<Search size={16} />}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            size="sm"
            variant={formatFilter === '' ? 'primary' : 'outline'}
            onClick={() => onFormatChange('')}
          >
            All Formats
          </Button>
          <Button
            size="sm"
            variant={formatFilter === 'in_person' ? 'primary' : 'outline'}
            onClick={() => onFormatChange('in_person')}
          >
            In-Person
          </Button>
          <Button
            size="sm"
            variant={formatFilter === 'online' ? 'primary' : 'outline'}
            onClick={() => onFormatChange('online')}
          >
            Online
          </Button>
          <Button
            size="sm"
            variant={isFreeOnly ? 'primary' : 'outline'}
            onClick={onToggleFreeOnly}
          >
            Free Only
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.slug}
              slug={cat.slug || 'all'}
              label={cat.label}
              emoji={cat.emoji}
              isActive={selectedCategory === cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '300px', flex: '1 1 300px', maxWidth: '450px' }}>
          <span style={{ fontSize: '13px', color: 'var(--gg-color-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Compass size={14} /> Radius:
          </span>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Slider value={radiusKm} onChange={(e) => onRadiusChange(Number(e.target.value))} min={1} max={100} />
          </div>
        </div>
      </div>
    </div>
  );
};
