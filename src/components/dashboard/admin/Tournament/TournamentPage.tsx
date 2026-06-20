"use client";
import { alertError, alertSuccess, confirmDelete } from "@/lib/confirm";
import {
  TournamentListItem,
  useDeleteTournamentMutation,
  useGetTournamentsQuery,
} from "@/redux/apiHooks/tournament/tournamentApi";
import {
  ChevronDown,
  ExternalLink,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export default function TournamentsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeries, setFilterSeries] = useState("All");
  const [filterStatus, setFilterStatus] = useState<
    "All Status" | "Open" | "Live" | "Completed" | "Cancelled" | "Filed"
  >("All Status");
  const [deleteTournament] = useDeleteTournamentMutation();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const tournamentStage = useMemo(() => {
    if (filterSeries === "Proving Series") return "PROVING" as const;
    if (filterSeries === "Crown Series") return "CROWN" as const;
    if (filterSeries === "Royal Cup") return "ROYAL" as const;
    return undefined;
  }, [filterSeries]);

  const { data, isLoading, error } = useGetTournamentsQuery({
    page,
    limit,
    searchTerm: searchQuery.trim() || undefined,
    tournamentStage,
    status:
      filterStatus === "Open"
        ? "OPEN"
        : filterStatus === "Live"
          ? "LIVE"
          : filterStatus === "Completed"
            ? "COMPLETED"
            : filterStatus === "Cancelled"
              ? "CANCELLED"
              : filterStatus === "Filed"
                ? "FILED"
                : undefined,
  });

  // Debug: Log API params being sent
  React.useEffect(() => {
    console.log(
      "🔍 API Query Params - Series:",
      tournamentStage,
      "Status:",
      filterStatus === "Open"
        ? "OPEN"
        : filterStatus === "Live"
          ? "LIVE"
          : filterStatus === "Completed"
            ? "COMPLETED"
            : filterStatus === "Cancelled"
              ? "CANCELLED"
              : filterStatus === "Filed"
                ? "FILED"
                : "undefined",
    );
  }, [tournamentStage, filterStatus]);

  const list: TournamentListItem[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? { total: 0, page: 1, limit };

  const getSeriesBadgeColor = (series: string) => {
    switch (series) {
      case "Proving Series":
        return "bg-[#35BACB] text-black";
      case "Crown Series":
        return "bg-[#FF6B35] text-white";
      case "Royal Cup":
        return "bg-[#FF006E] text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-600";
      case "Live":
        return "bg-red-600";
      case "Completed":
        return "bg-gray-600";
      case "Cancelled":
        return "bg-gray-700";
      case "Filed":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const formatSeriesLabel = (stage?: string) =>
    stage === "PROVING"
      ? "Proving Series"
      : stage === "CROWN"
        ? "Crown Series"
        : stage === "ROYAL"
          ? "Royal Cup"
          : "Unknown";

  const formatDate = (iso: string) => {
    const dateOnlyMatch = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    const date = dateOnlyMatch
      ? new Date(
          Date.UTC(
            Number(dateOnlyMatch[1]),
            Number(dateOnlyMatch[2]) - 1,
            Number(dateOnlyMatch[3]),
          ),
        )
      : new Date(iso);

    if (Number.isNaN(date.getTime())) return iso;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const confirmAndDeleteTournament = async (id: string, name: string) => {
    const ok = await confirmDelete({
      title: "Delete Tournament?",
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      await deleteTournament(id).unwrap();
      await alertSuccess("Deleted", "Tournament removed successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      await alertError(
        "Delete failed",
        "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and Buttons */}
        <div className="mb-8 flex justify-between items-start gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-2">TOURNAMENTS</h1>
            <p className="text-gray-400">
              Manage tournament events and registrations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center shrink-0">
            <Link href="/dashboard/admin/tournament/update-pricing">
              <button className="border-2 border-blue-500 hover:bg-blue-500/10 text-white font-bold px-6 py-3 rounded-2xl transition-colors flex items-center gap-2">
                ✏️ Update Pricing
              </button>
            </Link>
            <Link href="/dashboard/admin/tournament/create">
              <button className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold px-6 py-3 rounded-2xl transition-colors flex items-center gap-2">
                + Create New Tournament
              </button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs and Search Row */}
        <div className="flex gap-4 mb-6 items-center justify-between">
          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              "All Tournaments",
              "Proving Series",
              "Crown Series",
              "Royal Cup",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setFilterSeries(tab === "All Tournaments" ? "All" : tab)
                }
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  (tab === "All Tournaments" && filterSeries === "All") ||
                  (tab !== "All Tournaments" && filterSeries === tab)
                    ? tab === "All Tournaments"
                      ? "bg-[#35BACB] text-black"
                      : tab === "Proving Series"
                        ? "bg-yellow-500 text-black"
                        : tab === "Crown Series"
                          ? "bg-orange-500 text-white"
                          : "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Status Dropdown */}
          <div className="flex gap-4 items-center shrink-0">
            <div className="flex-1 relative w-64">
              <Search
                size={20}
                className="absolute left-3 top-3.5 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search tournament name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                {filterStatus}
                <ChevronDown size={18} />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 w-40">
                  {[
                    "All Status",
                    "Open",
                    "Live",
                    "Completed",
                    "Cancelled",
                    "Filed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(
                          status as
                            | "All Status"
                            | "Open"
                            | "Live"
                            | "Completed"
                            | "Cancelled"
                            | "Filed",
                        );
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                        filterStatus === status
                          ? "bg-[#35BACB] text-black font-semibold"
                          : "text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crown Series Alert Banner */}
        {filterSeries === "Crown Series" && (
          <div className="bg-[#3B2D08] border-2 border-[#bb8d0d] rounded-xl p-4 mb-6 flex gap-3">
            <div className="text-yellow-400 shrink-0">🏆</div>
            <div>
              <h3 className="text-red-400 font-bold mb-1">
                Crown Series - Invitation Required
              </h3>
              <p className="text-gray-300 text-sm">
                Top 8 teams from Proving Series quality. Send invitations from
                the Standings page to eligible teams.
              </p>
            </div>
          </div>
        )}

        {/* Tournaments Table */}
        <div className="border border-gray-700 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-900/50 border-b border-gray-700 grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-gray-400">
            <div>Tournament Name</div>
            <div>Date & Location</div>
            <div>Total Registered</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {/* Loading */}
          {isLoading && (
            <div className="px-6 py-10 text-center text-gray-400">
              Loading tournaments...
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="px-6 py-6 text-red-400">
              Failed to load tournaments.
            </div>
          )}

          {/* Table Body */}
          {!isLoading &&
            !error &&
            list.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-900/30 transition-colors items-center"
              >
                {/* Tournament Name */}
                <div>
                  <h3 className="font-bold text-white mb-2">{t.name}</h3>
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${getSeriesBadgeColor(
                      formatSeriesLabel(t.tournamentStage),
                    )}`}
                  >
                    {formatSeriesLabel(t.tournamentStage)}
                  </span>
                </div>

                {/* Date & Location */}
                <div className="text-gray-400 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    📅 {formatDate(t.startDate)}
                  </div>
                  <div className="flex items-center gap-2">📍 {t.location}</div>
                </div>

                {/* Total Registered */}
                <div>
                  <p className="font-bold text-white">
                    {t.totalRegisteredTeams ?? 0} Teams
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-4 py-2 rounded-lg text-white font-semibold text-sm ${getStatusBadgeColor(
                      t.status === "OPEN"
                        ? "Open"
                        : t.status === "LIVE"
                          ? "Live"
                          : t.status === "COMPLETED"
                            ? "Completed"
                            : t.status === "CANCELLED"
                              ? "Cancelled"
                              : t.status === "FILED"
                                ? "Filed"
                                : String(t.status),
                    )}`}
                  >
                    {t.status === "OPEN"
                      ? "Open"
                      : t.status === "LIVE"
                        ? "Live"
                        : t.status === "COMPLETED"
                          ? "Completed"
                          : t.status === "CANCELLED"
                            ? "Cancelled"
                            : t.status === "FILED"
                              ? "Filed"
                              : String(t.status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/admin/tournament/manage/${t.id}`}>
                    <button className="border border-gray-600 hover:border-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                      Manage
                    </button>
                  </Link>
                  <Link href={`/dashboard/admin/tournament/${t.id}/edit`}>
                    <button className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white flex items-center justify-center">
                      <ExternalLink size={18} />
                    </button>
                  </Link>
                  <button
                    onClick={() => confirmAndDeleteTournament(t.id, t.name)}
                    className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-500 flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* Empty State */}
        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Data not found</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && meta.total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Page {meta.page} of{" "}
              {Math.max(1, Math.ceil(meta.total / meta.limit))}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* SweetAlert handles delete confirmation UI */}
      </div>
    </div>
  );
}
