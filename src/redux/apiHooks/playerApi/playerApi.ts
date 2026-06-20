/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerDashbaord: builder.query<any, void>({
      query: () => ({
        url: "/players/dashboard",
        method: "GET",
      }),
      providesTags: ["TeamPlayers"],
    }),
    getPlayerSchedule: builder.query<any, void>({
      query: () => ({
        url: "/players/schedule",
        method: "GET",
      }),
      providesTags: ["TeamPlayers"],
    }),
    approveSign: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/team-players/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TeamPlayers"],
    }),
    updatePlayerProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `/users/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetPlayerDashbaordQuery,
  useGetPlayerScheduleQuery,
  useApproveSignMutation,
  useUpdatePlayerProfileMutation,
} = playerApi;
