/* eslint-disable @typescript-eslint/no-unused-vars */
import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  useCampRefundMutation,
  useGetAllSchedulesQuery,
  useGetPerticipantListQuery,
} from "@/redux/apiHooks/camp/campApi";
import MovePlayerDialog from "./MovePlayerDialog";

type ParticipantsTableProps = {
  scheduleId: string;
};

export type ApiParticipant = {
  id: string;
  schedulePeriodId: string;
  scheduleSessionIds: string[];
  numberOfKids: number;
  numberOfWeeks: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  processingFee?: number;
  totalAmount?: number;
  amount?: number;
  paymentStatus: string;
  status?: string;
  players: {
    id?: string;
    playerName: string;
    dateOfBirth: string;
    playerType: string;
    shirtSize: string;
  }[];
  scheduleWeek?: {
    id: string;
    weekNumber: number;
  };
  scheduleSession?: {
    id: string;
    sessionType: "AM" | "PM";
    title: string;
  };
};

const REFUND_PAYLOAD = {
  refundType: "REFUND",
  isCancelledByOrganization: true,
};

function SessionBadge({ session }: { session?: "AM" | "PM" }) {
  if (!session) return <span className="text-xs text-[#7E889E]">N/A</span>;

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
        session === "AM"
          ? "bg-[#0A2E5B] text-[#63B4FF]"
          : "bg-[#2D174B] text-[#C18EFF]"
      }`}
    >
      {session}
    </span>
  );
}

function getAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return "N/A";
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

function ChipList({
  items,
  emptyLabel = "N/A",
  compact = false,
}: {
  items: string[];
  emptyLabel?: string;
  compact?: boolean;
}) {
  if (!items.length) {
    return <span className="text-xs text-[#7E889E]">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-[#DCE2F1] ${
            compact ? "w-fit" : "w-full"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function PlayerGroupCell({ row }: { row: ApiParticipant }) {
  const isSiblingGroup = (row.numberOfKids ?? row.players?.length ?? 0) > 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#E8ECF7]">
          {isSiblingGroup ? "Sibling registration" : "Single registration"}
        </span>

        {isSiblingGroup ? (
          <span className="rounded-full bg-[#103B2B] px-2 py-0.5 text-[11px] font-semibold text-[#46D98A]">
            Sibling
          </span>
        ) : null}
      </div>

      <ChipList
        items={row.players?.map((player) => player.playerName) ?? []}
        emptyLabel={row.parentName}
      />

      <p className="text-xs text-[#7E889E]">
        {row.numberOfKids ?? row.players?.length ?? 0} kid
        {(row.numberOfKids ?? row.players?.length ?? 0) === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function PlayerDetailCell({
  row,
  field,
}: {
  row: ApiParticipant;
  field: "age" | "type" | "size";
}) {
  const values = (row.players ?? []).map((player) => {
    if (field === "age") return String(getAge(player.dateOfBirth));
    if (field === "type") return player.playerType.replace(/_/g, " ");
    return player.shirtSize;
  });

  return <ChipList items={values} compact />;
}

export default function ParticipantsTable({
  scheduleId,
}: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<ApiParticipant | null>(null);

  const [refundingId, setRefundingId] = useState<string | null>(null);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: perticipantListData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPerticipantListQuery(
    {
      schedulePeriodId: scheduleId,
      page,
      limit,
      searchTerm: debouncedSearchTerm,
    },
    { skip: !scheduleId },
  );

  const { data: schedulesData } = useGetAllSchedulesQuery(
    { limit: 100, page: 1 },
    { skip: false },
  );

  const findSessionInfo = (sessionId?: string) => {
    if (!sessionId) return null;
    const schedules = schedulesData?.data ?? [];

    for (const sched of schedules) {
      for (const week of sched.weeks ?? []) {
        for (const sess of week.sessions ?? []) {
          if (sess.id === sessionId) {
            return {
              weekNumber: week.weekNumber,
              title: sess.title,
              sessionType: sess.sessionType,
              scheduleName: sched.scheduleName,
              scheduleId: sched.id,
            };
          }
        }
      }
    }

    return null;
  };

  const [refund] = useCampRefundMutation();

  const rows: ApiParticipant[] = useMemo(() => {
    return perticipantListData?.data ?? [];
  }, [perticipantListData]);

  const total = perticipantListData?.meta?.total ?? 0;
  const currentPage = perticipantListData?.meta?.page ?? page;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const handleMove = (participant: ApiParticipant) => {
    setSelectedParticipant(participant);
    setMoveDialogOpen(true);
  };

  const handleRefund = async (participant: ApiParticipant) => {
    if (refundingId) return;

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Refund and cancel registration for ${participant.parentName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, refund it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      background: "#151821",
      color: "#E4EAF6",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setRefundingId(participant.id);

      Swal.fire({
        title: "Processing refund...",
        text: "Please wait.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: "#151821",
        color: "#E4EAF6",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await refund({
        id: participant.id,
        data: REFUND_PAYLOAD,
      }).unwrap();

      await refetch();

      await Swal.fire({
        title: "Refund completed",
        text: `${participant.parentName}'s registration has been refunded and cancelled.`,
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#151821",
        color: "#E4EAF6",
      });
    } catch (error) {
      console.error("Refund failed", error);

      await Swal.fire({
        title: "Refund failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#DC2626",
        background: "#151821",
        color: "#E4EAF6",
      });
    } finally {
      setRefundingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2B303C] bg-[#151821] p-5">
        <div className="mb-4 h-11 w-full animate-pulse rounded bg-[#1F2937]" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded bg-[#1F2937]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
        Failed to load participants.
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F899F]" />

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by player, parent, email, or phone..."
            className="h-11 w-full rounded-md border border-[#293142] bg-[#151821] pl-10 pr-3 text-sm text-[#E4EAF6] outline-none focus:border-[#35BACB]"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-20 items-center justify-center rounded-md border border-[#293142] bg-[#151821] text-[#8F99AF]"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2B303C] bg-[#151821]">
        <table className="w-full min-w-375 text-left text-sm">
          <thead className="border-b border-[#272C37] bg-[#1A1E27] text-xs uppercase tracking-wide text-[#9EA8BC]">
            <tr>
              <th className="px-4 py-3">Registration</th>
              <th className="px-3 py-3">Age</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Sessions</th>
              <th className="px-3 py-3">Weeks</th>
              <th className="px-3 py-3">T-Shirt</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Parent</th>
              <th className="px-3 py-3">Refund</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className={isFetching ? "opacity-60" : ""}>
            {rows.length > 0 ? (
              rows.map((row) => {
                const isRefunded =
                  (row.paymentStatus ?? "").toUpperCase() === "REFUNDED";
                const isCurrentRefunding = refundingId === row.id;
                const isAnyRefunding = Boolean(refundingId);
                const isPendingPayment =
                  (row.paymentStatus ?? "").toUpperCase() === "PENDING";
                const isSiblingGroup =
                  (row.numberOfKids ?? row.players?.length ?? 0) > 1;
                const sessionCount = row.scheduleSessionIds?.length ?? 0;

                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#242A35] last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-[#E8ECF7]">
                      <PlayerGroupCell row={row} />
                    </td>

                    <td className="px-3 py-3 text-[#AAB3C7]">
                      <PlayerDetailCell row={row} field="age" />
                    </td>

                    <td className="px-3 py-3 text-[#AAB3C7]">
                      <PlayerDetailCell row={row} field="type" />
                    </td>

                    <td className="px-3 py-3">
                      {isSiblingGroup ? (
                        <div className="space-y-2">
                          {(row.scheduleSessionIds ?? []).map((sid) => {
                            const info = findSessionInfo(sid);
                            return (
                              <div key={sid} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-[#0A2E5B] px-2 py-0.5 text-xs font-semibold text-[#63B4FF]">
                                    {info ? `Week ${info.weekNumber}` : "Week"}
                                  </span>
                                </div>
                                {info?.scheduleName && (
                                  <div className="text-xs text-[#7E889E]">
                                    {info.scheduleName}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <p className="text-xs text-[#7E889E]">
                            Shared registration for all kids
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {(() => {
                            const infos = (row.scheduleSessionIds ?? [])
                              .map((sid) => findSessionInfo(sid))
                              .filter(Boolean) as Array<{
                              weekNumber: number;
                              scheduleName?: string;
                              sessionType?: "AM" | "PM";
                            }>;

                            const uniqueMap = new Map<
                              string,
                              (typeof infos)[0]
                            >();
                            infos.forEach((i) => {
                              const key = `${i?.scheduleName ?? ""}-${i?.weekNumber}`;
                              if (!uniqueMap.has(key)) uniqueMap.set(key, i);
                            });

                            const uniqueInfos = Array.from(uniqueMap.values());

                            const firstSessionType =
                              uniqueInfos[0]?.sessionType ??
                              (row.scheduleSession?.sessionType as
                                | "AM"
                                | "PM"
                                | undefined);

                            return (
                              <>
                                <SessionBadge session={firstSessionType} />
                                <div className="flex flex-col text-xs text-[#7E889E]">
                                  {uniqueInfos.length === 0 ? (
                                    <span>
                                      Week{" "}
                                      {row.scheduleWeek?.weekNumber ?? "N/A"}
                                    </span>
                                  ) : (
                                    uniqueInfos.map((info) => (
                                      <span
                                        key={`${info.scheduleName}-${info.weekNumber}`}
                                      >
                                        Week {info.weekNumber} •{" "}
                                        {info.scheduleName}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3 text-[#AAB3C7]">
                      {row.numberOfWeeks} week
                      {row.numberOfWeeks === 1 ? "" : "s"}
                    </td>

                    <td className="px-3 py-3 text-[#AAB3C7]">
                      <PlayerDetailCell row={row} field="size" />
                    </td>

                    <td className="px-3 py-3">
                      {isRefunded ? (
                        <span className="rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300">
                          REFUNDED
                        </span>
                      ) : (
                        <div className="space-y-1 text-[#AAB3C7]">
                          <span>{row.paymentStatus}</span>
                          <p className="text-xs text-[#7E889E]">
                            ${row.totalAmount ?? row.amount ?? 0} total
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <p className="text-[#DCE2F1]">{row.parentName}</p>
                      <p className="text-xs text-[#7E889E]">
                        {row.parentEmail}
                      </p>
                      <p className="text-xs text-[#7E889E]">
                        {row.parentPhone}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={
                          isRefunded ||
                          isAnyRefunding ||
                          isFetching ||
                          isPendingPayment
                        }
                        onClick={() => handleRefund(row)}
                        className="h-8 rounded bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCurrentRefunding
                          ? "Processing..."
                          : isRefunded
                            ? "Refunded"
                            : isSiblingGroup
                              ? "Refund Group"
                              : "Refund & Cancel"}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={isAnyRefunding || isFetching}
                        onClick={() => handleMove(row)}
                        className="h-8 rounded bg-[#2A303B] px-3 text-xs font-semibold text-[#D3D9E9] hover:bg-[#394151] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Move Session
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-8 text-center text-sm text-[#8F99AF]"
                >
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-[#8F99AF]">
          Showing page {currentPage} of {totalPages} • Total {total}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="h-9 rounded-md border border-[#293142] bg-[#151821] px-3 text-sm text-[#D3D9E9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="rounded-md border border-[#293142] bg-[#151821] px-3 py-2 text-sm text-[#D3D9E9]">
            {currentPage}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || isFetching}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="h-9 rounded-md border border-[#293142] bg-[#151821] px-3 text-sm text-[#D3D9E9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <MovePlayerDialog
        open={moveDialogOpen}
        participant={selectedParticipant}
        onOpenChange={(open) => {
          setMoveDialogOpen(open);
          if (!open) setSelectedParticipant(null);
        }}
        onSuccess={() => {
          setSelectedParticipant(null);
          refetch();
        }}
      />
    </section>
  );
}
