/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  TournamentCard,
  TournamentStatus,
} from "@/components/dashboard/coach-pages/TournamentCard";
// import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetRegisterdTournamentQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import HistoryTab from "@/components/dashboard/coach-team/History/HistoryTab";
import Spinner from "@/components/common/Spinner";
export interface RegisteredTournament {
  registrationId: string;
  registrationPayStatus: string;
  registeredAt: string;

  tournament: {
    id: string;
    name: string;
    stage: string;
    status: string;
    startDate: string;
    endDate: string;
    formattedDate: string;
    location: string;
    gameStyle: string;
    logo: string;
    rosterSizeMax: number;
    numberOfFields: number;
  };

  division: {
    id: string;
    name: string;
    raw: string;
    status: string;
    slotsLeft: number;
    maxTeams: number;
    feeOverride: any;
  };

  rosterSummary: {
    totalPlayers: number;
    signedCount: number;
    maxPlayers: number;
    badgeStatus: string;
    message: string;
  };
}

const mapBadgeStatus = (s: string): TournamentStatus | undefined => {
  const normalized = s.trim().toUpperCase();

  if (normalized === "NO PLAYERS") return "NO_PLAYERS";
  if (normalized === "ROSTER INCOMPLETE") return "ROSTER_INCOMPLETE";
  if (normalized === "ROSTER COMPLETE") return "ROSTER_COMPLETE";

  return undefined;
};

export default function CoachTournamentsPage() {
  const selectedTeamId = useSelector(
    (state: RootState) => state.teamSelection.selectedTeamId,
  );

  const { data: upcomingData, isLoading } =
    useGetRegisterdTournamentQuery(selectedTeamId);

  const upcomingTournaments: RegisteredTournament[] =
    upcomingData?.data?.tournaments ?? [];
  const transformedTournaments = upcomingTournaments.map((item) => ({
    id: item.registrationId,
    name: item.tournament.name,
    date: item.tournament.formattedDate,
    location: item.tournament.location,
    ageGroup: item.division.name,
    status: mapBadgeStatus(item.rosterSummary.badgeStatus),
  }));

  console.log(selectedTeamId);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TOURNAMENTS</h1>
          <p className="text-gray-400">
            {activeTab === "upcoming"
              ? "View your tournament schedule and results"
              : "View schedules and track performance points"}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:w-2/3">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-3 px-4 font-bold transition-colors ${
              activeTab === "upcoming"
                ? "bg-[#35BACB] text-black"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            UPCOMING
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-4 font-bold transition-colors ${
              activeTab === "history"
                ? "bg-[#35BACB] text-black"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            HISTORY & POINTS
          </button>
        </div>

        {/* Upcoming Tournaments */}
        {activeTab === "upcoming" && (
          <div>
            <div className="grid grid-cols-1 gap-6">
              {transformedTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {/* History & Points */}
        {activeTab === "history" && <HistoryTab teamId={selectedTeamId} />}
      </div>
    </div>
  );
}
