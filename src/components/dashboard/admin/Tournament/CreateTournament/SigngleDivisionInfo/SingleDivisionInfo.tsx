/* =================================
   DivisionManagePage.tsx (FIXED)
   ================================= */

"use client";
import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetTeamsByDivisionQuery,
  useGetTournamentByIdQuery,
  useGetScheduleByDivisionQuery,
  useGetStandingsByDivisionQuery,
} from "@/redux/apiHooks/tournament/tournamentApi";
import TeamsRoster from "@/components/dashboard/division/TeamsRoster";
import BracketsSchedule from "@/components/dashboard/division/BracketsSchedule";
import StandingsTable from "@/components/dashboard/division/StandingsTable";

interface Team {
  id: string;
  name: string;
  coach: string;
  contact: string;
  email:string
  waiverStatus: string;
  signedCount: number;
  totalCount: number;
}

interface Match {
  id: number | string;
  date: string; // display
  time: string; // display
  field: string;

  homeTeam: string;
  homeTeamInitial: string;
  homeTeamColor: string;

  awayTeam: string;
  awayTeamInitial: string;
  awayTeamColor: string;

  homeScore?: number;
  awayScore?: number;

  referee: string;
  stage?: "group" | "semi-finals" | "finals";

  // ✅ IMPORTANT: include ISO so modal can auto-fill correctly
  scheduledAt?: string;
}

interface Standing {
  rank: number;
  teamName: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  gf?: number;
  ga?: number;
  gd?: number;
  gamesPlayed?: number;
  points: number;
}

export default function DivisionManagePage() {
  const params = useParams();
  const divisionId = useMemo(() => {
    const id = params.divisionId;
    return typeof id === "string" ? id : "";
  }, [params.divisionId]);

  const [activeTab, setActiveTab] = useState("teams");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const { data: teamsData, isLoading: teamsLoading } =
    useGetTeamsByDivisionQuery(
      {
        teamDivisionId: divisionId,
        page: currentPage,
        limit: itemsPerPage,
      },
      {
        skip: !divisionId || typeof divisionId !== "string",
      },
    );

  // Extract tournament ID from teams data
  const tournamentId = teamsData?.data?.data?.[0]?.tournamentId;

  // Fetch tournament details
  const { data: tournamentData } = useGetTournamentByIdQuery(
    tournamentId || "",
    {
      skip: !tournamentId,
    },
  );

  // Fetch schedule by division
  const { data: scheduleData } = useGetScheduleByDivisionQuery(
    {
      divisionId: divisionId,
      page: 1,
      limit: 30,
    },
    {
      skip: !divisionId || typeof divisionId !== "string",
    },
  );

  console.log("tt", scheduleData);
  const divisionName = scheduleData?.data?.division.divisionName;
  // Fetch standings by division
  const { data: standingsData } = useGetStandingsByDivisionQuery(divisionId, {
    skip: !divisionId || typeof divisionId !== "string",
  });

  const teams = useMemo<Team[]>(() => {
    if (!teamsData?.data?.data) return [];
    return teamsData.data.data.map((team) => ({
      id: team.id,
      name: team.teamName,
      coach: team.coach.fullName,
      email: team.coach.email,
      contact: (team.coach as any).phoneNumber || "",
      waiverStatus: `${team.signedPlayersCount}/${team.totalRegisteredPlayers} Signed`,
      signedCount: team.signedPlayersCount,
      totalCount: team.totalRegisteredPlayers,
    }));
  }, [teamsData]);

  // Get pagination metadata
  const paginationMeta = useMemo(() => {
    if (!teamsData?.data?.meta) {
      return { total: 0, page: 1, limit: 10, totalPages: 0 };
    }
    const { total, page, limit } = teamsData.data.meta;
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }, [teamsData]);

  // Get number of fields from tournament data
  const numberOfFields = useMemo(() => {
    if (tournamentData?.data?.data?.[0]?.numberOfFields) {
      return tournamentData.data.data[0].numberOfFields;
    }
    return 0;
  }, [tournamentData]);

  // ✅ Transform schedule data into Match format (includes scheduledAt ISO)
  const matches = useMemo<Match[]>(() => {
    if (!scheduleData?.data?.schedule?.data?.length) return [];

    return scheduleData.data.schedule.data.map((m) => {
      const scheduledDate = new Date(m.scheduledAt);

      // Display values (for table only)
      const date = scheduledDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const time = scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: m.id,

        // ✅ pass ISO for edit modal auto-fill (this is the real fix)
        scheduledAt: m.scheduledAt,

        date,
        time,
        field: m.field,
        homeTeam: m.homeTeam.teamName,
        homeTeamInitial: m.homeTeam.teamName.charAt(0),
        homeTeamColor: `bg-blue-500`,
        awayTeam: m.awayTeam.teamName,
        awayTeamInitial: m.awayTeam.teamName.charAt(0),
        awayTeamColor: `bg-red-500`,
        homeScore: m.homeScore || undefined,
        awayScore: m.awayScore || undefined,
        referee: m.referee?.name || "",
        stage: m.stage.toLowerCase() as "group" | "semi-finals" | "finals",
      };
    });
  }, [scheduleData]);

  const standings = useMemo<Standing[]>(() => {
    if (!standingsData?.data?.standings) return [];
    return standingsData.data.standings.map((standing) => ({
      rank: standing.rank,
      teamName: standing.teamName,
      played: standing.played,
      wins: standing.wins,
      draws: standing.draws,
      losses: standing.losses,
      gf: standing.gf,
      ga: standing.ga,
      gd: standing.gd,
      points: standing.points,
    }));
  }, [standingsData]);

  if (teamsLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#35BACB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading division details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to List
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">{divisionName}</h1>
              <div className="flex gap-3 items-center">
                <span className="bg-[#35BACB] text-black px-4 py-1 rounded-full text-sm font-bold">
                  Proving Series
                </span>
                <span className="bg-green-500/20 text-green-400 border border-green-500 px-4 py-1 rounded-full text-sm font-bold">
                  ✓ Status: Ready
                </span>
              </div>
            </div>

            {/* Stats on the right */}
            <div className="flex gap-8">
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">TEAMS</p>
                <p className="text-3xl font-bold text-white">{teams.length}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">MATCHES</p>
                <p className="text-3xl font-bold text-white">
                  {teams.length > 0
                    ? (teams.length * (teams.length - 1)) / 2
                    : 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">FIELDS</p>
                <p className="text-3xl font-bold text-white">
                  {numberOfFields}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-800">
            <button
              onClick={() => setActiveTab("teams")}
              className={`pb-3 font-bold transition-colors ${
                activeTab === "teams"
                  ? "text-[#35BACB] border-b-2 border-[#35BACB]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Teams & Roster
            </button>
            <button
              onClick={() => setActiveTab("brackets")}
              className={`pb-3 font-bold transition-colors ${
                activeTab === "brackets"
                  ? "text-[#35BACB] border-b-2 border-[#35BACB]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Brackets & Schedule
            </button>
            <button
              onClick={() => setActiveTab("standings")}
              className={`pb-3 font-bold transition-colors ${
                activeTab === "standings"
                  ? "text-[#35BACB] border-b-2 border-[#35BACB]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Standings
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "teams" && (
          <>
            <TeamsRoster teams={teams} teamDivisionId={divisionId} />

            {/* Pagination Controls */}
            {paginationMeta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
                <div className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="text-white font-bold">
                    {(paginationMeta.page - 1) * itemsPerPage + 1}
                  </span>{" "}
                  -{" "}
                  <span className="text-white font-bold">
                    {Math.min(
                      paginationMeta.page * itemsPerPage,
                      paginationMeta.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-bold">
                    {paginationMeta.total}
                  </span>{" "}
                  teams
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-[#35BACB] text-black hover:bg-[#A232D6]"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: paginationMeta.totalPages },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-bold transition-colors ${
                          currentPage === page
                            ? "bg-[#35BACB] text-black"
                            : "bg-[#1A1A1A] text-gray-400 hover:text-white border border-gray-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, paginationMeta.totalPages),
                      )
                    }
                    disabled={currentPage === paginationMeta.totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === paginationMeta.totalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-[#35BACB] text-black hover:bg-[#A232D6]"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "brackets" && (
          <BracketsSchedule matches={matches} divisionId={divisionId} />
        )}
        {activeTab === "standings" && <StandingsTable standings={standings} />}
      </div>
    </div>
  );
}
