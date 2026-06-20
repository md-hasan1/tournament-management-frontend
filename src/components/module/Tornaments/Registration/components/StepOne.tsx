"use client";

import React from "react";
import { Tournament } from "../Registration";
// import type { Tournament } from "../../../../../app/(commonLayout)/tournament-registration/page";

const YOUTH_DIVISIONS = new Set<string>([
  "U9_BOYS",
  "U10_BOYS",
  "U9_GIRLS",
  "U10_GIRLS",
  "U11_BOYS",
  "U11_GIRLS",
  "U12_BOYS",
  "U12_GIRLS",
  "U13_BOYS",
  "U14_BOYS",
  "U13_GIRLS",
  "U14_GIRLS",
  "U15_BOYS",
  "U16_BOYS",
  "U15_GIRLS",
  "U16_GIRLS",
  "U17_BOYS",
  "U18_BOYS",
  "U17_GIRLS",
  "U18_GIRLS",
  "HS_BOYS",
  "HS_GIRLS",
]);

const ADULT_DIVISIONS = new Set<string>([
  "MENS_DIV_1",
  "MENS_DIV_2",
  "MENS_DIV_3",
  "WOMENS",
  "COED",
]);

function normalizeDivisionName(name?: string) {
  return (name ?? "").trim().toUpperCase();
}

interface StepOneProps {
  selectedTournament: string;
  selectedDivision: string;
  tournaments: Tournament[];
  onTournamentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDivisionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function StepOne({
  selectedTournament,
  selectedDivision,
  tournaments,
  onTournamentChange,
  onDivisionChange,
}: StepOneProps) {
  const selectedTournamentData = tournaments.find(
    (t) => t.id === selectedTournament,
  );
  const divisions = selectedTournamentData?.tournamentDivisions ?? [];
  const selectedDivisionData = divisions.find((d) => d.id === selectedDivision);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const feeType: "youth" | "adult" | "unknown" = (() => {
    const name = normalizeDivisionName(selectedDivisionData?.divisionName);
    if (!name) return "unknown";
    if (YOUTH_DIVISIONS.has(name)) return "youth";
    if (ADULT_DIVISIONS.has(name)) return "adult";
    return "unknown";
  })();

  const entryFee = (() => {
    if (!selectedTournamentData) return "";

    if (selectedDivisionData?.feeOverride != null)
      return `$${selectedDivisionData.feeOverride}`;
    if (feeType === "adult") return `$${selectedTournamentData.adultFee}`;
    return `$${selectedTournamentData.youthFee}`;
  })();

  return (
    <>
      <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide font-['Oswald']">
        Select Tournament
      </h2>

      <div className="space-y-6">
        {/* Tournament */}
        <div>
          <label className="block text-gray-300 text-sm mb-3 font-semibold">
            Tournament <span className="text-red-500">*</span>
          </label>

          <select
            value={selectedTournament}
            onChange={onTournamentChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition"
          >
            <option value="">Select a tournament</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {selectedTournamentData && (
            <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-700">
              <p className="text-gray-300 text-sm">
                <span className="text-[#35BACB]">
                  {formatDate(selectedTournamentData.startDate)} -{" "}
                  {formatDate(selectedTournamentData.endDate)}
                </span>
              </p>
              <p className="text-gray-400 text-sm">
                {selectedTournamentData.location}
              </p>
            </div>
          )}
        </div>

        {/* Division */}
        <div>
          <label className="block text-gray-300 text-sm mb-3 font-semibold">
            Select Division <span className="text-red-500">*</span>
          </label>

          <select
            value={selectedDivision}
            onChange={onDivisionChange}
            disabled={!selectedTournamentData}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition disabled:opacity-50"
          >
            <option value="">
              {selectedTournamentData
                ? "Select your division"
                : "Select tournament first"}
            </option>

            {divisions.map((d) => (
              <option key={d.id} value={d.id} disabled={d.slotsLeft <= 0}>
                {d.divisionName}{" "}
                {d.slotsLeft <= 0 ? "(Full)" : `(${d.slotsLeft} slots left)`}
              </option>
            ))}
          </select>

          {selectedDivisionData && selectedTournamentData && (
            <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-700">
              <p className="text-gray-400 text-xs mb-2">Entry Fee:</p>
              <p className="text-white font-semibold">{entryFee}</p>

              <p className="text-gray-500 text-xs mt-2">
                {feeType === "adult"
                  ? "Adult division fee applied"
                  : feeType === "youth"
                    ? "Youth division fee applied"
                    : "Default fee applied"}
                {" · "}Processing fees excluded
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
