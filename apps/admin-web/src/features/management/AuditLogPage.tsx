import React from 'react';
import { Card, Badge } from '@gathergrid/ui';

interface LogRow {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
}

const AUDIT_LOGS: LogRow[] = [
  { id: 'log-1', timestamp: '2026-10-08 10:42:12', actor: 'admin@gathergrid.com', action: 'SUSPEND_USER', target: 'Spam Bot 9000 (u-4)' },
  { id: 'log-2', timestamp: '2026-10-08 09:15:30', actor: 'admin@gathergrid.com', action: 'UPGRADE_TIER', target: 'Bay Area Outdoor Club (Gold)' },
  { id: 'log-3', timestamp: '2026-10-07 18:22:04', actor: 'system', action: 'AUTO_WAITLIST_PROMOTE', target: 'Activity #act-3' },
  { id: 'log-4', timestamp: '2026-10-07 14:05:19', actor: 'admin@gathergrid.com', action: 'RESOLVE_REPORT', target: 'Report #rep-1' },
];

export const AuditLogPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Platform Audit Log</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Immutable ledger of administrative actions and moderation events.</p>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Admin / Actor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              <th style={{ padding: '0.75rem 1rem' }}>Target Entity</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '13px' }}>{l.timestamp}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{l.actor}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant="muted">{l.action}</Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#374151' }}>{l.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
