/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SchedulePeriod, ScheduleWeek, SessionType } from "./types";

type SessionLike = {
  sessionType?: string;
  capacity?: number;
  totalRegistered?: number;
};

function getWeekSessions(week: ScheduleWeek): SessionLike[] {
  return Array.isArray((week as any)?.sessions) ? (week as any).sessions : [];
}

export function getSessionByType(
  week: ScheduleWeek,
  sessionType: SessionType,
): SessionLike | undefined {
  return getWeekSessions(week).find(
    (session) => session?.sessionType?.toUpperCase() === sessionType,
  );
}

export function getWeekSessionAvailability(
  week: ScheduleWeek,
  key: "am" | "pm",
) {
  const sessionType = key.toUpperCase() as SessionType;
  const session = getSessionByType(week, sessionType);

  if (!session) {
    return "No session";
  }

  const capacity = Number(session.capacity) || 0;
  const enrolled = Number(session.totalRegistered) || 0;
  const available = Math.max(capacity - enrolled, 0);

  if (available === 0) {
    return "Full";
  }

  if (available === 1) {
    return "1 spot available";
  }

  return `${available} spots available`;
}

export function getScheduleStats(schedule: SchedulePeriod) {
  const totalWeeks =
    typeof schedule.totalWeeks === "number"
      ? schedule.totalWeeks
      : typeof schedule.numberOfWeek === "number"
        ? schedule.numberOfWeek
        : Array.isArray(schedule.weeks)
          ? schedule.weeks.length
          : 0;

  const hasTopLevelStats =
    typeof schedule.totalCapacity === "number" &&
    typeof schedule.totalEnrollment === "number";

  if (hasTopLevelStats) {
    const totalCapacity = Number(schedule.totalCapacity) || 0;
    const totalEnrollment = Number(schedule.totalEnrollment) || 0;

    const fillRate =
      typeof schedule.fillRate === "number"
        ? Number(schedule.fillRate) || 0
        : totalCapacity > 0
          ? Math.round((totalEnrollment / totalCapacity) * 100)
          : 0;

    return {
      totalWeeks,
      totalCapacity,
      totalEnrollment,
      fillRate,
    };
  }

  const totals = (schedule.weeks ?? []).reduce(
    (acc, week) => {
      const sessions = getWeekSessions(week);

      const weekCapacity = sessions.reduce((sum, session) => {
        return sum + (Number(session.capacity) || 0);
      }, 0);

      const weekEnrollment = sessions.reduce((sum, session) => {
        return sum + (Number(session.totalRegistered) || 0);
      }, 0);

      acc.totalCapacity += weekCapacity;
      acc.totalEnrollment += weekEnrollment;

      return acc;
    },
    {
      totalCapacity: 0,
      totalEnrollment: 0,
    },
  );

  const fillRate =
    totals.totalCapacity > 0
      ? Math.round((totals.totalEnrollment / totals.totalCapacity) * 100)
      : 0;

  return {
    totalWeeks,
    totalCapacity: totals.totalCapacity,
    totalEnrollment: totals.totalEnrollment,
    fillRate,
  };
}

export function formatScheduleDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
