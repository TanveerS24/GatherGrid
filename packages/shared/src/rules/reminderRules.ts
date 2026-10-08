import { DEFAULT_REMINDER_OFFSETS_MS } from '../constants/index.js';

export interface ScheduledReminder {
  offsetMs: number;
  fireTime: Date;
  label: string;
}

export function calculateReminderSchedules(
  startDateTime: string | Date,
  creationTime: string | Date = new Date(),
  offsetsMs: readonly number[] = DEFAULT_REMINDER_OFFSETS_MS
): ScheduledReminder[] {
  const start = new Date(startDateTime).getTime();
  const created = new Date(creationTime).getTime();

  const schedules: ScheduledReminder[] = [];

  for (const offset of offsetsMs) {
    const fireTimeMs = start - offset;
    // Suppress reminder if event was created after or starting sooner than the reminder offset
    if (fireTimeMs > created) {
      const hours = Math.round(offset / (60 * 60 * 1000));
      schedules.push({
        offsetMs: offset,
        fireTime: new Date(fireTimeMs),
        label: `${hours}h_before`,
      });
    }
  }

  return schedules;
}
