import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesApi, type ActivityFormat, type Activity } from '@gathergrid/shared';
import { ActivityCard, type OrganizerBadgeTier, Skeleton, EmptyState, Button } from '@gathergrid/ui';
import { LayoutGrid, List } from 'lucide-react';
import { DiscoverFilterBar } from './DiscoverFilterBar';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [formatFilter, setFormatFilter] = useState('');
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    activitiesApi
      .list({
        query: query || undefined,
        category: selectedCategory || undefined,
        format: (formatFilter as ActivityFormat) || undefined,
        isFree: isFreeOnly ? true : undefined,
      })
      .then((res) => {
        if (isMounted) {
          setActivities(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, selectedCategory, formatFilter, isFreeOnly]);

  return (
    <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Discover Activities</h2>
          <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>
            Explore events, meetups, and workshops happening in your area.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      <DiscoverFilterBar
        query={query}
        onQueryChange={setQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        formatFilter={formatFilter}
        onFormatChange={setFormatFilter}
        isFreeOnly={isFreeOnly}
        onToggleFreeOnly={() => setIsFreeOnly((prev) => !prev)}
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ height: '320px', borderRadius: '12px', background: '#f9fafb' }}>
              <Skeleton variant="rectangular" height={160} />
              <div style={{ padding: '1rem' }}>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities found"
          description="Try broadening your search keywords or adjusting your filters."
          action={
            <Button
              variant="primary"
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setFormatFilter('');
                setIsFreeOnly(false);
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
            gap: '1.25rem',
          }}
        >
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              id={act.id}
              title={act.title}
              bannerUrl={act.bannerUrl}
              categorySlug={act.categorySlug}
              categoryLabel={act.categoryLabel}
              categoryEmoji={act.categoryEmoji}
              startDateTime={act.startDateTime}
              locationName={act.locationName}
              registeredCount={act.registeredCount}
              capacity={act.capacity}
              joinMode={act.joinMode === 'approval' ? 'approval' : 'instant'}
              isTeamEvent={act.isTeamEvent}
              costInfo={act.costInfo}
              organizerName={act.organizerName}
              organizerBadgeTier={act.organizerBadge as OrganizerBadgeTier | undefined}
              onClick={() => navigate(`/activities/${act.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
