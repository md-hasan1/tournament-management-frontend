/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import CoachingStaff from "@/components/dashboard/coach-team/CoachingStaff";
import TeamRoster from "@/components/dashboard/coach-team/TeamRoster";
import { useParams } from "next/navigation";
import { useGetSingleRegisterdTournamentDetailsQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import Spinner from "@/components/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";

interface RosterPlayer {
  id: string;
  name: string;
  email: string;
  jersey: number;
  waiverStatus: "Signed" | "Pending";
  ageStatus: "Verified" | "Pending" | "Check In Required";
  initials: string;
}

export default function CoachTournamentDetailPage() {
  const [activeTab, setActiveTab] = useState<"roster" | "schedule">("roster");

  const params = useParams();
  const registrationId = params.id as string;

  console.log(registrationId);

  const {
    data: tournamentData,
    isLoading,
    isError,
  } = useGetSingleRegisterdTournamentDetailsQuery(registrationId, {
    skip: !registrationId, // important if params isn't ready yet
  });

  const tournament = tournamentData?.data?.tournament;
  const division = tournamentData?.data?.division;

  const coachingStaff = tournamentData?.data?.coachingStaff;
  console.log(coachingStaff);

  const rosterPlayers = tournamentData?.data?.roster?.players ?? [];

  const players: RosterPlayer[] = rosterPlayers.map((rp: any, idx: number) => {
    const fullName = rp?.player?.fullName ?? "Unknown";
    const parts = fullName.trim().split(/\s+/);
    const playerId = rp?.teamPlayerId;

    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : fullName.slice(0, 2).toUpperCase();

    const waiverStatus: "Signed" | "Pending" =
      rp?.waiverStatus === "Signed" ? "Signed" : "Pending";

    const ageStatus: "Verified" | "Pending" | "Check In Required" =
      rp?.ageVerified === "verified"
        ? "Verified"
        : rp?.ageVerified === "Check_in_required"
          ? "Check In Required"
          : "Pending";

    return {
      id: playerId, // numeric id for your table key + remove handler
      name: fullName,
      email: rp?.player?.email ?? "",
      jersey: rp?.player?.jerseyNum
        ? Number(rp.player.jerseyNum)
        : (rp?.number ?? 0),
      waiverStatus,
      ageStatus,
      initials,
    };
  });

  const apiMatches = tournamentData?.data?.matchSchedule ?? [];

  const matches = apiMatches.map((m: any) => ({
    id: m.matchId,
    time: m.time,
    opponent: m.match, // or build your own string using opponent.teamName
    field: m.field, // already like "Field 1"
    date: m.date, // "MAR 10 2026"
    status: m.status, // "COMPLETED" | "PUBLISHED"
    stage: m.stage, // "GROUP"
    isHome: m.isHome, // boolean
    opponentName: m.opponent?.teamName ?? "",
  }));

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-white mt-10">Failed to load.</div>;
  if (!tournament)
    return <div className="text-white mt-10">No tournament found.</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-1">
            {tournament.name}
          </h1>
          <p className="text-gray-400">
            View your tournament schedule and manage roster
          </p>
        </div>

        {/* Coaching Staff */}
        <div className="bg-[#111] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase">
              COACHING STAFF
            </h3>
          </div>
          <CoachingStaff coachingStaff={coachingStaff} />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab("roster")}
            className={`pb-3 font-bold text-sm ${activeTab === "roster" ? "text-[#35BACB] border-b-2 border-[#35BACB]" : "text-gray-400"}`}
          >
            Player Roster
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`pb-3 font-bold text-sm ${activeTab === "schedule" ? "text-[#35BACB] border-b-2 border-[#35BACB]" : "text-gray-400"}`}
          >
            Matches & Schedule
          </button>
        </div>

        {activeTab === "roster" && (
          <div>
            <TeamRoster players={players} registrationId={registrationId} />
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-2">
                  DATE
                </div>
                <div className="text-white font-bold">{tournament.date}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-2">
                  AGE GROUP
                </div>
                <div className="text-white font-bold">{division.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-2">
                  LOCATION
                </div>
                <div className="text-white font-bold">
                  {tournament.location}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-2">
                  TEAMS
                </div>
                <div className="text-white font-bold">{division.maxTeams}</div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">
              YOUR MATCH SCHEDULE
            </h3>
            <div className="space-y-4">
              {matches.map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-start gap-4 pb-4 border-b border-[#35BACB]/10 last:border-0"
                >
                  <div
                    className="font-bold px-3 py-2 rounded min-w-fit text-sm"
                    style={{
                      color: "#F0B100",
                      backgroundColor: "rgba(240,177,0,0.1)",
                    }}
                  >
                    {m.time}
                  </div>

                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">{m.opponent}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>{m.field}</span>
                      <span>•</span>
                      <span>{m.date}</span>
                      <span>•</span>
                      <span
                        className={
                          m.status === "COMPLETED"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {m.status}
                      </span>
                      <span>•</span>
                      <span>{m.stage}</span>
                      <span>•</span>
                      <span>{m.isHome ? "Home" : "Away"}</span>
                    </div>
                  </div>
                </div>
              ))}

              {!matches.length && (
                <p className="text-gray-400">No match schedule found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
