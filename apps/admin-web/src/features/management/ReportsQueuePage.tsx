import React, { useState } from 'react';
import { Card, Button, Badge, useToast } from '@gathergrid/ui';

interface ReportRow {
  id: string;
  targetType: string;
  targetTitle: string;
  reporter: string;
  reason: string;
  status: 'pending' | 'resolved';
}

const INITIAL_REPORTS: ReportRow[] = [
  { id: 'rep-1', targetType: 'Activity', targetTitle: 'Crypto Trading Meetup', reporter: 'alex@example.com', reason: 'Suspected commercial promotion / spam', status: 'pending' },
  { id: 'rep-2', targetType: 'User', targetTitle: 'Spam Bot 9000', reporter: 'maya@example.com', reason: 'Automated comment spam', status: 'pending' },
];

export const ReportsQueuePage: React.FC = () => {
  const toast = useToast();
  const [reports, setReports] = useState<ReportRow[]>(INITIAL_REPORTS);

  const resolveReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    toast.success('Report resolved and marked.');
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Reports Queue</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Triage member reports regarding activities, users, and inappropriate content.</p>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Type</th>
              <th style={{ padding: '0.75rem 1rem' }}>Target</th>
              <th style={{ padding: '0.75rem 1rem' }}>Reason</th>
              <th style={{ padding: '0.75rem 1rem' }}>Reporter</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant="muted">{r.targetType}</Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{r.targetTitle}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{r.reason}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{r.reporter}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant={r.status === 'pending' ? 'danger' : 'primary'}>{r.status}</Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  {r.status === 'pending' && (
                    <Button size="sm" variant="primary" onClick={() => resolveReport(r.id)}>
                      Dismiss / Resolve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
