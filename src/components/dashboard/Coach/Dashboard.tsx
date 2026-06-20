"use client";

import React from "react";
import { AlertCircle, Clock } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useGetCoachDashboardQuery } from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import { useGetMeQuery } from "@/redux/apiHooks/auth/authApi";
import RecentActivity from "@/components/dashboard/coachDashbaord/recentActivity";
import Spinner from "@/components/common/Spinner";

const CoachDashboard = () => {
  const selectedTeamId = useSelector(
    (state: RootState) => state.teamSelection.selectedTeamId,
  );

  const {
    data: getme,
    isLoading: meLoading,
    isError: meError,
  } = useGetMeQuery(undefined);

  const {
    data: coachDashboard,
    isLoading: dashLoading,
    isError: dashError,
  } = useGetCoachDashboardQuery(selectedTeamId as string, {
    skip: !selectedTeamId,
  });

  // ✅ Safe user info
  const coachName = getme?.data?.fullName ?? "Coach";
  const bundleCredit = getme?.data?.totalBundle ?? 0;

  // ✅ Guard selected team
  if (!selectedTeamId) {
    return <div className="text-white mt-10">Please select a team</div>;
  }

  // ✅ Loading / Error guards
  if (meLoading || dashLoading) {
    return <Spinner />;
  }
  if (meError) {
    return <div className="text-white mt-10">Failed to load profile</div>;
  }
  if (dashError) {
    return <div className="text-white mt-10">Failed to load dashboard</div>;
  }

  // ✅ Dashboard data shortcut
  const d = coachDashboard?.data;

  // If API returns success false or missing data
  if (!d) {
    return <div className="text-white mt-10">No dashboard data found</div>;
  }

  const rosterPercent =
    d.roster.max > 0
      ? Math.round((d.roster.registered / d.roster.max) * 100)
      : 0;

  const waiverPercent =
    d.waivers.total > 0
      ? Math.round((d.waivers.signed / d.waivers.total) * 100)
      : 0;

  const tournamentDate = d.tournament?.startDate
    ? new Date(d.tournament.startDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBA";

  const rosterStatusText = d.roster.incomplete
    ? "ROSTER INCOMPLETE"
    : "ROSTER COMPLETE";

  return (
    <div className="w-full mt-10">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            WELCOME BACK, {coachName.toUpperCase()}
          </h1>
          <p className="text-gray-400">
            Here&apos;s what&apos;s happening with your team{" "}
            <span className="text-[#35BACB] font-semibold">{d.teamName}</span>
          </p>
        </div>

        <div className="text-right">
          <div className="bg-green-900/30 border border-green-500 rounded px-4 py-2 inline-block">
            <span className="text-green-400 font-semibold">
              ✓ {bundleCredit} Bundle Credit
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner (only show if pending waivers exist OR backend sends alert text) */}
      {(d.pendingWaiversAlert || d.waivers.pending > 0) && (
        <div className="bg-yellow-900/30 border-l-4 border-[#35BACB] rounded p-4 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#35BACB] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold">
                Action Required: {d.waivers.pending} Players have pending
                waivers
              </h3>
              <p className="text-gray-400 text-sm">
                {d.pendingWaiversAlert ??
                  "Specific players will not be eligible until waivers are signed."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tournament Card */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {d.tournament?.name ?? "No tournament assigned"}
              </h2>
              <p className="text-gray-400 text-sm">
                {tournamentDate}
                {d.tournament?.location ? ` • ${d.tournament.location}` : ""}
              </p>
            </div>

            <span className="px-3 py-1 rounded text-xs font-semibold border border-gray-700 text-gray-200">
              {rosterStatusText}
            </span>
          </div>

          {/* Countdown */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                TIME UNTIL TOURNAMENT
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {d.tournament?.timeUntil ?? "TBA"}
            </p>
          </div>

          {/* Tournament Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Division:</span>
              <span className="text-white font-medium">
                {d.division?.name ?? "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white font-medium">
                {d.tournament?.location ?? "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white font-medium">
                {d.tournament?.gameStyle ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Team Status Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">
            TEAM STATUS
          </h3>

          <div className="space-y-6">
            {/* Players Registered */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">
                  Players Registered
                </span>
                <span className="text-white font-bold text-lg">
                  {d.roster.registered}/{d.roster.max}
                </span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${rosterPercent}%` }}
                />
              </div>

              <p className="text-gray-400 text-xs mt-2">
                {d.roster.playersNeeded > 0
                  ? `Need ${d.roster.playersNeeded} more players to complete roster`
                  : "Roster complete"}
              </p>
            </div>

            {/* Waivers Signed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Waivers Signed</span>
                <span className="text-white font-bold text-lg">
                  {d.waivers.signed}/{d.waivers.total}
                </span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#35BACB] h-2 rounded-full"
                  style={{ width: `${waiverPercent}%` }}
                />
              </div>

              <p className="text-gray-400 text-xs mt-2">
                {d.waivers.pending > 0
                  ? `${d.waivers.pending} pending waivers`
                  : "No pending waivers"}
              </p>
            </div>

            {/* Age Verified */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400 text-sm">Age Verified</span>
              <span className="text-white font-bold text-lg">
                {d.ageVerified}
              </span>
            </div>

            {/* Tournament Ready */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Tournament ready</span>
              <div
                className={`w-5 h-5 rounded border-2 ${
                  d.roster.incomplete || d.waivers.pending > 0
                    ? "border-gray-600"
                    : "border-green-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* (Optional) If you don't have activity API yet, keep static for now */}
      {/* <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
        <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
          RECENT ACTIVITY
        </h3>

        <p className="text-gray-400 text-sm">
          (Connect activity API when available)
        </p>
      </div> */}
      <RecentActivity />
    </div>
  );
};

export default CoachDashboard;
