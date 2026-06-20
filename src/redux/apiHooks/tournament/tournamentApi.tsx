/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";
import {
  DivisionStandingsResponse,
  SeriesLeaderboardResponse,
  UpdateMatchModel,
} from "@/types/tournament";

// Strict division enum values expected by the backend
export type DivisionCode =
  | "U9_BOYS"
  | "U10_BOYS"
  | "U9_GIRLS"
  | "U10_GIRLS"
  | "U11_BOYS"
  | "U11_GIRLS"
  | "U12_BOYS"
  | "U12_GIRLS"
  | "U13_BOYS"
  | "U14_BOYS"
  | "U13_GIRLS"
  | "U14_GIRLS"
  | "U15_BOYS"
  | "U16_BOYS"
  | "U15_GIRLS"
  | "U16_GIRLS"
  | "U17_BOYS"
  | "U18_BOYS"
  | "U17_GIRLS"
  | "U18_GIRLS"
  | "HS_BOYS"
  | "HS_GIRLS"
  | "MENS_DIV_1"
  | "MENS_DIV_2"
  | "MENS_DIV_3"
  | "WOMENS"
  | "COED";

export interface Division {
  divisionName: DivisionCode;
  maxTeams: number;
}

export interface CreateTournamentRequest {
  tournamentStage: "PROVING" | "CROWN" | "ROYAL";
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  mapLink: string;
  registrationDeadline: string;
  numberOfFields: number;
  youthFee: number;
  adultFee: number;
  notes?: string;
  bathrooms?: string;
  foods?: string;
  parking?: string;
  prizePool?: string;
  status: "OPEN" | "LIVE" | "COMPLETED" | "CANCELLED" | "FILED";
  divisions: Division[];
}

export interface SeriesResponse {
  id: string;
  type: "PROVING" | "CROWN" | "ROYAL";
  youthFee: number;
  adultFee: number;
}

export interface CreateTournamentResponse {
  id: string;
  userId: string;
  tournamentStage: "PROVING" | "CROWN" | "ROYAL";
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  mapLink: string;
  registrationDeadline: string;
  numberOfFields: number;
  youthFee: number;
  adultFee: number;
  notes?: string;
  bathrooms?: string;
  foods?: string;
  parking?: string;
  prizePool?: string;
  gameStyle?: string;
  rosterSizeMax?: number;
  status: "OPEN" | "LIVE" | "COMPLETED" | "CANCELLED" | "FILED";
  totalRegisteredTeams?: number;
  logo?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  tournamentDivisions: Array<{
    id: string;
    tournamentId: string;
    divisionName: DivisionCode;
    maxTeams: number;
    slotsLeft: number;
    status: string;
    feeOverride: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TournamentDivisionDetails {
  id: string;
  tournamentId: string;
  divisionName: DivisionCode;
  maxTeams: number;
  slotsLeft: number;
  revenue: number;
  isScheduled: boolean;
  status: string;
  feeOverride: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentByUserIdResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      totalDivisions: number;
      activeDivisions: number;
      totalTeams: number;
      totalRevenue: number;
    };
    data: Omit<CreateTournamentResponse, "tournamentDivisions"> & {
      tournamentDivisions: TournamentDivisionDetails[];
    };
  };
}

// List item returned from GET /tournaments
export interface TournamentListItem {
  id: string;
  userId: string;
  tournamentStage: "PROVING" | "CROWN" | "ROYAL";
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  mapLink: string;
  registrationDeadline: string;
  numberOfFields: number;
  youthFee: number;
  adultFee: number;
  notes?: string;
  gameStyle?: string;
  rosterSizeMax?: number;
  status: "OPEN" | "LIVE" | "COMPLETED" | "CANCELLED" | "FILED";
  totalRegisteredTeams?: number;
  logo?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  tournamentDivisions: Array<{
    id: string;
    tournamentId: string;
    divisionName: DivisionCode;
    maxTeams: number;
    slotsLeft: number;
    status: string;
    feeOverride: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TournamentsListResponse {
  success: boolean;
  message: string;
  data: {
    meta: { total: number; page: number; limit: number };
    data: TournamentListItem[];
  };
}

export interface TournamentsListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  tournamentStage?: "PROVING" | "CROWN" | "ROYAL";
  id?: string;
  status?: "OPEN" | "LIVE" | "COMPLETED" | "CANCELLED" | "FILED";
}

export interface TeamPlayer {
  id: string;
  status: "Pending" | "Signed";
  ageVerified: "verified" | "Rejected" | "Check_in_required";
  isAgree: boolean;
  signName: string | null;
  userId: string;
  playerId: string;
  teamregistrationId: string;
  isDeletedTeamPlayer: boolean;
  createdAt: string;
  updatedAt: string;
  signedAt: string | null;
}

export interface TeamByDivision {
  signedPlayersCount: number;
  id: string;
  teamId: string;
  userId: string;
  tournamentId: string;
  teamDivisionId: string;
  teamName: string;
  image: string | null;
  registrationPayStatus: "PENDING" | "PAID";
  maxPlayers: number;
  totalRegisteredPlayers: number;
  createdAt: string;
  updatedAt: string;
  coach: {
    id: string;
    fullName: string;
    email: string;
  };
  teamplayers: TeamPlayer[];
}

export interface TeamsbyDivisionResponse {
  success: boolean;
  message: string;
  data: {
    meta: { total: number; page: number; limit: number };
    data: TeamByDivision[];
  };
}

export interface GetTeamsByDivisionParams {
  teamDivisionId: string;
  page?: number;
  limit?: number;
}

export interface ScheduleMatch {
  id: string;
  tournamentId: string;
  divisionId: string;
  homeTeamId: string;
  awayTeamId: string;
  refereeId: string | null;
  scheduledAt: string;
  field: string;
  homeScore: number | null;
  awayScore: number | null;
  round: string | null;
  isPublished: boolean;
  status: "PUBLISHED" | "COMPLETED" | "PENDING" | "CANCELLED";
  stage: "GROUP" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS";
  createdAt: string;
  updatedAt: string;
  referee: any;
  homeTeam: {
    id: string;
    teamName: string;
    image: string | null;
  };
  awayTeam: {
    id: string;
    teamName: string;
    image: string | null;
  };
}

export interface DivisionScheduleResponse {
  success: boolean;
  message: string;
  data: {
    division: {
      id: string;
      tournamentId: string;
      divisionName: string;
      maxTeams: number;
      slotsLeft: number;
      revenue: number;
      isScheduled: boolean;
      status: string;
      feeOverride: number | null;
      createdAt: string;
      updatedAt: string;
      tournament: {
        id: string;
        name: string;
      };
    };
    stats: {
      teamsRegistered: number;
      teamsMax: number;
      matches: number;
      fields: number;
    };
    schedule: {
      meta: { total: number; page: number; limit: number };
      data: ScheduleMatch[];
    };
    brackets: any[];
  };
}

export interface GetScheduleByDivisionParams {
  divisionId: string;
  page?: number;
  limit?: number;
}

export const tournamentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create tournament
    createTournament: builder.mutation<CreateTournamentResponse, FormData>({
      query: (formData) => ({
        url: "/tournaments",
        method: "POST",
        // Don't set Content-Type explicitly; browser sets multipart boundaries
        body: formData,
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Get all tournaments (paginated + filters)
    getTournaments: builder.query<
      TournamentsListResponse,
      TournamentsListParams | void
    >({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params) {
          // Always send page and limit
          qp.append("page", String(params.page || 1));
          qp.append("limit", String(params.limit || 10));
          // Send optional filters if provided
          if (params.searchTerm) qp.append("searchTerm", params.searchTerm);
          if (params.tournamentStage) {
            qp.append("tournamentStage", params.tournamentStage);
          }
          if (params.status) {
            qp.append("status", params.status);
          }
          if (params.id) qp.append("id", params.id);
        }
        const qs = qp.toString();
        const url = `/tournaments${qs ? `?${qs}` : ""}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Tournaments"],
    }),

    // Get tournament by ID
    getTournamentById: builder.query<any, string>({
      query: (id) => ({
        url: `/tournaments?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Tournaments"],
    }),

    // Get tournament details by user ID
    getTournamentByUserId: builder.query<TournamentByUserIdResponse, string>({
      query: (userId) => ({
        url: `/tournaments/get/by/userId/${userId}`,
        method: "GET",
      }),
      providesTags: ["Tournaments"],
    }),

    // Update tournament
    updateTournament: builder.mutation<
      CreateTournamentResponse,
      { id: string; data: Partial<CreateTournamentRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/tournaments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Delete tournament
    deleteTournament: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/tournaments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Get series by type
    getSeries: builder.query<any, string>({
      query: (type) => ({
        url: `/series?type=${type}`,
        method: "GET",
      }),
      providesTags: ["Series"],
    }),

    // Update series pricing
    updateSeriesPricing: builder.mutation<
      { success: boolean },
      { id: string; youthFee: number; adultFee: number }
    >({
      query: ({ id, youthFee, adultFee }) => ({
        url: `/series/${id}`,
        method: "PUT",
        body: { youthFee, adultFee },
      }),
      invalidatesTags: ["Series"],
    }),

    // Get teams by division ID
    getTeamsByDivision: builder.query<
      TeamsbyDivisionResponse,
      GetTeamsByDivisionParams
    >({
      query: (params) => {
        const qp = new URLSearchParams();
        qp.append("page", String(params.page || 1));
        qp.append("limit", String(params.limit || 10));
        const qs = qp.toString();
        const url = `/tournaments/division/${params.teamDivisionId}/teams${qs ? `?${qs}` : ""}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Team"],
    }),

    // Get schedule by division ID
    getScheduleByDivision: builder.query<
      DivisionScheduleResponse,
      GetScheduleByDivisionParams
    >({
      query: (params) => {
        const qp = new URLSearchParams();
        qp.append("page", String(params.page || 1));
        qp.append("limit", String(params.limit || 30));
        const qs = qp.toString();
        const url = `/tournaments/division/${params.divisionId}/schedule${qs ? `?${qs}` : ""}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Tournaments"],
    }),

    // Get standings by division ID
    getStandingsByDivision: builder.query<DivisionStandingsResponse, string>({
      query: (divisionId) => ({
        url: `/tournaments/division/${divisionId}/standings`,
        method: "GET",
      }),
      providesTags: ["Tournaments"],
    }),

    // Get series leaderboard by division name
    getSeriesLeaderboard: builder.query<SeriesLeaderboardResponse, string>({
      query: (divisionName) => ({
        url: `/tournaments/series/${divisionName}/leaderboard`,
        method: "GET",
      }),
      providesTags: ["Series"],
    }),

    // Update match score
    updateMatchScore: builder.mutation<
      { success: boolean; message: string; data: any },
      { matchId: string; homeScore: number; awayScore: number }
    >({
      query: ({ matchId, homeScore, awayScore }) => ({
        url: `/tournaments/match/${matchId}/edit?force=true`,
        method: "PATCH",
        body: {
          homeScore,
          awayScore,
        },
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Update match referee
    updateMatchReferee: builder.mutation<
      { success: boolean; message: string; data: any },
      { matchId: string; refereeId: string }
    >({
      query: ({ matchId, refereeId }) => ({
        url: `/tournaments/match/${matchId}/edit?force=true`,
        method: "PATCH",
        body: {
          refereeId,
        },
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Update match with full details
    updateMatch: builder.mutation<
      { success: boolean; message: string; data: any },
      { matchId: string; data: UpdateMatchModel }
    >({
      query: ({ matchId, data }) => ({
        url: `/tournaments/match/${matchId}/edit?force=true`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Regenerate schedule for a division
    regenerateSchedule: builder.mutation<
      { success: boolean; message: string; data: any },
      { divisionId: string }
    >({
      query: ({ divisionId }) => ({
        url: `/tournaments/division/${divisionId}/generate?force=true`,
        method: "POST",
      }),
      invalidatesTags: ["Tournaments"],
    }),

    // Update team player age verification status
    updateTeamPlayerVerification: builder.mutation<
      { success: boolean; message: string; data: any },
      { playerId: string; ageVerified: "verified" | "Rejected" | "pending" }
    >({
      query: ({ playerId, ageVerified }) => ({
        url: `/team-players/${playerId}`,
        method: "PUT",
        body: { ageVerified },
      }),
      invalidatesTags: ["Team"],
    }),

    // Update team discount override
    updateTeamDiscountOverride: builder.mutation<
      { success: boolean; message: string; data: any },
      { teamId: string; discountPercent: number }
    >({
      query: ({ teamId, discountPercent }) => ({
        url: `/tournaments/team/${teamId}/discount/override`,
        method: "POST",
        body: { discountPercent },
      }),
      invalidatesTags: ["Series"],
    }),
    deleteDivision: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/tournaments/division/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tournaments"],
    }),
  }),
});

export const {
  useCreateTournamentMutation,
  useGetTournamentsQuery,
  useGetTournamentByIdQuery,
  useGetTournamentByUserIdQuery,
  useUpdateTournamentMutation,
  useDeleteTournamentMutation,
  useGetSeriesQuery,
  useUpdateSeriesPricingMutation,
  useGetTeamsByDivisionQuery,
  useGetScheduleByDivisionQuery,
  useGetStandingsByDivisionQuery,
  useGetSeriesLeaderboardQuery,
  useUpdateMatchScoreMutation,
  useUpdateMatchRefereeMutation,
  useUpdateMatchMutation,
  useRegenerateScheduleMutation,
  useUpdateTeamPlayerVerificationMutation,
  useUpdateTeamDiscountOverrideMutation,
  useDeleteDivisionMutation,
} = tournamentApi;
