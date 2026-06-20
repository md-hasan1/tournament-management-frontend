/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllSchedulesQuery,
  useMoveSessionPlayerMutation,
} from "@/redux/apiHooks/camp/campApi";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import type { ApiParticipant } from "./ParticipantsTable";

type MovePlayerDialogProps = {
  open: boolean;
  participant: ApiParticipant | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function MovePlayerDialog({
  open,
  participant,
  onOpenChange,
  onSuccess,
}: MovePlayerDialogProps) {
  const { data: sessionData, isLoading: isScheduleLoading } =
    useGetAllSchedulesQuery(
      {
        limit: 100,
        page: 1,
      },
      {
        skip: !open,
      },
    );

  const [moveSessionPlayer, { isLoading: isMoving }] =
    useMoveSessionPlayerMutation();

  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [targetWeek, setTargetWeek] = useState("");
  const [selectedWeekIds, setSelectedWeekIds] = useState<string[]>([]);

  const activeSchedule = useMemo(() => {
    return sessionData?.data?.find((schedule: any) => {
      return schedule.status === "ACTIVE" && !schedule.isDeleted;
    });
  }, [sessionData]);

  const findSessionInfo = (sessionId: string) => {
    const schedules = sessionData?.data ?? [];

    for (const sched of schedules) {
      for (const week of sched.weeks ?? []) {
        for (const sess of week.sessions ?? []) {
          if (sess.id === sessionId) {
            return {
              weekNumber: week.weekNumber,
              title: sess.title,
              sessionType: sess.sessionType,
            };
          }
        }
      }
    }

    return null;
  };

  const registeredSessions = useMemo(() => {
    return (participant?.scheduleSessionIds ?? []).map((id: string) => {
      return {
        id,
        info: findSessionInfo(id),
      };
    });
  }, [participant, sessionData]);

  const activeWeeks = useMemo(() => {
    return (activeSchedule?.weeks ?? []).filter((week: any) => {
      return week.status === "ACTIVE";
    });
  }, [activeSchedule]);

  const selectedWeek = useMemo(() => {
    return activeWeeks.find((w: any) => w.id === targetWeek) ?? activeWeeks[0];
  }, [activeWeeks, targetWeek]);

  const activeSessions = useMemo(() => {
    return selectedWeek?.sessions ?? [];
  }, [selectedWeek]);

  // selections are across all active weeks; do not derive a single selectedWeek

  useEffect(() => {
    if (!open || !participant || activeWeeks.length === 0) return;

    // default to the participant's current registered session ids if available
    const currentSessionIds = participant.scheduleSessionIds ?? [];
    const defaultWeek =
      activeWeeks.find((w: any) => w.id === participant.scheduleWeek?.id) ??
      activeWeeks[0];
    setTargetWeek(defaultWeek?.id ?? "");

    // derive selected weeks from participant's current session ids
    const weekIdsFromSessions = Array.from(
      new Set(
        (currentSessionIds ?? [])
          .map((sid: string) => {
            for (const sched of sessionData?.data ?? []) {
              for (const wk of sched.weeks ?? []) {
                for (const ss of wk.sessions ?? []) {
                  if (ss.id === sid) return wk.id;
                }
              }
            }
            return null;
          })
          .filter(Boolean),
      ),
    );

    if (weekIdsFromSessions.length > 0) {
      setSelectedWeekIds(weekIdsFromSessions as string[]);
      setSelectedSessionIds(currentSessionIds);
    } else {
      setSelectedWeekIds(defaultWeek?.id ? [defaultWeek.id] : []);
      const defaultSession = defaultWeek?.sessions?.[0];
      setSelectedSessionIds(defaultSession?.id ? [defaultSession.id] : []);
    }

    // default player selection: single player or first player
    const defaultPlayerId = participant.players?.[0]?.id ?? "";
    setSelectedPlayerId(defaultPlayerId);
    setReason("");
  }, [open, participant, activeWeeks]);

  // no longer auto-syncing a single target week/session — selections are across all active weeks

  const resetForm = () => {
    setSelectedSessionIds([]);
    setSelectedPlayerId("");
    setTargetWeek("");
    setSelectedWeekIds([]);
    setReason("");
  };

  const toggleWeekSelection = (weekId: string) => {
    setSelectedWeekIds((current) => {
      const isSelected = current.includes(weekId);
      if (isSelected) {
        // remove week -> also remove any session ids belonging to this week
        const week = activeWeeks.find((w: any) => w.id === weekId);
        const weekSessionIds = (week?.sessions ?? []).map((s: any) => s.id);
        setSelectedSessionIds((sessions) =>
          sessions.filter((id) => !weekSessionIds.includes(id)),
        );
        return current.filter((id) => id !== weekId);
      }

      // add week -> add its first session id to selectedSessionIds
      const week = activeWeeks.find((w: any) => w.id === weekId);
      const firstSessionId = week?.sessions?.[0]?.id;
      if (firstSessionId)
        setSelectedSessionIds((s) =>
          Array.from(new Set([...s, firstSessionId])),
        );
      return [...current, weekId];
    });
  };

  const handleClose = () => {
    if (isMoving) return;
    resetForm();
    onOpenChange(false);
  };

  const handleMove = async () => {
    const targetId = selectedPlayerId || participant?.id;
    if (!targetId || selectedSessionIds.length === 0 || !reason.trim()) {
      return;
    }

    try {
      // payload supports an array of session ids and a reason
      const payload: any = {
        reason: reason.trim(),
        toSessionIds: selectedSessionIds,
      };

      // send player id in the URL when a single player is selected, otherwise fall back to participant id
      const response = await moveSessionPlayer({
        id: targetId ?? "",
        payload,
      }).unwrap();

      resetForm();
      onOpenChange(false);
      onSuccess?.();

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: response?.message || "Player session moved successfully.",
        confirmButtonColor: "#35BACB",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.data?.message ||
          error?.message ||
          "Failed to move player session.",
        confirmButtonColor: "#35BACB",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      {/* ✅ FIX: Added flex flex-col so header/body/footer stack correctly inside the bounded height */}
      <DialogContent className="flex flex-col w-[min(1200px,95vw)] max-h-[90vh] border border-[#1D2A45] bg-[#06090F] p-0 text-white">
        {/* ✅ FIX: Added shrink-0 so the header never gets squished */}
        <DialogHeader className="shrink-0 border-b border-[#14203A] px-6 py-4 text-left">
          <DialogTitle className="text-5xl font-bold uppercase tracking-wide text-[#EAF0FA]">
            Move Player Session
          </DialogTitle>

          <DialogDescription className="text-sm text-[#A5AFC0]">
            Select an active week and session for this player.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ FIX: Removed fixed max-h here — flex-1 + overflow-y-auto handles scrolling within the flex container */}
        <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4">
          <div className="rounded-lg border border-[#2A313F] bg-[#171B24] p-3">
            <p className="text-xs text-[#9FA9BE]">Registration</p>

            <p className="text-2xl font-bold text-[#ECF2FF]">
              {participant?.parentName ?? "N/A"}
            </p>

            <p className="mt-1 text-sm text-[#9FA9BE]">
              {participant?.numberOfKids ?? participant?.players?.length ?? 0}{" "}
              kid
              {(participant?.numberOfKids ??
                participant?.players?.length ??
                0) === 1
                ? ""
                : "s"}{" "}
              • {participant?.numberOfWeeks ?? 0} week
              {participant?.numberOfWeeks === 1 ? "" : "s"}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {participant?.players?.map((player) => (
                <span
                  key={`${player.playerName}-${player.dateOfBirth}`}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[#DCE2F1]"
                >
                  {player.playerName}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <p className="text-sm text-[#9FA9BE]">
                Current Registered Sessions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {registeredSessions.length > 0 ? (
                  registeredSessions.map((rs) => (
                    <span
                      key={rs.id}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[#DCE2F1]"
                    >
                      {rs.info
                        ? `Week ${rs.info.weekNumber} · ${rs.info.title} (${rs.info.sessionType})`
                        : rs.id}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#9FA9BE]">
                    No registered sessions found
                  </span>
                )}
              </div>
            </div>
            {/* player selection for sibling registrations */}
            <div className="mt-3">
              <label className="mb-2 block text-sm text-[#B5BDD1]">
                Select Player to Move
              </label>

              <div className="flex flex-col gap-1">
                {participant?.players?.map((player) => (
                  <label
                    key={player.id}
                    className="inline-flex items-center gap-1"
                  >
                    <input
                      type="radio"
                      name="selectedPlayer"
                      value={player.id || ""}
                      checked={selectedPlayerId === player.id}
                      onChange={() =>
                        player.id && setSelectedPlayerId(player.id)
                      }
                      disabled={isMoving}
                      className="h-4 w-4"
                    />
                    <span className="text-xs text-[#DCE2F1]">
                      {player.playerName}
                    </span>
                    <span className="ml-2 text-xs text-[#7E889E]">
                      ({player.playerType.replace(/_/g, " ")})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#5F4306] bg-[#2B2108] px-3 py-2 text-[#E2B34A]">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">
              A mandatory reason note is required for audit logging
            </p>
          </div>

          <div className="space-y-4">
            <label className="mb-2 block text-sm text-[#B5BDD1]">
              Select Week(s)
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="mt-2 flex w-full h-10 items-center justify-between gap-3 rounded border border-white/15 bg-black px-3 py-1.5 text-left text-sm text-gray-100 outline-none transition-colors hover:border-cyan-300/50 focus:border-cyan-300"
                >
                  <span className="min-w-0 flex-1 truncate text-gray-100">
                    {selectedWeekIds.length > 0
                      ? activeWeeks
                          .filter((w: any) => selectedWeekIds.includes(w.id))
                          .map((w: any) => `Week ${w.weekNumber}`)
                          .join(", ")
                      : "Select one or more active weeks"}
                  </span>
                  <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-300">
                    {selectedWeekIds.length} selected
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[min(100vw-2rem,42rem)] border border-white/10 bg-[#101010] p-0 text-gray-100 shadow-2xl">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <DropdownMenuLabel className="p-0 text-sm font-semibold text-gray-100">
                      Active Weeks
                    </DropdownMenuLabel>
                    <p className="text-xs text-gray-400">
                      Select weeks to move this registration into.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWeekIds([]);
                      setSelectedSessionIds([]);
                    }}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    Clear all
                  </button>
                </div>

                <DropdownMenuSeparator className="mx-0 bg-white/10" />

                <div className="max-h-80 overflow-y-auto p-1">
                  {activeWeeks.map((week: any) => {
                    const session = week.sessions?.[0];
                    const isSelected = selectedWeekIds.includes(week.id);

                    return (
                      <DropdownMenuCheckboxItem
                        key={week.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleWeekSelection(week.id)}
                        className="rounded-md px-3 py-2 text-sm text-gray-100 data-[state=checked]:bg-cyan-300/10 data-[state=checked]:text-cyan-100"
                      >
                        <div className="flex w-full items-center justify-between gap-3 pr-4">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {activeSchedule?.scheduleName || "Camp"} - Week{" "}
                              {week.weekNumber}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {week.startDate
                                ? new Date(week.startDate).toLocaleDateString(undefined, { timeZone: "UTC" })
                                : ""}{" "}
                              -{" "}
                              {week.endDate
                                ? new Date(week.endDate).toLocaleDateString(undefined, { timeZone: "UTC" })
                                : ""}
                            </p>
                          </div>

                          <div className="shrink-0 text-right text-xs text-gray-400">
                            <p>{session?.sessionType || "AM"} session</p>
                            <p>Capacity {session?.capacity ?? 0}</p>
                          </div>
                        </div>
                      </DropdownMenuCheckboxItem>
                    );
                  })}

                  {!activeWeeks.length ? (
                    <p className="px-3 py-4 text-sm text-rose-300">
                      No active weeks found for current schedule.
                    </p>
                  ) : null}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-3">
              {selectedWeekIds.length === 1 ? (
                <div>
                  <label className="mb-2 block text-sm text-[#B5BDD1]">
                    Select Session(s) for Week
                  </label>
                  <div className="space-y-2 rounded-md border border-[#1D2C4A] bg-[#0A1630] p-3">
                    {(
                      activeWeeks.find((w: any) => w.id === selectedWeekIds[0])
                        ?.sessions ?? []
                    ).map((session: any) => (
                      <label
                        key={session.id}
                        className="inline-flex w-full items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSessionIds.includes(session.id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedSessionIds((s) =>
                                Array.from(new Set([...s, session.id])),
                              );
                            else
                              setSelectedSessionIds((s) =>
                                s.filter((id) => id !== session.id),
                              );
                          }}
                          disabled={isMoving}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="text-sm text-[#EDF3FF]">
                            {session.title}
                          </div>
                          <div className="text-xs text-[#7E889E]">
                            {session.sessionType} — {session.time}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#B5BDD1]">
              Reason for Move Required
            </label>

            <textarea
              value={reason}
              disabled={isMoving}
              onChange={(event) => setReason(event.target.value)}
              placeholder="e.g., Coach evaluation determined skill level better suited for advanced PM session"
              rows={4}
              className="w-full rounded-md border border-[#1D2C4A] bg-[#1A1E27] px-3 py-2 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1 text-xs text-[#7F8AA1]">
              This note will be recorded in the audit log with your admin ID and
              timestamp
            </p>
          </div>
        </div>

        {/* ✅ FIX: Added shrink-0 so the footer is always visible and never pushed out of view */}
        <DialogFooter className="shrink-0 border-t border-[#14203A] px-6 py-5 sm:justify-between">
          <button
            type="button"
            disabled={isMoving}
            onClick={handleClose}
            className="h-11 rounded-md bg-[#1B2A43] px-6 text-sm font-semibold text-[#D3DCEC] hover:bg-[#233451] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleMove}
            disabled={
              selectedSessionIds.length === 0 || !reason.trim() || isMoving
            }
            className="h-11 rounded-md bg-[#35BACB] px-10 text-sm font-bold text-[#041116] hover:bg-[#2EA8B7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMoving ? "Moving..." : "Move Player"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
