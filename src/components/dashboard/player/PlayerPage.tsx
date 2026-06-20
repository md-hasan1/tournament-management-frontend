/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Trophy, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useGetPlayerDashbaordQuery } from "@/redux/apiHooks/playerApi/playerApi";
import defaultPlayerImg from "@/assets/player.jpg";
import Spinner from "@/components/common/Spinner";
import Link from "next/link";

/** =========================
 * Types (based on your API)
 * ========================= */
export interface PlayerPass {
  fullName: string;
  email: string;
  profileImage: string | null;
  dob: string; // ISO string
  division: string;
  teamName: string;
  jerseyNum: number | null;
  role: "PLAYER" | string;
  ageVerifiedStatus: "verified" | "pending" | "rejected" | string;
}

export interface Waiver {
  status: string; // e.g. "Signed"
  isAgree: boolean;
}

export interface Opponent {
  teamName: string;
  image: string | null;
}

export interface NextMatch {
  id: string;
  scheduledAt: string; // ISO string
  field: string;
  location: string;
  mapLink: string;
  tournamentName: string;
  division: string;
  stage: string;
  round: string | null;
  opponent: Opponent;
  referee: string | null;
  status: string; // e.g. "PUBLISHED"
}

export interface PlayerDashboardData {
  playerPass: PlayerPass;
  waiver: Waiver;
  nextMatch: NextMatch | null;
}

export interface PlayerDashboardResponse {
  success: boolean;
  message: string;
  data: PlayerDashboardData;
}

/** =========================
 * Helpers
 * ========================= */
function formatMatchDateTime(iso?: string) {
  if (!iso) return { date: "TBD", time: "TBD" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "TBD", time: "TBD" };

  return {
    date: d.toLocaleDateString(undefined, {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function formatDob(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function PlayerDashboard() {
  const {
    data: playerData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPlayerDashbaordQuery();

  const playerInfo = playerData?.data?.playerPass;
  const waiver = playerData?.data?.waiver;
  const nextMatch = playerData?.data?.nextMatch;

  const isVerified = playerInfo?.ageVerifiedStatus === "verified";
  const waiverPending = waiver ? !waiver.isAgree : false;

  const { date: matchDate, time: matchTime } = formatMatchDateTime(
    nextMatch?.scheduledAt,
  );

  if (isLoading) {
    return (
      // <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      //   <div className="max-w-7xl mx-auto space-y-6">
      //     <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-8">
      //       <p className="text-gray-300">Loading dashboard…</p>
      //     </div>
      //   </div>
      // </div>
      <Spinner />
    );
  }

  if (isError) {
    const errMsg =
      (error as any)?.data?.message ||
      (error as any)?.error ||
      "Failed to load dashboard data.";

    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-8">
            <p className="text-red-400 font-semibold">{errMsg}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-[#35BACB] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#A232D6] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!playerInfo) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-8">
            <p className="text-gray-300">No player data found.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-[#35BACB] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#A232D6] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photoSrc = playerInfo.profileImage || defaultPlayerImg;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Digital Player Pass */}
        <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-8">
          <h2 className="text-[#35BACB] font-bold text-xl mb-6 uppercase tracking-wider">
            Digital Player Pass
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Player Photo */}
            <div className="shrink-0">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-[#35BACB] bg-black/30">
                <Image
                  src={photoSrc}
                  alt={playerInfo.fullName}
                  fill
                  className="object-fill"
                  sizes="192px"
                  priority
                />
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {playerInfo.fullName}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    DOB: {formatDob(playerInfo.dob)}
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    {playerInfo.email}
                  </p>
                </div>

                {isVerified && (
                  <div className="flex items-center gap-2 bg-green-600/20 border border-green-600 text-green-400 px-4 py-2 rounded-lg">
                    <CheckCircle size={20} />
                    <span className="font-semibold">VERIFIED</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-6 border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      Division
                    </p>
                    <p className="text-lg text-gray-200">
                      {playerInfo.division}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      Team
                    </p>
                    <p className="text-lg text-gray-200">
                      {playerInfo.teamName}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      Jersey
                    </p>
                    <p className="text-lg text-gray-200">
                      {playerInfo.jerseyNum ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Match and Waiver Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Next Match Card */}
          <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-6">
            <h3 className="text-[#35BACB] font-bold text-lg mb-6 uppercase tracking-wider">
              Next Match
            </h3>

            {nextMatch ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#35BACB]" size={20} />
                  <div>
                    <p className="text-gray-500 text-sm">Date & Time</p>
                    <p className="text-gray-200">
                      {matchDate} @ {matchTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Trophy className="text-[#35BACB] mt-1" size={20} />
                  <div>
                    <p className="text-gray-500 text-sm">Opponent</p>
                    <p className="text-gray-200 text-lg font-semibold">
                      vs. {nextMatch.opponent?.teamName ?? "TBD"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {nextMatch.tournamentName} • {nextMatch.stage}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-[#35BACB] mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-200">{nextMatch.location}</p>
                    <p className="text-gray-500 text-sm">{nextMatch.field}</p>

                    {nextMatch.mapLink && (
                      <a
                        href={nextMatch.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-[#35BACB] hover:underline"
                      >
                        Open map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No upcoming match scheduled.</p>
            )}
          </div>

          {/* Waiver Alert Card */}
          {waiverPending && (
            <div className="bg-linear-to-br from-red-900/20 to-red-900/10 border-2 border-red-900/50 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle
                  className="text-orange-400 shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h3 className="text-orange-400 font-bold text-lg uppercase">
                    Waiver Pending
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    You have an unsigned waiver that requires your attention.
                  </p>
                  {waiver?.status && (
                    <p className="text-gray-400 text-xs mt-2">
                      Current status: {waiver.status}
                    </p>
                  )}
                </div>
              </div>

              <Link href={"/dashboard/player/waiver-center"}>
                <button className="w-full bg-[#35BACB] text-black font-bold py-3 rounded-lg hover:bg-[#A232D6] transition-colors">
                  Sign Waiver Now
                </button>
              </Link>
            </div>
          )}

          {/* If waiver is signed */}
          {!waiverPending && waiver && (
            <div className="bg-linear-to-br from-green-900/10 to-green-900/5 border border-green-900/40 rounded-xl p-6 flex items-start gap-3">
              <CheckCircle className="text-green-400 mt-1" size={24} />
              <div>
                <h3 className="text-green-400 font-bold text-lg uppercase">
                  Waiver Signed
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  Your waiver is complete.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Status: {waiver.status}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
