import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesApi, ActivityFormat, JoinMode } from '@gathergrid/shared';
import { Card, FormField, Input, Textarea, Select, Switch, Button, useToast } from '@gathergrid/ui';

const CATEGORIES = [
  { value: 'sports', label: '⚽ Sports' },
  { value: 'hackathons', label: '💻 Hackathons' },
  { value: 'gaming', label: '🎲 Gaming' },
  { value: 'workshops', label: '🛠️ Workshops' },
  { value: 'trips', label: '🏕️ Trips' },
  { value: 'social', label: '🎉 Social' },
];

export const CreateActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('sports');
  const [format, setFormat] = useState<ActivityFormat>(ActivityFormat.IN_PERSON);
  const [locationName, setLocationName] = useState('Mission District, San Francisco');
  const [onlinePlatform, setOnlinePlatform] = useState('Zoom');
  const [startDateTime, setStartDateTime] = useState('2026-10-25T18:00');
  const [endDateTime, setEndDateTime] = useState('2026-10-25T21:00');
  const [capacity, setCapacity] = useState('25');
  const [joinMode, setJoinMode] = useState<JoinMode>(JoinMode.INSTANT);
  const [costInfo, setCostInfo] = useState('Free');
  const [shortDesc, setShortDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = CATEGORIES.find((c) => c.value === category);
      await activitiesApi.create({
        title,
        categorySlug: category,
        categoryLabel: selectedCat?.label.split(' ')[1] || 'General',
        categoryEmoji: selectedCat?.label.split(' ')[0] || '🌟',
        format,
        locationName: format === ActivityFormat.IN_PERSON ? locationName : `Online (${onlinePlatform})`,
        onlinePlatform: format === ActivityFormat.ONLINE ? onlinePlatform : undefined,
        lat: format === ActivityFormat.IN_PERSON ? 37.76 : undefined,
        lng: format === ActivityFormat.IN_PERSON ? -122.42 : undefined,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: new Date(endDateTime).toISOString(),
        capacity: Number(capacity) || 20,
        joinMode,
        costInfo,
        shortDescription: shortDesc || 'Join us for this exciting activity!',
        bannerUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
      });
      toast.success('Activity published successfully!');
      navigate('/activities');
    } catch {
      toast.error('Failed to create activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 1rem' }}>
      <Card variant="flat" padding="lg">
        <h2 style={{ marginBottom: '0.25rem' }}>Create New Activity</h2>
        <p style={{ color: 'var(--gg-color-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>
          Publish an event for your community. It will be immediately discoverable.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormField label="Activity Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Golden Gate Sunset Run" />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Category">
              <Select value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
            </FormField>
            <FormField label="Format">
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value as ActivityFormat)}
                options={[
                  { value: 'in_person', label: '📍 In-Person' },
                  { value: 'online', label: '🌐 Online / Remote' },
                ]}
              />
            </FormField>
          </div>

          {format === 'in_person' ? (
            <FormField label="Location / Venue Name" required>
              <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="e.g. Ocean Beach, Fire Pits" />
            </FormField>
          ) : (
            <FormField label="Virtual Platform" required>
              <Input value={onlinePlatform} onChange={(e) => setOnlinePlatform(e.target.value)} placeholder="e.g. Zoom, Discord, Google Meet" />
            </FormField>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Start Date & Time" required>
              <Input type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
            </FormField>
            <FormField label="End Date & Time" required>
              <Input type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Max Capacity (Seats)">
              <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} min={2} max={500} />
            </FormField>
            <FormField label="Cost Info">
              <Input value={costInfo} onChange={(e) => setCostInfo(e.target.value)} placeholder="Free or $10 (materials)" />
            </FormField>
          </div>

          <FormField label="Short Description">
            <Textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={3} placeholder="Tell participants what to expect..." />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Switch label="Require Organizer Approval to Join" checked={joinMode === JoinMode.APPROVAL} onChange={(e) => setJoinMode(e.target.checked ? JoinMode.APPROVAL : JoinMode.INSTANT)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => navigate('/activities')}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>Publish Activity</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
