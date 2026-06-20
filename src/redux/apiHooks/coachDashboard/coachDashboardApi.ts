/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

type CreateTeamPlayersRequest = {
  teamregisterId: string;
  existingPlayerIds: string[];
};

export const coachDashbaordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoachDashboard: builder.query<any, string>({
      query: (id) => ({
        url: `/team-registrations/dashboard/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),
    updateGlobalPlayer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/player/profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coach", "Team"],
    }),

    getrecentActivity: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/users/activity/logs",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Coach", "Team"],
    }),
    getSingleTeamDetails: builder.query<any, any>({
      query: (id: string) => ({
        url: `/team-registrations/my-team/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),
    getCoachAllPalayer: builder.query<
      any,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, searchTerm } = {}) => ({
        url: "/players",
        method: "GET",
        params: { page, limit, ...(searchTerm ? { searchTerm } : {}) },
      }),
      providesTags: ["Coach", "Team"],
    }),
    addGlobalPlayer: builder.mutation<any, any>({
      query: (data) => ({
        url: "/players",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coach", "Team"],
    }),
    deletePlayer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Coach", "Team"],
    }),

    getRegisterdTournament: builder.query<any, any>({
      query: (id) => ({
        url: `/team-registrations/all/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),
    getSingleRegisterdTournamentDetails: builder.query<any, any>({
      query: (id) => ({
        url: `/team-registrations/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),
    inviteManager: builder.mutation<any, any>({
      query: ({ data, id }) => ({
        url: `/team-registrations/invite-manager/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coach", "Team"],
    }),
    getTeamHistroryPoint: builder.query<any, any>({
      query: (id) => ({
        url: `/team-registrations/history/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),
    getSingleTeamTournamentHistory: builder.query<any, any>({
      query: (id) => ({
        url: `/team-registrations/details-history/${id}`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team"],
    }),

    createTeamPlayer: builder.mutation<any, CreateTeamPlayersRequest>({
      query: (body) => ({
        url: "/team-players",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coach", "Team"],
    }),
    removeTeamPlayer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/team-players/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coach", "Team"],
    }),
    sendNotifyMail: builder.mutation<any, string>({
      query: (id) => ({
        url: `team-registrations/send-mail/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Coach", "Team"],
    }),
  }),
});

export const {
  useGetCoachDashboardQuery,
  useGetrecentActivityQuery,
  useGetSingleTeamDetailsQuery,
  useGetCoachAllPalayerQuery,
  useAddGlobalPlayerMutation,
  useDeletePlayerMutation,
  useGetRegisterdTournamentQuery,
  useGetSingleRegisterdTournamentDetailsQuery,
  useGetTeamHistroryPointQuery,
  useGetSingleTeamTournamentHistoryQuery,
  useInviteManagerMutation,
  useCreateTeamPlayerMutation,
  useRemoveTeamPlayerMutation,
  useSendNotifyMailMutation,
  useUpdateGlobalPlayerMutation,
} = coachDashbaordApi;
