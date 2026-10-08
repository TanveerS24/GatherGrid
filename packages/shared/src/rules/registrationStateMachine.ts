import { RegistrationStatus } from '../enums/index.js';

export const VALID_TRANSITIONS: Record<RegistrationStatus, readonly RegistrationStatus[]> = {
  [RegistrationStatus.PENDING]: [
    RegistrationStatus.CONFIRMED,
    RegistrationStatus.REJECTED,
    RegistrationStatus.CANCELLED,
  ],
  [RegistrationStatus.WAITLISTED]: [
    RegistrationStatus.OFFERED,
    RegistrationStatus.CANCELLED,
  ],
  [RegistrationStatus.OFFERED]: [
    RegistrationStatus.CONFIRMED,
    RegistrationStatus.EXPIRED,
    RegistrationStatus.CANCELLED,
  ],
  [RegistrationStatus.CONFIRMED]: [
    RegistrationStatus.CANCELLED,
    RegistrationStatus.ATTENDED,
    RegistrationStatus.NO_SHOW,
  ],
  [RegistrationStatus.REJECTED]: [],
  [RegistrationStatus.EXPIRED]: [RegistrationStatus.WAITLISTED],
  [RegistrationStatus.CANCELLED]: [],
  [RegistrationStatus.ATTENDED]: [],
  [RegistrationStatus.NO_SHOW]: [],
};

export class InvalidStateTransitionError extends Error {
  constructor(public from: RegistrationStatus, public to: RegistrationStatus) {
    super(`Invalid registration status transition from '${from}' to '${to}'`);
    this.name = 'InvalidStateTransitionError';
  }
}

export function canTransitionRegistration(
  from: RegistrationStatus,
  to: RegistrationStatus
): boolean {
  if (from === to) return true;
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export function transitionRegistration(
  from: RegistrationStatus,
  to: RegistrationStatus
): RegistrationStatus {
  if (from === to) return to;
  if (!canTransitionRegistration(from, to)) {
    throw new InvalidStateTransitionError(from, to);
  }
  return to;
}
