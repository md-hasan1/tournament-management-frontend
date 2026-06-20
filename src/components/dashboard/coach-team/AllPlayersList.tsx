/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import AddPlayerModal from "./AddPlayerModal";
import {
  useAddGlobalPlayerMutation,
  useDeletePlayerMutation,
  useGetCoachAllPalayerQuery,
  useUpdateGlobalPlayerMutation,
} from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import EditPlayerModal from "./EditGlobalPlayerInfo";

type ApiPlayer = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  jerseyNum?: string | null;
  dob?: string | null;
  status?: string;
  waiverStatus?: string | null;
  ageVerified?: string | null;
  tournament?: {
    id: string;
    name: string;
    startDate?: string;
    teamId?: string;
    teamName?: string;
  } | null;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "P";
};

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

const formatWaiver = (waiverStatus?: string | null) => {
  if (waiverStatus === "Signed")
    return { label: "✓ Signed", variant: "signed" };
  return { label: "○ Pending", variant: "pending" };
};

const formatAge = (ageVerified?: string | null) => {
  if (ageVerified === "verified")
    return { label: "✓ Verified", variant: "verified" };
  if (ageVerified === "Check_in_required")
    return { label: "Check In Required", variant: "checkin" };
  if (ageVerified === "Rejected")
    return { label: "Rejected", variant: "rejected" };
  return { label: ageVerified ?? "Pending", variant: "pending" };
};

const AllPlayersList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<ApiPlayer | null>(null);

  const [addPlayer, { isLoading: isAdding }] = useAddGlobalPlayerMutation();
  const [removePlayer] = useDeletePlayerMutation();
  const [updatePlayer, { isLoading: isUpdating }] =
    useUpdateGlobalPlayerMutation();

  // ✅ pagination state
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data: playerList,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCoachAllPalayerQuery({ page, limit });

  const players: ApiPlayer[] = useMemo(() => {
    return (playerList?.data ?? []) as ApiPlayer[];
  }, [playerList]);

  const meta = playerList?.meta;
  const total = meta?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const handleAddPlayerClick = async (playerData: any) => {
    console.log("Add player payload:", playerData);

    try {
      const res = await addPlayer(playerData).unwrap();

      toast.success(res?.message || "Player added successfully");
      setIsModalOpen(false);

      // refresh list after success
      refetch();
    } catch (error: any) {
      console.error("Add player failed:", error);

      toast.error(
        error?.data?.message || "Failed to add player. Please try again.",
      );
    }
  };

  const handleEdit = (player: ApiPlayer) => {
    setSelectedPlayer(player);
    setIsEditModalOpen(true);
  };

  const handleUpdatePlayer = async (data: any) => {
    if (!selectedPlayer) return;

    const payload: any = {};

    if (data.fullName) payload.fullName = data.fullName;
    if (data.dateOfBirth) payload.dob = data.dateOfBirth;
    if (data.phoneNumber) payload.phone = data.phoneNumber;
    if (data.jerseyNum) payload.jerseyNum = data.jerseyNum;

    try {
      const res = await updatePlayer({
        id: selectedPlayer.id,
        data: payload,
      }).unwrap();

      toast.success(res?.message || "Player updated successfully");

      setIsEditModalOpen(false);
      setSelectedPlayer(null);

      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update player. Please try again.",
      );
    }
  };

  const handleRemove = async (id: string) => {
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

      refetch(); // refresh list after delete
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

  return (
    <>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              ALL PLAYER LIST
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Add from a list of a managed all players
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#222] text-white font-bold text-sm rounded hover:bg-[#2a2a2a] transition uppercase tracking-wide"
              type="button"
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#35BACB] text-black font-bold text-sm rounded hover:bg-[#B8D800] transition uppercase tracking-wide"
              type="button"
            >
              + ADD PLAYER
            </button>
          </div>
        </div>

        {/* States */}
        {isLoading ? (
          <div className="text-gray-400 text-sm">Loading players...</div>
        ) : isError ? (
          <div className="text-red-400 text-sm">
            Failed to load players.{" "}
            <button
              onClick={() => refetch()}
              className="underline text-red-300 hover:text-red-200"
              type="button"
            >
              Try again
            </button>
          </div>
        ) : players.length === 0 ? (
          <div className="text-gray-400 text-sm">No players found.</div>
        ) : (
          <>
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
                    <th className="text-left text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                      TOURNAMENTS
                    </th>
                    <th className="text-right text-gray-400 font-semibold px-4 py-3 uppercase text-xs tracking-wide">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((p) => {
                    const initials = getInitials(p.fullName || "Player");
                    const waiver = formatWaiver(p.waiverStatus);
                    const age = formatAge(p.ageVerified);

                    return (
                      <tr
                        key={p.id}
                        className="border-b border-gray-800 hover:bg-gray-900/50 transition"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full ${getInitialsBg(
                                initials,
                              )} flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {initials}
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {p.fullName}
                              </p>
                              <p className="text-gray-500 text-xs">{p.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-white font-semibold">
                            {p.jerseyNum ?? "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              waiver.variant === "signed"
                                ? "bg-green-900/40 text-green-400 border border-green-500/60"
                                : "bg-yellow-900/40 text-yellow-400 border border-yellow-500/60"
                            }`}
                          >
                            {waiver.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              age.variant === "verified"
                                ? "bg-green-900/40 text-green-400 border border-green-500/60"
                                : age.variant === "checkin"
                                  ? "bg-gray-800 text-gray-400 border border-gray-700"
                                  : age.variant === "rejected"
                                    ? "bg-red-900/40 text-red-400 border border-red-500/60"
                                    : "bg-yellow-900/40 text-yellow-400 border border-yellow-500/60"
                            }`}
                          >
                            {age.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-yellow-400 text-sm font-semibold">
                            {p.tournament?.name ?? "Not Assigned"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-gray-400 hover:text-yellow-400 transition"
                              type="button"
                              title="Edit player"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleRemove(p.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition"
                              type="button"
                              title="Remove player"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination controls */}
            <div className="flex items-center justify-between mt-5">
              <p className="text-gray-500 text-xs">
                Total: {total} • Page: {page} / {totalPages} • Limit: {limit}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="px-3 py-2 rounded bg-[#222] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#2a2a2a] transition"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="px-3 py-2 rounded bg-[#222] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#2a2a2a] transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddPlayerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddPlayer={handleAddPlayerClick}
        isSubmitting={isAdding}
      />
      <EditPlayerModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        player={selectedPlayer}
        onUpdatePlayer={handleUpdatePlayer}
        isSubmitting={isUpdating}
      />
    </>
  );
};

export default AllPlayersList;
