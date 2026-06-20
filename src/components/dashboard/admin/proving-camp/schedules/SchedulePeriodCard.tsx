import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { formatScheduleDate, getScheduleStats } from "./helpers";
import type { SchedulePeriod } from "./types";

type SchedulePeriodCardProps = {
  schedule: SchedulePeriod;
  isSelected?: boolean;
  onView: (schedule: SchedulePeriod) => void;
  onEdit: (schedule: SchedulePeriod) => void;
  onDelete: (schedule: SchedulePeriod) => void;
};

export default function SchedulePeriodCard({
  schedule,
  isSelected,
  onView,
  onEdit,
  onDelete,
}: SchedulePeriodCardProps) {
  const stats = getScheduleStats(schedule);

  const scheduleName =
    schedule.name || schedule.scheduleName || "Untitled Schedule";
  const season = schedule.season || "N/A";
  const startDate = formatScheduleDate(schedule.startDate);
  const endDate = formatScheduleDate(schedule.endDate);

  return (
    <article
      className={`rounded-xl border bg-[#151821] p-4 ${
        isSelected ? "border-[#00A94A]" : "border-[#2E3340]"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#35BACB]">
            {season}
          </p>
          <h3 className="mt-1 text-3xl font-bold text-[#EEF3FF]">
            {scheduleName}
          </h3>
          <p className="text-sm text-[#9099AD]">
            {startDate} - {endDate}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(schedule)}
            className="rounded bg-[#242A35] p-1.5 text-[#A8B0C4] hover:bg-[#2E3643]"
            aria-label={`Edit ${scheduleName}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(schedule)}
            className="rounded bg-[#242A35] p-1.5 text-[#FF5D5D] hover:bg-[#342325]"
            aria-label={`Delete ${scheduleName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1 text-sm text-[#A8B0C4]">
        <div className="flex items-center justify-between">
          <span>Total Weeks</span>
          <span className="font-semibold text-[#D7DDED]">
            {stats.totalWeeks}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Enrollment</span>
          <span className="font-semibold text-[#D7DDED]">
            {stats.totalEnrollment}/{stats.totalCapacity}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Fill Rate</span>
          <span className="font-semibold text-[#D7DDED]">
            {stats.fillRate}%
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded bg-[#273041]">
        <div
          className="h-full bg-[#35BACB]"
          style={{ width: `${Math.min(stats.fillRate, 100)}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => onView(schedule)}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#35BACB] hover:text-[#5FD6E4]"
      >
        View Schedule
        <ChevronRight className="h-4 w-4" />
      </button>
    </article>
  );
}
