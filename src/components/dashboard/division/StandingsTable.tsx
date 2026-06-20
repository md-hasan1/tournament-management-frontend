"use client";
import React from "react";
import { Crown, Star } from "lucide-react";

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

interface StandingsTableProps {
  standings: Standing[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  // Check if we have detailed stats or just basic info
  const hasDetailedStats =
    standings.length > 0 && standings[0].played !== undefined;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Crown size={28} className="text-[#35BACB]" />
          <h2 className="text-3xl font-bold">Standings</h2>
        </div>
        <p className="text-gray-400">
          Manage the points system and view leaderboard
        </p>
      </div>

      {/* Standings Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-2">
          <Star size={18} className="text-[#35BACB]" />
          <h3 className="text-sm font-bold uppercase">Standings</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-900/50 border-b border-gray-800">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Team Name
              </th>
              {hasDetailedStats ? (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    P
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    W
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    D
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    L
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    GF
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    GA
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    GD
                  </th>
                </>
              ) : (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Games Played
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {standings.length === 0 ? (
              <tr>
                <td
                  colSpan={hasDetailedStats ? 9 : 4}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No standings data available
                </td>
              </tr>
            ) : (
              standings.map((standing) => (
                <tr
                  key={standing.rank}
                  className="hover:bg-gray-900/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                      {standing.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {standing.teamName}
                  </td>
                  {hasDetailedStats ? (
                    <>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.played}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.wins}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.draws}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.losses}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.gf}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.ga}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {standing.gd! > 0 ? "+" : ""}
                        {standing.gd}
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 text-sm text-white">
                      {standing.gamesPlayed}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-bold text-[#35BACB]">
                    {standing.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
