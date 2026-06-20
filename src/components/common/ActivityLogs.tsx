import React, { useState } from "react";
import { useGetActivityLogsQuery } from "@/redux/apiHooks/activity/activityApi";
import { Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: response,
    isLoading,
    error,
  } = useGetActivityLogsQuery({
    page,
    limit,
  });

  const activityLogs = response?.data?.data || [];
  const total = response?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActivityColor = (title: string) => {
    if (title.includes("Tournament")) return "bg-blue-500";
    if (title.includes("Registration")) return "bg-green-500";
    if (title.includes("Error") || title.includes("Failed"))
      return "bg-red-500";
    if (title.includes("Waiver")) return "bg-blue-500";
    if (title.includes("Roster")) return "bg-purple-500";
    if (title.includes("Updated")) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6">
        Recent Activity
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#35BACB]"></div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-400 text-sm">
            {(error as { data?: { message?: string } })?.data?.message ||
              "Failed to load activity logs"}
          </p>
        </div>
      )}

      {!isLoading && !error && activityLogs.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto text-gray-500 mb-3" size={32} />
          <p className="text-gray-400">No activity logs found</p>
        </div>
      )}

      {!isLoading && !error && activityLogs.length > 0 && (
        <>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-colors"
              >
                <div
                  className={`${getActivityColor(
                    log.title,
                  )} p-3 rounded-full shrink-0 flex items-center justify-center`}
                >
                  <Clock size={20} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">
                    {log.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{log.content}</p>
                </div>

                <p className="text-gray-500 text-xs shrink-0 whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs">
                {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
                {total}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
