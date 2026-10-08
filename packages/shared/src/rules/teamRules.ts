import { JOIN_CODE_CHARSET, JOIN_CODE_LENGTH } from '../constants/index.js';

export function generateJoinCode(
  length: number = JOIN_CODE_LENGTH,
  charset: string = JOIN_CODE_CHARSET
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

export function isValidJoinCode(
  code: string,
  expectedLength: number = JOIN_CODE_LENGTH,
  charset: string = JOIN_CODE_CHARSET
): boolean {
  if (!code || code.length !== expectedLength) return false;
  const upper = code.toUpperCase();
  for (const ch of upper) {
    if (!charset.includes(ch)) return false;
  }
  return true;
}

export interface TeamMemberLike {
  userId: string;
  userName: string;
}

export function electSuccessorLeader<T extends TeamMemberLike>(
  currentLeaderId: string,
  members: T[]
): T | null {
  const remaining = members.filter((m) => m.userId !== currentLeaderId);
  if (remaining.length === 0) return null;
  // Second person to join (which is the first person in remaining array) becomes leader
  return remaining[0];
}

export function isTeamLockActive(
  lockDeadline: string | Date | null | undefined,
  currentTime: string | Date = new Date()
): boolean {
  if (!lockDeadline) return false;
  const deadline = new Date(lockDeadline).getTime();
  const current = new Date(currentTime).getTime();
  return current >= deadline;
}

export function validateTeamSize(
  memberCount: number,
  minSize: number = 2,
  maxSize: number = 4
): { isValid: boolean; underMin: boolean; overMax: boolean } {
  return {
    isValid: memberCount >= minSize && memberCount <= maxSize,
    underMin: memberCount < minSize,
    overMax: memberCount > maxSize,
  };
}
