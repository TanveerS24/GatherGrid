import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesApi, type Activity } from '@gathergrid/shared';
import { Card, Button, StatusPill, CategoryChip, EmptyState } from '@gathergrid/ui';
import { Plus, Calendar, MapPin, Users } from 'lucide-react';

export const OrganizerActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activitiesApi
      .list({ limit: 50 })
      .then((res) => {
        setActivities(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Hosted Activities</h1>
          <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>
            Manage your published events, applicant queues, and attendance.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/activities/new')}>
          Create Activity
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your events...</div>
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities created yet"
          description="Create your first event to start gathering people."
          action={
            <Button variant="primary" onClick={() => navigate('/activities/new')}>
              Create Activity
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((act) => (
            <Card key={act.id} variant="flat" padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1', minWidth: '260px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CategoryChip slug={act.categorySlug} label={act.categoryLabel} emoji={act.categoryEmoji} />
                    <StatusPill status={act.status as any} />
                    <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      {act.joinMode === 'instant' ? 'Instant Join' : 'Approval Required'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{act.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '13px', color: 'var(--gg-color-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {new Date(act.startDateTime).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {act.locationName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {act.registeredCount} / {act.capacity || '∞'} confirmed
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/activities/${act.id}`)}>
                    View Event
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
