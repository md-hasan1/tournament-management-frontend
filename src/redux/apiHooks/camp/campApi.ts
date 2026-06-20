/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CampOverviewApiResponse } from "@/components/dashboard/admin/proving-camp/data";
import baseApi from "@/redux/api/baseApi";

export const campApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampOverview: builder.query<CampOverviewApiResponse, void>({
      query: () => ({
        url: "/camp-registrations/dashboard/overview",
        method: "GET",
      }),
      providesTags: ["Camp"],
    }),
    getAllSchedules: builder.query<any, { limit: number; page: number }>({
      query: ({ limit, page }) => ({
        url: "/schedules",
        method: "GET",
        params: {
          limit,
          page,
        },
      }),
      providesTags: ["Camp"],
    }),
    getSingleSchedule: builder.query<any, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "GET",
      }),
      providesTags: ["Camp"],
    }),
    campRegistration: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/camp-registrations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    campPayment: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/camp-registrations/${id}/pay`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Camp"],
    }),

    waitlistRegistration: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/camp-waitlist",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    getWaitlistStatus: builder.query<any, void>({
      query: () => ({
        url: "/camp-waitlist/stats",
        method: "GET",
      }),
      providesTags: ["Camp"],
    }),
    getWaitLists: builder.query<
      any,
      {
        limit: number;
        page: number;
        desiredSession?: "AM" | "PM";
        status?: string;
        searchTerm?: string;
      }
    >({
      query: ({
        limit,
        page,
        desiredSession,
        status = "",
        searchTerm = "",
      }) => {
        const params: any = {
          limit,
          page,
          status,
          searchTerm,
        };
        if (desiredSession) params.desiredSession = desiredSession;
        return {
          url: "/camp-waitlist",
          method: "GET",
          params,
        };
      },
      providesTags: ["Camp"],
    }),
    moveWaitTolist: builder.mutation<any, { payload: any; id: string }>({
      query: ({ id, payload }) => ({
        url: `/camp-waitlist/${id}/move-to-session`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    getPerticipantList: builder.query<any, any>({
      query: ({ schedulePeriodId, page, limit, searchTerm = "" }) => ({
        url: `/camp-registrations/participants`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          schedulePeriodId,
        },
      }),
      providesTags: ["Camp"],
    }),
    moveSessionPlayer: builder.mutation<any, { payload: any; id: string }>({
      query: ({ id, payload }) => ({
        url: `/camp-registrations/player/${id}/move-session`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Camp"],
    }),
    campRefund: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/camp-registrations/${id}/refund`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Camp"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCampOverviewQuery,
  useCampRegistrationMutation,
  useCampPaymentMutation,
  useGetAllSchedulesQuery,
  useWaitlistRegistrationMutation,
  useGetSingleScheduleQuery,
  useGetWaitlistStatusQuery,
  useGetWaitListsQuery,
  useMoveWaitTolistMutation,
  useGetPerticipantListQuery,
  useMoveSessionPlayerMutation,
  useCampRefundMutation,
} = campApi;
