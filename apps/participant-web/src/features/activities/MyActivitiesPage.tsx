import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  registrationsApi,
  activitiesApi,
  type Registration,
  type Activity,
} from '@gathergrid/shared';
import {
  Card,
  Button,
  StatusPill,
  type StatusPillStatus,
  CategoryChip,
  EmptyState,
  SegmentedControl,
  useToast,
} from '@gathergrid/ui';
import { Calendar, MapPin, Trash2, ExternalLink } from 'lucide-react';

export const MyActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState<'confirmed' | 'waitlisted' | 'past'>('confirmed');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, Activity>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regs, acts] = await Promise.all([
        registrationsApi.myRegistrations(),
        activitiesApi.list({ limit: 50 }),
      ]);
      setRegistrations(regs);
      const map: Record<string, Activity> = {};
      acts.data.forEach((a: Activity) => {
        map[a.id] = a;
      });
      setActivitiesMap(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (regId: string) => {
    try {
      await registrationsApi.cancel(regId);
      toast.success('RSVP cancelled.');
      loadData();
    } catch {
      toast.error('Failed to cancel RSVP.');
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (tab === 'confirmed') return r.status === 'confirmed';
    if (tab === 'waitlisted') return r.status === 'waitlisted';
    return r.status === 'attended' || r.status === 'cancelled';
  });

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Activities</h1>
          <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>
            Manage your upcoming events, waitlist spots, and event history.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>
          Browse More Events
        </Button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SegmentedControl
          value={tab}
          onChange={(v) => setTab(v as 'confirmed' | 'waitlisted' | 'past')}
          options={[
            { label: 'Upcoming (Confirmed)', value: 'confirmed' },
            { label: 'Waitlisted', value: 'waitlisted' },
            { label: 'Past & Cancelled', value: 'past' },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your events...</div>
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          title={`No ${tab} activities`}
          description="You don't have any activities in this category yet."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Find an Activity
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRegistrations.map((reg) => {
            const act = activitiesMap[reg.activityId];
            return (
              <Card key={reg.id} variant="flat" padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: '1', minWidth: '260px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      {act && <CategoryChip slug={act.categorySlug} label={act.categoryLabel} emoji={act.categoryEmoji} />}
                      <StatusPill status={reg.status as StatusPillStatus} />
                      {reg.waitlistPosition && (
                        <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          Position #{reg.waitlistPosition}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                      {act ? act.title : `Activity #${reg.activityId}`}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '13px', color: 'var(--gg-color-muted)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {act ? new Date(act.startDateTime).toLocaleString() : 'Upcoming'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} />
                        {act ? act.locationName : 'Location'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {act && (
                      <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<ExternalLink size={14} />}
                        onClick={() => navigate(`/activities/${act.id}`)}
                      >
                        Details
                      </Button>
                    )}
                    {reg.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => handleCancel(reg.id)}
                      >
                        Cancel RSVP
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
