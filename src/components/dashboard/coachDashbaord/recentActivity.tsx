/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { useGetrecentActivityQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import React, { useMemo, useState } from "react";

type ActivityLog = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: ActivityLog[];
  };
};

function getActivityDot(title: string) {
  const t = title.toLowerCase();
  if (t.includes("payment") || t.includes("successful")) return "bg-green-500";
  if (t.includes("bundle")) return "bg-blue-500";
  if (t.includes("failed") || t.includes("error")) return "bg-red-500";
  return "bg-gray-500";
}

function formatTime(iso: string) {
  // Simple, safe formatting without timezone headaches
  // Example output: Feb 17, 2026, 12:17 PM
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentActivity() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isFetching, isError, error } =
    useGetrecentActivityQuery({ page, limit }) as {
      data?: ApiResponse;
      isLoading: boolean;
      isFetching: boolean;
      isError: boolean;
      error?: any;
    };

  const logs = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const currentPage = data?.data?.page ?? page;
  const perPage = data?.data?.limit ?? limit;

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const pagesToShow = useMemo(() => {
    // Simple windowed pagination: show up to 5 pages around current
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return arr;
  }, [currentPage, totalPages]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
          RECENT ACTIVITY
        </h3>

        {/* Small fetch indicator */}
        {isFetching && !isLoading ? (
          <span className="text-xs text-gray-400">Refreshing...</span>
        ) : null}
      </div>

      {/* States */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading activity...</p>
      ) : isError ? (
        <p className="text-red-400 text-sm">
          Failed to load activity.
          {error?.data?.message ? ` ${error.data.message}` : ""}
        </p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent activity found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {logs.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 pb-4 border-b border-gray-800 last:border-b-0"
              >
                <div
                  className={`w-2 h-2 rounded-full ${getActivityDot(
                    activity.title,
                  )} shrink-0 mt-2`}
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {activity.title}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    {activity.content}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {formatTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages} • Total {total} logs
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={!canPrev || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                Prev
              </button>

              {pagesToShow.map((p) => (
                <button
                  key={p}
                  disabled={isFetching}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    p === currentPage
                      ? "border-gray-400 text-white bg-gray-800"
                      : "border-gray-700 text-gray-200 hover:bg-gray-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={!canNext || isFetching}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
