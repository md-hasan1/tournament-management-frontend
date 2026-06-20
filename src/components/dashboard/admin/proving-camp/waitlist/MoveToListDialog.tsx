/* eslint-disable react-hooks/set-state-in-effect */
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
import { useGetAllSchedulesQuery } from "@/redux/apiHooks/camp/campApi";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WaitlistEntry } from "./types";

interface MoveToListDialogProps {
  open: boolean;
  entry: WaitlistEntry | null;
  isMoving?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { toSessionIds: string[] }) => void;
}

function getAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export default function MoveToListDialog({
  open,
  entry,
  isMoving = false,
  onOpenChange,
  onConfirm,
}: MoveToListDialogProps) {
  const [selectedWeekIds, setSelectedWeekIds] = useState<string[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: sessionData } = useGetAllSchedulesQuery({
    limit: 100,
    page: 1,
  });

  const activeWeeks = useMemo(() => {
    return (sessionData?.data || [])
      .filter((schedule: any) => schedule.status === "ACTIVE")
      .flatMap((schedule: any) =>
        (schedule.weeks || [])
          .filter((week: any) => week.status === "ACTIVE")
          .map((week: any) => ({
            ...week,
            scheduleName: schedule.scheduleName,
          })),
      );
  }, [sessionData]);

  const sessionsByWeek = useMemo(() => {
    const result: Record<string, any[]> = {};
    activeWeeks.forEach((week: any) => {
      result[week.id] = (week.sessions || []).filter(
        (session: any) =>
          session.status === undefined || session.status === "ACTIVE",
      );
    });
    return result;
  }, [activeWeeks]);

  useEffect(() => {
    if (!open) return;
    setSelectedWeekIds([]);
    setSelectedSessionIds([]);
    setDropdownOpen(false);
  }, [open, entry]);

  useEffect(() => {
    const allSessionIds = selectedWeekIds.flatMap((weekId) =>
      (sessionsByWeek[weekId] || []).map((s: any) => s.id),
    );
    setSelectedSessionIds(allSessionIds);
  }, [selectedWeekIds, sessionsByWeek]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWeekToggle = (weekId: string) => {
    setSelectedWeekIds((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId],
    );
  };

  const handleRemoveWeek = (weekId: string) => {
    setSelectedWeekIds((prev) => prev.filter((id) => id !== weekId));
  };

  const selectedWeeks = useMemo(
    () => activeWeeks.filter((w: any) => selectedWeekIds.includes(w.id)),
    [activeWeeks, selectedWeekIds],
  );

  const handleConfirm = () => {
    if (selectedSessionIds.length === 0 || isMoving) return;
    onConfirm({ toSessionIds: selectedSessionIds });
  };

  const getDropdownLabel = () => {
    if (selectedWeekIds.length === 0) return null;
    if (selectedWeekIds.length === 1) {
      const w = activeWeeks.find((w: any) => w.id === selectedWeekIds[0]);
      return w ? `${w.scheduleName} — Week ${w.weekNumber}` : "1 week selected";
    }
    return `${selectedWeekIds.length} weeks selected`;
  };

  const dropdownLabel = getDropdownLabel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl border border-[#1D2A45] bg-[#06090F] p-0 text-white">
        <DialogHeader className="border-b border-[#14203A] px-6 py-5 text-left">
          <DialogTitle className="text-3xl font-bold uppercase tracking-wide text-[#EAF0FA] md:text-4xl">
            Move To Participant List
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A5AFC0]">
            Confirm player transfer from waitlist to active participant list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          {/* Multi-select week dropdown */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#B5BDD1]">
              Select Week
            </label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => !isMoving && setDropdownOpen((v) => !v)}
                disabled={isMoving}
                className="flex h-11 w-full items-center justify-between rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm outline-none focus:border-[#35BACB] disabled:opacity-50"
              >
                <span
                  className={
                    dropdownLabel ? "text-[#EDF3FF]" : "text-[#7F899F]"
                  }
                >
                  {dropdownLabel ?? "Select week from schedule"}
                </span>
                <svg
                  className={`h-4 w-4 text-[#7F899F] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-[#1D2C4A] bg-[#0A1630] shadow-xl">
                  {activeWeeks.length === 0 ? (
                    <div className="px-3 py-2.5 text-sm text-[#7F899F]">
                      No active weeks available
                    </div>
                  ) : (
                    activeWeeks.map((week: any) => {
                      const isSelected = selectedWeekIds.includes(week.id);
                      return (
                        <div
                          key={week.id}
                          onClick={() => handleWeekToggle(week.id)}
                          className={`flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-[#0D2233] ${
                            isSelected
                              ? "bg-[#0D2233] text-[#35BACB]"
                              : "text-[#EDF3FF]"
                          }`}
                        >
                          <span>
                            {`${week.scheduleName} — Week ${week.weekNumber}`}
                            <span className="ml-2 text-xs text-[#7F899F]">
                              {`(${new Date(week.startDate).toLocaleDateString(undefined, { timeZone: "UTC" })} – ${new Date(week.endDate).toLocaleDateString(undefined, { timeZone: "UTC" })})`}
                            </span>
                          </span>
                          {isSelected && (
                            <svg
                              className="ml-3 h-4 w-4 shrink-0 text-[#35BACB]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Selected week tags */}
            {selectedWeeks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedWeeks.map((week: any) => (
                  <span
                    key={week.id}
                    className="flex items-center gap-1.5 rounded-full border border-[#35BACB44] bg-[#0D2233] px-3 py-1 text-xs text-[#35BACB]"
                  >
                    {`${week.scheduleName} — Week ${week.weekNumber}`}
                    <button
                      type="button"
                      onClick={() => handleRemoveWeek(week.id)}
                      disabled={isMoving}
                      className="opacity-60 hover:opacity-100 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Registration info */}
          <div className="rounded-lg border border-[#2A313F] bg-[#171B24] p-4">
            <p className="text-sm text-[#9FA9BE]">Registration</p>
            <p className="text-xl font-bold text-[#ECF2FF] md:text-2xl">
              {entry?.parentName}
            </p>
            <p className="text-sm text-[#9FA9BE]">
              {entry?.players && entry.players.length > 0
                ? `${entry.players.map((p) => p.playerName).join(", ")} - Age ${getAge(entry.players[0].dateOfBirth)}`
                : "N/A"}
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-[#14203A] px-6 py-5 sm:justify-between">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md bg-[#1B2A43] px-6 text-sm font-semibold text-[#D3DCEC] hover:bg-[#233451]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-md bg-[#35BACB] px-10 text-sm font-bold text-[#041116] hover:bg-[#2EA8B7] disabled:opacity-50"
            disabled={isMoving || selectedSessionIds.length === 0}
          >
            {selectedSessionIds.length === 0
              ? "Select Week"
              : `Move To List (${selectedSessionIds.length})`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
