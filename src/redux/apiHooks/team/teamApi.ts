/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTeam: builder.query({
      query: () => ({
        url: `/team-registrations/my-team`,
        method: "GET",
      }),
      providesTags: ["Coach", "Team", "Tournament"],
    }),
    teamRegistation: builder.mutation<any, any>({
      query: (data) => ({
        url: "/team-registrations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coach", "Team", "Tournament"],
    }),
    // ✅ RTK Query mutation fix (important for FormData upload)
    updateTeamDetails: builder.mutation<
      any,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/team-registrations/${id}`,
        method: "PUT",
        body: formData, // ✅ send FormData directly (NOT { data: formData })
      }),
      invalidatesTags: ["Coach", "Team", "Tournament"],
    }),
  }),
});

export const {
  useGetMyTeamQuery,
  useTeamRegistationMutation,
  useUpdateTeamDetailsMutation,
} = teamApi;
