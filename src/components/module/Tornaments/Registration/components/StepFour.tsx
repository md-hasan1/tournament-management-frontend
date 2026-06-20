"use client";

import { Tournament, TournamentDivision } from "../Registration";

// import type { Tournament, TournamentDivision } from "../../../../../app/(commonLayout)/tournament-registration/page";

interface StepFourProps {
  selectedTournamentData: Tournament | undefined;
  selectedDivisionData: TournamentDivision | undefined;
  teamName: string;
  entryFee: string;
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const formatUsd = (amount: number) => `$${amount.toFixed(2)}`;

export default function StepFour({
  selectedTournamentData,
  selectedDivisionData,
  teamName,
  entryFee,
}: StepFourProps) {
  const numericEntryFee = Number(entryFee.replace(/[^0-9.]/g, ""));
  const safeEntryFee = Number.isFinite(numericEntryFee) ? numericEntryFee : 0;
  const processingFee = safeEntryFee * 0.03;
  const totalFee = safeEntryFee + processingFee;

  const tournamentDate =
    selectedTournamentData?.startDate && selectedTournamentData?.endDate
      ? `${formatDate(selectedTournamentData.startDate)} - ${formatDate(selectedTournamentData.endDate)}`
      : "";

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-6">🎉</div>

      <h2 className="text-4xl font-bold text-center mb-4 font-['Oswald']">
        Congratulations
      </h2>

      <p className="text-gray-300 text-center text-lg mb-8">
        Your team is successfully registered in 
        <br />
        <strong>{selectedTournamentData?.name ?? "-"}</strong>
      </p>

      <div className="bg-gray-900 rounded p-6 w-full max-w-sm mb-8 border border-gray-700">
        <div className="space-y-2 text-sm">
          <div className="flex w-full justify-between gap-3 text-gray-400">
            <span>Tournament:</span>{" "}
            <span className="text-white">
            {selectedTournamentData?.name ?? "-"}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Date:</span>
            <span className="text-white">{tournamentDate || "-"}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Division:</span>
            <span className="text-white">
              {selectedDivisionData?.divisionName ?? "-"}
            </span>
          </div>

          {/* <div className="flex justify-between text-gray-400">
            <span>Division ID:</span>
            <span className="text-white">
              {selectedDivisionData?.id ?? "-"}
            </span>
          </div> */}

          <div className="flex justify-between text-gray-400">
            <span>Team:</span>
            <span className="text-white">{teamName || "-"}</span>
          </div>

          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex justify-between text-gray-400">
              <span>Entry Fee:</span>
              <span className="text-white font-semibold">
                {entryFee || "-"}
              </span>
            </div>

            <div className="flex justify-between text-gray-400 mt-1">
              <span>Processing Fee:</span>
              <span className="text-white font-semibold">
                3% of {formatUsd(safeEntryFee)} ({formatUsd(processingFee)})
              </span>
            </div>

            <div className="flex justify-between text-gray-400 mt-1">
              <span>Total (Entry + Processing):</span>
              <span className="text-[#35BACB] font-bold text-right">
                {/* {formatUsd(safeEntryFee)} + {formatUsd(processingFee)} ={" "} */}
                {formatUsd(totalFee)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <p className="text-xs text-gray-500 text-center max-w-sm">
        A confirmation email/receipt can be sent here after your registration
        API succeeds.
      </p> */}
    </div>
  );
}
