import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activitiesApi, registrationsApi, type Activity } from '@gathergrid/shared';
import {
  Card,
  Button,
  CategoryChip,
  StatusPill,
  type StatusPillStatus,
  SeatMeter,
  OrganizerBadge,
  type OrganizerBadgeTier,
  useToast,
} from '@gathergrid/ui';
import { Calendar, MapPin, ArrowLeft, Share2, Users } from 'lucide-react';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!id) return;
    activitiesApi
      .getById(id)
      .then((data) => {
        setActivity(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleJoin = async () => {
    if (!activity) return;
    setJoining(true);
    try {
      await registrationsApi.join(activity.id);
      setIsJoined(true);
      toast.success('Successfully registered for this activity!');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Activity link copied to clipboard!');
  };

  if (loading) {
    return <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>Loading activity...</div>;
  }

  if (!activity) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
        <h3>Activity Not Found</h3>
        <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Return to Explore
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1rem' }}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => navigate('/')}
        style={{ marginBottom: '1rem' }}
      >
        Back to Explore
      </Button>

      {activity.bannerUrl && (
        <div style={{ width: '100%', height: '280px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <img
            src={activity.bannerUrl}
            alt={activity.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <Card variant="flat" padding="lg">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <CategoryChip slug={activity.categorySlug} label={activity.categoryLabel} emoji={activity.categoryEmoji} />
          <StatusPill status={activity.status as StatusPillStatus} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{activity.title}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gg-color-muted)' }}>
            <Calendar size={18} />
            <span>{new Date(activity.startDateTime).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gg-color-muted)' }}>
            <MapPin size={18} />
            <span>{activity.locationName}</span>
          </div>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
          <SeatMeter registered={activity.registeredCount + (isJoined ? 1 : 0)} capacity={activity.capacity} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>About this activity</h3>
          <p style={{ lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-line' }}>
            {activity.fullDescription || activity.shortDescription}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--gg-color-border-light)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} />
            <span>
              Hosted by{' '}
              <button
                type="button"
                onClick={() => navigate(`/organizers/${activity.organizerId}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gg-color-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                {activity.organizerName}
              </button>
            </span>
            {activity.organizerBadge && <OrganizerBadge tier={activity.organizerBadge as OrganizerBadgeTier} />}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {activity.isTeamEvent && (
              <Button
                variant="outline"
                leftIcon={<Users size={16} />}
                onClick={() => navigate(`/activities/${activity.id}/teams`)}
              >
                Form / Join Teams
              </Button>
            )}
            <Button variant="outline" leftIcon={<Share2 size={16} />} onClick={handleShare}>
              Share
            </Button>
            <Button
              variant="primary"
              onClick={handleJoin}
              isLoading={joining}
              disabled={isJoined}
            >
              {isJoined ? 'Registered ✓' : 'Join Activity'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
