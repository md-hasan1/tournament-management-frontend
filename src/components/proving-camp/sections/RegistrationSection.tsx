/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SectionHeading from "@/components/proving-camp/sections/SectionHeading";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCampRegistrationMutation,
  useGetAllSchedulesQuery,
  useWaitlistRegistrationMutation,
} from "@/redux/apiHooks/camp/campApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";

type PlayerFormValues = {
  playerName: string;
  dateOfBirth: string;
  playerType: string;
  shirtSize: string;
};

type RegistrationFormValues = {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  players: PlayerFormValues[];
};

interface ScheduleData {
  id: string;
  scheduleName: string;
  season: "SUMMER" | "FALL" | "WINTER" | "SPRING";
  status: "ACTIVE" | "INACTIVE";
  weeks: any[];
}

interface RegistrationSectionProps {
  scheduleData?: ScheduleData | null;
}

const playerTypeOptions = [
  { label: "Field Player", value: "FIELD_PLAYER" },
  { label: "Goalkeeper", value: "GOALIE" },
];

const shirtSizeOptions = ["YS", "YM", "YL", "YXL", "XS", "S", "M", "L", "XL"];

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, { timeZone: "UTC" });
}

function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return 0;

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

function normalizeDob(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export default function RegistrationSection({
  scheduleData,
}: RegistrationSectionProps) {
  const router = useRouter();
  const { data: currentCamp } = useGetAllSchedulesQuery({
    limit: 100000,
    page: 1,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      players: [
        {
          playerName: "",
          dateOfBirth: "",
          playerType: "",
          shirtSize: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  const [makeRegistration, { isLoading: isRegistering }] =
    useCampRegistrationMutation();
  const [waitlistRegistration] = useWaitlistRegistrationMutation();
  const [selectedSchedulePeriodId, setSelectedSchedulePeriodId] = useState("");
  const [selectedWeekIds, setSelectedWeekIds] = useState<string[]>([]);

  const inputClassName =
    "mt-2 w-full rounded border border-white/15 bg-black px-3 py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-cyan-300";

  const activeSchedules = useMemo(() => {
    if (!Array.isArray(currentCamp?.data)) return [];

    return currentCamp.data.filter((season: any) => season.status === "ACTIVE");
  }, [currentCamp]);

  const selectedSchedule = useMemo(() => {
    if (!activeSchedules.length) return null;

    return (
      activeSchedules.find(
        (season: any) => season.id === selectedSchedulePeriodId,
      ) || activeSchedules[0]
    );
  }, [activeSchedules, selectedSchedulePeriodId]);

  const activeWeeks = useMemo(() => {
    return (
      selectedSchedule?.weeks?.filter(
        (week: any) => week.status === "ACTIVE",
      ) || []
    );
  }, [selectedSchedule]);

  useEffect(() => {
    if (!activeSchedules.length) return;

    const scheduleStillExists = activeSchedules.some(
      (season: any) => season.id === selectedSchedulePeriodId,
    );

    if (!selectedSchedulePeriodId || !scheduleStillExists) {
      setSelectedSchedulePeriodId(activeSchedules[0].id);
      setSelectedWeekIds([]);
    }
  }, [activeSchedules, selectedSchedulePeriodId]);

  useEffect(() => {
    setSelectedWeekIds([]);
  }, [selectedSchedulePeriodId]);

  const selectedKidCount = watch("players").length;
  const effectiveSchedulePeriodId =
    selectedSchedulePeriodId || selectedSchedule?.id || "";
  const numberOfWeeks = selectedWeekIds.length;
  const totalAmount = 225 * selectedKidCount * numberOfWeeks;
  const processingFee = totalAmount * 0.03;
  const finalAmount = totalAmount + processingFee;

  const selectedWeekLabels = activeWeeks
    .filter((week: any) => selectedWeekIds.includes(week.id))
    .map((week: any) => `Week ${week.weekNumber}`);

  const selectedWeekSummary =
    selectedWeekLabels.length > 0
      ? selectedWeekLabels.join(", ")
      : "Select one or more active weeks";

  const toggleWeekSelection = (weekId: string) => {
    setSelectedWeekIds((current) =>
      current.includes(weekId)
        ? current.filter((id) => id !== weekId)
        : [...current, weekId],
    );
  };

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!effectiveSchedulePeriodId) {
      toast.error("Please select an active camp first.");
      return;
    }

    if (!selectedWeekIds.length) {
      toast.error("Please select at least one active week.");
      return;
    }

    const selectedWeeks = activeWeeks.filter((week: any) =>
      selectedWeekIds.includes(week.id),
    );

    if (selectedWeeks.length !== selectedWeekIds.length) {
      toast.error("One or more selected weeks are no longer available.");
      return;
    }

    const scheduleSessionIds = selectedWeeks
      .map((week: any) => week.sessions?.[0]?.id)
      .filter(Boolean);

    if (scheduleSessionIds.length !== selectedWeeks.length) {
      toast.error("Each selected week must have a session available.");
      return;
    }

    const players = values.players.map((player) => {
      const age = calculateAge(player.dateOfBirth);

      if (age < 8 || age > 14) {
        throw new Error(
          `Player ${player.playerName || "entry"} must be between 8 and 14 years old.`,
        );
      }

      return {
        playerName: player.playerName.trim(),
        dateOfBirth: normalizeDob(player.dateOfBirth),
        playerType: player.playerType.trim().toUpperCase().replace(/\s+/g, "_"),
        shirtSize: player.shirtSize,
      };
    });

    const payload = {
      schedulePeriodId: effectiveSchedulePeriodId,
      // scheduleWeekId: selectedWeeks[0]?.id,
      scheduleSessionIds,
      players,
      parentName: values.parentName.trim(),
      parentPhone: values.parentPhone.trim(),
      parentEmail: values.parentEmail.trim(),
    };

    try {
      const response = await makeRegistration(payload);
      const registrationId = response?.data?.data?.id;

      if (!registrationId) {
        throw new Error("Registration failed: no registration ID returned.");
      }

      toast.success("Registration successful! Please proceed to payment.");
      setTimeout(() => {
        router.push(
          `/proving-camp/payment?registrationId=${registrationId}&amount=${finalAmount.toFixed(2)}`,
        );
      }, 2000);
    } catch (error) {
      console.error("Error occurred while registering:", error);

      try {
        const response = await waitlistRegistration(payload);
        if (response?.data?.success) {
          Swal.fire({
            icon: "info",
            title: "You are in waitlist",
            text: "We will get back to you soon.",
            confirmButtonColor: "#2fd2e5",
          });
          return;
        }
      } catch (waitlistError) {
        console.error("Waitlist registration failed:", waitlistError);
      }

      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <section
      id="registration"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <SectionHeading title="Registration" />

      <div className="mx-auto max-w-5xl space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-white/10 bg-[#161616] p-4 md:p-6"
        >
          <div className="space-y-4 rounded-lg border border-white/5 bg-white/5 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">
                  Choose a camp and active weeks
                </h3>
                <p className="text-xs text-gray-400">
                  Each selected week contains one available session.
                </p>
              </div>
            </div>

            <label className="text-sm text-gray-200">
              Active Camp <span className="text-cyan-300">*</span>
              {activeSchedules.length > 1 ? (
                <select
                  value={selectedSchedulePeriodId}
                  onChange={(event) =>
                    setSelectedSchedulePeriodId(event.target.value)
                  }
                  className={inputClassName}
                >
                  {activeSchedules.map((season: any) => (
                    <option key={season.id} value={season.id}>
                      {season.scheduleName} ({season.season})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="mt-2 rounded border border-white/15 bg-black px-3 py-2.5 text-sm text-gray-100">
                  {selectedSchedule?.scheduleName || "No active camp available"}
                </div>
              )}
            </label>

            <div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-gray-200">
                  Select Week(s) <span className="text-cyan-300">*</span>
                </p>

                <p className="text-xs text-gray-400">
                  Choose one or more active weeks from the dropdown
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="mt-2 flex w-full min-h-12 items-center justify-between gap-3 rounded border border-white/15 bg-black px-3 py-2.5 text-left text-sm text-gray-100 outline-none transition-colors hover:border-cyan-300/50 focus:border-cyan-300"
                  >
                    <span className="min-w-0 flex-1 truncate text-gray-100">
                      {selectedWeekSummary}
                    </span>
                    <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-gray-300">
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
                        Select as many weeks as needed for this registration.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedWeekIds([])}
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
                                {selectedSchedule?.scheduleName || "Camp"} -
                                Week {week.weekNumber}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-400">
                                {formatDateLabel(week.startDate)} -{" "}
                                {formatDateLabel(week.endDate)}
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
                        No active weeks found for the selected camp.
                      </p>
                    ) : null}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedWeekIds.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedWeekLabels.map((label: string) => (
                    <span
                      key={label}
                      className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}

              {!activeWeeks.length ? (
                <p className="mt-2 text-xs text-rose-300">
                  No active weeks found for the selected camp.
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-white/5 bg-white/5 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">
                  Player Details
                </h3>
                <p className="text-xs text-gray-400">
                  Add one or more kids to the same registration.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  append({
                    playerName: "",
                    dateOfBirth: "",
                    playerType: "",
                    shirtSize: "",
                  })
                }
                className="rounded-md border border-cyan-300/30 px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                Add Another Kid
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-white/10 bg-black/40 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-100">
                        Kid {index + 1}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Enter the child information for this registration.
                      </p>
                    </div>

                    {fields.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-xs font-semibold text-rose-300 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-gray-200">
                      Player Name <span className="text-cyan-300">*</span>
                      <input
                        {...register(`players.${index}.playerName`, {
                          required: "Player name is required.",
                        })}
                        className={inputClassName}
                        placeholder="Player's full name"
                      />
                      {errors.players?.[index]?.playerName ? (
                        <span className="mt-1 block text-xs text-rose-300">
                          {errors.players[index]?.playerName?.message}
                        </span>
                      ) : null}
                    </label>

                    <label className="block text-sm text-gray-200">
                      Select Date of Birth{" "}
                      <span className="text-cyan-300">*</span>
                      <input
                        {...register(`players.${index}.dateOfBirth`, {
                          required: "Date of birth is required.",
                          validate: (value) => {
                            const age = calculateAge(value);
                            return (
                              (age >= 8 && age <= 14) ||
                              "Player age must be between 8 and 14."
                            );
                          },
                        })}
                        type="date"
                        onClick={(event) => {
                          const target =
                            event.currentTarget as HTMLInputElement & {
                              showPicker?: () => void;
                            };

                          target.showPicker?.();
                        }}
                        className={`${inputClassName} cursor-pointer [color-scheme:dark]`}
                      />
                      <span className="mt-1 block text-xs text-gray-400">
                        Use the date picker to select the child&apos;s date of
                        birth.
                      </span>
                      {errors.players?.[index]?.dateOfBirth ? (
                        <span className="mt-1 block text-xs text-rose-300">
                          {errors.players[index]?.dateOfBirth?.message}
                        </span>
                      ) : null}
                    </label>

                    <label className="text-sm text-gray-200">
                      Player Type <span className="text-cyan-300">*</span>
                      <select
                        {...register(`players.${index}.playerType`, {
                          required: "Player type is required.",
                        })}
                        className={inputClassName}
                      >
                        <option value="">Select Here</option>
                        {playerTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.players?.[index]?.playerType ? (
                        <span className="mt-1 block text-xs text-rose-300">
                          {errors.players[index]?.playerType?.message}
                        </span>
                      ) : null}
                    </label>

                    <label className="text-sm text-gray-200">
                      T-Shirt Size <span className="text-cyan-300">*</span>
                      <select
                        {...register(`players.${index}.shirtSize`, {
                          required: "T-shirt size is required.",
                        })}
                        className={inputClassName}
                      >
                        <option value="">Select Here</option>
                        {shirtSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      {errors.players?.[index]?.shirtSize ? (
                        <span className="mt-1 block text-xs text-rose-300">
                          {errors.players[index]?.shirtSize?.message}
                        </span>
                      ) : null}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              Number of kids in this registration: {selectedKidCount}
            </p>
          </div>

          <div className="space-y-4 rounded-lg border border-white/5 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-gray-100">
              Parent / Guardian
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-200">
                Parent Name <span className="text-cyan-300">*</span>
                <input
                  {...register("parentName", { required: true })}
                  className={inputClassName}
                  placeholder="Parent full name"
                />
                {errors.parentName ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    Parent name is required.
                  </span>
                ) : null}
              </label>

              <label className="text-sm text-gray-200">
                Phone Number <span className="text-cyan-300">*</span>
                <input
                  {...register("parentPhone", { required: true })}
                  type="tel"
                  className={inputClassName}
                  placeholder="Write Here.."
                />
                {errors.parentPhone ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    Phone number is required.
                  </span>
                ) : null}
              </label>

              <label className="text-sm text-gray-200 md:col-span-2">
                Email Address <span className="text-cyan-300">*</span>
                <input
                  {...register("parentEmail", { required: true })}
                  type="email"
                  className={inputClassName}
                  placeholder="Write Here.."
                />
                {errors.parentEmail ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    Email address is required.
                  </span>
                ) : null}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full rounded bg-[#2fd2e5] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#5ce0ef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegistering
              ? "Registering..."
              : `Pay $${finalAmount.toFixed(2)} total ($${totalAmount.toFixed(2)} + 3% fee)`}
          </button>

          <p className="text-center text-xs text-gray-400">
            By submitting this form, you agree to our refund and cancellation
            policy. You will be asked to review and accept this policy before
            completing payment.
          </p>
        </form>
      </div>
    </section>
  );
}
