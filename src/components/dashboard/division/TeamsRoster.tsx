"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Team {
  id: string;
  name: string;
  coach: string;
  email: string;
  contact: string;
  waiverStatus: string;
  signedCount: number;
  totalCount: number;
  teamDivisionId?: string;
}

interface TeamsRosterProps {
  teams: Team[];
  teamDivisionId?: string;
}

export default function TeamsRoster({
  teams,
  teamDivisionId,
}: TeamsRosterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getWaiverStatusColor = (signed: number, total: number) => {
    const percentage = (signed / total) * 100;
    if (percentage === 100) return "text-green-400";
    if (percentage >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB] transition-colors"
        />
      </div>

      {/* Info Section
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Teams Registered</p>
          <p className="text-2xl font-bold text-white">16</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Revenue</p>
          <p className="text-2xl font-bold text-[#35BACB]">$5,200</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Matches Scheduled</p>
          <p className="text-2xl font-bold text-white">24</p>
        </div>
      </div> */}
      {/* Teams Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Team Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Coach
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Waiver Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTeams.map((team) => (
              <tr
                key={team.id}
                className="hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {team.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {team.coach}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {team.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {team.contact}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-semibold ${getWaiverStatusColor(
                      team.signedCount,
                      team.totalCount,
                    )}`}
                  >
                    {team.waiverStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/admin/tournament/manage/division/roster?teamId=${team.id}&teamDivisionId=${teamDivisionId || team.teamDivisionId || ""}`}
                  >
                    <button className="px-4 py-2 bg-[#35BACB] text-black rounded-lg font-semibold text-sm hover:bg-[#EAB634] transition-colors">
                      Check Roster
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No teams found</p>
        </div>
      )}
    </div>
  );
}
