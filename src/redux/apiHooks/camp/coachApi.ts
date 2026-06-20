import type {
  CampCoachListResponse,
  CampCoachMutationPayload,
} from "@/components/dashboard/admin/proving-camp/coaches/types";
import baseApi from "@/redux/api/baseApi";

export const campCoachApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampCoachList: builder.query<
      CampCoachListResponse,
      { page: number; limit: number }
    >({
      query: (data: { page: number; limit: number }) => ({
        url: "/coaches",
        method: "GET",
        params: {
          page: data.page,
          limit: data.limit,
        },
      }),
      providesTags: ["Camp"],
    }),
    createCampCoach: builder.mutation<unknown, { payload: FormData }>({
      query: ({ payload }) => ({
        url: "/coaches",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    updateCampCoach: builder.mutation<
      unknown,
      { id: string; payload: CampCoachMutationPayload | FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/coaches/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    deleteCampCoach: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/coaches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Camp"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCampCoachListQuery,
  useCreateCampCoachMutation,
  useUpdateCampCoachMutation,
  useDeleteCampCoachMutation,
} = campCoachApi;
