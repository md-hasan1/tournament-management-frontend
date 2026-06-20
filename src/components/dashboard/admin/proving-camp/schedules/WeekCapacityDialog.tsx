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
import { useEffect, useMemo, useState } from "react";
import type { ScheduleWeek } from "./types";

type WeekCapacityDialogProps = {
  open: boolean;
  week: ScheduleWeek | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: { capacity: number }) => void;
  isSubmitting?: boolean;
};

function buildAgeLabel(minAge?: number, maxAge?: number) {
  if (typeof minAge === "number" && typeof maxAge === "number") {
    return `Ages ${minAge}-${maxAge}`;
  }

  if (typeof minAge === "number") {
    return `Age ${minAge}+`;
  }

  return "Age not set";
}

export default function WeekCapacityDialog({
  open,
  week,
  onOpenChange,
  onSave,
  isSubmitting = false,
}: WeekCapacityDialogProps) {
  const [amCapacity, setAmCapacity] = useState("50");

  const amSession = useMemo(() => {
    return week?.sessions?.find((session: any) => session.sessionType === "AM");
  }, [week]);

  useEffect(() => {
    if (!open || !week) return;

    setAmCapacity(String(amSession?.capacity ?? 0));
  }, [open, week, amSession]);

  const handleSave = () => {
    if (!week) return;

    const nextAm = Math.max(
      Number.parseInt(amCapacity, 10) || 0,
      amSession?.totalRegistered ?? 0,
    );

    onSave({
      capacity: nextAm,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border border-[#1D2A45] bg-[#06090F] p-0 text-white">
        <DialogHeader className="border-b border-[#14203A] px-6 py-5 text-left">
          <DialogTitle className="text-4xl font-bold uppercase tracking-wide text-[#EAF0FA]">
            Edit Capacity - {week?.title ?? "Week"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A5AFC0]">
            Enter the details to edit capacity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm text-[#B5BDD1]">
              AM Session Capacity (
              {buildAgeLabel(amSession?.minAge, amSession?.maxAge)})
            </label>
            <input
              type="number"
              value={amCapacity}
              onChange={(event) => setAmCapacity(event.target.value)}
              className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
            />
            <p className="mt-1 text-xs text-[#98A3BA]">
              Current enrollment: {amSession?.totalRegistered ?? 0}
            </p>
          </div>

          {/**
           * PM capacity is intentionally disabled for the current schedule flow.
           *
           * <div>
           *   <label className="mb-2 block text-sm text-[#B5BDD1]">
           *     PM Session Capacity
           *   </label>
           *   <input type="number" />
           * </div>
           */}
        </div>

        <DialogFooter className="border-t border-[#14203A] px-6 py-5 sm:justify-between">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md bg-[#1B2A43] px-6 text-sm font-semibold text-[#D3DCEC] hover:bg-[#233451]"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-11 rounded-md bg-[#35BACB] px-10 text-sm font-bold text-[#041116] hover:bg-[#2EA8B7] disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
