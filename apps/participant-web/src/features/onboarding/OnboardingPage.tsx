import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, authApi, geoApi } from '@gathergrid/shared';
import { Card, Button, CategoryChip, Slider, FormField, Input, useToast } from '@gathergrid/ui';

const CATEGORIES = [
  { slug: 'sports', label: 'Sports', emoji: '⚽' },
  { slug: 'hackathons', label: 'Hackathons', emoji: '💻' },
  { slug: 'workshops', label: 'Workshops', emoji: '🛠️' },
  { slug: 'gaming', label: 'Gaming', emoji: '🎮' },
  { slug: 'study-groups', label: 'Study Groups', emoji: '📚' },
  { slug: 'cultural', label: 'Cultural', emoji: '🎭' },
  { slug: 'trips', label: 'Trips', emoji: '🏕️' },
  { slug: 'social', label: 'Social', emoji: '🎉' },
  { slug: 'career', label: 'Career', emoji: '💼' },
];

const QUICK_LOCATIONS = [
  { name: 'Mission District', lat: 37.7599, lng: -122.4148 },
  { name: 'SoMa', lat: 37.7785, lng: -122.4056 },
  { name: 'Marina', lat: 37.8037, lng: -122.4368 },
  { name: 'Golden Gate Park', lat: 37.7694, lng: -122.4862 },
  { name: 'North Beach', lat: 37.8005, lng: -122.4091 },
  { name: 'Berkeley', lat: 37.8715, lng: -122.2730 },
  { name: 'Oakland', lat: 37.8044, lng: -122.2712 },
];

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationName, setLocationName] = useState('San Francisco, CA');
  const [coords, setCoords] = useState({ lat: 37.7749, lng: -122.4194 });
  const [radius, setRadius] = useState(25);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleUseLocation = () => {
    if (!navigator?.geolocation) {
      toast.info('Geolocation is not supported by your browser. Please select a neighborhood.');
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
          const name = res.displayName || `${res.city || 'Local Area'} (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
          setLocationName(name);
          toast.success(`Location set: ${name}`);
        } catch {
          setLocationName(`Current Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
          toast.success('Location coordinates saved');
        } finally {
          setIsLocating(false);
        }
      },
      async (err) => {
        // Geolocation error or permission denied: try IP location fallback
        try {
          const ipRes = await fetch('https://ipapi.co/json/').then((r) => r.json());
          if (ipRes?.city && ipRes?.latitude && ipRes?.longitude) {
            const name = `${ipRes.city}, ${ipRes.region_code || ipRes.region || ''}`;
            setLocationName(name);
            setCoords({ lat: ipRes.latitude, lng: ipRes.longitude });
            toast.info(`Using approximate IP location: ${name}`);
            setIsLocating(false);
            return;
          }
        } catch {
          // Fall back to default SF
        }
        setIsLocating(false);
        const reason = err.code === 1 ? 'Permission was denied.' : 'Position unavailable or timed out.';
        toast.info(`GPS unavailable (${reason}). Set to San Francisco default or pick below.`);
      },
      { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  const handleSelectQuickLocation = (loc: typeof QUICK_LOCATIONS[0]) => {
    setLocationName(`${loc.name}, San Francisco`);
    setCoords({ lat: loc.lat, lng: loc.lng });
    toast.success(`Location set to ${loc.name}`);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await authApi.updateProfile({
        interests: selectedCategories,
        homeLocation: { name: locationName, lat: coords.lat, lng: coords.lng },
        defaultRadiusKm: radius,
      });
      updateUser({
        interests: selectedCategories,
        homeLocation: { name: locationName, lat: coords.lat, lng: coords.lng },
        defaultRadiusKm: radius,
      });
      toast.success('Your profile is all set!');
      navigate('/', { replace: true });
    } catch {
      navigate('/', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.25rem' }}>Welcome, {user?.name || 'Explorer'}! 👋</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>
          Personalize your GatherGrid experience so you see activities you love.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>1. Pick your favorite activity types</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CATEGORIES.map((cat) => (
                <CategoryChip
                  key={cat.slug}
                  slug={cat.slug}
                  label={cat.label}
                  emoji={cat.emoji}
                  isActive={selectedCategories.includes(cat.slug)}
                  onClick={() => toggleCategory(cat.slug)}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>2. Set your home base</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Input
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter city or neighborhood"
              />
              <Button type="button" variant="outline" onClick={handleUseLocation} isLoading={isLocating}>
                Use GPS
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gg-color-muted)' }}>Quick select:</span>
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectQuickLocation(loc)}
                  style={{
                    background: locationName.includes(loc.name) ? 'var(--gg-color-primary-light)' : '#f3f4f6',
                    border: locationName.includes(loc.name) ? '1px solid var(--gg-color-primary)' : '1px solid #e5e7eb',
                    color: locationName.includes(loc.name) ? 'var(--gg-color-primary-dark)' : '#374151',
                    borderRadius: '16px',
                    padding: '2px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: locationName.includes(loc.name) ? 600 : 400,
                  }}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>3. How far are you willing to travel?</h4>
            <FormField label={`Search radius: ${radius} km`}>
              <Slider value={radius} onChange={(e) => setRadius(Number(e.target.value))} min={1} max={100} />
            </FormField>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" onClick={() => navigate('/', { replace: true })}>
              Skip for now
            </Button>
            <Button variant="primary" onClick={handleFinish} isLoading={isSubmitting}>
              Start Exploring
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
