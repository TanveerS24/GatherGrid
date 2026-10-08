import React from 'react';
import {
  Badge,
  Chip,
  CategoryChip,
  StatusPill,
  Avatar,
  AvatarStack,
  SeatMeter,
  RatingStars,
  OrganizerBadge,
  CopyField,
  CountdownTimer,
  ActivityCard,
  StatCard,
} from '@gathergrid/ui';

export const BadgesAndCardsSection: React.FC = () => {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2>Badges, Status, and Activity Cards</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <CategoryChip slug="sports" label="Sports" emoji="⚽" />
        <CategoryChip slug="hackathons" label="Hackathons" emoji="💻" />
        <CategoryChip slug="workshops" label="Workshops" emoji="🛠️" />
        <CategoryChip slug="gaming" label="Gaming" emoji="🎮" />
        <CategoryChip slug="cultural" label="Cultural" emoji="🎭" />
        <CategoryChip slug="social" label="Social" emoji="🎉" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <StatusPill status="confirmed" />
        <StatusPill status="pending" />
        <StatusPill status="waitlisted" />
        <StatusPill status="cancelled" />
        <StatusPill status="offered" />
        <Badge variant="primary">New</Badge>
        <Badge variant="success">Verified</Badge>
        <Badge variant="warning">Expiring</Badge>
        <Chip label="Basketball" onRemove={() => alert('Removed')} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar name="Sarah Connor" size="lg" />
          <Avatar name="Alex Rivera" size="md" />
          <Avatar name="Jordan Lee" size="sm" />
        </div>
        <AvatarStack
          users={[
            { name: 'Sarah Connor' },
            { name: 'Alex Rivera' },
            { name: 'Jordan Lee' },
            { name: 'Taylor Swift' },
            { name: 'David Kim' },
          ]}
          max={3}
        />
        <OrganizerBadge tier="gold" />
        <OrganizerBadge tier="silver" />
        <OrganizerBadge tier="bronze" />
        <OrganizerBadge tier="new" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <RatingStars value={4.6} showNumber totalRatings={38} />
        <CopyField value="GG-TEAM-8492" label="Team Join Code" />
        <CountdownTimer expiresAt={new Date(Date.now() + 3600000).toISOString()} />
      </div>

      <div style={{ maxWidth: '320px' }}>
        <SeatMeter registered={37} capacity={50} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <ActivityCard
          id="act-1"
          title="Sunset Beach Volleyball & Picnic"
          categorySlug="sports"
          categoryLabel="Sports"
          categoryEmoji="🏐"
          startDateTime="Sat, Oct 17 · 5:00 PM"
          locationName="Ocean Beach, San Francisco"
          distanceKm={3.4}
          registeredCount={14}
          capacity={16}
          joinMode="instant"
          organizerName="Golden Gate Athletics"
          organizerBadgeTier="gold"
          costInfo="Free"
        />
        <StatCard label="Total Activities Hosted" value="48" change="+12% this month" isPositive />
      </div>
    </section>
  );
};
