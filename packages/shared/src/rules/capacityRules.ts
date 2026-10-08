export function isUnlimitedCapacity(capacity: number | null | undefined): boolean {
  return capacity === null || capacity === undefined || capacity <= 0;
}

export function hasAvailableCapacity(
  capacity: number | null | undefined,
  currentCount: number
): boolean {
  if (isUnlimitedCapacity(capacity)) {
    return true;
  }
  return currentCount < (capacity as number);
}

export function calculateRemainingSlots(
  capacity: number | null | undefined,
  currentCount: number
): number | null {
  if (isUnlimitedCapacity(capacity)) {
    return null;
  }
  return Math.max(0, (capacity as number) - currentCount);
}

export function isCapacityExceeded(
  capacity: number | null | undefined,
  currentCount: number
): boolean {
  if (isUnlimitedCapacity(capacity)) {
    return false;
  }
  return currentCount > (capacity as number);
}

export function calculateTeamCapacity(
  maxTeams: number | null | undefined,
  currentTeamCount: number
): { isFull: boolean; remainingSlots: number | null } {
  if (isUnlimitedCapacity(maxTeams)) {
    return { isFull: false, remainingSlots: null };
  }
  const cap = maxTeams as number;
  return {
    isFull: currentTeamCount >= cap,
    remainingSlots: Math.max(0, cap - currentTeamCount),
  };
}
