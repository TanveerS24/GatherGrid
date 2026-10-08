import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import {
  FormField,
  Input,
  PasswordInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  NumberStepper,
  DateTimePicker,
} from '@gathergrid/ui';

export const InputsSection: React.FC = () => {
  const [radius, setRadius] = useState(25);
  const [stepperVal, setStepperVal] = useState(4);
  const [multiVal, setMultiVal] = useState<string[]>(['sports']);
  const [radioVal, setRadioVal] = useState('free');
  const [switchVal, setSwitchVal] = useState(true);
  const [dateTime, setDateTime] = useState('2026-10-15T18:00');

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2>Form Controls</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <FormField label="Email address" required helperText="We'll never share your email.">
          <Input leftAddon={<Mail size={16} />} placeholder="alex@example.com" />
        </FormField>

        <FormField label="Password" required>
          <PasswordInput placeholder="Enter secure password" />
        </FormField>

        <FormField label="Select City" required>
          <Select
            options={[
              { value: 'nyc', label: 'New York City' },
              { value: 'sf', label: 'San Francisco' },
              { value: 'lon', label: 'London' },
            ]}
            placeholder="Choose city..."
          />
        </FormField>

        <FormField label="Interests (MultiSelect)">
          <MultiSelect
            options={[
              { value: 'sports', label: '⚽ Sports' },
              { value: 'gaming', label: '🎮 Gaming' },
              { value: 'hackathons', label: '💻 Hackathons' },
            ]}
            value={multiVal}
            onChange={setMultiVal}
          />
        </FormField>
      </div>

      <FormField label="Bio / Description">
        <Textarea placeholder="Tell us about yourself..." rows={3} />
      </FormField>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <Checkbox label="I agree to Community Guidelines" defaultChecked />
        <Switch label="Receive instant alerts" checked={switchVal} onChange={(e) => setSwitchVal(e.target.checked)} />
        <div>
          <span style={{ fontSize: '14px', fontWeight: 500, marginRight: '8px' }}>Team size:</span>
          <NumberStepper value={stepperVal} onChange={setStepperVal} min={2} max={10} />
        </div>
      </div>

      <div style={{ maxWidth: '400px' }}>
        <FormField label={`Search radius: ${radius} km`}>
          <Slider value={radius} onChange={(e) => setRadius(Number(e.target.value))} min={1} max={100} />
        </FormField>
      </div>

      <div style={{ maxWidth: '400px' }}>
        <FormField label="Event start time">
          <DateTimePicker value={dateTime} onChange={setDateTime} />
        </FormField>
      </div>

      <RadioGroup
        name="cost_type"
        options={[
          { value: 'free', label: 'Free activity' },
          { value: 'paid', label: 'Paid activity (Direct to host)', description: 'GatherGrid does not handle payments' },
        ]}
        value={radioVal}
        onChange={setRadioVal}
        orientation="horizontal"
      />
    </section>
  );
};
