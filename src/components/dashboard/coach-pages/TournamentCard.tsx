"use client";

import { MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export type TournamentStatus =
  | "NO_PLAYERS"
  | "ROSTER_INCOMPLETE"
  | "ROSTER_COMPLETE";

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  ageGroup: string;
  status?: string;
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const router = useRouter();

  const getStatusText = () => {
    switch (tournament.status) {
      case "NO_PLAYERS":
        return "NO PLAYERS";
      case "ROSTER_INCOMPLETE":
        return "ROSTER INCOMPLETE";
      case "ROSTER_COMPLETE":
        return "ROSTER COMPLETE";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        onClick={() =>
          router.push(`/dashboard/coach/tournament/${tournament.id}`)
        }
        className="border border-gray-800 rounded-lg p-6  transition-colors bg-transparent cursor-pointer group hover:border-[#35BACB]"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-white group-hover:text-[#35BACB] transition flex-1">
            {tournament.name}
          </h3>
          {tournament.status && (
            <span className="px-3 py-1 rounded text-xs font-medium border border-[#35BACB]/30 bg-[#35BACB]/10 text-[#35BACB]">
              {getStatusText()}
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4 flex flex-row gap-7 items-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} className="text-[#35BACB]" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={14} className="text-[#35BACB]" />
            <span>{tournament.ageGroup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} className="text-[#35BACB]" />
            <span>{tournament.location}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition text-center">
          Click to view tournament details and schedule
        </p>
      </div>
    </>
  );
}
