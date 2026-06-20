"use client";

import { X } from "lucide-react";

interface MatchResult {
  opponent: string;
  matchNumber: number;
  result: "WIN" | "LOSS" | "DRAW";
  score: string;
}

export function TournamentResultsModal({
  isOpen,
  onClose,
  tournamentName,
  matches,
}: {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  matches: MatchResult[];
}) {
  const wins = matches.filter((m) => m.result === "WIN").length;
  const draws = matches.filter((m) => m.result === "DRAW").length;
  const losses = matches.filter((m) => m.result === "LOSS").length;

  const getResultColor = (result: string) => {
    switch (result) {
      case "WIN":
        return "text-green-400";
      case "LOSS":
        return "text-red-400";
      case "DRAW":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#35BACB]/30 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-2">{tournamentName}</h2>
        <p className="text-gray-400 mb-8">
          Quarter-Finalist • January 10, 2026
        </p>

        {/* Match Results */}
        <h3 className="text-lg font-bold text-white mb-6">MATCH RESULTS</h3>
        <div className="space-y-4 mb-8 pb-8 border-b border-[#35BACB]/30">
          {matches.map((match, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-black/40 border border-[#35BACB]/10 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-white font-bold">vs {match.opponent}</p>
                <p className="text-gray-500 text-sm">
                  Match {match.matchNumber}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${getResultColor(match.result)}`}
                >
                  {match.result}
                </p>
                <p className="text-gray-400 font-bold">{match.score}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-black/40 border border-green-500/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">{wins}</div>
            <div className="text-xs text-gray-400 uppercase">Wins</div>
          </div>
          <div className="text-center p-4 bg-black/40 border border-yellow-500/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {draws}
            </div>
            <div className="text-xs text-gray-400 uppercase">Draws</div>
          </div>
          <div className="text-center p-4 bg-black/40 border border-red-500/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400 mb-1">{losses}</div>
            <div className="text-xs text-gray-400 uppercase">Losses</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#35BACB] text-black font-bold py-3 rounded-lg hover:bg-[#35BACB]/90 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
