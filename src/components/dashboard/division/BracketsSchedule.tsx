/* ===========================
   BracketsSchedule.tsx (FIXED)
   =========================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { RefreshCw, Lock, Edit2, Plus, X, Loader } from "lucide-react";
import {
  useUpdateMatchScoreMutation,
  useUpdateMatchRefereeMutation,
  useUpdateMatchMutation,
  useGetTeamsByDivisionQuery,
  useRegenerateScheduleMutation,
} from "@/redux/apiHooks/tournament/tournamentApi";
import { useGetRefereesQuery } from "@/redux/apiHooks/referee/refereeApi";

interface Match {
  id: number | string;
  date: string; // display text (not reliable for parsing)
  time: string; // display text (not reliable for parsing)
  field: string;

  homeTeam: string; // display name
  homeTeamInitial: string;
  homeTeamColor: string;

  awayTeam: string; // display name
  awayTeamInitial: string;
  awayTeamColor: string;

  homeScore?: number;
  awayScore?: number;

  referee: string; // display name
  stage?: "group" | "semi-finals" | "finals";

  // ✅ IMPORTANT: ISO string from API (reliable)
  scheduledAt?: string;
}

interface BracketsScheduleProps {
  matches: Match[];
  divisionId?: string;
}

export default function BracketsSchedule({
  matches,
  divisionId,
}: BracketsScheduleProps) {
  const [bracketType, setBracketType] = useState("group");
  const [schedulePublished, setSchedulePublished] = useState(false);

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scoringMatch, setScoringMatch] = useState<Match | null>(null);

  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [scoreSuccess, setScoreSuccess] = useState(false);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // API mutations
  const [updateMatchScore] = useUpdateMatchScoreMutation();
  const [regenerateSchedule] = useRegenerateScheduleMutation();
  const [updateMatch] = useUpdateMatchMutation();
  const [updateMatchReferee] = useUpdateMatchRefereeMutation();

  // Teams for division
  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useGetTeamsByDivisionQuery(
    { teamDivisionId: divisionId || "", page: 1, limit: 100 },
    { skip: !divisionId },
  );

  // Referees
  const {
    data: refereesData,
    isLoading: refereesLoading,
    error: refereesError,
  } = useGetRefereesQuery();

  // ===== Helpers for date/time autofill =====
  const pad2 = (n: number) => String(n).padStart(2, "0");

  // ✅ ISO -> { date: YYYY-MM-DD, time: HH:mm }
  const fromISOToDateTimeInputs = (iso?: string) => {
    if (!iso) return { date: "", time: "" };
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { date: "", time: "" };
    return {
      date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
      time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
    };
  };

  // ✅ DO NOT parse "Thu, Apr 10" (causes year 2001 bugs)
  // Accept only YYYY-MM-DD or ISO strings.
  const toDateInputValue = (dateStr?: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
      const d = new Date(dateStr);
      if (!Number.isNaN(d.getTime())) {
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      }
    }
    return "";
  };

  // Many formats -> HH:mm (for <input type="time" />)
  const toTimeInputValue = (timeStr?: string) => {
    if (!timeStr) return "";
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

    // "7:30 PM", "7 PM"
    const m = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (m) {
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2] ?? "0", 10);
      const ap = m[3].toUpperCase();
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return `${pad2(h)}:${pad2(min)}`;
    }

    // "19:30:00" or "7:30"
    const m2 = timeStr.trim().match(/^(\d{1,2}):(\d{2})/);
    if (m2) {
      return `${pad2(parseInt(m2[1], 10))}:${pad2(parseInt(m2[2], 10))}`;
    }

    return "";
  };

  // Find teamId from teamName (display name)
  const resolveTeamIdByName = (teamName?: string) => {
    if (!teamName) return "";
    const list = teamsData?.data?.data ?? [];
    const found = list.find((t: any) => t.teamName === teamName);
    return found?.id ? String(found.id) : "";
  };

  // Find refereeId from referee fullName/name (display name)
  const resolveRefereeIdByName = (refName?: string) => {
    if (!refName) return "";
    const list = refereesData ?? [];
    const found = list.find(
      (r: any) => r.fullName === refName || r.name === refName,
    );
    return found?.id ? String(found.id) : "";
  };

  // ===== Local modal states =====
  const [editFormData, setEditFormData] = useState({
    date: "",
    time: "",
    field: "",
    homeTeam: "",
    awayTeam: "",
    refereeId: "",
    homeScore: 0,
    awayScore: 0,
  });
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const [scoreData, setScoreData] = useState({ homeScore: 0, awayScore: 0 });

  const [refereeMatch, setRefereeMatch] = useState<Match | null>(null);
  const [refereeData, setRefereeData] = useState({ refereeId: "" });
  const [isLoadingReferee, setIsLoadingReferee] = useState(false);
  const [refereeError, setRefereeError] = useState<string | null>(null);
  const [refereeSuccess, setRefereeSuccess] = useState(false);

  const handleEditClick = (match: Match) => {
    setEditingMatch(match);

    // ✅ Prefer ISO if available (best for auto-fill)
    const dt = fromISOToDateTimeInputs(match.scheduledAt);

    setEditFormData({
      // ✅ If ISO missing, we DON'T parse "Thu, Apr 10" anymore (returns "")
      date: dt.date || toDateInputValue(match.date),
      time: dt.time || toTimeInputValue(match.time),
      field: match.field || "",
      homeTeam: resolveTeamIdByName(match.homeTeam) || "",
      awayTeam: resolveTeamIdByName(match.awayTeam) || "",
      refereeId: resolveRefereeIdByName(match.referee) || "",
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
    });

    setEditError(null);
    setEditSuccess(false);
  };

  const handleCloseModal = () => {
    setEditingMatch(null);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "homeScore" || name === "awayScore") {
      setEditFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Build ISO from date+time in correct input formats
  const formatToISO = (date: string, time: string) => {
    if (!date || !time) return null;
    // date: YYYY-MM-DD, time: HH:mm
    const dt = new Date(`${date}T${time}`);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString();
  };

  const handleUpdate = async () => {
    if (!editingMatch) return;

    setIsLoadingEdit(true);
    setEditError(null);
    setEditSuccess(false);

    try {
      const matchId = String(editingMatch.id);

      const updateBody: any = {
        scheduledAt:
          formatToISO(editFormData.date, editFormData.time) || undefined,
        homeTeamId: editFormData.homeTeam || null,
        awayTeamId: editFormData.awayTeam || null,
        refereeId: editFormData.refereeId || null,
        field: editFormData.field || editingMatch.field,
        homeScore: editFormData.homeScore ?? (editingMatch.homeScore || 0),
        awayScore: editFormData.awayScore ?? (editingMatch.awayScore || 0),
      };

      // keep same logic
      if (editFormData.date && editFormData.time) {
        updateBody.scheduledAt = formatToISO(
          editFormData.date,
          editFormData.time,
        );
      }

      const result = await updateMatch({ matchId, data: updateBody }).unwrap();

      if (result?.success) {
        setEditSuccess(true);
        setTimeout(() => handleCloseModal(), 1200);
      } else {
        setEditError("Update failed. Please try again.");
      }
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update match. Please try again.";
      setEditError(msg);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleEnterScoreClick = (match: Match) => {
    setScoringMatch(match);
    setScoreData({
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
    });
    setScoreError(null);
    setScoreSuccess(false);
  };

  const handleCloseScoreModal = () => {
    setScoringMatch(null);
    setScoreError(null);
    setScoreSuccess(false);
  };

  const handleScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "homeScore" | "awayScore",
  ) => {
    const value = parseInt(e.target.value) || 0;
    setScoreData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveScore = async () => {
    if (!scoringMatch) return;

    setIsLoadingScore(true);
    setScoreError(null);
    setScoreSuccess(false);

    try {
      const matchId = String(scoringMatch.id);
      const result = await updateMatchScore({
        matchId,
        homeScore: scoreData.homeScore,
        awayScore: scoreData.awayScore,
      }).unwrap();

      if (result?.success) {
        setScoreSuccess(true);
        setTimeout(() => handleCloseScoreModal(), 1200);
      } else {
        setScoreError("Failed to save score.");
      }
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to save score. Please try again.";
      setScoreError(msg);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const handleAssignRefereeClick = (match: Match) => {
    setRefereeMatch(match);
    setRefereeData({ refereeId: resolveRefereeIdByName(match.referee) || "" });
    setRefereeError(null);
    setRefereeSuccess(false);
  };

  const handleCloseRefereeModal = () => {
    setRefereeMatch(null);
    setRefereeData({ refereeId: "" });
    setRefereeError(null);
    setRefereeSuccess(false);
  };

  const handleRefereeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefereeData({ refereeId: e.target.value });
  };

  const handleSaveReferee = async () => {
    if (!refereeMatch || !refereeData.refereeId) return;

    setIsLoadingReferee(true);
    setRefereeError(null);
    setRefereeSuccess(false);

    try {
      const matchId = String(refereeMatch.id);
      const result = await updateMatchReferee({
        matchId,
        refereeId: refereeData.refereeId,
      }).unwrap();

      if (result?.success) {
        setRefereeSuccess(true);
        setTimeout(() => handleCloseRefereeModal(), 1200);
      } else {
        setRefereeError("Failed to assign referee.");
      }
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to assign referee. Please try again.";
      setRefereeError(msg);
    } finally {
      setIsLoadingReferee(false);
    }
  };

  const handleRegenerateSchedule = async () => {
    if (!divisionId) {
      setRegenerateError("Division ID is required");
      return;
    }

    setIsRegenerating(true);
    setRegenerateError(null);
    setRegenerateSuccess(false);

    try {
      const result = await regenerateSchedule({ divisionId }).unwrap();
      if (result?.success) {
        setRegenerateSuccess(true);
        setTimeout(() => setRegenerateSuccess(false), 2500);
      } else {
        setRegenerateError("Failed to regenerate schedule.");
      }
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to regenerate schedule. Please try again.";
      setRegenerateError(msg);
      setTimeout(() => setRegenerateError(null), 4000);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handlePublishSchedule = async () => {
    if (matches.length === 0) {
      setPublishError("No matches to publish");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      const newPublishState = !schedulePublished;

      const updatePromises = matches.map((match) =>
        updateMatch({
          matchId: String(match.id),
          data: { isPublished: newPublishState },
        }).unwrap(),
      );

      await Promise.all(updatePromises);

      setSchedulePublished(newPublishState);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 2500);
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to publish schedule. Please try again.";
      setPublishError(msg);
      setTimeout(() => setPublishError(null), 4000);
    } finally {
      setIsPublishing(false);
    }
  };

  const groupMatches = matches.filter((m) => m.stage === "group");
  const totalGroupPages = Math.ceil(groupMatches.length / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {regenerateSuccess && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
          ✓ Schedule regenerated successfully!
        </div>
      )}
      {regenerateError && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {regenerateError}
        </div>
      )}
      {publishSuccess && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
          ✓ Schedule {schedulePublished ? "published" : "unpublished"}{" "}
          successfully!
        </div>
      )}
      {publishError && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {publishError}
        </div>
      )}

      {/* Top Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setBracketType("group")}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              bracketType === "group"
                ? "bg-[#35BACB] text-black"
                : "border border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            Group Stage
          </button>
          <button
            onClick={() => setBracketType("playoff")}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              bracketType === "playoff"
                ? "bg-[#35BACB] text-black"
                : "border border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            Playoff Brackets
          </button>
        </div>

        {bracketType === "group" && (
          <div className="flex gap-4">
            <button
              onClick={handleRegenerateSchedule}
              disabled={isRegenerating || !divisionId}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#35BACB] text-black rounded-lg font-semibold hover:bg-[#EAB634] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={18}
                className={isRegenerating ? "animate-spin" : ""}
              />
              {isRegenerating ? "Regenerating..." : "Re-Generate Schedule"}
            </button>

            <button
              onClick={handlePublishSchedule}
              disabled={isPublishing || matches.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                schedulePublished
                  ? "bg-[#35BACB] text-black"
                  : "border border-gray-700 text-gray-300 hover:border-gray-500"
              }`}
            >
              <Lock size={18} className={isPublishing ? "animate-pulse" : ""} />
              {isPublishing
                ? "Processing..."
                : schedulePublished
                  ? "Unpublish Schedule"
                  : "Publish Schedule"}
            </button>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="space-y-6">
        {bracketType === "group" ? (
          groupMatches.length === 0 ? (
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30 py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-gray-400 text-center">
                  <p className="text-lg font-semibold mb-2">
                    No Schedule Generated
                  </p>
                  <p className="text-sm">
                    Generate a schedule to start managing matches
                  </p>
                </div>
                <button
                  onClick={handleRegenerateSchedule}
                  disabled={isRegenerating || !divisionId}
                  className="flex items-center gap-2 px-6 py-3 bg-[#35BACB] text-black rounded-lg font-semibold hover:bg-[#EAB634] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus
                    size={20}
                    className={isRegenerating ? "animate-spin" : ""}
                  />
                  {isRegenerating ? "Generating..." : "Generate Schedule"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Field
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Home Team
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Away Team
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Referee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {groupMatches
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize,
                      )
                      .map((match) => (
                        <tr
                          key={match.id}
                          className="hover:bg-gray-900/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-white">
                            {match.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {match.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {match.field}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${match.homeTeamColor} flex items-center justify-center text-white font-bold text-sm`}
                              >
                                {match.homeTeamInitial}
                              </div>
                              <span className="text-sm text-white">
                                {match.homeTeam}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${match.awayTeamColor} flex items-center justify-center text-white font-bold text-sm`}
                              >
                                {match.awayTeamInitial}
                              </div>
                              <span className="text-sm text-white">
                                {match.awayTeam}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {match.homeScore !== undefined &&
                            match.awayScore !== undefined ? (
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-white font-semibold">
                                  {match.homeScore}
                                </span>
                                <span className="text-gray-500">-</span>
                                <span className="text-sm text-white font-semibold">
                                  {match.awayScore}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEnterScoreClick(match)}
                                className="px-3 py-1 bg-[#35BACB] text-black text-sm font-semibold rounded hover:bg-[#EAB634] transition-colors"
                              >
                                Enter Score
                              </button>
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {match.referee ? (
                              <span className="text-white">
                                {match.referee}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAssignRefereeClick(match)}
                                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                              >
                                <Plus size={16} /> Assign Ref
                              </button>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleEditClick(match)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalGroupPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * pageSize + 1,
                      groupMatches.length,
                    )}{" "}
                    to {Math.min(currentPage * pageSize, groupMatches.length)}{" "}
                    of {groupMatches.length} matches
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: totalGroupPages },
                        (_, i) => i + 1,
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === p
                              ? "bg-[#35BACB] text-black font-semibold"
                              : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalGroupPages),
                        )
                      }
                      disabled={currentPage === totalGroupPages}
                      className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          <div className="space-y-6">
            {["semi-finals", "finals"].map((stage) => {
              const stageMatches = matches.filter((m) => m.stage === stage);
              if (stageMatches.length === 0) return null;

              return (
                <div key={stage}>
                  <h3 className="text-[#35BACB] font-bold text-sm uppercase tracking-widest mb-4">
                    {stage === "semi-finals" ? "SEMI-FINALS" : "FINAL"}
                  </h3>

                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-900 border-b border-gray-800">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Time
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Field
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Home Team
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Away Team
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Score
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Referee
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-800">
                        {stageMatches.map((match) => (
                          <tr
                            key={match.id}
                            className="hover:bg-gray-900/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-white">
                              {match.date}
                            </td>
                            <td className="px-6 py-4 text-sm text-white">
                              {match.time}
                            </td>
                            <td className="px-6 py-4 text-sm text-white">
                              {match.field}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${match.homeTeamColor} flex items-center justify-center text-white font-bold text-sm`}
                                >
                                  {match.homeTeamInitial}
                                </div>
                                <span className="text-sm text-white">
                                  {match.homeTeam}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${match.awayTeamColor} flex items-center justify-center text-white font-bold text-sm`}
                                >
                                  {match.awayTeamInitial}
                                </div>
                                <span className="text-sm text-white">
                                  {match.awayTeam}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {match.homeScore !== undefined &&
                              match.awayScore !== undefined ? (
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-white font-semibold">
                                    {match.homeScore}
                                  </span>
                                  <span className="text-gray-500">-</span>
                                  <span className="text-sm text-white font-semibold">
                                    {match.awayScore}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEnterScoreClick(match)}
                                  className="px-3 py-1 bg-[#35BACB] text-black text-sm font-semibold rounded hover:bg-[#EAB634] transition-colors"
                                >
                                  Enter Score
                                </button>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm">
                              {match.referee ? (
                                <span className="text-white">
                                  {match.referee}
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAssignRefereeClick(match)
                                  }
                                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                  <Plus size={16} /> Assign Ref
                                </button>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleEditClick(match)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">EDIT MATCH</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-b border-gray-700 px-6 py-4">
              <p className="text-xs text-gray-400 mb-2">Current</p>
              <p className="text-sm text-white">
                <span className="text-[#35BACB]">{editingMatch.date}</span> •{" "}
                <span className="text-[#35BACB]">{editingMatch.time}</span> •{" "}
                <span className="text-[#35BACB]">{editingMatch.field}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {editingMatch.homeTeam} vs {editingMatch.awayTeam}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Score: {editingMatch.homeScore ?? "-"} -{" "}
                {editingMatch.awayScore ?? "-"}
              </p>
              {editingMatch.referee && (
                <p className="text-sm text-gray-400 mt-1">
                  Referee: {editingMatch.referee}
                </p>
              )}
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-2">
                  Field
                </label>
                <select
                  name="field"
                  value={editFormData.field}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                >
                  <option value="">Select Field</option>
                  <option value="Field 1">Field 1</option>
                  <option value="Field 2">Field 2</option>
                  <option value="Field 3">Field 3</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Home Team
                  </label>
                  <select
                    name="homeTeam"
                    value={editFormData.homeTeam}
                    onChange={handleInputChange}
                    disabled={teamsLoading}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:opacity-50"
                  >
                    <option value="">
                      {teamsLoading ? "Loading teams..." : "Select Team"}
                    </option>
                    {teamsError ? (
                      <option disabled>Error loading teams</option>
                    ) : (
                      (teamsData?.data?.data ?? []).map((team: any) => (
                        <option key={team.id} value={team.id}>
                          {team.teamName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Away Team
                  </label>
                  <select
                    name="awayTeam"
                    value={editFormData.awayTeam}
                    onChange={handleInputChange}
                    disabled={teamsLoading}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:opacity-50"
                  >
                    <option value="">
                      {teamsLoading ? "Loading teams..." : "Select Team"}
                    </option>
                    {teamsError ? (
                      <option disabled>Error loading teams</option>
                    ) : (
                      (teamsData?.data?.data ?? []).map((team: any) => (
                        <option key={team.id} value={team.id}>
                          {team.teamName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-2">
                  Referee
                </label>
                <select
                  name="refereeId"
                  value={editFormData.refereeId}
                  onChange={handleInputChange}
                  disabled={refereesLoading}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:opacity-50"
                >
                  <option value="">
                    {refereesLoading ? "Loading referees..." : "Select Referee"}
                  </option>
                  {refereesError ? (
                    <option disabled>Error loading referees</option>
                  ) : (
                    (refereesData ?? []).map((ref: any) => (
                      <option key={ref.id} value={ref.id}>
                        {ref.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Home Score
                  </label>
                  <input
                    type="number"
                    name="homeScore"
                    min="0"
                    value={editFormData.homeScore}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">
                    Away Score
                  </label>
                  <input
                    type="number"
                    name="awayScore"
                    min="0"
                    value={editFormData.awayScore}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>
            </div>

            {editError && (
              <div className="px-6 py-3 bg-red-500/20 border-b border-red-500/30 text-red-300 text-sm">
                {editError}
              </div>
            )}
            {editSuccess && (
              <div className="px-6 py-3 bg-green-500/20 border-b border-green-500/30 text-green-300 text-sm">
                Match updated successfully!
              </div>
            )}

            <div className="border-t border-gray-700 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isLoadingEdit}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isLoadingEdit}
                className="flex-1 px-4 py-2 bg-[#35BACB] text-black rounded-lg font-semibold hover:bg-[#EAB634] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoadingEdit ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Schedule"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enter Score Modal */}
      {scoringMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700">
            <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">ENTER SCORE</h2>
              <button
                onClick={handleCloseScoreModal}
                disabled={isLoadingScore}
                className="text-gray-400 hover:text-white disabled:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {scoreSuccess && (
              <div className="bg-green-500/20 border-b border-green-500 px-6 py-3">
                <p className="text-green-400 text-sm font-semibold">
                  ✓ Score saved successfully!
                </p>
              </div>
            )}
            {scoreError && (
              <div className="bg-red-500/20 border-b border-red-500 px-6 py-3">
                <p className="text-red-400 text-sm font-semibold">
                  {scoreError}
                </p>
              </div>
            )}

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 font-semibold mb-2">
                  {scoringMatch.homeTeam} Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={scoreData.homeScore}
                  onChange={(e) => handleScoreChange(e, "homeScore")}
                  disabled={isLoadingScore}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:bg-gray-600 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 font-semibold mb-2">
                  {scoringMatch.awayTeam} Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={scoreData.awayScore}
                  onChange={(e) => handleScoreChange(e, "awayScore")}
                  disabled={isLoadingScore}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:bg-gray-600 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="border-t border-gray-700 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseScoreModal}
                disabled={isLoadingScore}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScore}
                disabled={isLoadingScore}
                className="flex-1 px-4 py-2 bg-[#35BACB] text-black rounded-lg font-semibold hover:bg-[#EAB634] transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingScore && (
                  <Loader size={16} className="animate-spin" />
                )}
                {isLoadingScore ? "Saving..." : "Save Score"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Referee Modal */}
      {refereeMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg w-full max-w-md border border-gray-700">
            <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">ASSIGN REFEREE</h2>
              <button
                onClick={handleCloseRefereeModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 space-y-2">
              <p className="text-sm text-gray-400">
                Current: {refereeMatch.date} • {refereeMatch.time} • Field{" "}
                {refereeMatch.field}
              </p>
              <p className="text-sm text-gray-300 font-semibold">
                {refereeMatch.homeTeam} vs {refereeMatch.awayTeam}
              </p>
            </div>

            <div className="px-6 py-6 space-y-4">
              {refereeError && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {refereeError}
                </div>
              )}
              {refereeSuccess && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                  Referee assigned successfully!
                </div>
              )}

              <div>
                <label className="block text-sm text-white font-semibold mb-2">
                  Select Referee
                </label>
                <select
                  value={refereeData.refereeId}
                  onChange={handleRefereeChange}
                  disabled={isLoadingReferee}
                  className="w-full bg-gray-900 border-2 border-[#35BACB] rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#35BACB] disabled:bg-gray-800 disabled:border-gray-600 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select a Referee --</option>
                  {(refereesData ?? []).map((ref: any) => (
                    <option key={ref.id} value={ref.id}>
                      {ref.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-700 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseRefereeModal}
                disabled={isLoadingReferee}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReferee}
                disabled={isLoadingReferee || !refereeData.refereeId}
                className="flex-1 px-4 py-2 bg-[#35BACB] text-black rounded-lg font-semibold hover:bg-[#EAB634] transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingReferee && (
                  <Loader size={16} className="animate-spin" />
                )}
                {isLoadingReferee ? "Assigning..." : "Save Referee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
