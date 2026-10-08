import { JoinMode, RegistrationStatus } from '../enums/index.js';

export function resolveRegistrationStatusOnApply(params: {
  joinMode: JoinMode;
  hasCapacity: boolean;
  waitlistEnabled: boolean;
}): { status: RegistrationStatus; waitlisted: boolean } {
  const { joinMode, hasCapacity, waitlistEnabled } = params;

  if (hasCapacity) {
    if (joinMode === JoinMode.APPROVAL) {
      return { status: RegistrationStatus.PENDING, waitlisted: false };
    }
    return { status: RegistrationStatus.CONFIRMED, waitlisted: false };
  }

  // No capacity available
  if (waitlistEnabled) {
    return { status: RegistrationStatus.WAITLISTED, waitlisted: true };
  }

  throw new Error('Activity is full and waitlist is not enabled');
}

export function resolveApprovalStatus(
  approved: boolean,
  hasCapacity: boolean,
  waitlistEnabled: boolean
): RegistrationStatus {
  if (!approved) {
    return RegistrationStatus.REJECTED;
  }
  if (hasCapacity) {
    return RegistrationStatus.CONFIRMED;
  }
  if (waitlistEnabled) {
    return RegistrationStatus.WAITLISTED;
  }
  throw new Error('Cannot approve registration into a full activity without waitlist');
}
