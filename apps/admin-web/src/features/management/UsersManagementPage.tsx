import React, { useState } from 'react';
import { Card, Button, Badge, Input, useToast } from '@gathergrid/ui';
import { Search, Ban, CheckCircle } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  joinedDate: string;
}

const INITIAL_USERS: UserRow[] = [
  { id: 'u-1', name: 'Maya Lin', email: 'maya@example.com', role: 'Participant', status: 'active', joinedDate: '2026-10-01' },
  { id: 'u-2', name: 'Bay Area Outdoor Club', email: 'host@outdoors.org', role: 'Organizer', status: 'active', joinedDate: '2026-09-15' },
  { id: 'u-3', name: 'Alex Rivera', email: 'alex@example.com', role: 'Participant', status: 'active', joinedDate: '2026-10-03' },
  { id: 'u-4', name: 'Spam Bot 9000', email: 'spam@botnet.xyz', role: 'Participant', status: 'suspended', joinedDate: '2026-10-06' },
];

export const UsersManagementPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [query, setQuery] = useState('');

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'suspended' : 'active';
          toast.success(`User ${u.name} set to ${next}.`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>User Accounts Management</h2>
          <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>Inspect accounts, enforce suspensions, and manage roles.</p>
        </div>
        <div style={{ width: '280px' }}>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email..." leftAddon={<Search size={16} />} />
        </div>
      </div>

      <Card variant="flat" padding="none">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--gg-color-border-light)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Email</th>
              <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Joined</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--gg-color-border-light)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{u.role}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge variant={u.status === 'active' ? 'primary' : 'muted'}>
                    {u.status}
                  </Badge>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--gg-color-muted)' }}>{u.joinedDate}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <Button size="sm" variant={u.status === 'active' ? 'ghost' : 'outline'} onClick={() => toggleStatus(u.id)}>
                    {u.status === 'active' ? <><Ban size={14} /> Suspend</> : <><CheckCircle size={14} /> Restore</>}
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
