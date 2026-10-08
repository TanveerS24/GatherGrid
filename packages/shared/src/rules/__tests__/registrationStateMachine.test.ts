import { describe, it, expect } from 'vitest';
import { RegistrationStatus } from '../../enums/index.js';
import {
  canTransitionRegistration,
  transitionRegistration,
  InvalidStateTransitionError,
} from '../registrationStateMachine.js';

describe('Registration State Machine (Specification Matrix)', () => {
  const allStatuses = Object.values(RegistrationStatus);

  describe('valid state transitions', () => {
    const validPairs: [RegistrationStatus, RegistrationStatus][] = [
      // From PENDING
      [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED],
      [RegistrationStatus.PENDING, RegistrationStatus.REJECTED],
      [RegistrationStatus.PENDING, RegistrationStatus.CANCELLED],

      // From WAITLISTED
      [RegistrationStatus.WAITLISTED, RegistrationStatus.OFFERED],
      [RegistrationStatus.WAITLISTED, RegistrationStatus.CANCELLED],

      // From OFFERED
      [RegistrationStatus.OFFERED, RegistrationStatus.CONFIRMED],
      [RegistrationStatus.OFFERED, RegistrationStatus.EXPIRED],
      [RegistrationStatus.OFFERED, RegistrationStatus.CANCELLED],

      // From CONFIRMED
      [RegistrationStatus.CONFIRMED, RegistrationStatus.CANCELLED],
      [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED],
      [RegistrationStatus.CONFIRMED, RegistrationStatus.NO_SHOW],

      // From EXPIRED
      [RegistrationStatus.EXPIRED, RegistrationStatus.WAITLISTED],
    ];

    it.each(validPairs)(
      'permits valid transition from %s to %s',
      (from, to) => {
        expect(canTransitionRegistration(from, to)).toBe(true);
        expect(transitionRegistration(from, to)).toBe(to);
      }
    );

    it.each(allStatuses)(
      'allows identity transition for status %s (no-op)',
      (status) => {
        expect(canTransitionRegistration(status, status)).toBe(true);
        expect(transitionRegistration(status, status)).toBe(status);
      }
    );
  });

  describe('invalid state transitions (table-driven rejection)', () => {
    const invalidPairs: [RegistrationStatus, RegistrationStatus][] = [
      [RegistrationStatus.PENDING, RegistrationStatus.OFFERED],
      [RegistrationStatus.PENDING, RegistrationStatus.ATTENDED],
      [RegistrationStatus.WAITLISTED, RegistrationStatus.CONFIRMED],
      [RegistrationStatus.WAITLISTED, RegistrationStatus.ATTENDED],
      [RegistrationStatus.OFFERED, RegistrationStatus.REJECTED],
      [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING],
      [RegistrationStatus.REJECTED, RegistrationStatus.CONFIRMED],
      [RegistrationStatus.CANCELLED, RegistrationStatus.CONFIRMED],
      [RegistrationStatus.ATTENDED, RegistrationStatus.CANCELLED],
      [RegistrationStatus.NO_SHOW, RegistrationStatus.ATTENDED],
    ];

    it.each(invalidPairs)(
      'rejects invalid transition from %s to %s with InvalidStateTransitionError',
      (from, to) => {
        expect(canTransitionRegistration(from, to)).toBe(false);
        expect(() => transitionRegistration(from, to)).toThrow(
          InvalidStateTransitionError
        );
      }
    );
  });
});
