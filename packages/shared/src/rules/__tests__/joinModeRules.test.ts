import { describe, it, expect } from 'vitest';
import { JoinMode, RegistrationStatus } from '../../enums/index.js';
import {
  resolveRegistrationStatusOnApply,
  resolveApprovalStatus,
} from '../joinModeRules.js';

describe('Join Modes Resolution Rules', () => {
  describe('resolveRegistrationStatusOnApply', () => {
    it('confirms immediately for instant join when capacity is available', () => {
      const result = resolveRegistrationStatusOnApply({
        joinMode: JoinMode.INSTANT,
        hasCapacity: true,
        waitlistEnabled: true,
      });
      expect(result.status).toBe(RegistrationStatus.CONFIRMED);
      expect(result.waitlisted).toBe(false);
    });

    it('creates pending registration for approval mode when capacity is available', () => {
      const result = resolveRegistrationStatusOnApply({
        joinMode: JoinMode.APPROVAL,
        hasCapacity: true,
        waitlistEnabled: true,
      });
      expect(result.status).toBe(RegistrationStatus.PENDING);
      expect(result.waitlisted).toBe(false);
    });

    it('places applicant on waitlist when activity is full and waitlist is enabled', () => {
      const result = resolveRegistrationStatusOnApply({
        joinMode: JoinMode.INSTANT,
        hasCapacity: false,
        waitlistEnabled: true,
      });
      expect(result.status).toBe(RegistrationStatus.WAITLISTED);
      expect(result.waitlisted).toBe(true);
    });

    it('throws error when activity is full and waitlist is disabled', () => {
      expect(() =>
        resolveRegistrationStatusOnApply({
          joinMode: JoinMode.INSTANT,
          hasCapacity: false,
          waitlistEnabled: false,
        })
      ).toThrow('Activity is full and waitlist is not enabled');
    });
  });

  describe('resolveApprovalStatus', () => {
    it('sets status to REJECTED when applicant is not approved', () => {
      expect(resolveApprovalStatus(false, true, true)).toBe(RegistrationStatus.REJECTED);
    });

    it('confirms approved applicant when capacity exists', () => {
      expect(resolveApprovalStatus(true, true, true)).toBe(RegistrationStatus.CONFIRMED);
    });

    it('diverts approved applicant to waitlist if activity filled up before approval', () => {
      expect(resolveApprovalStatus(true, false, true)).toBe(RegistrationStatus.WAITLISTED);
    });
  });
});
