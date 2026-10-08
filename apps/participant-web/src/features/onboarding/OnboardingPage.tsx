import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, authApi } from '@gathergrid/shared';
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

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationName, setLocationName] = useState('San Francisco, CA');
  const [radius, setRadius] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationName('Current Location (San Francisco)');
          toast.success('Location set to current position');
        },
        () => {
          toast.info('Location permission denied, using default city.');
        }
      );
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await authApi.updateProfile({
        interests: selectedCategories,
        homeLocation: { name: locationName, lat: 37.7749, lng: -122.4194 },
        defaultRadiusKm: radius,
      });
      updateUser({
        interests: selectedCategories,
        homeLocation: { name: locationName, lat: 37.7749, lng: -122.4194 },
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter city or neighborhood"
              />
              <Button type="button" variant="outline" onClick={handleUseLocation}>
                Use GPS
              </Button>
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
