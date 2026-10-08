import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request, useAuthStore, type Activity } from '@gathergrid/shared';
import { Card, Button, FormField, Input, Textarea, Badge, Avatar, useToast } from '@gathergrid/ui';
import { Plus, ArrowLeft, Shield, UserPlus, CheckCircle2 } from 'lucide-react';

interface TeamMember {
  userId: string;
  userName: string;
  role?: string;
  avatarUrl?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  maxMembers: number;
  lookingFor: string[];
  joinCode?: string;
}

export const FormTeamsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamRoles, setNewTeamRoles] = useState('');

  const loadData = async () => {
    if (!id) return;
    try {
      const [actRes, teamsRes] = await Promise.all([
        request<Activity>(`/api/v1/activities/${id}`),
        request<Team[]>(`/api/v1/activities/${id}/teams`),
      ]);
      setActivity(actRes);
      setTeams(teamsRes || []);
    } catch {
      toast.error('Failed to load team formation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !id) return;
    try {
      const created = await request<Team>(`/api/v1/activities/${id}/teams`, {
        method: 'POST',
        body: JSON.stringify({
          name: newTeamName.trim(),
          description: newTeamDesc.trim(),
          lookingFor: newTeamRoles.split(',').map((s) => s.trim()).filter(Boolean),
          userName: user?.name,
          avatarUrl: user?.avatarUrl,
        }),
      });
      setTeams((prev) => [created, ...prev]);
      setShowCreate(false);
      setNewTeamName('');
      setNewTeamDesc('');
      setNewTeamRoles('');
      toast.success(`Team "${created.name}" created!`);
    } catch {
      toast.error('Could not create team');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!id) return;
    try {
      const updated = await request<Team>(`/api/v1/activities/${id}/teams/${teamId}/join`, {
        method: 'POST',
        body: JSON.stringify({
          userName: user?.name,
          avatarUrl: user?.avatarUrl,
          role: 'Team Member',
        }),
      });
      setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
      toast.success(`Joined ${updated.name}!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not join team');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading team formation arena...</div>;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(`/activities/${id}`)} style={{ marginBottom: '1rem' }}>
        Back to Activity Details
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gg-color-primary)', textTransform: 'uppercase' }}>
            Team Formation Arena
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{activity?.title}</h1>
          <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px' }}>
            Assemble or join a team of 2–5 participants for this collaborative event.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Close Form' : 'Create New Team'}
        </Button>
      </div>

      {showCreate && (
        <Card variant="flat" padding="lg" style={{ marginBottom: '2rem', border: '2px solid var(--gg-color-primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Register a New Team</h3>
          <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Team Name" required>
              <Input placeholder="e.g. CyberSpike Triad" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
            </FormField>
            <FormField label="Description & Goals">
              <Textarea placeholder="What are your goals or project ideas for this event?" rows={2} value={newTeamDesc} onChange={(e) => setNewTeamDesc(e.target.value)} />
            </FormField>
            <FormField label="Roles Needed" helperText="Comma separated, e.g. Frontend, Designer, Blocker">
              <Input placeholder="e.g. PyTorch Developer, UI Designer" value={newTeamRoles} onChange={(e) => setNewTeamRoles(e.target.value)} />
            </FormField>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Confirm & Create Team</Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
        {teams.map((t) => {
          const isMember = t.members.some((m) => m.userId === user?.id);
          const isFull = t.members.length >= t.maxMembers;
          return (
            <Card key={t.id} variant="flat" padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{t.name}</h3>
                  <Badge variant={isFull ? 'default' : 'primary'}>{t.members.length}/{t.maxMembers} Members</Badge>
                </div>
                {t.description && <p style={{ fontSize: '13px', color: 'var(--gg-color-muted)', marginBottom: '0.75rem' }}>{t.description}</p>}
                
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gg-color-ink)', marginBottom: '0.35rem' }}>Roster:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {t.members.map((m) => (
                    <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <Avatar name={m.userName} size="sm" src={m.avatarUrl} />
                      <span>{m.userName} {m.userId === t.leaderId && <Shield size={12} style={{ display: 'inline', color: 'var(--gg-color-primary)' }} />}</span>
                      {m.role && <span style={{ color: 'var(--gg-color-muted)' }}>({m.role})</span>}
                    </div>
                  ))}
                </div>

                {t.lookingFor?.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '11px', color: 'var(--gg-color-muted)', marginBottom: '4px' }}>Seeking roles:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {t.lookingFor.map((r, i) => (
                        <span key={i} style={{ fontSize: '11px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {isMember ? (
                  <Button fullWidth size="sm" variant="outline" disabled leftIcon={<CheckCircle2 size={14} />}>Already on Team</Button>
                ) : isFull ? (
                  <Button fullWidth size="sm" variant="ghost" disabled>Team Full</Button>
                ) : (
                  <Button fullWidth size="sm" variant="primary" leftIcon={<UserPlus size={14} />} onClick={() => handleJoinTeam(t.id)}>Join Team</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
