import React from 'react';
import { PageHeader } from '@gathergrid/ui';
import { ButtonsSection } from './ButtonsSection';
import { InputsSection } from './InputsSection';
import { BadgesAndCardsSection } from './BadgesAndCardsSection';
import { OverlaysSection } from './OverlaysSection';

export const GalleryPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <PageHeader
        title="GatherGrid Design System Gallery"
        subtitle="Shared UI component library testing and preview environment"
      />
      <ButtonsSection />
      <hr style={{ border: 'none', borderTop: '1px solid var(--gg-color-border)' }} />
      <InputsSection />
      <hr style={{ border: 'none', borderTop: '1px solid var(--gg-color-border)' }} />
      <BadgesAndCardsSection />
      <hr style={{ border: 'none', borderTop: '1px solid var(--gg-color-border)' }} />
      <OverlaysSection />
    </div>
  );
};
