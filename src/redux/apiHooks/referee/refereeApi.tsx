import baseApi from "@/redux/api/baseApi";

export interface Referee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefereeRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateRefereeRequest {
  name: string;
  phoneNumber: string;
}

export const refereeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all referees
    getReferees: builder.query<Referee[], void>({
      query: () => ({
        url: "/referees",
        method: "GET",
      }),
      transformResponse: (response: { data?: Referee[] }) =>
        response.data ?? [],
      providesTags: ["Referees"],
    }),

    // Create referee
    createReferee: builder.mutation<Referee, CreateRefereeRequest>({
      query: (body) => ({
        url: "/referees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referees"],
    }),

    // Update referee
    updateReferee: builder.mutation<
      Referee,
      { id: string; body: UpdateRefereeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/referees/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Referees"],
    }),

    // Delete referee
    deleteReferee: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/referees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Referees"],
    }),
  }),
});

export const {
  useGetRefereesQuery,
  useCreateRefereeMutation,
  useUpdateRefereeMutation,
  useDeleteRefereeMutation,
} = refereeApi;
