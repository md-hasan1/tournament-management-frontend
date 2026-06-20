"use client";
import React, { useState, useMemo } from "react";
import { Trophy } from "lucide-react";
import {
  useGetSeriesLeaderboardQuery,
  useUpdateTeamDiscountOverrideMutation,
} from "@/redux/apiHooks/tournament/tournamentApi";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import InviteTeamModal from "./InviteModal";

const statusColorMap: Record<string, string> = {
  QUALIFIED: "#0D542B",
  ON_THE_BUBBLE: "#733E0A",
  ELIMINATED: "#82181A",
};

const statusLabelMap: Record<string, string> = {
  QUALIFIED: "Qualified",
  ON_THE_BUBBLE: "On the Bubble",
  ELIMINATED: "Eliminated",
};

export default function AdminStandingsPage() {
  const searchParams = useSearchParams();
  const initialDivision = searchParams.get("division") || "U11_BOYS";
  const [selectedDivision, setSelectedDivision] = useState(initialDivision);
  const [activeView, setActiveView] = useState<"standings" | "discount">(
    "standings",
  );
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingDiscountValue, setEditingDiscountValue] = useState<string>("");

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetSeriesLeaderboardQuery(selectedDivision);

  const [updateDiscountOverride, { isLoading: isUpdating }] =
    useUpdateTeamDiscountOverrideMutation();

  const handleEditDiscount = (teamId: string, currentDiscount: string) => {
    const discountValue = currentDiscount.replace("%", "");
    setEditingTeamId(teamId);
    setEditingDiscountValue(discountValue);
  };

  const handleSaveDiscount = async (teamId: string) => {
    try {
      const discountPercent = parseFloat(editingDiscountValue);
      if (
        isNaN(discountPercent) ||
        discountPercent < 0 ||
        discountPercent > 100
      ) {
        alert("Please enter a valid discount percentage (0-100)");
        return;
      }
      await updateDiscountOverride({
        teamId,
        discountPercent,
      }).unwrap();
      setEditingTeamId(null);
      setEditingDiscountValue("");
    } catch (error) {
      console.error("Failed to update discount:", error);
      alert("Failed to update discount. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditingDiscountValue("");
  };

  const divisions = [
    "U9_BOYS",
    "U10_BOYS",
    "U9_GIRLS",
    "U10_GIRLS",
    "U11_BOYS",
    "U11_GIRLS",
    "U12_BOYS",
    "U12_GIRLS",
    "U13_BOYS",
    "U14_BOYS",
    "U13_GIRLS",
    "U14_GIRLS",
    "U15_BOYS",
    "U16_BOYS",
    "U15_GIRLS",
    "U16_GIRLS",
    "U17_BOYS",
    "U18_BOYS",
    "U17_GIRLS",
    "U18_GIRLS",
    "HS_BOYS",
    "HS_GIRLS",
    "MENS_DIV_1",
    "MENS_DIV_2",
    "MENS_DIV_3",
    "WOMENS",
    "COED",
  ];

  // Transform API data to component format
  const standings = useMemo(() => {
    if (!leaderboardData?.data?.standings) return [];

    return leaderboardData.data.standings.map((team) => ({
      rank: team.rank,
      name: team.teamName,
      tournaments: team.tournaments,
      points: team.points,
      status: statusLabelMap[team.statusBadge] || team.statusBadge,
      statusColor: statusColorMap[team.statusBadge] || "#666666",
      discount: `${team.discountPercent}%`,
      teamId: team.teamId,
      inviteEnabled: team.inviteEnabled,
      discountSource: team.discountSource,
    }));
  }, [leaderboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-400 mb-2">
              Error Loading Leaderboard
            </h2>
            <p className="text-gray-300">
              {error instanceof Error
                ? error.message
                : "Failed to load standings data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={32} className="text-[#35BACB]" />
              <h1 className="text-4xl font-bold">
                {activeView === "standings"
                  ? "Crown Series Standings"
                  : "Crown Series Discount Configuration"}
              </h1>
            </div>
            <p className="text-gray-400">
              {activeView === "standings"
                ? "Manage the points system and view leaderboard"
                : "Manage the ticket system and view leaderboard"}
            </p>
          </div>
          <button
            onClick={() =>
              setActiveView(
                activeView === "standings" ? "discount" : "standings",
              )
            }
            className="bg-[#35BACB] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#A232D6]"
          >
            {activeView === "standings"
              ? "Discount Configuration"
              : "Back to Standings"}
          </button>
        </div>

        {/* Division Selector */}
        <div className="mb-8">
          <label className="text-gray-400 text-sm font-semibold block mb-2">
            Select Division
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
          >
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>📊</span>
              Leaderboard
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
                  <th className="text-left py-4 px-6">Rank</th>
                  <th className="text-left py-4 px-6">Team Name</th>
                  <th className="text-left py-4 px-6">Tournaments</th>
                  <th className="text-left py-4 px-6">Points</th>
                  <th className="text-left py-4 px-6">Status</th>
                  {activeView === "standings" ? (
                    <th className="text-left py-4 px-6">Action</th>
                  ) : (
                    <th className="text-left py-4 px-6">Discount</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr
                    key={team.rank}
                    className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm">
                        {team.rank}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Trophy size={16} className="text-[#35BACB]" />
                        <span className="font-semibold">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {team.tournaments}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[#35BACB] font-bold text-lg">
                        {team.points}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">pts</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        style={{
                          backgroundColor: team.statusColor,
                        }}
                        className="px-3 py-1 rounded text-xs font-semibold"
                      >
                        {team.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {activeView === "standings" ? (
                        <button
                          disabled={!team.inviteEnabled}
                          onClick={() => {
                            setSelectedTeam({
                              id: team.teamId,
                              name: team.name,
                            });
                            setInviteModalOpen(true);
                          }}
                          className={`text-sm ${
                            team.inviteEnabled
                              ? "cursor-pointer bg-[#35BACB] text-black px-3 py-1 rounded hover:bg-[#A232D6] font-bold"
                              : "text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {team.inviteEnabled ? "Invite" : "N/A"}
                        </button>
                      ) : (
                        <div>
                          {editingTeamId === team.teamId ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editingDiscountValue}
                                onChange={(e) =>
                                  setEditingDiscountValue(e.target.value)
                                }
                                className="w-16 bg-gray-700 border border-[#35BACB] rounded px-2 py-1 text-white text-sm focus:outline-none"
                                placeholder="0"
                                disabled={isUpdating}
                              />
                              <span className="text-white text-sm">%</span>
                              <button
                                onClick={() => handleSaveDiscount(team.teamId)}
                                disabled={isUpdating}
                                className="bg-[#35BACB] text-black text-xs px-2 py-1 rounded hover:bg-[#A232D6] disabled:opacity-50"
                              >
                                {isUpdating ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() =>
                                handleEditDiscount(team.teamId, team.discount)
                              }
                              className="font-bold text-white cursor-pointer hover:text-[#35BACB] transition-colors"
                            >
                              {team.discount}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTeam && (
        <InviteTeamModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
        />
      )}
    </div>
  );
}
