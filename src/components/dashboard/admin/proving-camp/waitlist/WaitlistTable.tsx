import { useMemo } from "react";

import type { WaitlistEntry } from "./types";

type WaitlistTableProps = {
  rows: WaitlistEntry[];
  onMoveToSession?: (entry: WaitlistEntry) => void;
};

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

function PlayerGroupCell({ row }: { row: WaitlistEntry }) {
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
  row: WaitlistEntry;
  field: "age" | "type" | "size";
}) {
  const values = (row.players ?? []).map((player) => {
    if (field === "age") return String(getAge(player.dateOfBirth));
    if (field === "type") return player.playerType.replace(/_/g, " ");
    return player.shirtSize;
  });

  return <ChipList items={values} compact />;
}

function getStatusBadge(status: string) {
  const statusConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    OFFER_SENT: {
      bg: "bg-[#4B3B1F]",
      text: "text-[#FFB84D]",
      label: "Offer Sent",
    },
    ACTIVE: {
      bg: "bg-[#1F3B2B]",
      text: "text-[#46D98A]",
      label: "Waiting",
    },
    ACCEPTED: {
      bg: "bg-[#0A2E5B]",
      text: "text-[#63B4FF]",
      label: "Accepted",
    },
    DECLINED: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      label: "Declined",
    },
  };

  const config = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

export default function WaitlistTable({
  rows,
  onMoveToSession,
}: WaitlistTableProps) {
  const sortedRows = useMemo(() => {
    return [...rows].sort(
      (a, b) => (a.queuePosition ?? 0) - (b.queuePosition ?? 0),
    );
  }, [rows]);

  return (
    <div className="overflow-x-auto rounded-lg border border-[#2B303C] bg-[#151821]">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="border-b border-[#272C37] bg-[#1A1E27] text-xs uppercase tracking-wide text-[#9EA8BC]">
          <tr>
            <th className="px-4 py-3">Position</th>
            <th className="px-3 py-3">Registration</th>
            <th className="px-3 py-3">Age</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Weeks</th>
            <th className="px-3 py-3">T-Shirt</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Parent</th>
            <th className="px-3 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row) => {
            const isOfferExpired =
              row.offerExpiresAt && new Date(row.offerExpiresAt) < new Date();

            return (
              <tr
                key={row.id}
                className="border-b border-[#242A35] last:border-b-0"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#1D5160] bg-[#112A33] text-xs font-bold text-[#35BACB]">
                    {row.queuePosition}
                  </span>
                </td>

                <td className="px-3 py-3 font-medium text-[#E8ECF7]">
                  <PlayerGroupCell row={row} />
                </td>

                <td className="px-3 py-3 text-[#AAB3C7]">
                  <PlayerDetailCell row={row} field="age" />
                </td>

                <td className="px-3 py-3 text-[#AAB3C7]">
                  <PlayerDetailCell row={row} field="type" />
                </td>

                <td className="px-3 py-3 text-[#AAB3C7]">
                  {row.numberOfWeeks} week
                  {row.numberOfWeeks === 1 ? "" : "s"}
                </td>

                <td className="px-3 py-3 text-[#AAB3C7]">
                  <PlayerDetailCell row={row} field="size" />
                </td>

                <td className="px-3 py-3">{getStatusBadge(row.status)}</td>

                <td className="px-3 py-3">
                  <p className="text-[#DCE2F1]">{row.parentName}</p>
                  <p className="text-xs text-[#7E889E]">{row.parentEmail}</p>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {row.status === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => onMoveToSession?.(row)}
                        className="h-8 rounded bg-[#2A303B] px-3 text-xs font-semibold text-[#D3D9E9] hover:bg-[#394151]"
                      >
                        Move to Session
                      </button>
                    )}

                    {isOfferExpired && row.status === "OFFER_SENT" && (
                      <span className="inline-flex h-8 items-center rounded bg-red-500/10 px-3 text-xs font-semibold text-red-300">
                        Offer Expired
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="border-b border-[#242A35] px-4 py-6 text-center text-[#7E889E]">
          No waitlist entries
        </div>
      )}
    </div>
  );
}
