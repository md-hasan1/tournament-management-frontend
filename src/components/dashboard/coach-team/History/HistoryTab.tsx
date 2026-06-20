/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  useGetSingleTeamTournamentHistoryQuery,
  useGetTeamHistroryPointQuery,
} from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import { X } from "lucide-react";

type TeamHistoryResponse = {
  success: boolean;
  message: string;
  data: {
    teamId: string;
    teamName: string;
    divisionName: string;
    meta: {
      resetAfter: string;
      lastRoyalEndedAt: string | null;
      totalTournaments: number;
    };
    totals: {
      historyPoints: number;
      totalWins: number;
      totalBasePoints: number;
      totalWinPoints: number;
      provingPoints: number;
      crownPoints: number;
    };
    tournaments: Array<{
      tournamentId: string;
      tournamentName: string;
      tournamentStage: string;
      tournamentStatus: string;
      startDate: string;
      endDate: string;
      formattedDate: string;
      location: string;
      logo: string;
      gameStyle: string;
      registrationPayStatus: string;
      totalRegisteredPlayers: number;
      placement: number | null;
      placementLabel: string | null;
      wins: number;
      basePoints: number;
      winPoints: number;
      totalPoints: number;
      pointsLocked: boolean;
    }>;
  };
};

type HistoryDetailsResponse = {
  success: boolean;
  message: string;
  data: {
    divisionName: string;
    tournament: {
      tournamentId: string;
      name: string;
      stage: string;
      startDate: string;
      endDate: string;
    };
    points: {
      placement: string;
      basePoints: number;
      winPoints: number;
      totalPoints: number;
      winsCounted: number;
    };
    summary: {
      played: number;
      wins: number;
      draws: number;
      losses: number;
      gf: number;
      ga: number;
      gd: number;
    };
    matches: Array<{
      matchId: string;
      scheduledAt: string;
      opponentTeamName: string;
      homeScore: number;
      awayScore: number;
      result: "WIN" | "LOSS" | "DRAW";
    }>;
  };
};

interface HistroyProps {
  teamId: string | null;
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border border-[#35BACB]/30 rounded-lg p-6 bg-black/20 backdrop-blur text-center">
      <div className="text-2xl font-bold text-[#35BACB] mb-2">{value}</div>
      <div className="text-xs text-gray-400 uppercase">{label}</div>
    </div>
  );
}

function HistoryTab({ teamId }: HistroyProps) {
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);

  // LIST API
  const {
    data: historyPointTeam,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTeamHistroryPointQuery(teamId, { skip: !teamId }) as {
    data?: TeamHistoryResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error?: any;
    refetch: () => any;
  };

  const totals = historyPointTeam?.data?.totals;
  const meta = historyPointTeam?.data?.meta;

  const tournaments = useMemo(
    () => historyPointTeam?.data?.tournaments ?? [],
    [historyPointTeam?.data?.tournaments],
  );

  // DETAILS API (only when modal is opened + id exists)
  const {
    data: histroyDetails,
    isLoading: isDetailsLoading,
    isFetching: isDetailsFetching,
    isError: isDetailsError,
    error: detailsError,
    refetch: refetchDetails,
  } = useGetSingleTeamTournamentHistoryQuery(selectedTournamentId, {
    skip: !selectedTournamentId,
  }) as {
    data?: HistoryDetailsResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error?: any;
    refetch: () => any;
  };

  const handleViewDetails = (id: string) => {
    setSelectedTournamentId(id);
    setShowResultsModal(true);
  };

  const closeModal = () => {
    setShowResultsModal(false);
    setSelectedTournamentId(null);
  };

  const getResultColor = (result: "WIN" | "LOSS" | "DRAW") => {
    switch (result) {
      case "WIN":
        return "#4ADE80";
      case "LOSS":
        return "#F87171";
      case "DRAW":
        return "#FBBF24";
      default:
        return "#35BACB";
    }
  };

  const listBusy = isLoading || isFetching;
  const detailsBusy = isDetailsLoading || isDetailsFetching;

  return (
    <div>
      {/* ===== LIST ERROR ===== */}
      {isError && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-4 mb-6">
          <div className="text-red-300 font-bold mb-1">
            Failed to load history data
          </div>
          <div className="text-red-200/80 text-sm">
            {error?.data?.message || error?.message || "Please try again."}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-[#35BACB] text-black font-bold text-sm rounded hover:bg-[#B8D800] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ===== SUMMARY ===== */}
      <div className="border border-[#35BACB]/30 rounded-lg p-8 mb-8 bg-black/20 backdrop-blur">
        <div className="mb-2 text-gray-400 text-sm">
          TOTAL POINTS EARNED (CROWN SERIES QUALIFICATION)
        </div>

        {listBusy ? (
          <div className="h-12 w-32 bg-gray-800/60 rounded animate-pulse mb-2" />
        ) : (
          <div className="text-5xl font-bold text-[#35BACB] mb-2">
            {totals?.historyPoints ?? 0}
          </div>
        )}

        {listBusy ? (
          <div className="h-4 w-56 bg-gray-800/60 rounded animate-pulse" />
        ) : (
          <div className="text-gray-500 text-sm">
            Based on {meta?.totalTournaments ?? 0} tournaments
          </div>
        )}
      </div>

      {/* ===== TABLE ===== */}
      <div className="border border-[#35BACB]/30 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#35BACB]/30 bg-black/40">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                  TOURNAMENT
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                  TOURNAMENT DATE
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                  TOTAL POINTS
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                  STAGE / STATUS
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {/* loading skeleton rows */}
              {listBusy &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#35BACB]/10">
                    <td className="px-6 py-5">
                      <div className="h-4 w-64 bg-gray-800/60 rounded animate-pulse" />
                      <div className="h-3 w-40 bg-gray-800/40 rounded animate-pulse mt-2" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-28 bg-gray-800/60 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-16 bg-gray-800/60 rounded animate-pulse" />
                      <div className="h-3 w-44 bg-gray-800/40 rounded animate-pulse mt-2" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-20 bg-gray-800/60 rounded animate-pulse" />
                      <div className="h-3 w-36 bg-gray-800/40 rounded animate-pulse mt-2" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-24 bg-gray-800/60 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!listBusy && tournaments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-gray-400">
                    No tournament history found.
                  </td>
                </tr>
              )}

              {!listBusy &&
                tournaments.map((t) => (
                  <tr
                    key={t.tournamentId}
                    className="border-b border-[#35BACB]/10 hover:bg-[#35BACB]/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {t.tournamentName}
                      <div className="text-xs text-gray-500 mt-1">
                        {t.location} • {t.gameStyle}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {t.formattedDate || t.endDate}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[#35BACB] font-bold text-lg">
                        {t.totalPoints}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Wins: {t.wins} • Base: {t.basePoints} • Win:{" "}
                        {t.winPoints}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-sm font-semibold">
                        {t.tournamentStage}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.tournamentStatus} • Pay: {t.registrationPayStatus}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(t.tournamentId)}
                        className="text-[#35BACB] hover:text-[#35BACB]/80 font-bold text-sm transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== FOOTER STATS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard
          label="Total Tournaments"
          value={listBusy ? "…" : (meta?.totalTournaments ?? 0)}
        />
        <StatCard
          label="Total Wins"
          value={listBusy ? "…" : (totals?.totalWins ?? 0)}
        />
        <StatCard
          label="Proving Points"
          value={listBusy ? "…" : (totals?.provingPoints ?? 0)}
        />
        <StatCard
          label="Crown Points"
          value={listBusy ? "…" : (totals?.crownPoints ?? 0)}
        />
      </div>

      {/* ===== MODAL ===== */}
      {showResultsModal && selectedTournamentId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#35BACB]/30 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Details error */}
            {isDetailsError && (
              <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-4 mb-6">
                <div className="text-red-300 font-bold mb-1">
                  Failed to load tournament details
                </div>
                <div className="text-red-200/80 text-sm">
                  {detailsError?.data?.message ||
                    detailsError?.message ||
                    "Please try again."}
                </div>
                <button
                  onClick={() => refetchDetails()}
                  className="mt-3 px-4 py-2 bg-[#35BACB] text-black font-bold text-sm rounded hover:bg-[#B8D800] transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Details loading skeleton */}
            {detailsBusy && (
              <div className="mb-6">
                <div className="h-7 w-72 bg-gray-800/60 rounded animate-pulse mb-3" />
                <div className="h-4 w-52 bg-gray-800/40 rounded animate-pulse mb-6" />

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="h-20 bg-gray-800/40 rounded animate-pulse" />
                  <div className="h-20 bg-gray-800/40 rounded animate-pulse" />
                </div>

                <div className="h-4 w-40 bg-gray-800/40 rounded animate-pulse mb-4" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-800/30 rounded animate-pulse mb-3"
                  />
                ))}
              </div>
            )}

            {/* Details content */}
            {!detailsBusy && histroyDetails?.data && (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {histroyDetails.data.tournament.name}
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                  {histroyDetails.data.divisionName} •{" "}
                  {histroyDetails.data.tournament.stage}
                </p>

                {/* Points row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-[#35BACB]/20 rounded-lg p-4 bg-black/20">
                    <div className="text-xs text-gray-400 uppercase mb-1">
                      Placement
                    </div>
                    <div className="text-white font-bold">
                      {histroyDetails.data.points.placement}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Wins counted: {histroyDetails.data.points.winsCounted}
                    </div>
                  </div>

                  <div className="border border-[#35BACB]/20 rounded-lg p-4 bg-black/20">
                    <div className="text-xs text-gray-400 uppercase mb-1">
                      Total Points
                    </div>
                    <div className="text-[#35BACB] font-bold text-xl">
                      {histroyDetails.data.points.totalPoints}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Base: {histroyDetails.data.points.basePoints} • Win:{" "}
                      {histroyDetails.data.points.winPoints}
                    </div>
                  </div>
                </div>

                {/* Match Results */}
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">
                  MATCH RESULTS
                </h3>

                {histroyDetails.data.matches.length === 0 ? (
                  <div className="text-gray-500 mb-8">No matches found.</div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {histroyDetails.data.matches.map((match, idx) => (
                      <div
                        key={match.matchId}
                        className="flex items-center justify-between pb-4 border-b border-[#35BACB]/10 last:border-0"
                      >
                        <div>
                          <p className="text-white font-semibold mb-1">
                            vs {match.opponentTeamName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Match {idx + 1} •{" "}
                            {new Date(match.scheduledAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            style={{ color: getResultColor(match.result) }}
                            className="font-bold text-sm"
                          >
                            {match.result}
                          </span>
                          <span className="text-gray-400 text-sm font-semibold">
                            {match.homeScore}-{match.awayScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-[#35BACB]/30">
                  <div className="border border-[#35BACB]/20 rounded-lg p-4 text-center">
                    <div
                      style={{ color: "#4ADE80" }}
                      className="text-2xl font-bold mb-1"
                    >
                      {histroyDetails.data.summary.wins}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">WINS</div>
                  </div>

                  <div className="border border-[#35BACB]/20 rounded-lg p-4 text-center">
                    <div
                      style={{ color: "#FBBF24" }}
                      className="text-2xl font-bold mb-1"
                    >
                      {histroyDetails.data.summary.draws}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">DRAWS</div>
                  </div>

                  <div className="border border-[#35BACB]/20 rounded-lg p-4 text-center">
                    <div
                      style={{ color: "#F87171" }}
                      className="text-2xl font-bold mb-1"
                    >
                      {histroyDetails.data.summary.losses}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">
                      LOSSES
                    </div>
                  </div>
                </div>

                <div className="text-gray-400 text-sm mb-8">
                  Played: {histroyDetails.data.summary.played} • GF:{" "}
                  {histroyDetails.data.summary.gf} • GA:{" "}
                  {histroyDetails.data.summary.ga} • GD:{" "}
                  {histroyDetails.data.summary.gd}
                </div>
              </>
            )}

            <button
              onClick={closeModal}
              className="w-full bg-[#35BACB] text-black font-bold py-3 rounded-lg hover:bg-[#35BACB]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryTab;
