/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export const scheduleAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSchedule: builder.mutation<any, any>({
      query: ({ data }) => ({
        url: "/schedules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Camp"],
    }),
    updateSchedule: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Camp"],
    }),
    updateCapacity: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/schedules/week/${id}/capacity`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Camp"],
    }),
    deleteSchedule: builder.mutation<any, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Camp"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useUpdateCapacityMutation,
  useUpdateScheduleMutation,
} = scheduleAPi;
