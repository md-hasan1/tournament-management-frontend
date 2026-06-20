export type Season = "Summer" | "Winter" | "Spring" | "Fall";
export type BackendSeason = "SUMMER" | "WINTER" | "SPRING" | "FALL";

export type SessionType = "AM" | "PM";

export type ScheduleSession = {
  id: string;
  scheduleWeekId?: string;
  sessionType: SessionType;
  title: string;
  minAge: number;
  maxAge: number;
  dropOffTime: string;
  startTime: string;
  endTime: string;
  capacity: number;
  totalRegistered: number;
  goalieSlots: number;
  totalGoalieRegistered: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ScheduleWeek = {
  id: string;
  schedulePeriodId?: string;
  weekNumber: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  sessions: ScheduleSession[];
  createdAt?: string;
  updatedAt?: string;
};

export type SchedulePeriod = {
  id: string;
  name: string;
  scheduleName?: string;
  season: Season;
  backendSeason?: BackendSeason;
  numberOfWeek?: number;
  totalWeeks?: number;
  totalEnrollment?: number;
  totalCapacity?: number;
  fillRate?: number;
  startDate: string;
  endDate: string;
  status?: string;
  isDeleted?: boolean;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  weeks: ScheduleWeek[];
};

export type SchedulePeriodInput = {
  name: string;
  season: Season;
  weekRanges: Array<{
    startDate: string;
    endDate: string;
  }>;
};

export type ScheduleApiPayload = {
  scheduleName: string;
  season: BackendSeason;
  numberOfWeek: number;
  weeks: Array<{
    weekNumber: number;
    startDate: string;
    endDate: string;
  }>;
};

export type Participant = {
  id: string;
  playerName: string;
  age: number;
  session: SessionType;
  weekId: string;
  playerNumber: string;
  tshirtSize: string;
  parentName: string;
  parentEmail: string;
};
