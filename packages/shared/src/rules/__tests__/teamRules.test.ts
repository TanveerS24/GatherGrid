import { describe, it, expect } from 'vitest';
import {
  generateJoinCode,
  isValidJoinCode,
  electSuccessorLeader,
  isTeamLockActive,
  validateTeamSize,
} from '../teamRules.js';
import { JOIN_CODE_CHARSET, JOIN_CODE_LENGTH } from '../../constants/index.js';

describe('Team Rules, Join Codes & Leader Succession', () => {
  describe('join code generation & validation', () => {
    it('generates codes of configured length without ambiguous characters (0, O, 1, I)', () => {
      const code = generateJoinCode();
      expect(code.length).toBe(JOIN_CODE_LENGTH);
      expect(isValidJoinCode(code)).toBe(true);
      expect(code).not.toMatch(/[0O1I]/);
    });

    it('validates join codes strictly against allowed charset and length', () => {
      expect(isValidJoinCode('ABC456')).toBe(true);
      expect(isValidJoinCode('ABC056')).toBe(false); // contains '0'
      expect(isValidJoinCode('ABCI56')).toBe(false); // contains 'I'
      expect(isValidJoinCode('ABC')).toBe(false); // too short
    });
  });

  describe('leader succession', () => {
    it('elects second person to join as successor when leader leaves', () => {
      const members = [
        { userId: 'lead-1', userName: 'Alice' },
        { userId: 'lead-2', userName: 'Bob' },
        { userId: 'lead-3', userName: 'Charlie' },
      ];

      const successor = electSuccessorLeader('lead-1', members);
      expect(successor).not.toBeNull();
      expect(successor?.userId).toBe('lead-2');
      expect(successor?.userName).toBe('Bob');
    });

    it('returns null when last member leaves and team is disbanded', () => {
      const members = [{ userId: 'solo-1', userName: 'Dave' }];
      const successor = electSuccessorLeader('solo-1', members);
      expect(successor).toBeNull();
    });
  });

  describe('team lock deadline and size validation', () => {
    it('freezes team modifications once lock deadline is reached', () => {
      const lockTime = new Date('2026-10-12T12:00:00Z');
      const beforeLock = new Date('2026-10-12T11:59:59Z');
      const afterLock = new Date('2026-10-12T12:00:01Z');

      expect(isTeamLockActive(lockTime, beforeLock)).toBe(false);
      expect(isTeamLockActive(lockTime, afterLock)).toBe(true);
    });

    it('detects under-minimum and over-maximum size boundaries', () => {
      expect(validateTeamSize(1, 2, 4).underMin).toBe(true);
      expect(validateTeamSize(3, 2, 4).isValid).toBe(true);
      expect(validateTeamSize(5, 2, 4).overMax).toBe(true);
    });
  });
});
