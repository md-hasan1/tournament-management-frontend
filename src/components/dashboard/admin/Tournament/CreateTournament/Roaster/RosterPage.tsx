"use client";
import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  useGetTeamsByDivisionQuery,
  useUpdateTeamPlayerVerificationMutation,
  TeamPlayer,
  TeamByDivision,
} from "@/redux/apiHooks/tournament/tournamentApi";

export default function CheckRosterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const teamDivisionId = searchParams.get("teamDivisionId");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  // Mutation for updating player verification
  const [updateVerification, { isLoading: isUpdating }] =
    useUpdateTeamPlayerVerificationMutation();

  // Fetch teams data from API
  const { data: teamsData, isLoading } = useGetTeamsByDivisionQuery(
    { teamDivisionId: teamDivisionId || "" },
    { skip: !teamDivisionId },
  );

  // Find the selected team
  const selectedTeam = useMemo(() => {
    if (!teamsData?.data?.data || !teamId) return null;
    return teamsData.data.data.find(
      (team: TeamByDivision) => team.id === teamId,
    );
  }, [teamsData, teamId]);

  // Filter players by search query
  const filteredPlayers = useMemo(() => {
    if (!selectedTeam?.teamplayers) return [];
    return selectedTeam.teamplayers.filter((player: TeamPlayer) => {
      const playerName = player.signName || `Player ${player.id.slice(0, 8)}`;
      return playerName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [selectedTeam, searchQuery]);

  // Set first player as selected when team data loads
  React.useEffect(() => {
    if (filteredPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(filteredPlayers[0]);
    }
  }, [filteredPlayers, selectedPlayer]);

  const handleApprove = async (player: TeamPlayer) => {
    try {
      setActionType("approve");
      await updateVerification({
        playerId: player.id,
        ageVerified: "verified",
      }).unwrap();
      setSelectedPlayer(null);
    } catch (error) {
      console.error("Failed to approve player:", error);
    } finally {
      setActionType(null);
    }
  };

  const handleReject = async (player: TeamPlayer) => {
    try {
      setActionType("reject");
      await updateVerification({
        playerId: player.id,
        ageVerified: "Rejected",
      }).unwrap();
      setSelectedPlayer(null);
    } catch (error) {
      console.error("Failed to reject player:", error);
    } finally {
      setActionType(null);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Signed":
        return "bg-green-500/20 text-green-400 border border-green-500";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border border-red-500";
      default:
        return "bg-orange-500/20 text-orange-400 border border-orange-500";
    }
  };

  const getAgeVerifiedColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-400";
      case "Rejected":
        return "text-red-400";
      case "Check_in_required":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getAgeVerifiedLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "Rejected":
        return "Rejected";
      case "Check_in_required":
        return "Check-in Required";
      default:
        return status;
    }
  };

  // Render modal only if teamId is present
  if (!teamId || !teamDivisionId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
          <p className="text-white text-center">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
          <p className="text-white text-center">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-4xl w-full relative flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">
            {selectedTeam.teamName}
          </h2>
          <p className="text-gray-400 text-sm">
            Review player documents • {filteredPlayers.length} players
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Left Side - Verification Queue */}
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-gray-500 text-xs uppercase tracking-wide mb-3">
              VERIFICATION QUEUE
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 scrollbar-hide pr-2">
              {filteredPlayers.map((player: TeamPlayer) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedPlayer?.id === player.id
                      ? "bg-gray-800 border-l-2 border-l-[#35BACB] border-t-gray-700 border-r-gray-700 border-b-gray-700"
                      : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-semibold text-sm">
                      {player.signName || `Player ${player.id.slice(0, 8)}`}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(
                        player.status,
                      )}`}
                    >
                      {player.status}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${getAgeVerifiedColor(player.ageVerified)}`}
                  >
                    {getAgeVerifiedLabel(player.ageVerified)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Waiting for Age Verification
                  </p>
                </button>
              ))}

              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No players found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Player Information */}
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-white font-bold mb-3">Player Information</h3>

            {selectedPlayer ? (
              <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide flex flex-col">
                {/* Player Name & Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <span>👤</span> Player Name
                    </label>
                    <input
                      type="text"
                      value={
                        selectedPlayer.signName ||
                        `Player ${selectedPlayer.id.slice(0, 8)}`
                      }
                      disabled
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <span>📅</span> Date of Birth
                    </label>
                    <input
                      type="text"
                      value={
                        selectedPlayer.createdAt
                          ? new Date(
                              selectedPlayer.createdAt,
                            ).toLocaleDateString()
                          : "N/A"
                      }
                      disabled
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Division */}
                <div>
                  <label className="text-gray-400 text-xs block mb-1">
                    Division
                  </label>
                  <input
                    type="text"
                    value={selectedTeam.teamName}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 mt-auto">
                  <button
                    onClick={() => handleApprove(selectedPlayer)}
                    disabled={isUpdating}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {actionType === "approve" ? "Processing..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(selectedPlayer)}
                    disabled={isUpdating}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {actionType === "reject" ? "Processing..." : "✕ Reject"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Select a player to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
