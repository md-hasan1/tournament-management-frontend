/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useGetCoachAllPalayerQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";

interface PlayerListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayers?: (selectedPlayerIds: string[]) => void; // <-- string ids
  isSubmitting: boolean;
}

const getInitialsBg = (initials: string) => {
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
  ];
  const charCode = initials?.charCodeAt(0) ?? 0;
  return colors[charCode % colors.length];
};

const makeInitials = (name: string) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "P";
};

const PlayerListModal: React.FC<PlayerListModalProps> = ({
  open,
  onOpenChange,
  onAddPlayers,
  isSubmitting,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // pagination (optional)
  const [page] = useState(1);
  const [limit] = useState(10000);

  // ✅ call API with searchTerm
  const {
    data: playerlist,
    isLoading,
    isError,
  } = useGetCoachAllPalayerQuery({
    page,
    limit,
    searchTerm,
  });

  const players = useMemo(() => playerlist?.data ?? [], [playerlist]);

  // If your backend search param isn't wired yet,
  // you can keep a client-side fallback filter too:
  const filteredPlayers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return players;

    return players.filter((p: any) => {
      const name = (p?.fullName ?? "").toLowerCase();
      const email = (p?.email ?? "").toLowerCase();
      const team = (p?.tournament?.teamName ?? "").toLowerCase();
      return name.includes(term) || email.includes(term) || team.includes(term);
    });
  }, [players, searchTerm]);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleAddPlayers = () => {
    if (isSubmitting) return; // ✅ prevent double click
    onAddPlayers?.(selectedPlayers);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 max-w-md">
        <DialogHeader className="pb-4 border-b border-gray-800">
          <DialogTitle className="text-lg font-bold text-white uppercase tracking-wide">
            PLAYER LIST
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-400 transition placeholder-gray-600 text-sm"
            />
          </div>

          {/* Info Message */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 flex gap-3">
            <div className="shrink-0 mt-0.5">
              <span className="text-yellow-400">ℹ</span>
            </div>
            <p className="text-[#EAB634] text-xs">
              Select players from your coaching history. They will need to sign
              a new waiver for this team.
            </p>
          </div>

          {/* Players List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Loading players...
              </p>
            ) : isError ? (
              <p className="text-red-400 text-sm text-center py-4">
                Failed to load players
              </p>
            ) : filteredPlayers.length > 0 ? (
              filteredPlayers.map((player: any) => {
                const id = player?.id as string;
                const name = player?.fullName ?? "Unknown Player";
                const email = player?.email ?? "";
                const teamName = player?.tournament?.teamName;
                const initials = makeInitials(name);

                return (
                  <label
                    key={id}
                    className="flex items-center gap-3 p-3 bg-gray-900 rounded cursor-pointer hover:bg-gray-800 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(id)}
                      onChange={() => handlePlayerToggle(id)}
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded border border-gray-700 bg-gray-800 checked:bg-yellow-400 cursor-pointer"
                    />
                    <div
                      className={`w-8 h-8 rounded-full ${getInitialsBg(
                        initials,
                      )} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                    >
                      {initials}
                    </div>

                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-gray-500 text-xs">{email}</p>
                      {teamName && (
                        <p className="text-gray-600 text-xs">{teamName}</p>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No players found
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-3 border border-gray-700 text-white font-semibold rounded hover:bg-gray-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAddPlayers}
            disabled={selectedPlayers.length === 0 || isSubmitting}
            className="flex-1 px-4 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Players"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerListModal;
