import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request, type Activity } from '@gathergrid/shared';
import { Card, Button, Avatar, OrganizerBadge, type OrganizerBadgeTier, SegmentedControl, CategoryChip, StatusPill, type StatusPillStatus } from '@gathergrid/ui';
import { ArrowLeft, CheckCircle, Calendar, MapPin, Mail, Award, Clock } from 'lucide-react';

interface OrganizerProfile {
  organizer: {
    id: string;
    name: string;
    organizationName?: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    role: string;
    isVerified: boolean;
  };
  upcomingActivities: Activity[];
  pastActivities: Activity[];
}

export const OrganizerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    request<OrganizerProfile>(`/api/v1/organizers/${id}`)
      .then((res) => {
        setProfile(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading organizer profile...</div>;
  }

  if (!profile) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Organizer Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Return Home</Button>
      </div>
    );
  }

  const { organizer, upcomingActivities, pastActivities } = profile;
  const displayActivities = tab === 'upcoming' ? upcomingActivities : pastActivities;

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} style={{ marginBottom: '1.25rem' }}>
        Back
      </Button>

      <Card variant="flat" padding="lg" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Avatar name={organizer.name} size="lg" src={organizer.avatarUrl} />
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{organizer.name}</h1>
              {organizer.isVerified && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  <CheckCircle size={14} /> Verified Host
                </span>
              )}
              <OrganizerBadge tier={'gold' as OrganizerBadgeTier} />
            </div>

            {organizer.organizationName && (
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gg-color-primary)', marginBottom: '0.5rem' }}>
                {organizer.organizationName}
              </div>
            )}

            <p style={{ color: 'var(--gg-color-ink)', lineHeight: 1.6, fontSize: '14px', marginBottom: '1rem' }}>
              {organizer.bio || 'Community event host on GatherGrid.'}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--gg-color-muted)', fontSize: '13px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} /> {organizer.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} /> {upcomingActivities.length + pastActivities.length} Hosted Events
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: '1.5rem' }}>
        <SegmentedControl
          value={tab}
          onChange={(v) => setTab(v as 'upcoming' | 'past')}
          options={[
            { label: `Upcoming Events (${upcomingActivities.length})`, value: 'upcoming' },
            { label: `Past Events (${pastActivities.length})`, value: 'past' },
          ]}
        />
      </div>

      {displayActivities.length === 0 ? (
        <Card variant="flat" padding="lg" style={{ textAlign: 'center', color: 'var(--gg-color-muted)' }}>
          No {tab} events hosted by {organizer.name} at this time.
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayActivities.map((act) => (
            <Card key={act.id} variant="flat" padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <CategoryChip slug={act.categorySlug} label={act.categoryLabel} emoji={act.categoryEmoji} />
                    <StatusPill status={act.status as StatusPillStatus} />
                    {act.isTeamEvent && (
                      <span style={{ fontSize: '12px', background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        👥 Team Event
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{act.title}</h3>
                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '13px', color: 'var(--gg-color-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {new Date(act.startDateTime).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {act.locationName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {act.costInfo}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="primary" onClick={() => navigate(`/activities/${act.id}`)}>
                  View Activity
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
