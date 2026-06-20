import baseApi from "@/redux/api/baseApi";

export interface TeamPlayer {
  id: string;
  status: "Pending" | "Signed" | "Verified" | "Rejected";
  ageVerified: "verified" | "Check_in_required" | "Pending" | "Rejected";
  note: string | null;
  team: {
    tourDivision: {
      divisionName: string;
    };
  };
  player: {
    fullName: string;
  };
}

export interface TeamPlayersResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: TeamPlayer[];
}

export interface TeamPlayersParams {
  page?: number;
  limit?: number;
}

export const teamPlayersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get team players for verification queue
    getTeamPlayers: builder.query<
      TeamPlayersResponse,
      TeamPlayersParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
        }
        const queryString = queryParams.toString();
        return {
          url: `/team-players${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["TeamPlayers"],
    }),

    // Get single team player
    getTeamPlayerById: builder.query<TeamPlayer, string>({
      query: (id) => ({
        url: `/team-players/${id}`,
        method: "GET",
      }),
      providesTags: ["TeamPlayers"],
    }),

    // Update team player age verification (approve/reject)
    updateTeamPlayerStatus: builder.mutation<
      TeamPlayer,
      { id: string; ageVerified: "verified" | "Rejected"; note?: string }
    >({
      query: ({ id, ageVerified, note }) => ({
        url: `/team-players/${id}`,
        method: "PUT",
        body: {
          ageVerified,
          ...(note ? { note } : {}),
        },
      }),
      invalidatesTags: ["TeamPlayers"],
    }),
  }),
});

export const {
  useGetTeamPlayersQuery,
  useGetTeamPlayerByIdQuery,
  useUpdateTeamPlayerStatusMutation,
} = teamPlayersApi;
