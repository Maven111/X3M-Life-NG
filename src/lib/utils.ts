/**
 * Shared Utilities for X3M Life NG Simulation
 */

/**
 * Format currency into Nigerian Naira (₦) with thousand separators
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
    .format(amount)
    .replace('NGN', '₦')
    .trim();
}

/**
 * Game Clock Calculations (Server Authoritative)
 * Rules (PRD 9.1 & GDD 7):
 * - 1 real minute = 2 in-game minutes (multiplier = 2.0)
 * - 8 in-game working hours = 4 real hours
 * - 1 complete in-game day (24h) = 12 real hours
 * - 30 in-game days = 15 real days
 */
export const GAME_TIME_MULTIPLIER = 2.0;

export function realTimeToGameTime(realElapsedMs: number): number {
  return realElapsedMs * GAME_TIME_MULTIPLIER;
}

export function gameTimeToRealTime(gameElapsedMs: number): number {
  return gameElapsedMs / GAME_TIME_MULTIPLIER;
}

/**
 * Classnames utility function
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

