import React, { useState } from 'react';
import { useAuthStore, authApi, geoApi } from '@gathergrid/shared';
import {
  Card,
  Avatar,
  FormField,
  Input,
  Textarea,
  Button,
  CategoryChip,
  Slider,
  Switch,
  StatCard,
  useToast,
} from '@gathergrid/ui';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [locationName, setLocationName] = useState(user?.homeLocation?.name || 'San Francisco, CA');
  const [coords, setCoords] = useState({
    lat: user?.homeLocation?.lat || 37.7749,
    lng: user?.homeLocation?.lng || -122.4194,
  });
  const [radius, setRadius] = useState(user?.defaultRadiusKm || 25);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUseLocation = () => {
    if (!navigator?.geolocation) {
      toast.info('Geolocation not supported by browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        try {
          const res = await geoApi.reverse(lat, lng);
          const locName = res.displayName || `${res.city || 'Local Area'} (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
          setLocationName(locName);
          toast.success(`Location updated to ${locName}`);
        } catch {
          setLocationName(`Current Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
          toast.success('Coordinates updated');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.info('GPS unavailable. You can type your neighborhood or city.');
      },
      { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name,
        bio,
        homeLocation: { name: locationName, lat: coords.lat, lng: coords.lng },
        defaultRadiusKm: radius,
      };
      await authApi.updateProfile(payload);
      updateUser(payload);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>My Profile</h2>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          Log Out
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Joined Activities" value="10" />
        <StatCard label="Attended" value="8" change="80% Attendance" isPositive />
        <StatCard label="Late Cancellations" value="1" />
      </div>

      <Card variant="flat" padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Avatar name={user?.name || 'User'} size="xl" src={user?.avatarUrl} />
          <div>
            <h3>{user?.name}</h3>
            <span style={{ fontSize: '14px', color: 'var(--gg-color-muted)' }}>{user?.email}</span>
            <div style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                {user?.isVerified ? '✓ Verified Account' : 'Unverified Email'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Full Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>

          <FormField label="Bio">
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell others a bit about yourself..." />
          </FormField>

          <FormField label="Home Location">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="City or neighborhood" />
              <Button type="button" variant="outline" onClick={handleUseLocation} isLoading={isLocating}>
                Use GPS
              </Button>
            </div>
          </FormField>

          <FormField label={`Default Search Radius: ${radius} km`}>
            <Slider value={radius} onChange={(e) => setRadius(Number(e.target.value))} min={1} max={100} />
          </FormField>

          <div>
            <span style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              My Interests
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(user?.interests?.length ? user.interests : ['sports', 'social']).map((slug) => (
                <CategoryChip key={slug} slug={slug} label={slug.toUpperCase()} isActive />
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gg-color-border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4>Notification Preferences</h4>
            <Switch label="Email notifications for activity updates & offers" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            <Switch label="In-app alerts for team requests & reminders" checked={inAppAlerts} onChange={(e) => setInAppAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
