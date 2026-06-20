/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetTournamentQuery } from "@/redux/apiHooks/homePage/homePageApi";
import { useInviteTeamMutation } from "@/redux/apiHooks/inviteTournament/inviteTournament";
import React, { useState } from "react";
import { toast } from "sonner";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamId: string;
}

export default function InviteTeamModal({
  isOpen,
  onClose,
  teamName,
  teamId,
}: InviteTeamModalProps) {
  const [page] = useState(1);
  const [limit] = useState(1000);

  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [inviteTeam, { isLoading: isInviting }] = useInviteTeamMutation();

  const { data, isLoading } = useGetTournamentQuery({
    page,
    limit,
  });

  const handleClose = () => {
    setSelectedTournament("");
    setSelectedDivision("");
    onClose();
  };

  if (!isOpen) return null;

  const tournaments =
    data?.data?.data?.filter(
      (t: any) =>
        t.tournamentStage === "CROWN" || t.tournamentStage === "ROYAL",
    ) || [];

  const selectedTournamentData = tournaments.find(
    (t: any) => t.id === selectedTournament,
  );

  const divisions = selectedTournamentData?.tournamentDivisions || [];

  const sendInviteRequest = async () => {
    return await inviteTeam({
      tournamentId: selectedTournament,
      payload: {
        toTournamentDivisionId: selectedDivision,
        teamIds: [teamId],
      },
    }).unwrap();
  };

  const handleInvite = async () => {
    if (!selectedTournament) {
      toast.error("Please select a tournament");
      return;
    }

    if (!selectedDivision) {
      toast.error("Please select a division");
      return;
    }

    try {
      const res = await sendInviteRequest();

      toast.success(res?.message || "Team invitation sent successfully");

      setTimeout(() => {
        handleClose();
      }, 400);
    } catch (error: any) {
      console.log("First invite attempt failed:", error);

      // 🔁 retry once (because your API succeeds second time)
      try {
        const retryRes = await sendInviteRequest();

        toast.success(retryRes?.message || "Team invitation sent successfully");

        setTimeout(() => {
          handleClose();
        }, 400);
      } catch (retryError: any) {
        console.log("Retry failed:", retryError);

        const message =
          retryError?.data?.message ||
          retryError?.data?.errorSources?.[0] ||
          retryError?.error ||
          "Failed to send team invitation";

        toast.error(message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-gray-800 rounded-xl w-105 p-6">
        <h2 className="text-xl font-bold mb-4 text-[#35BACB]">Invite Team</h2>

        <p className="text-gray-400 mb-6">
          Invite <span className="text-white font-semibold">{teamName}</span>
        </p>

        {/* Tournament */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Tournament</label>

          <select
            value={selectedTournament}
            onChange={(e) => {
              setSelectedTournament(e.target.value);
              setSelectedDivision("");
            }}
            disabled={isLoading || isInviting}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 disabled:opacity-60"
          >
            <option value="">Select Tournament</option>

            {isLoading && <option>Loading...</option>}

            {!isLoading &&
              tournaments.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tournamentStage})
                </option>
              ))}
          </select>
        </div>

        {/* Division */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Division</label>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            disabled={!selectedTournament || isInviting}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 disabled:opacity-60"
          >
            <option value="">Select Division</option>

            {divisions.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.divisionName.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isInviting}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleInvite}
            disabled={isInviting || !selectedTournament || !selectedDivision}
            className="bg-[#35BACB] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#A232D6] disabled:opacity-60"
          >
            {isInviting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
