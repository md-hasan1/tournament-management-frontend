/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useGetSingleScheduleQuery } from "@/redux/apiHooks/camp/campApi";
import { useUpdateCapacityMutation } from "@/redux/apiHooks/camp/scheduleApi";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import ParticipantsTable from "./ParticipantsTable";
import ScheduleWeekCard from "./ScheduleWeekCard";
import WeekCapacityDialog from "./WeekCapacityDialog";

function mapBackendSeasonToUi(season?: string) {
  switch ((season || "").toUpperCase()) {
    case "WINTER":
      return "Winter";
    case "SPRING":
      return "Spring";
    case "SUMMER":
      return "Summer";
    case "FALL":
      return "Fall";
    default:
      return "";
  }
}

function normalizeSingleSchedule(response: any) {
  const item = response?.data;

  if (!item) return null;

  return {
    id: item.id,
    name: item.scheduleName,
    scheduleName: item.scheduleName,
    season: mapBackendSeasonToUi(item.season),
    backendSeason: item.season,
    numberOfWeek: item.numberOfWeek,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status,
    isDeleted: item.isDeleted,
    createdById: item.createdById,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    weeks: (item.weeks ?? []).map((week: any) => ({
      id: week.id,
      schedulePeriodId: week.schedulePeriodId,
      weekNumber: week.weekNumber,
      title: `Week ${week.weekNumber}`,
      startDate: week.startDate,
      endDate: week.endDate,
      status: week.status,
      createdAt: week.createdAt,
      updatedAt: week.updatedAt,
      sessions: (week.sessions ?? []).map((session: any) => ({
        id: session.id,
        scheduleWeekId: session.scheduleWeekId,
        sessionType: session.sessionType,
        title: session.title,
        minAge: session.minAge,
        maxAge: session.maxAge,
        dropOffTime: session.dropOffTime,
        startTime: session.startTime,
        endTime: session.endTime,
        capacity: session.capacity,
        totalRegistered: session.totalRegistered,
        goalieSlots: session.goalieSlots,
        totalGoalieRegistered: session.totalGoalieRegistered,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        currentEnrollment: session.currentEnrollment,
        spotsAvailable: session.spotsAvailable,
      })),
    })),
  };
}

function ScheduleDetailSkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="h-8 w-56 animate-pulse rounded bg-[#1F2937]" />
        <div className="h-4 w-28 animate-pulse rounded bg-[#1F2937]" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#1F2937] bg-[#111827] p-5"
          >
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-[#1F2937]" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="h-24 animate-pulse rounded bg-[#1F2937]" />
              <div className="h-24 animate-pulse rounded bg-[#1F2937]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScheduleDetail() {
  const params = useParams();
  const scheduleId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false);
  const [activeWeek, setActiveWeek] = useState<any | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  const {
    data: singleSchedule,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSingleScheduleQuery(scheduleId as string, {
    skip: !scheduleId,
  });

  const [updateCapacity, { isLoading: isUpdatingCapacity }] =
    useUpdateCapacityMutation();

  const schedule = useMemo(() => {
    return normalizeSingleSchedule(singleSchedule);
  }, [singleSchedule]);

  const handleOpenWeekCapacity = (week: any) => {
    setActiveWeek(week);
    setIsCapacityDialogOpen(true);
  };

  const handleSaveWeekCapacity = async (payload: { capacity: number }) => {
    if (!activeWeek) return;

    try {
      await updateCapacity({
        id: activeWeek.id,
        data: { capacity: payload.capacity },
      }).unwrap();

      await refetch();

      setIsCapacityDialogOpen(false);
      setActiveWeek(null);
    } catch (error) {
      console.error("Failed to update capacity:", error);
    }
  };

  if (isLoading || isFetching) {
    return <ScheduleDetailSkeleton />;
  }

  if (isError || !schedule) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
        Failed to load schedule details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B10] p-5 lg:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#F2F4F8]">
          {showParticipants ? "Participants" : schedule.name}
        </h2>

        <div className="flex flex-col items-end gap-3">
          <span className="text-xs text-[#8C97AE]">
            {schedule.weeks.length} weeks
            {schedule.season ? ` - ${schedule.season}` : ""}
          </span>

          <Button onClick={() => setShowParticipants((prev) => !prev)}>
            {showParticipants ? "View Details" : "View Participants"}
          </Button>
        </div>
      </div>

      {showParticipants ? (
        <ParticipantsTable scheduleId={scheduleId as string} />
      ) : (
        <div className="space-y-3">
          {schedule.weeks.map((week: any) => (
            <ScheduleWeekCard
              key={week.id}
              week={week}
              onEditCapacity={handleOpenWeekCapacity}
            />
          ))}
        </div>
      )}

      <WeekCapacityDialog
        open={isCapacityDialogOpen}
        week={activeWeek}
        onOpenChange={(open) => {
          setIsCapacityDialogOpen(open);
          if (!open) setActiveWeek(null);
        }}
        onSave={handleSaveWeekCapacity}
        isSubmitting={isUpdatingCapacity}
      />
    </div>
  );
}
