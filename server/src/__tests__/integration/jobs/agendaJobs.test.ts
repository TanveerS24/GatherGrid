import { describe, it } from 'vitest';

describe('Agenda Background Jobs Engine (Integration)', () => {
  it.skip(
    'dispatches activity reminders 24h and 1h prior to event start [@not-implemented BUG-006]',
    () => {
      // Pending implementation of agenda job worker
    }
  );

  it.skip(
    'expires pending waitlist offers after 12-hour window and promotes next in queue [@not-implemented BUG-006]',
    () => {
      // Pending implementation of waitlist expiry job
    }
  );

  it.skip(
    'drops teams under minimum size when team lock deadline arrives [@not-implemented BUG-006]',
    () => {
      // Pending implementation of team lock job
    }
  );
});
