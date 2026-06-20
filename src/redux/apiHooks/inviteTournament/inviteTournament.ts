/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export const teamInvitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteTeam: builder.mutation<
      any,
      {
        tournamentId: string;
        payload: {
          toTournamentDivisionId: string;
          teamIds: string[];
        };
      }
    >({
      query: ({ tournamentId, payload }) => ({
        url: `/teaminvitations/${tournamentId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Coach", "Team", "Tournament"],
    }),
  }),
});

export const { useInviteTeamMutation } = teamInvitationApi;
