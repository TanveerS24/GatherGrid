import React, { useState } from 'react';
import { Sparkles, Trash2, Heart } from 'lucide-react';
import { Button, IconButton } from '@gathergrid/ui';

export const ButtonsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Buttons & IconButtons</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <Button variant="primary">Primary Coral</Button>
        <Button variant="secondary">Secondary Teal</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger" leftIcon={<Trash2 size={16} />}>Danger</Button>
        <Button
          variant="primary"
          isLoading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          Click for loading
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg" rightIcon={<Sparkles size={18} />}>Large with icon</Button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <IconButton label="Favorite" variant="solid" size="md">
          <Heart size={18} />
        </IconButton>
        <IconButton label="Favorite" variant="outline" size="md">
          <Heart size={18} />
        </IconButton>
        <IconButton label="Favorite" variant="ghost" size="md">
          <Heart size={18} />
        </IconButton>
        <IconButton label="Favorite" variant="solid" size="md" isRound>
          <Heart size={18} />
        </IconButton>
      </div>
    </section>
  );
};
