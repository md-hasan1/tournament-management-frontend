/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Spinner from "@/components/common/Spinner";
import { useGetSingleTournamentQuery } from "@/redux/apiHooks/homePage/homePageApi";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const TournamentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: tournamentDetails,
    isLoading,
    isError,
  } = useGetSingleTournamentQuery(id ? { id } : skipToken);

  const tournament =
    tournamentDetails?.data?.data?.[0] ?? tournamentDetails?.data ?? null;

  const divisions = tournament?.tournamentDivisions ?? [];

  // Helpers
  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const dateOnlyMatch = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    const date = dateOnlyMatch
      ? new Date(
          Date.UTC(
            Number(dateOnlyMatch[1]),
            Number(dateOnlyMatch[2]) - 1,
            Number(dateOnlyMatch[3]),
          ),
        )
      : new Date(iso);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const calcRegistered = (maxTeams?: number, slotsLeft?: number) => {
    if (typeof maxTeams !== "number" || typeof slotsLeft !== "number") return 0;
    return Math.max(0, maxTeams - slotsLeft);
  };

  const calcProgress = (maxTeams?: number, slotsLeft?: number) => {
    if (typeof maxTeams !== "number" || typeof slotsLeft !== "number") return 0;
    const registered = calcRegistered(maxTeams, slotsLeft);
    return maxTeams > 0 ? Math.round((registered / maxTeams) * 100) : 0;
  };

  // ✅ FREE Google map embed (NO API KEY)
  // Works with your backend link: https://maps.google.com/?q=Central+Sports+Complex
  const googleEmbedSrc = useMemo(() => {
    if (tournament?.mapLink) {
      // If already has "?", add &output=embed; if not, add ?output=embed
      const joiner = tournament.mapLink.includes("?") ? "&" : "?";
      return `${tournament.mapLink}${joiner}output=embed`;
    }

    if (tournament?.location) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        tournament.location,
      )}&output=embed`;
    }

    return null;
  }, [tournament?.mapLink, tournament?.location]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <Spinner />
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Failed to load tournament details.
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen mt-10">
      {/* Header Section */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto mb-10 rounded-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {tournament.name}
              </h1>
              <div className="w-16 h-1 bg-[#35BACB] rounded"></div>
            </div>

            <span className="border border-[#35BACB] text-[#35BACB] text-sm font-bold px-4 py-2 rounded">
              {tournament.status}
            </span>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#35BACB]" />
                <span className="text-gray-400 text-sm">Dates</span>
              </div>

              <p className="text-white font-semibold">
                {formatDate(tournament.startDate)} –{" "}
                {formatDate(tournament.endDate)}
              </p>

              {tournament.registrationDeadline && (
                <p className="text-gray-400 text-xs mt-1">
                  Registration deadline:{" "}
                  {formatDate(tournament.registrationDeadline)}
                </p>
              )}
            </div>

            <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#35BACB]" />
                <span className="text-gray-400 text-sm">Location</span>
              </div>
              <p className="text-white font-semibold">{tournament.location}</p>

              {tournament.mapLink ? (
                <a
                  href={tournament.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#35BACB] text-xs hover:underline"
                >
                  View on Google Maps →
                </a>
              ) : (
                <p className="text-gray-400 text-xs">Map link not available</p>
              )}
            </div>

            <div className="bg-[#240303] border border-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-[#35BACB]" />
                <span className="text-gray-400 text-sm">Entry Fee</span>
              </div>
              <p className="text-white font-semibold">
                Youth: ${tournament.youthFee}
              </p>
              <p className="text-white font-semibold">
                Adult: ${tournament.adultFee}
              </p>
            </div>
          </div>

          {/* Prize Pool */}
          {tournament.prizePool && (
            <div className="mt-4 bg-[#240303] border border-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏆</span>
                <span className="text-white font-semibold">Prize Pool</span>
              </div>
              <p className="text-[#35BACB] font-semibold whitespace-pre-wrap">
                {tournament.prizePool}
              </p>
            </div>
          )}

          {tournament.notes && (
            <div className="mt-4 bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
              <p className="text-gray-300 text-sm">{tournament.notes}</p>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Divisions Section */}
        <section className="mb-12 bg-[#1a1a1a] border border-[#35BACB] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-[#35BACB]">⚡</span> DIVISIONS OFFERED THIS
            WEEK
          </h2>

          <div className="space-y-4">
            {divisions.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No divisions found for this tournament.
              </div>
            ) : (
              divisions.map((division: any) => {
                const maxTeams = division.maxTeams;
                const slotsLeft = division.slotsLeft;
                const registered = calcRegistered(maxTeams, slotsLeft);
                const progress = calcProgress(maxTeams, slotsLeft);

                return (
                  <div
                    key={division.id}
                    className="border border-[#333] rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-[#35BACB]" />
                      <h3 className="text-white font-semibold text-lg">
                        {division.divisionName}
                      </h3>

                      <span className="ml-auto text-xs text-gray-400">
                        {division.status}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      {registered} teams registered •{" "}
                      <span className="text-[#35BACB]">
                        {slotsLeft} spots left
                      </span>{" "}
                      {typeof maxTeams === "number" ? (
                        <span className="text-gray-500">
                          / {maxTeams} total
                        </span>
                      ) : null}
                    </p>

                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-[#333] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#35BACB] rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs w-12 text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="bg-[#1a1a1a] border border-[#333] rounded p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-400 text-sm">
                Minimum 24 teams required to run division. Divisions with fewer
                than 24 teams may be combined with similar divisions or
                rescheduled to the next tournament. Teams will be notified at
                least 7 days before the tournament if changes occur.
              </p>
            </div>
          </div>
        </section>

        {/* Tournament Format */}
        <section className="bg-[#1a1a1a] border border-[#333] rounded p-6 mb-12">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[#35BACB]">⚽</span> TOURNAMENT FORMAT
          </h3>

          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#35BACB] font-bold">•</span>
              <span>
                <strong>{tournament.gameStyle?.replace("FORMAT_", "")}</strong>{" "}
                format
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#35BACB] font-bold">•</span>
              <span>
                Fields available: <strong>{tournament.numberOfFields}</strong>
              </span>
            </li>
          </ul>
        </section>

        {/* Roster Requirements */}
        <section className="bg-[#1a1a1a] border border-[#333] rounded p-6 mb-12">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[#35BACB]">👥</span> ROSTER REQUIREMENTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#35BACB] font-semibold mb-3">Roster Size</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#35BACB] font-bold">•</span>
                  <span>Max {tournament.rosterSizeMax} players per team</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#35BACB] font-semibold mb-3">Stage</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#35BACB] font-bold">•</span>
                  <span>{tournament.tournamentStage}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ✅ Location + FREE Embedded Map */}
        <section className="bg-[#1a1a1a] border border-[#333] rounded p-6 mb-12">
          <h3 className="text-xl font-bold text-white mb-4">📍 Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Venue</p>
              <p className="text-white font-semibold mb-4">
                {tournament.location}
              </p>

              {tournament.mapLink ? (
                <a
                  href={tournament.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#35BACB] text-sm hover:underline"
                >
                  View on Google Maps →
                </a>
              ) : null}
            </div>

            <div className="md:col-span-2 relative h-64 rounded overflow-hidden border border-[#333] bg-[#0a0a0a]">
              {googleEmbedSrc ? (
                <iframe
                  title="Google Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={googleEmbedSrc}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-4 text-center">
                  Map is unavailable.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#333]">
            <div>
              <h4 className="text-white font-semibold mb-2">Parking</h4>
              <p className="text-gray-400 text-sm">
                {tournament.parking || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Restrooms</h4>
              <p className="text-gray-400 text-sm">
                {tournament.bathrooms || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Food & Drinks</h4>
              <p className="text-gray-400 text-sm">
                {tournament.foods || "Not specified"}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1a1a1a] border border-[#35BACB] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            📋 Tournament Rules
          </h2>
          <p className="text-gray-300 mb-6">
            Before registering, review our official tournament rules and
            regulations including game format, scoring, conduct policies, and
            more.
          </p>
          <a
            href="/rules"
            className="inline-flex items-center gap-2 bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-8 rounded-lg transition"
          >
            View Official Rules <span>→</span>
          </a>
        </section>

        {/* CTA Section */}
        <section className="bg-linear-to-r from-[#1D2109] to-[#220A13] border-2 border-[#35BACB] rounded-lg p-8 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            READY TO REGISTER?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Registration deadline is{" "}
            <strong>{formatDate(tournament.registrationDeadline)}</strong>. All
            teams must complete individual registration with signed waivers.
          </p>
          <button
            onClick={() =>
              router.push(`/tournament-registration?id=${tournament.id}`)
            }
            className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-12 rounded-lg shadow-lg transition mb-4 cursor-pointer"
          >
            Register Your Team
          </button>
          <p className="text-gray-400 text-xs">
            Entry Fee: Youth ${tournament.youthFee} • Adult $
            {tournament.adultFee}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TournamentDetailsPage;
