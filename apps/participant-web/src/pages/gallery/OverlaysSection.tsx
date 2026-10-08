import React, { useState } from 'react';
import {
  Button,
  Modal,
  ConfirmDialog,
  Drawer,
  BottomSheet,
  useToast,
  Tabs,
  SegmentedControl,
} from '@gathergrid/ui';

export const OverlaysSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('list');
  const toast = useToast();

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2>Navigation & Overlays</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <Tabs
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: 3 },
            { id: 'waitlisted', label: 'Waitlisted', count: 1 },
            { id: 'past', label: 'Past' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <SegmentedControl
          options={[
            { value: 'list', label: 'List View' },
            { value: 'map', label: 'Map View' },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Button variant="outline" onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Button variant="outline" onClick={() => setConfirmOpen(true)}>Open ConfirmDialog</Button>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
        <Button variant="outline" onClick={() => setSheetOpen(true)}>Open BottomSheet</Button>
        <Button variant="secondary" onClick={() => toast.success('You joined the volleyball game!')}>
          Show Success Toast
        </Button>
        <Button variant="danger" onClick={() => toast.error('Capacity reached. Placed on waitlist.')}>
          Show Error Toast
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Activity Rules & Gear">
        <p>Please bring non-marking sneakers and your own water bottle.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setModalOpen(false)}>Understood</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          toast.info('Cancelled registration');
        }}
        title="Cancel Registration?"
        message="Are you sure you want to cancel? If cancelled less than 24h prior, it will be marked as late cancellation."
        isDestructive
        confirmLabel="Yes, Cancel"
      />

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filter Activities">
        <p>Filters and location radius settings panel.</p>
      </Drawer>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Quick Filters">
        <p>Mobile bottom sheet for date range and categories.</p>
      </BottomSheet>
    </section>
  );
};
