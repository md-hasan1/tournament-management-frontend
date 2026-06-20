/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllSchedulesQuery } from "@/redux/apiHooks/camp/campApi";
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useUpdateScheduleMutation,
} from "@/redux/apiHooks/camp/scheduleApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import SchedulePeriodCard from "./schedules/SchedulePeriodCard";
import SchedulePeriodDialog from "./schedules/SchedulePeriodDialog";
import ScheduleWeekCard from "./schedules/ScheduleWeekCard";
import type {
  BackendSeason,
  ScheduleApiPayload,
  SchedulePeriod,
  SchedulePeriodInput,
  Season,
} from "./schedules/types";
import SchedulePeriodCardSkeleton from "./schedules/SchedulePeriodCardSkeleton";

type SchedulesView = "list" | "detail";

function mapSeasonToBackend(season: string): BackendSeason {
  switch (season.toUpperCase()) {
    case "WINTER":
      return "WINTER";
    case "SPRING":
      return "SPRING";
    case "SUMMER":
      return "SUMMER";
    case "FALL":
      return "FALL";
    default:
      return "SUMMER";
  }
}

function mapBackendSeasonToUi(season?: string): Season {
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
      return "Summer";
  }
}

function buildSchedulePayload(input: SchedulePeriodInput): ScheduleApiPayload {
  return {
    scheduleName: input.name.trim(),
    season: mapSeasonToBackend(input.season),
    numberOfWeek: input.weekRanges.length,
    weeks: input.weekRanges.map((week, index) => ({
      weekNumber: index + 1,
      startDate: week.startDate,
      endDate: week.endDate,
    })),
  };
}

function normalizeSchedules(data: any): SchedulePeriod[] {
  const apiSchedules = data?.data ?? [];

  return apiSchedules.map((item: any) => ({
    id: item.id,
    name: item.scheduleName,
    scheduleName: item.scheduleName,
    season: mapBackendSeasonToUi(item.season),
    backendSeason: item.season,
    numberOfWeek: item.numberOfWeek,
    totalWeeks: item.totalWeeks,
    totalEnrollment: item.totalEnrollment,
    totalCapacity: item.totalCapacity,
    fillRate: item.fillRate,
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
      })),
    })),
  }));
}

export default function ProvingCampSchedulesPage({
  scheduleId,
}: {
  scheduleId?: string;
}) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const { data, isLoading, isError, isFetching } = useGetAllSchedulesQuery({
    limit,
    page,
  });

  const [createSchedule, { isLoading: isCreating }] =
    useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: isDeleting }] =
    useDeleteScheduleMutation();

  const schedules = useMemo<SchedulePeriod[]>(() => {
    return normalizeSchedules(data);
  }, [data]);

  const totalItems = data?.meta?.total ?? 0;
  const totalPages =
    data?.meta?.totalPages ?? Math.max(1, Math.ceil(totalItems / limit));

  const [view, setView] = useState<SchedulesView>(
    scheduleId ? "detail" : "list",
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState(
    scheduleId ?? "",
  );

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleDialogMode, setScheduleDialogMode] = useState<
    "create" | "edit"
  >("create");
  const [editingSchedule, setEditingSchedule] = useState<SchedulePeriod | null>(
    null,
  );
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!selectedScheduleId && schedules.length > 0) {
      setSelectedScheduleId(schedules[0].id);
    }
  }, [schedules, selectedScheduleId]);

  const selectedSchedule =
    schedules.find((schedule) => schedule.id === selectedScheduleId) ??
    schedules[0] ??
    null;

  const visiblePageNumbers = useMemo(() => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    const pages: number[] = [];
    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const handleOpenCreateSchedule = () => {
    setSubmitError("");
    setScheduleDialogMode("create");
    setEditingSchedule(null);
    setIsScheduleDialogOpen(true);
  };

  const handleOpenEditSchedule = (schedule: SchedulePeriod) => {
    setSubmitError("");
    setScheduleDialogMode("edit");
    setEditingSchedule(schedule);
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = async (input: SchedulePeriodInput) => {
    try {
      setSubmitError("");
      const payload = buildSchedulePayload(input);

      if (scheduleDialogMode === "create") {
        await createSchedule({ data: payload }).unwrap();
      } else if (scheduleDialogMode === "edit" && editingSchedule?.id) {
        await updateSchedule({
          id: editingSchedule.id,
          data: payload,
        }).unwrap();
      }

      setIsScheduleDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to save schedule:", error);
      setSubmitError(
        error?.data?.message || "Failed to save schedule. Please try again.",
      );
    }
  };

  const handleDeleteSchedule = async (schedule: SchedulePeriod) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete "${schedule.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setSubmitError("");

      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await deleteSchedule(schedule.id).unwrap();

      Swal.fire({
        title: "Deleted!",
        text: "Schedule has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (selectedScheduleId === schedule.id) {
        setSelectedScheduleId("");
        setView("list");
      }
    } catch (error: any) {
      console.error("Failed to delete schedule:", error);

      Swal.fire({
        title: "Error!",
        text:
          error?.data?.message ||
          "Failed to delete schedule. Please try again.",
        icon: "error",
      });

      setSubmitError(
        error?.data?.message || "Failed to delete schedule. Please try again.",
      );
    }
  };

  const handleViewSchedule = (schedule: SchedulePeriod) => {
    setSelectedScheduleId(schedule.id);
    setView("detail");
    router.push(`/dashboard/admin/proving-camp/schedules/${schedule.id}`);
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return (
    <section className="min-h-screen bg-[#090B10] p-5 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold uppercase tracking-wide text-[#F2F4F8]">
            Schedules
          </h1>
          <p className="mt-1 text-xl text-[#8D93A6]">
            Manage all schedule from dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateSchedule}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#35BACB] px-5 font-bold text-[#061014] hover:bg-[#2FAABA]"
        >
          <Plus className="h-4 w-4" />
          Create Schedule
        </button>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SchedulePeriodCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          Failed to load schedules.
        </div>
      )}

      {!isLoading && !isError && view === "list" && (
        <>
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#1E293B] bg-[#0F172A] p-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-[#94A3B8]">
              Showing page{" "}
              <span className="font-semibold text-white">{page}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span> ·
              Total schedules:{" "}
              <span className="font-semibold text-white">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-[#94A3B8]">Per page</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-[#334155] bg-[#111827] px-3 py-2 text-sm text-white outline-none"
              >
                {[6, 9, 12, 18, 24].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <SchedulePeriodCard
                  key={schedule.id}
                  schedule={schedule}
                  isSelected={selectedScheduleId === schedule.id}
                  onView={handleViewSchedule}
                  onEdit={handleOpenEditSchedule}
                  onDelete={handleDeleteSchedule}
                />
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-[#1F2937] bg-[#111827] p-6 text-sm text-[#9CA3AF]">
                No schedules found.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#1E293B] bg-[#0F172A] p-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-[#94A3B8]">
                {isFetching ? "Updating page..." : `Current page: ${page}`}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-lg border border-[#334155] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {page > 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      className="rounded-lg border border-[#334155] px-3 py-2 text-sm text-white"
                    >
                      1
                    </button>
                    {page > 4 && (
                      <span className="px-1 text-sm text-[#64748B]">...</span>
                    )}
                  </>
                )}

                {visiblePageNumbers.map((pageNumber) => {
                  const isActive = pageNumber === page;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-[#35BACB] text-[#061014]"
                          : "border border-[#334155] text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {page < totalPages - 2 && (
                  <>
                    {page < totalPages - 3 && (
                      <span className="px-1 text-sm text-[#64748B]">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className="rounded-lg border border-[#334155] px-3 py-2 text-sm text-white"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="rounded-lg border border-[#334155] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!isLoading && !isError && view === "detail" && selectedSchedule && (
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setView("list")}
              className="rounded-lg bg-[#2B394F] px-4 py-2 text-sm font-semibold text-[#D7DEEE]"
            >
              {selectedSchedule.name}
            </button>

            <span className="text-xs text-[#8C97AE]">
              {selectedSchedule.weeks.length} weeks - {selectedSchedule.season}
            </span>
          </div>

          <div className="space-y-3">
            {selectedSchedule.weeks.map((week) => (
              <ScheduleWeekCard key={week.id} week={week} />
            ))}
          </div>
        </div>
      )}

      <SchedulePeriodDialog
        open={isScheduleDialogOpen}
        mode={scheduleDialogMode}
        schedule={editingSchedule}
        onOpenChange={setIsScheduleDialogOpen}
        onSave={handleSaveSchedule}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}

ProvingCampSchedulesPage.defaultProps = {
  scheduleId: undefined,
};
