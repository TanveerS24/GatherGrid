import { describe, it, expect } from 'vitest';
import { calculateReminderSchedules } from '../reminderRules.js';

describe('Reminder Scheduling Rules', () => {
  const futureEventStart = new Date('2026-10-15T18:00:00Z');

  it('schedules both 24h and 1h reminders for events created well in advance', () => {
    const createdTime = new Date('2026-10-10T12:00:00Z');
    const reminders = calculateReminderSchedules(futureEventStart, createdTime);

    expect(reminders).toHaveLength(2);
    expect(reminders[0].label).toBe('24h_before');
    expect(reminders[0].fireTime.toISOString()).toBe('2026-10-14T18:00:00.000Z');

    expect(reminders[1].label).toBe('1h_before');
    expect(reminders[1].fireTime.toISOString()).toBe('2026-10-15T17:00:00.000Z');
  });

  it('suppresses the 24h reminder if activity is created within 24 hours of start', () => {
    // Created 12 hours before event start
    const createdTime = new Date('2026-10-15T06:00:00Z');
    const reminders = calculateReminderSchedules(futureEventStart, createdTime);

    expect(reminders).toHaveLength(1);
    expect(reminders[0].label).toBe('1h_before');
  });

  it('schedules no reminders if activity starts sooner than the 1h offset', () => {
    // Created 30 minutes before event start
    const createdTime = new Date('2026-10-15T17:30:00Z');
    const reminders = calculateReminderSchedules(futureEventStart, createdTime);

    expect(reminders).toHaveLength(0);
  });
});
