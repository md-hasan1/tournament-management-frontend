// types/tournament.ts
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type TournamentQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
};

export type UpdateMatchModel = {
  homeTeamId?: string;
  awayTeamId?: string;
  refereeId?: string | null;
  scheduledAt?: string;
  field?: string;
  homeScore?: number;
  awayScore?: number;
  isPublished?: boolean;
};

export type DivisionStanding = {
  rank: number;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
};

export type DivisionStandingsData = {
  divisionId: string;
  standings: DivisionStanding[];
};

export type DivisionStandingsResponse = {
  success: boolean;
  message: string;
  data: DivisionStandingsData;
};

export type SeriesStanding = {
  rank: number;
  teamId: string;
  teamName: string;
  tournaments: number;
  points: number;
  statusBadge: "QUALIFIED" | "ON_THE_BUBBLE" | "ELIMINATED";
  inviteEnabled: boolean;
  discountPercent: number;
  discountSource: "DEFAULT" | "OVERRIDE";
};

export type SeriesLeaderboardMeta = {
  resetAfter: string;
  lastRoyalEndedAt: string | null;
  totalTeams: number;
  qualifiedCount: number;
  bubbleCount: number;
  eliminatedCount: number;
};

export type SeriesLeaderboardData = {
  divisionName: string;
  meta: SeriesLeaderboardMeta;
  standings: SeriesStanding[];
};

export type SeriesLeaderboardResponse = {
  success: boolean;
  message: string;
  data: SeriesLeaderboardData;
};
