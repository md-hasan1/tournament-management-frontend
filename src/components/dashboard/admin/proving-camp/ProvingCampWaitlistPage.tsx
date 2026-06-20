/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetWaitListsQuery,
  useGetWaitlistStatusQuery,
  useMoveWaitTolistMutation,
} from "@/redux/apiHooks/camp/campApi";
import { Search } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { sessionOptions } from "./waitlist/mock-data";
import MoveToListDialog from "./waitlist/MoveToListDialog";
import type { WaitlistEntry } from "./waitlist/types";
import WaitlistStatCard from "./waitlist/WaitlistStatCard";
import WaitlistTable from "./waitlist/WaitlistTable";

export default function ProvingCampWaitlistPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState("All Sessions");
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<WaitlistEntry | null>(null);

  const apiParams: any = {
    limit,
    page,
    searchTerm: query,
  };

  if (selectedSession !== "All Sessions") {
    apiParams.desiredSession = selectedSession;
  }

  const { data: waitlistData } = useGetWaitListsQuery(apiParams);

  const entries: WaitlistEntry[] = waitlistData?.data || [];

  const total = waitlistData?.meta?.total || 0;

  const { data: waitlistStats } = useGetWaitlistStatusQuery();

  const totalWaiting = waitlistStats?.data?.totalWaiting || 0;
  const amWaiting = waitlistStats?.data?.amWaitlist || 0;
  const pmWaiting = waitlistStats?.data?.pmWaitlist || 0;

  const [moveToList, { isLoading: isMoving }] = useMoveWaitTolistMutation();

  const handleMoveToSession = (entry: WaitlistEntry) => {
    setActiveEntry(entry);
    setIsMoveDialogOpen(true);
  };

  const handleConfirmMoveToList = async ({
    toSessionIds,
  }: {
    toSessionIds: string[];
  }) => {
    if (!activeEntry || toSessionIds.length === 0) return;

    try {
      await moveToList({
        id: activeEntry.id,
        payload: {
          toSessionIds,
        },
      }).unwrap();

      setIsMoveDialogOpen(false);
      setActiveEntry(null);

      Swal.fire({
        icon: "success",
        title: "Player Moved!",
        text: `${activeEntry?.parentName}'s registration was moved to ${toSessionIds.length} session(s).`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Move to list failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to move player. Please try again.",
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#090B10] p-5 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#F2F4F8] md:text-4xl lg:text-5xl">
          Waitlist
        </h1>
        <p className="mt-1 text-sm text-[#8D93A6] md:text-base">
          Manage all participent from dashboard
        </p>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <WaitlistStatCard title="Total Waiting" value={totalWaiting} />
        <WaitlistStatCard
          title="AM Waitlist"
          value={amWaiting}
          valueClassName="text-[#B24BFF]"
        />
        <WaitlistStatCard
          title="PM Waitlist"
          value={pmWaiting}
          valueClassName="text-[#F2C447]"
        />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_150px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F899F]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search player name, email, date etc..."
            className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] pl-10 pr-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
          />
        </div>

        <select
          value={selectedSession}
          onChange={(event) => {
            setSelectedSession(event.target.value);
            setPage(1);
          }}
          className="h-11 w-full rounded-md border border-[#1D2C4A] bg-[#0A1630] px-3 text-sm text-[#EDF3FF] outline-none focus:border-[#35BACB]"
        >
          {sessionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <WaitlistTable rows={entries} onMoveToSession={handleMoveToSession} />

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          className="rounded bg-[#23283a] px-3 py-1 text-[#EDF3FF] disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <span className="text-[#EDF3FF]">
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>

        <button
          className="rounded bg-[#23283a] px-3 py-1 text-[#EDF3FF] disabled:opacity-50"
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <MoveToListDialog
        open={isMoveDialogOpen}
        entry={activeEntry}
        isMoving={isMoving}
        onOpenChange={setIsMoveDialogOpen}
        onConfirm={handleConfirmMoveToList}
      />
    </section>
  );
}