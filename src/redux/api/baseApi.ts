// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_DEV_BASE_URL;

if (!baseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_BASE_URL is not set");
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // ✅ no RootState import here (prevents circular type issues)
      const state = getState() as { auth?: { token?: string | null } };
      const token = state?.auth?.token;

      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Tournaments",
    "ActivityLogs",
    "Coach",
    "Team",
    "Tournament",
    "TeamPlayers",
    "Series",
    "Referees",
    "Payments",
    "Camp"
  ],
});

export default baseApi;
