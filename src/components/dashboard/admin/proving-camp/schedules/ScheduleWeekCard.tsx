import { Pencil } from "lucide-react";
import {
  formatScheduleDate,
  getSessionByType,
  getWeekSessionAvailability,
} from "./helpers";
import type { ScheduleWeek } from "./types";

type ScheduleWeekCardProps = {
  week: ScheduleWeek;
  onEditCapacity?: (week: ScheduleWeek) => void;
};

type SessionWithAge = {
  minAge?: number;
  maxAge?: number;
  totalRegistered?: number;
  capacity?: number;
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

function SessionBar({
  enrolled,
  capacity,
  availability,
}: {
  enrolled: number;
  capacity: number;
  availability: string;
}) {
  const progress = capacity > 0 ? (enrolled / capacity) * 100 : 0;
  const isFull = enrolled >= capacity;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className="text-[#DCE4F4]">
          {enrolled}/{capacity} enrolled
        </p>
        <p className="text-[#9AA4BA]">{availability}</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#273041]">
        <div
          className={`h-full rounded-full ${isFull ? "bg-[#FF2D55]" : "bg-[#35BACB]"}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ScheduleWeekCard({
  week,
  onEditCapacity,
}: ScheduleWeekCardProps) {
  const amSession = getSessionByType(week, "AM") as SessionWithAge | undefined;
  const pmSession = getSessionByType(week, "PM") as SessionWithAge | undefined;
  const hasPmSession = Boolean(pmSession);

  const dateLabel = `${formatScheduleDate(week.startDate)} - ${formatScheduleDate(
    week.endDate,
  )}`;

  return (
    <article className="rounded-2xl border border-[#2A2F3C] bg-linear-to-br from-[#171B26] via-[#141820] to-[#11141A] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <h3 className="text-xl font-bold text-[#EEF3FF] sm:text-2xl">
              {week.title || `Week ${week.weekNumber}`}
            </h3>
            <span className="rounded-full border border-[#2E3646] bg-[#1B2230] px-2.5 py-1 text-xs font-medium text-[#9AA4BA]">
              {dateLabel}
            </span>
            <span className="rounded-full bg-[#0D3A1F] px-2.5 py-1 text-xs font-semibold text-[#3ADF78]">
              {week.status}
            </span>
          </div>

          <p className="text-xs text-[#8E97AD]">
            {hasPmSession ? "AM and PM sessions configured" : "AM session only"}
          </p>
        </div>

        {onEditCapacity && (
          <button
            type="button"
            onClick={() => onEditCapacity(week)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#324055] bg-[#202634] px-3.5 text-xs font-semibold text-[#D8E0F0] transition-colors hover:border-[#41516A] hover:bg-[#262D3D]"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Capacity
          </button>
        )}
      </div>

      <div
        className={`grid gap-3 ${hasPmSession ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        <div className="rounded-xl border border-[#283142] bg-[#1A202B] p-4 ring-1 ring-white/5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[#EEF3FF]">
                AM Session (
                {buildAgeLabel(amSession?.minAge, amSession?.maxAge)})
              </p>
              <p className="text-xs text-[#8E97AD]">Morning training block</p>
            </div>
            <span className="rounded-full bg-[#0E2530] px-2 py-1 text-[11px] font-semibold text-[#4FD5E6]">
              Active
            </span>
          </div>

          <SessionBar
            enrolled={amSession?.totalRegistered ?? 0}
            capacity={amSession?.capacity ?? 0}
            availability={getWeekSessionAvailability(week, "am")}
          />
        </div>

        {hasPmSession && (
          <div className="rounded-xl border border-[#283142] bg-[#1A202B] p-4 ring-1 ring-white/5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#EEF3FF]">
                  PM Session (
                  {buildAgeLabel(pmSession?.minAge, pmSession?.maxAge)})
                </p>
                <p className="text-xs text-[#8E97AD]">
                  Afternoon training block
                </p>
              </div>
              <span className="rounded-full bg-[#2A1C2A] px-2 py-1 text-[11px] font-semibold text-[#F0A6D0]">
                Optional
              </span>
            </div>

            <SessionBar
              enrolled={pmSession?.totalRegistered ?? 0}
              capacity={pmSession?.capacity ?? 0}
              availability={getWeekSessionAvailability(week, "pm")}
            />
          </div>
        )}
      </div>
    </article>
  );
}
