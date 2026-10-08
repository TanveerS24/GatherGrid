import React, { useState } from 'react';
import { Card, Button, StatusPill, CategoryChip, useToast } from '@gathergrid/ui';

interface AdminActivityRow {
  id: string;
  title: string;
  organizer: string;
  category: string;
  status: 'published' | 'cancelled';
  attendees: number;
}

const INITIAL_ACTIVITIES: AdminActivityRow[] = [
  { id: 'act-1', title: 'Sunset Beach Volleyball & Social', organizer: 'Bay Area Outdoor Club', category: 'sports', status: 'published', attendees: 14 },
  { id: 'act-2', title: 'Autumn Hackathon: AI for Good', organizer: 'SF Tech & Hackathons', category: 'hackathons', status: 'published', attendees: 18 },
  { id: 'act-3', title: 'Strategy Board Game Night', organizer: 'Mission Board Game Guild', category: 'gaming', status: 'published', attendees: 24 },
];

export const ActivitiesModerationPage: React.FC = () => {
  const toast = useToast();
  const [activities, setActivities] = useState<AdminActivityRow[]>(INITIAL_ACTIVITIES);

  const toggleTakeDown = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = a.status === 'published' ? 'cancelled' : 'published';
          toast.success(`Activity status changed to ${next}.`);
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Activities Moderation</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Review published activities and enforce community guidelines.</p>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Title</th>
              <th style={{ padding: '0.75rem 1rem' }}>Organizer</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem' }}>Attendees</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{a.title}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{a.organizer}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <CategoryChip slug={a.category} label={a.category.toUpperCase()} />
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{a.attendees}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <StatusPill status={a.status} />
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <Button size="sm" variant={a.status === 'published' ? 'ghost' : 'outline'} onClick={() => toggleTakeDown(a.id)}>
                    {a.status === 'published' ? 'Take Down' : 'Restore'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
