import baseApi from "@/redux/api/baseApi";

export interface ActivityLog {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: ActivityLog[];
  };
}

export interface ActivityLogsParams {
  page?: number;
  limit?: number;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get activity logs
    getActivityLogs: builder.query<
      ActivityLogsResponse,
      ActivityLogsParams | void
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
          url: `/users/activity/logs${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["ActivityLogs"],
    }),

    // Get single activity log
    getActivityLogById: builder.query<ActivityLog, string>({
      query: (id) => ({
        url: `/users/activity/logs/${id}`,
        method: "GET",
      }),
      providesTags: ["ActivityLogs"],
    }),
  }),
});

export const { useGetActivityLogsQuery, useGetActivityLogByIdQuery } =
  activityApi;
