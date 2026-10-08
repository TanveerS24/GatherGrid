import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request, type Activity, RegistrationStatus } from '@gathergrid/shared';
import { Card, Button, Avatar, StatusPill, type StatusPillStatus, SegmentedControl, useToast } from '@gathergrid/ui';
import { ArrowLeft, Users, Mail, Check, X, Calendar, MapPin } from 'lucide-react';

interface ParticipantRegistration {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatarUrl?: string;
  status: RegistrationStatus;
  waitlistPosition?: number;
  appliedAt: string;
  confirmedAt?: string;
  teamId?: string;
  teamName?: string;
}

export const ActivityParticipantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [registrations, setRegistrations] = useState<ParticipantRegistration[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    try {
      const [actRes, regsRes] = await Promise.all([
        request<Activity>(`/api/v1/activities/${id}`),
        request<ParticipantRegistration[]>(`/api/v1/activities/${id}/registrations`),
      ]);
      setActivity(actRes);
      setRegistrations(regsRes || []);
    } catch {
      toast.error('Failed to load participants data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateStatus = async (regId: string, newStatus: RegistrationStatus) => {
    try {
      await request(`/api/v1/activities/registrations/${regId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: newStatus } : r))
      );
      toast.success(`Participant registration ${newStatus === RegistrationStatus.CONFIRMED ? 'approved' : 'updated'}.`);
    } catch {
      toast.error('Could not update participant status');
    }
  };

  const filtered = registrations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading registered participants...</div>;
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/activities')} style={{ marginBottom: '1.25rem' }}>
        Back to Activities
      </Button>

      {activity && (
        <Card variant="flat" padding="lg" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--gg-color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Participant Roster Management
              </span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0.5rem' }}>{activity.title}</h1>
              <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--gg-color-muted)', fontSize: '13px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {new Date(activity.startDateTime).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {activity.locationName}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {registrations.filter((r) => r.status === RegistrationStatus.CONFIRMED).length} / {activity.capacity || '∞'} Confirmed
                </span>
              </div>
            </div>
            <div style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>
              Mode: {activity.joinMode === 'approval' ? 'Requires Approval' : 'Instant Join'}
            </div>
          </div>
        </Card>
      )}

      <div style={{ marginBottom: '1.25rem' }}>
        <SegmentedControl
          value={filter}
          onChange={(v) => setFilter(v)}
          options={[
            { label: `All (${registrations.length})`, value: 'all' },
            { label: `Confirmed (${registrations.filter((r) => r.status === RegistrationStatus.CONFIRMED).length})`, value: 'confirmed' },
            { label: `Pending (${registrations.filter((r) => r.status === RegistrationStatus.PENDING).length})`, value: 'pending' },
            { label: `Waitlisted (${registrations.filter((r) => r.status === RegistrationStatus.WAITLISTED).length})`, value: 'waitlisted' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <Card variant="flat" padding="lg" style={{ textAlign: 'center', color: 'var(--gg-color-muted)' }}>
          No participants in this status category.
        </Card>
      ) : (
        <Card variant="flat" padding="none">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--gg-color-border)', background: 'var(--gg-color-surface-subtle)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Participant</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.75rem 1rem' }}>Team / Group</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar name={r.userName} size="sm" src={r.userAvatarUrl} />
                      <span style={{ fontWeight: 600 }}>{r.userName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={14} /> {r.userEmail || `${r.userName.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {r.teamName ? (
                      <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                        👥 {r.teamName}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--gg-color-muted)', fontSize: '12px' }}>Individual</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <StatusPill status={r.status as StatusPillStatus} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    {r.status === RegistrationStatus.PENDING ? (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Button size="sm" variant="primary" leftIcon={<Check size={14} />} onClick={() => handleUpdateStatus(r.id, RegistrationStatus.CONFIRMED)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost" leftIcon={<X size={14} />} onClick={() => handleUpdateStatus(r.id, RegistrationStatus.REJECTED)}>
                          Reject
                        </Button>
                      </div>
                    ) : r.status === RegistrationStatus.CONFIRMED ? (
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(r.id, RegistrationStatus.WAITLISTED)}>
                        Move to Waitlist
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(r.id, RegistrationStatus.CONFIRMED)}>
                        Re-admit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
