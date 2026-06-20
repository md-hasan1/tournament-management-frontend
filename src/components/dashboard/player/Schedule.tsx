"use client";

import React, { useMemo } from "react";
import { Calendar, MapPin, Clock, Trophy } from "lucide-react";
import { useGetPlayerScheduleQuery } from "@/redux/apiHooks/playerApi/playerApi";
import Spinner from "@/components/common/Spinner";

type Match = {
  id: string;
  scheduledAt: string; // ISO string
  field?: string | null;
  location?: string | null;
  mapLink?: string | null;
  tournamentName?: string | null;
  division?: string | null;
  stage?: string | null;
  round?: string | null;
  status?: string | null;
  opponent?: {
    id: string;
    teamName?: string | null;
    image?: string | null;
  } | null;
  score?: {
    mine?: number | null;
    opponent?: number | null;
  } | null;
  result?: string | null;
  resultType?: "win" | "loss" | "draw" | string | null;
};

function getUserTimeZone() {
  // Browser/device timezone (auto-selected)
  if (typeof window !== "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }
  return "UTC"; // SSR fallback
}

function formatDate(iso: string, timeZone: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}

function formatTime(iso: string, timeZone: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function resultColor(resultType?: Match["resultType"]) {
  switch ((resultType || "").toLowerCase()) {
    case "win":
      return "#4ADE80";
    case "draw":
      return "#FBBF24";
    case "loss":
      return "#F87171";
    default:
      return "#9CA3AF";
  }
}

export default function PlayerSchedulePage() {
  const {
    data: scheduleData,
    isLoading,
    isError,
    error,
  } = useGetPlayerScheduleQuery();

  // compute timezone once (client-side), avoid recalculating for every row
  const timeZone = useMemo(() => getUserTimeZone(), []);

  const teamName = scheduleData?.data?.teamName ?? "Team";
  const teamImage = scheduleData?.data?.teamImage ?? null;

  const upcomingMatches: Match[] = scheduleData?.data?.upcomingMatches ?? [];
  const pastMatches: Match[] = scheduleData?.data?.pastMatches ?? [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {teamImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teamImage}
              alt={teamName}
              className="h-12 w-12 rounded-full border border-gray-800 object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full border border-gray-800 bg-gray-900" />
          )}

          <div>
            <h1 className="text-2xl font-bold">{teamName}</h1>
            <p className="text-gray-400 text-sm">Schedule & results</p>
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && <Spinner />}

        {isError && (
          <div className="bg-gray-900/60 border border-red-900/60 rounded-xl p-6">
            <p className="text-red-400 font-semibold">
              Failed to load schedule.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {typeof error === "object" ? "Please try again." : String(error)}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Tournament Schedule */}
            <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between gap-4">
                <h2 className="font-bold text-2xl uppercase tracking-wider">
                  Tournament Schedule
                </h2>

                <span className="text-xs text-gray-400">
                  Times shown in {timeZone}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/50 border-b border-gray-800">
                    <tr className="text-[#35BACB] font-bold uppercase text-xs tracking-wide">
                      <th className="px-6 py-4">DATE</th>
                      <th className="px-6 py-4">TIME</th>
                      <th className="px-6 py-4">OPPONENT</th>
                      <th className="px-6 py-4">LOCATION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingMatches.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-gray-400">
                          No upcoming matches found.
                        </td>
                      </tr>
                    ) : (
                      upcomingMatches.map((match) => (
                        <tr
                          key={match.id}
                          className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-500" />
                              <div className="flex flex-col">
                                <span>
                                  {formatDate(match.scheduledAt, timeZone)}
                                </span>

                                {(match.tournamentName ||
                                  match.division ||
                                  match.stage) && (
                                  <span className="text-xs text-gray-500">
                                    {[
                                      match.tournamentName,
                                      match.division,
                                      match.stage,
                                    ]
                                      .filter(Boolean)
                                      .join(" • ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span>
                                {formatTime(match.scheduledAt, timeZone)}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {match.opponent?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={match.opponent.image}
                                  alt={match.opponent.teamName ?? "Opponent"}
                                  className="h-7 w-7 rounded-full border border-gray-800 object-cover"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full border border-gray-800 bg-gray-900" />
                              )}

                              <div className="flex flex-col">
                                <span className="text-gray-200">
                                  {match.opponent?.teamName ?? "TBD"}
                                </span>
                                {match.field && (
                                  <span className="text-xs text-gray-500">
                                    {match.field}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-500" />
                              {match.mapLink ? (
                                <a
                                  href={match.mapLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gray-200 hover:text-[#35BACB] transition-colors"
                                >
                                  {match.location ?? "Open map"}
                                </a>
                              ) : (
                                <span>{match.location ?? "TBD"}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Past Results */}
            <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-white font-bold text-2xl uppercase tracking-wider">
                  Past Results
                </h2>
              </div>

              <div className="divide-y divide-gray-800">
                {pastMatches.length === 0 ? (
                  <div className="px-6 py-8 text-gray-400">
                    No past matches found.
                  </div>
                ) : (
                  pastMatches.map((m) => {
                    const color = resultColor(m.resultType);
                    const mine = m.score?.mine;
                    const opp = m.score?.opponent;

                    const scoreText =
                      typeof mine === "number" && typeof opp === "number"
                        ? `${mine}-${opp}`
                        : "—";

                    const resultText = m.result ?? m.resultType ?? "Completed";

                    return (
                      <div
                        key={m.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-900/30 transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500 text-sm font-semibold min-w-40">
                              {formatDate(m.scheduledAt, timeZone)}
                            </span>
                            <Trophy size={16} className="text-gray-600" />
                            <span className="text-gray-300">
                              {m.opponent?.teamName ?? "Opponent"}
                            </span>
                          </div>

                          {(m.tournamentName || m.location) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {[m.tournamentName, m.location]
                                .filter(Boolean)
                                .join(" • ")}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p style={{ color }} className="font-bold text-lg">
                            {scoreText}
                          </p>
                          <p
                            style={{ color }}
                            className="text-sm font-semibold"
                          >
                            {resultText}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
