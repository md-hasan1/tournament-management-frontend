/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export const homePageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTournament: builder.query<
      any,
      { query?: string; page?: number; limit?: number }
    >({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/tournaments",
        method: "GET",
        params: {
          searchTerm: query,
          page,
          limit,
        },
      }),
      providesTags: ["Coach", "Team", "Tournament"],
    }),
    getSingleTournament: builder.query<any, { id?: string }>({
      query: ({ id }) => ({
        url: `/tournaments`,
        method: "GET",
        params: { id },
      }),
      providesTags: ["Coach", "Team", "Tournament"],
    }),
    getTournamentStandings: builder.query<any, { divisionName: string }>({
      query: ({ divisionName }) => ({
        url: `/tournaments/series/${divisionName}/leaderboard`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team", "Tournament"],
    }),
    buyBundle: builder.mutation<any, any>({
      query: (data) => ({
        url: `/payments/buy-bundle`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coach", "Team", "Tournament"],
    }),
  }),
});

export const {
  useGetTournamentQuery,
  useGetSingleTournamentQuery,
  useGetTournamentStandingsQuery,
  useBuyBundleMutation,
} = homePageApi;
