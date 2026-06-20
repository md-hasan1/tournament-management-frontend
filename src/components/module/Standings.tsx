/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetTournamentStandingsQuery } from "@/redux/apiHooks/homePage/homePageApi";
import Image from "next/image";
import { useMemo, useState } from "react";

type Division =
  | "U9_BOYS"
  | "U10_BOYS"
  | "U9_GIRLS"
  | "U10_GIRLS"
  | "U11_BOYS"
  | "U11_GIRLS"
  | "U12_BOYS"
  | "U12_GIRLS"
  | "U13_BOYS"
  | "U14_BOYS"
  | "U13_GIRLS"
  | "U14_GIRLS"
  | "U15_BOYS"
  | "U16_BOYS"
  | "U15_GIRLS"
  | "U16_GIRLS"
  | "U17_BOYS"
  | "U18_BOYS"
  | "U17_GIRLS"
  | "U18_GIRLS"
  | "HS_BOYS"
  | "HS_GIRLS"
  | "MENS_DIV_1"
  | "MENS_DIV_2"
  | "MENS_DIV_3"
  | "WOMENS"
  | "COED";

type DivisionOption = { label: string; value: Division };

const DIVISIONS: DivisionOption[] = [
  { label: "U9 Boys", value: "U9_BOYS" },
  { label: "U10 Boys", value: "U10_BOYS" },
  { label: "U9 Girls", value: "U9_GIRLS" },
  { label: "U10 Girls", value: "U10_GIRLS" },
  { label: "U11 Boys", value: "U11_BOYS" },
  { label: "U11 Girls", value: "U11_GIRLS" },
  { label: "U12 Boys", value: "U12_BOYS" },
  { label: "U12 Girls", value: "U12_GIRLS" },
  { label: "U13 Boys", value: "U13_BOYS" },
  { label: "U14 Boys", value: "U14_BOYS" },
  { label: "U13 Girls", value: "U13_GIRLS" },
  { label: "U14 Girls", value: "U14_GIRLS" },
  { label: "U15 Boys", value: "U15_BOYS" },
  { label: "U16 Boys", value: "U16_BOYS" },
  { label: "U15 Girls", value: "U15_GIRLS" },
  { label: "U16 Girls", value: "U16_GIRLS" },
  { label: "U17 Boys", value: "U17_BOYS" },
  { label: "U18 Boys", value: "U18_BOYS" },
  { label: "U17 Girls", value: "U17_GIRLS" },
  { label: "U18 Girls", value: "U18_GIRLS" },
  { label: "High School Boys", value: "HS_BOYS" },
  { label: "High School Girls", value: "HS_GIRLS" },
  { label: "Men's D1", value: "MENS_DIV_1" },
  { label: "Men's D2", value: "MENS_DIV_2" },
  { label: "Men's D3", value: "MENS_DIV_3" },
  { label: "Women's", value: "WOMENS" },
  { label: "Coed", value: "COED" },
];

type StatusBadge = "QUALIFIED" | "ON_THE_BUBBLE" | "ELIMINATED";

type ApiStanding = {
  rank: number;
  teamId: string;
  teamName: string;
  tournaments: number;
  points: number;
  statusBadge: StatusBadge;
  inviteEnabled: boolean;
  discountPercent: number;
  discountSource: "OVERRIDE" | "DEFAULT" | string;
};

type ApiMeta = {
  resetAfter: string;
  lastRoyalEndedAt: string | null;
  totalTeams: number;
  qualifiedCount: number;
  bubbleCount: number;
  eliminatedCount: number;
};

type ApiData = {
  divisionName: Division;
  meta: ApiMeta;
  standings: ApiStanding[];
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ApiData;
};

function statusText(badge: StatusBadge) {
  if (badge === "QUALIFIED") return "Qualified";
  if (badge === "ON_THE_BUBBLE") return "On the Bubble";
  return "Eliminated";
}

function statusIcon(badge: StatusBadge) {
  if (badge === "QUALIFIED") return "✓";
  if (badge === "ON_THE_BUBBLE") return "⏱";
  return "⊘";
}

function statusColor(badge: StatusBadge) {
  if (badge === "QUALIFIED") return "text-[#35BACB]";
  return "text-gray-400";
}

function crownFeeText(standing: ApiStanding) {
  if (!standing.inviteEnabled) return "Not Eligible";
  if (standing.discountPercent >= 100) return "Free (100% Off)";
  if (standing.discountPercent > 0) return `${standing.discountPercent}% Off`;
  return "Standard Fee";
}

function formatResetDate(dateValue?: string | null) {
  if (!dateValue) return "TBD";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StandingsPage() {
  const [selectedDivision, setSelectedDivision] =
    useState<Division>("U9_BOYS");

  const selectedDivisionLabel = useMemo(() => {
    return DIVISIONS.find((d) => d.value === selectedDivision)?.label ?? "";
  }, [selectedDivision]);

  const { data, isLoading, isError, error } = useGetTournamentStandingsQuery({
    divisionName: selectedDivision,
  });

  const api = data as unknown as ApiResponse | undefined;
  const standings = Array.isArray(api?.data?.standings)
    ? api.data.standings
    : [];

  const meta = api?.data?.meta
    ? {
        totalTeams: Number(api.data.meta.totalTeams ?? 0),
        qualifiedCount: Number(api.data.meta.qualifiedCount ?? 0),
        bubbleCount: Number(api.data.meta.bubbleCount ?? 0),
        eliminatedCount: Number(api.data.meta.eliminatedCount ?? 0),
        resetAfter: api.data.meta.resetAfter,
      }
    : null;

  const errorMessage =
    (error as any)?.data?.message ||
    (error as any)?.error ||
    (error as any)?.message ||
    "Failed to load standings";

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-70 sm:h-85 md:h-105 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/standing.png"
            alt="Standings background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 font-['Oswald']">
            Standings
          </h1>
          <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
          <p
            className="text-gray-200 text-sm sm:text-base md:text-lg"
            style={{ fontFamily: "Open Sans" }}
          >
            Track your team&apos;s progress toward Crown Series qualification
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Division Selector and Rules */}
        <div className="bg-[#1a1a1a] border-2 border-[#35BACB] rounded-lg mb-8 sm:mb-12 py-5 sm:py-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Division Selector */}
            <div>
              <label className="block text-white font-semibold mb-3 text-sm tracking-wide uppercase font-['Oswald']">
                Select Division
              </label>

              <select
                value={selectedDivision}
                onChange={(e) =>
                  setSelectedDivision(e.target.value as Division)
                }
                className="w-full px-4 py-3 bg-black border border-[#35BACB] rounded text-white text-sm sm:text-base focus:outline-none cursor-pointer"
                style={{ fontFamily: "Open Sans" }}
              >
                {DIVISIONS.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Qualification Rules */}
            <div>
              <label className="block text-white font-semibold mb-3 text-sm tracking-wide uppercase font-['Oswald']">
                Crown Series Qualification Rules
              </label>
              <div
                className="bg-[#2b331e] border border-[#35BACB] rounded px-4 py-3"
                style={{ fontFamily: "Open Sans" }}
              >
                <p className="text-gray-200 text-sm sm:text-base leading-6">
                  See Rules page for more information.
                </p>
                <a
                  href="/rules"
                  className="inline-flex items-center gap-1 mt-2 text-[#35BACB] hover:underline font-semibold text-xs sm:text-sm"
                >
                  See Full Rules <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div
            className="bg-[#2b331e] border border-[#35BACB] rounded px-4 py-3 w-full mt-4"
            style={{ fontFamily: "Open Sans" }}
          >
            {meta ? (
              <div className="text-gray-200 text-sm opacity-90">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <span className="truncate">
                    Total Teams: {meta.totalTeams}
                  </span>
                  <span className="truncate">
                    Qualified: {meta.qualifiedCount}
                  </span>
                  <span className="truncate">Bubble: {meta.bubbleCount}</span>
                  <span className="truncate">
                    Eliminated: {meta.eliminatedCount}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-300 text-sm opacity-70">
                {isLoading ? "Loading summary..." : "No summary available."}
              </div>
            )}
          </div>
        </div>

        {/* Standings Table */}
        <section className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-55">
              <h2 className="text-white font-bold text-xl sm:text-2xl mb-2 font-['Oswald']">
                {selectedDivisionLabel} Standings
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Qualifying for:{" "}
                <span className="text-[#35BACB]">Crown Series (June 2026)</span>
              </p>
            </div>

            <div className="text-xs sm:text-sm">
              {isLoading ? (
                <span className="text-gray-300">Loading…</span>
              ) : isError ? (
                <span className="text-red-400">⚠ {errorMessage}</span>
              ) : (
                <span className="text-gray-400">Updated</span>
              )}
            </div>
          </div>

          {/* ✅ responsive scroll only on small screens */}
          <div className="mt-5 overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-205 sm:min-w-0 px-4 sm:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Position
                    </th>
                    <th className="text-left py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Team
                    </th>
                    <th className="text-center py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Tournaments
                    </th>
                    <th className="text-center py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Points
                    </th>
                    <th className="text-center py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Status
                    </th>
                    <th className="text-right py-3 px-2 text-gray-400 text-xs sm:text-sm font-semibold font-['Oswald']">
                      Entry Fee
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!isLoading && standings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-400"
                      >
                        No standings found for this division.
                      </td>
                    </tr>
                  ) : (
                    standings.map((row) => (
                      <tr
                        key={row.teamId}
                        className="border-b border-[#333] hover:bg-[#222] transition"
                      >
                        <td className="py-4 px-2 text-[#35BACB] font-bold text-base sm:text-lg">
                          {row.rank}
                        </td>
                        <td className="py-4 px-2 text-white font-semibold text-sm sm:text-base">
                          {row.teamName}
                        </td>
                        <td className="py-4 px-2 text-center text-gray-300 text-sm">
                          {row.tournaments}
                        </td>
                        <td className="py-4 px-2 text-center text-[#35BACB] font-bold text-sm sm:text-base">
                          {row.points}
                        </td>
                        <td
                          className={`py-4 px-2 text-center text-xs sm:text-sm font-semibold ${statusColor(
                            row.statusBadge,
                          )}`}
                        >
                          <span className="flex items-center justify-center gap-1 whitespace-nowrap">
                            {statusIcon(row.statusBadge)}{" "}
                            {statusText(row.statusBadge)}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                          {crownFeeText(row)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {/* Crown Series Qualification Points */}
          <div className="bg-[#2b331e] border-2 border-[#35BACB] rounded-lg p-5 sm:p-6">
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-2 font-['Oswald'] leading-tight">
              Crown Series Qualification Points
            </h3>
            <p
              className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed"
              style={{ fontFamily: "Open Sans" }}
            >
              Earned per tournament finish- accumulates across the season toward
              Crown Series qualification. In-tournament pool play uses separate
              Win/Tie/Loss system- see Rules for details.
            </p>
            <a
              href="/rules"
              className="inline-flex items-center gap-2 text-[#35BACB] hover:underline font-semibold text-sm sm:text-base transition"
              style={{ fontFamily: "Open Sans" }}
            >
              See Full Rules <span>→</span>
            </a>
          </div>

          {/* Final Date */}
          <div className="bg-[#2b331e] border-2 border-[#35BACB] rounded-lg p-5 sm:p-6 flex flex-col justify-center">
            <div className="text-center">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 flex items-center justify-center gap-2 font-['Oswald']">
                <span>📅</span> Final Date
              </h3>
              <p className="text-[#35BACB] font-bold text-2xl sm:text-3xl mb-2 font-['Oswald'] leading-tight">
                {formatResetDate(meta?.resetAfter)}
              </p>
              <p
                className="text-gray-300 text-sm sm:text-base"
                style={{ fontFamily: "Open Sans" }}
              >
                Points reset for the next Crown Series cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
