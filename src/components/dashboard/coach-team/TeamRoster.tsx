/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Trash2, Mail } from "lucide-react";
import PlayerListModal from "./PlayerListModal";
import {
  useCreateTeamPlayerMutation,
  useRemoveTeamPlayerMutation,
  useSendNotifyMailMutation,
} from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface RosterPlayer {
  id: string;
  name: string;
  email: string;
  jersey: number;
  waiverStatus: "Signed" | "Pending";
  ageStatus: "Verified" | "Pending" | "Check In Required";
  initials: string;
  tournamentStatus?: "Pass Tournament" | "Not Assigned";
}

interface TeamRosterProps {
  players: RosterPlayer[];
  registrationId: string;
}

const getInitialsBg = (initials: string) => {
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
  ];
  const charCode = initials.charCodeAt(0);
  return colors[charCode % colors.length];
};

const TeamRoster: React.FC<TeamRosterProps> = ({ players, registrationId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addTeamplayer, { isLoading }] = useCreateTeamPlayerMutation();

  const [removePlayer] = useRemoveTeamPlayerMutation();
  const [sendMail] = useSendNotifyMailMutation();

  const handleAddPlayersFromList = async (selectedPlayerIds: string[]) => {
    const payload = {
      teamregisterId: registrationId,
      existingPlayerIds: selectedPlayerIds, // ✅ string[]
    };

    try {
      await addTeamplayer(payload).unwrap();
      toast.success("Player added successfully");
      setIsModalOpen(false); // ✅ close after success
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add player");
    }
  };

  const handleRemovePlayer = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This player will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#333",
    });

    if (!result.isConfirmed) return;
    try {
      const res = await removePlayer(id).unwrap();

      await Swal.fire({
        title: "Removed!",
        text: res?.message || "Player removed successfully.",
        icon: "success",
        confirmButtonColor: "#35BACB",
        customClass: {
          confirmButton: "swal-confirm-black-text",
        },
      });
    } catch (error: any) {
      console.error("Remove player failed:", error);

      await Swal.fire({
        title: "Failed!",
        text:
          error?.data?.message || "Failed to remove player. Please try again.",
        icon: "error",
        confirmButtonColor: "#35BACB",
      });
    }
  };

const handleSendMail = async (teamPlayerId: string) => {
  const result = await Swal.fire({
    title: "Send notification email?",
    text: "Notify this player to sign the waiver / complete action.",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Yes, send",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#35BACB",
    cancelButtonColor: "#333",
    customClass: {
      confirmButton: "swal-confirm-black-text",
    },
  });

  if (!result.isConfirmed) return;

  try {
    // ✅ prefer object payload
    const res = await sendMail( teamPlayerId ).unwrap();

    await Swal.fire({
      title: "Sent!",
      text: res?.message || "Notification email sent successfully.",
      icon: "success",
      confirmButtonColor: "#35BACB",
      customClass: {
        confirmButton: "swal-confirm-black-text",
      },
    });
  } catch (error: any) {
    console.error("Send mail failed:", error);

    await Swal.fire({
      title: "Failed!",
      text: error?.data?.message || "Failed to send email. Please try again.",
      icon: "error",
      confirmButtonColor: "#35BACB",
    });
  }
};

  return (
    <>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Team Roster
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {players.length}/12 players registered
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#35BACB] text-black font-bold text-sm rounded hover:bg-[#B8D800] transition uppercase tracking-wide"
          >
            + ADD PLAYER
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                  PLAYER
                </th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                  JERSEY
                </th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                  WAIVER STATUS
                </th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                  AGE VERIFICATION
                </th>
                <th className="text-right text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-gray-800 hover:bg-gray-900/50 transition"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getInitialsBg(
                          player.initials,
                        )} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {player.initials}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {player.name}
                        </p>
                        <p className="text-gray-500 text-xs">{player.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-white font-semibold">
                      {player.jersey}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        player.waiverStatus === "Signed"
                          ? "bg-green-900/40 text-green-400 border border-green-500/60"
                          : "bg-yellow-900/40 text-yellow-400 border border-yellow-500/60"
                      }`}
                    >
                      {player.waiverStatus === "Signed"
                        ? "✓ Signed"
                        : "○ Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        player.ageStatus === "Verified"
                          ? "bg-green-900/40 text-green-400 border border-green-500/60"
                          : player.ageStatus === "Check In Required"
                            ? "bg-gray-800 text-gray-400 border border-gray-700"
                            : "bg-yellow-900/40 text-yellow-400 border border-yellow-500/60"
                      }`}
                    >
                      {player.ageStatus === "Verified"
                        ? "✓ Verified"
                        : player.ageStatus}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSendMail(player.id)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition"
                      >
                        {player.waiverStatus !== "Signed" ? (
                          <Mail className="w-4 h-4" />
                        ) : null}
                      </button>
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PlayerListModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddPlayers={handleAddPlayersFromList}
        isSubmitting={isLoading} // ✅ pass loading state
      />
    </>
  );
};

export default TeamRoster;
