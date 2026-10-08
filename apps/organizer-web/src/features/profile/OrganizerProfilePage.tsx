import React, { useState } from 'react';
import { useAuthStore, authApi } from '@gathergrid/shared';
import { Card, FormField, Input, Textarea, Button, OrganizerBadge, ImageUploader, useToast } from '@gathergrid/ui';

export const OrganizerProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const toast = useToast();
  const [orgName, setOrgName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authApi.updateProfile({ name: orgName, bio });
      updateUser({ name: orgName, bio });
      toast.success('Organization profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Organization Profile</h2>
        <Button variant="outline" size="sm" onClick={() => logout()}>Log Out</Button>
      </div>

      <Card variant="flat" padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ margin: 0 }}>Host Status</h4>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--gg-color-muted)' }}>
              Complete 3 events with positive feedback to achieve Bronze tier.
            </p>
          </div>
          <OrganizerBadge tier="new" size="md" />
        </div>
      </Card>

      <Card variant="flat" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormField label="Organization Logo">
            <ImageUploader label="Upload organization logo" onChange={() => toast.info('Logo updated')} />
          </FormField>

          <FormField label="Organization / Host Name" required>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </FormField>

          <FormField label="Contact Email" required helperText="Visible to confirmed event participants">
            <Input value={user?.email || ''} readOnly disabled />
          </FormField>

          <FormField label="About Your Organization">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell participants what kinds of activities you host..."
            />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
              Save Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
