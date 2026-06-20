/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SchedulePeriod, SchedulePeriodInput, Season } from "./types";

const seasons: Season[] = ["Winter", "Spring", "Summer", "Fall"];

type SchedulePeriodDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  schedule: SchedulePeriod | null;
  onOpenChange: (open: boolean) => void;
  onSave: (input: SchedulePeriodInput) => void | Promise<void>;
  isSubmitting?: boolean;
};

type WeekRangeForm = {
  startDate: string;
  endDate: string;
};

function buildEmptyRanges(count: number): WeekRangeForm[] {
  return Array.from({ length: count }, () => ({
    startDate: "",
    endDate: "",
  }));
}

function normalizeDate(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default function SchedulePeriodDialog({
  open,
  mode,
  schedule,
  onOpenChange,
  onSave,
  isSubmitting = false,
}: SchedulePeriodDialogProps) {
  const [name, setName] = useState("");
  const [season, setSeason] = useState<Season>("Summer");
  const [weekCount, setWeekCount] = useState("9");
  const [ranges, setRanges] = useState<WeekRangeForm[]>(buildEmptyRanges(9));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");

    if (!schedule) {
      setName("");
      setSeason("Summer");
      setWeekCount("9");
      setRanges(buildEmptyRanges(9));
      return;
    }

    setName(schedule.name);
    setSeason(schedule.season);
    setWeekCount(String(schedule.weeks.length || schedule.numberOfWeek || 1));

    setRanges(
      (schedule.weeks ?? []).map((week) => ({
        startDate: normalizeDate(week.startDate) || "",
        endDate: normalizeDate(week.endDate) || "",
      })),
    );
  }, [open, schedule]);

  const title =
    mode === "create" ? "Create New Schedule Period" : "Edit Schedule Period";

  const normalizedWeekCount = useMemo(() => {
    const count = Number.parseInt(weekCount, 10);
    if (Number.isNaN(count) || count < 1) return 1;
    return Math.min(count, 16);
  }, [weekCount]);

  useEffect(() => {
    setRanges((prev) => {
      if (prev.length === normalizedWeekCount) return prev;

      if (prev.length > normalizedWeekCount) {
        return prev.slice(0, normalizedWeekCount);
      }

      return [...prev, ...buildEmptyRanges(normalizedWeekCount - prev.length)];
    });
  }, [normalizedWeekCount]);

  const updateRange = (
    index: number,
    field: keyof WeekRangeForm,
    value: string,
  ) => {
    setRanges((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = async () => {
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Schedule name is required.");
      return;
    }

    const hasInvalidRange = ranges.some(
      (item) =>
        !item.startDate || !item.endDate || item.startDate > item.endDate,
    );

    if (hasInvalidRange) {
      setError("Please select valid start and end dates for all weeks.");
      return;
    }

    try {
      await onSave({
        name: trimmedName,
        season,
        weekRanges: ranges.map((item) => ({
          startDate: item.startDate,
          endDate: item.endDate,
        })),
      });
    } catch {
      // parent handles API errors
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border border-[#1D2A45] bg-[#06090F] p-0 text-white">
        <DialogHeader className="border-b border-[#14203A] px-6 py-5 text-left">
          <DialogTitle className="text-4xl font-bold uppercase tracking-wide text-[#EAF0FA]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A5AFC0]">
            Enter the details to {mode === "create" ? "create" : "edit"}{" "}
            schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm text-[#B5BDD1]">
              Schedule Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g., Summer 2026 Camp"
              className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
            />
          </div>

          <div>
            <p className="mb-2 block text-sm text-[#B5BDD1]">Season</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {seasons.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSeason(item)}
                  className={`h-10 rounded-md text-sm font-semibold ${
                    season === item
                      ? "bg-[#35BACB] text-[#061014]"
                      : "bg-[#0B1A34] text-[#B6BED0] hover:bg-[#142744]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#B5BDD1]">
              Number of week
            </label>
            <input
              type="number"
              min={1}
              max={16}
              value={weekCount}
              onChange={(event) => setWeekCount(event.target.value)}
              placeholder="e.g., 9"
              className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {ranges.map((range, index) => (
              <div
                key={`range-${index}`}
                className="grid gap-3 sm:col-span-2 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-1 block text-xs text-[#A8B1C6]">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Week {index + 1} Start Date
                    </span>
                  </label>
                  <input
                    type="date"
                    value={range.startDate}
                    onChange={(event) =>
                      updateRange(index, "startDate", event.target.value)
                    }
                    className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[#A8B1C6]">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Week {index + 1} End Date
                    </span>
                  </label>
                  <input
                    type="date"
                    value={range.endDate}
                    min={range.startDate || undefined}
                    onChange={(event) =>
                      updateRange(index, "endDate", event.target.value)
                    }
                    className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[#14203A] px-6 py-5 sm:justify-between">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-11 rounded-md bg-[#1B2A43] px-6 text-sm font-semibold text-[#D3DCEC] hover:bg-[#233451] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="h-11 rounded-md bg-[#35BACB] px-10 text-sm font-bold text-[#041116] hover:bg-[#2EA8B7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Schedule"
                : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
