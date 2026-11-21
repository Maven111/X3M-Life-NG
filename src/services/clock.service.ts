/**
 * X3M Life NG Simulation - Authoritative Game Clock Service
 *
 * Requirements:
 * - Server-authoritative time progression.
 * - Time scale: 1 real minute = 2 game minutes (ratio 2.0).
 * - Work hours: Mon-Fri 09:00 - 18:00.
 * - Payday: 25th day of every game month.
 */

export interface GameClockState {
  currentDay: number;
  currentHour: number;
  currentMinute: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isWorkHours: boolean;
  isOvertime: boolean;
  isWeekend: boolean;
  isPayday: boolean;
  formattedTime: string; // "09:30 AM"
  formattedDate: string; // "Day 12, Week 2 (Monday)"
}

export const TIME_CONFIG = {
  // 1 real second = 2 game seconds => 1 real min = 2 game mins (60s * 2 = 120s)
  TIME_SCALE_RATIO: 2.0,
  WORK_START_HOUR: 9, // 09:00 AM
  WORK_END_HOUR: 18,  // 06:00 PM
  PAYDAY_DAY_OF_MONTH: 25,
  DAYS_PER_MONTH: 30,
  DAYS_OF_WEEK: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ] as const
};

export class GameClockService {
  /**
   * Calculate current game clock state from simulation start timestamp and current elapsed time.
   *
   * @param realSecondsElapsed Total elapsed real-world seconds since game start
   * @param startingDay Initial game day (defaults to Day 1, Monday)
   * @param startingHour Initial starting hour (defaults to 9 AM)
   * @param startingMinute Initial starting minute (defaults to 0)
   */
  public static calculateState(
    realSecondsElapsed: number,
    startingDay: number = 1,
    startingHour: number = 9,
    startingMinute: number = 0
  ): GameClockState {
    const totalGameSeconds = realSecondsElapsed * TIME_CONFIG.TIME_SCALE_RATIO;
    const additionalMinutes = Math.floor(totalGameSeconds / 60);

    const initialTotalMinutes = (startingDay - 1) * 1440 + startingHour * 60 + startingMinute;
    const currentTotalMinutes = initialTotalMinutes + additionalMinutes;

    const currentDay = Math.floor(currentTotalMinutes / 1440) + 1;
    const minutesInDay = currentTotalMinutes % 1440;
    const currentHour = Math.floor(minutesInDay / 60);
    const currentMinute = minutesInDay % 60;

    // Day 1 = Monday (index 0)
    const dayIndex = (currentDay - 1) % 7;
    const dayOfWeek = TIME_CONFIG.DAYS_OF_WEEK[dayIndex];
    const isWeekend = dayIndex >= 5; // Saturday or Sunday

    const isWorkHours = !isWeekend && currentHour >= TIME_CONFIG.WORK_START_HOUR && currentHour < TIME_CONFIG.WORK_END_HOUR;
    const isOvertime = !isWeekend && currentHour >= TIME_CONFIG.WORK_END_HOUR && currentHour < 22;

    const dayOfMonth = ((currentDay - 1) % TIME_CONFIG.DAYS_PER_MONTH) + 1;
    const isPayday = dayOfMonth === TIME_CONFIG.PAYDAY_DAY_OF_MONTH && currentHour === TIME_CONFIG.WORK_START_HOUR && currentMinute === 0;

    return {
      currentDay,
      currentHour,
      currentMinute,
      dayOfWeek,
      isWorkHours,
      isOvertime,
      isWeekend,
      isPayday,
      formattedTime: this.formatTime(currentHour, currentMinute),
      formattedDate: `Day ${currentDay} (${dayOfWeek})`
    };
  }

  /**
   * Format 24h hour and minute into standard 12h display string.
   */
  public static formatTime(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
    return `${displayHour}:${displayMinute} ${period}`;
  }

  /**
   * Determine deadline status for an active brief.
   */
  public static checkDeadline(deadlineDay: number, deadlineHour: number, currentDay: number, currentHour: number): {
    isExpired: boolean;
    hoursRemaining: number;
    urgency: 'normal' | 'urgent' | 'critical' | 'expired';
  } {
    const deadlineTotalHours = deadlineDay * 24 + deadlineHour;
    const currentTotalHours = currentDay * 24 + currentHour;
    const hoursRemaining = deadlineTotalHours - currentTotalHours;

    if (hoursRemaining <= 0) {
      return { isExpired: true, hoursRemaining: 0, urgency: 'expired' };
    }
    if (hoursRemaining <= 4) {
      return { isExpired: false, hoursRemaining, urgency: 'critical' };
    }
    if (hoursRemaining <= 12) {
      return { isExpired: false, hoursRemaining, urgency: 'urgent' };
    }
    return { isExpired: false, hoursRemaining, urgency: 'normal' };
  }
}

