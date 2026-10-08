import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesApi, type Activity } from '@gathergrid/shared';
import { Card, Button, CategoryChip, Badge, EmptyState } from '@gathergrid/ui';
import { Globe, Video, Calendar, ArrowRight } from 'lucide-react';

export const OnlinePage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activitiesApi
      .list({ format: 'online' as any })
      .then((res) => {
        setActivities(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gg-color-primary)', fontWeight: 600, fontSize: '14px' }}>
          <Globe size={18} />
          <span>VIRTUAL EVENTS HUB</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.25rem 0' }}>Join From Anywhere</h1>
        <p style={{ color: 'var(--gg-color-muted)' }}>
          Online workshops, game nights, hackathons, and webinars you can attend remotely.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading virtual activities...</div>
      ) : activities.length === 0 ? (
        <EmptyState
          title="No online activities found"
          description="Check back soon or explore in-person events in your city."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Browse In-Person
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {activities.map((act) => (
            <Card key={act.id} variant="flat" padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <CategoryChip slug={act.categorySlug} label={act.categoryLabel} emoji={act.categoryEmoji} />
                <Badge variant="primary">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Video size={12} /> {act.onlinePlatform || 'Online'}
                  </span>
                </Badge>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{act.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--gg-color-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {act.shortDescription}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--gg-color-muted)', marginBottom: '1.25rem' }}>
                <Calendar size={15} />
                <span>{new Date(act.startDateTime).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gg-color-border-light)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {act.registeredCount} attending
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight size={14} />}
                  onClick={() => navigate(`/activities/${act.id}`)}
                >
                  RSVP & Access
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
