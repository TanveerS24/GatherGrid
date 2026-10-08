import React, { useState } from 'react';
import { Card, Button, OrganizerBadge, Badge, useToast } from '@gathergrid/ui';

interface OrgRow {
  id: string;
  name: string;
  contactEmail: string;
  tier: 'bronze' | 'silver' | 'gold';
  eventsCount: number;
  status: 'verified' | 'unverified';
}

const INITIAL_ORGS: OrgRow[] = [
  { id: 'org-1', name: 'Bay Area Outdoor Club', contactEmail: 'host@outdoors.org', tier: 'gold', eventsCount: 42, status: 'verified' },
  { id: 'org-2', name: 'SF Tech & Hackathons', contactEmail: 'hello@sfhack.io', tier: 'silver', eventsCount: 18, status: 'verified' },
  { id: 'org-3', name: 'Mission Board Game Guild', contactEmail: 'play@missionbg.com', tier: 'bronze', eventsCount: 8, status: 'verified' },
];

export const OrganizersManagementPage: React.FC = () => {
  const toast = useToast();
  const [orgs, setOrgs] = useState<OrgRow[]>(INITIAL_ORGS);

  const upgradeTier = (id: string) => {
    setOrgs((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const nextTier = o.tier === 'bronze' ? 'silver' : o.tier === 'silver' ? 'gold' : 'bronze';
          toast.success(`${o.name} updated to ${nextTier} tier.`);
          return { ...o, tier: nextTier as any };
        }
        return o;
      })
    );
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Organizers & Clubs</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Review host reputation, attendance tier badges, and verifications.</p>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Organization</th>
              <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
              <th style={{ padding: '0.75rem 1rem' }}>Badge Tier</th>
              <th style={{ padding: '0.75rem 1rem' }}>Hosted Events</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{o.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{o.contactEmail}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <OrganizerBadge tier={o.tier} />
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{o.eventsCount} events</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant="primary">{o.status}</Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <Button size="sm" variant="outline" onClick={() => upgradeTier(o.id)}>
                    Cycle Tier
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
