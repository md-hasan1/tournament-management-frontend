"use client";

import React from "react";
import TeamDetails from "@/components/dashboard/coach-team/TeamDetails";
import AllPlayersList from "@/components/dashboard/coach-team/AllPlayersList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetSingleTeamDetailsQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import Spinner from "@/components/common/Spinner";

const CoachTeamPage = () => {
  const selectedTeamId = useSelector(
    (state: RootState) => state.teamSelection.selectedTeamId,
  );

  const { data, isLoading } = useGetSingleTeamDetailsQuery(selectedTeamId);
  const team = data?.data;

  // Removed manager invite and staff handlers for this page per design

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full mt-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">ALL PLAYER</h1>
        <p className="text-gray-400">Manage team details & all player roster</p>
      </div>

      {/* Team Details */}
      <TeamDetails
        teamId={selectedTeamId ?? "N/A"}
        teamName={team?.teamName ?? "N/A"}
        division={team?.division ?? "N/A"}
        imageUrl={team?.image} // ✅ pass logo url from API
      />

      {/* Removed Coaching Staff section to match design */}

      {/* All Players List */}
      <AllPlayersList />
    </div>
  );
};

export default CoachTeamPage;
