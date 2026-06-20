/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Spinner from "@/components/common/Spinner";
import { useGetTournamentQuery } from "@/redux/apiHooks/homePage/homePageApi";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [page, setPage] = useState(1);
  const limit = 9; // 3x3 grid

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, isFetching } = useGetTournamentQuery({
    query: debouncedSearch,
    page,
    limit,
  });

  // ✅ Your response shape: data.data.meta + data.data.data[]
  const tournaments: any[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const total = meta?.total ?? tournaments.length ?? 0;

  const totalPages = useMemo(() => {
    if (!meta?.total || !meta?.limit) return 1;
    return Math.max(1, Math.ceil(meta.total / meta.limit));
  }, [meta?.total, meta?.limit]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "TBA";

    // Preserve the calendar day the API stored, regardless of viewer timezone.
    const dateOnlyMatch =
      typeof dateValue === "string"
        ? dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        : null;

    const d = dateOnlyMatch
      ? new Date(
          Date.UTC(
            Number(dateOnlyMatch[1]),
            Number(dateOnlyMatch[2]) - 1,
            Number(dateOnlyMatch[3]),
          ),
        )
      : new Date(dateValue);

    if (Number.isNaN(d.getTime())) return "TBA";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 md:h-95 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/thero.png"
            alt="Tournaments background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-['Oswald']">
            Tournaments
          </h1>
          <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
          <p
            className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "Open Sans" }}
          >
            Find your next tournament and register your team. Popup locations
            across DFW.
          </p>
        </div>
      </section>

      <section className="max-w-[90%] mx-auto px-4 sm:px-6 pt-8">
        <p
          className="text-gray-300 text-sm sm:text-base"
          style={{ fontFamily: "Open Sans" }}
        >
          Crown &amp; Pitch hosts pop-up tournaments at locations across the
          Dallas-Fort Worth Metroplex. We rotate through Collin County cities
          including Prosper, Frisco, McKinney, Allen, and Celina, Denton County
          including Lewisville, Flower Mound, Little Elm, and The Colony, and
          throughout the greater DFW area including Arlington, Irving, Grand
          Prairie, Garland, Carrollton, Mesquite, Southlake, and Grapevine.
          Enter your city in the search bar or check back regularly as new
          tournaments are added.
        </p>
      </section>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 py-12">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tournaments or locations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
              style={{ fontFamily: "Open Sans" }}
            />
          </div>

          {isFetching && (
            <div className="text-gray-400 text-sm flex items-center">
              Searching...
            </div>
          )}
        </div>

        {/* States */}
        {isLoading ? (
          <div className="bg-black flex items-center justify-center text-white py-20">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="text-center text-red-400">
            Failed to load tournaments.
          </p>
        ) : total === 0 ? (
          // ✅ EMPTY STATE (success but no data)
          <div className="rounded-lg border border-[#333] bg-white/5 p-10 text-center mb-4">
            <h2 className="text-white font-bold text-xl mb-2">
              {debouncedSearch
                ? "No tournaments match your search."
                : "No tournaments available right now."}
            </h2>
            <p className="text-gray-300">
              {debouncedSearch
                ? "Try a different keyword or clear the search."
                : "Check back soon — new tournaments will appear here."}
            </p>

            {debouncedSearch ? (
              <div className="mt-6">
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-8 rounded-sm transition"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <Link href="/">
                  <button className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-sm transition cursor-pointer">
                    Back to Home
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Tournament Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {tournaments.map((tournament: any) => (
                <div
                  key={tournament.id}
                  className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-500 transition-all duration-300 hover:shadow-xl"
                  style={{
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.18)",
                    backgroundImage: "url(/card.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="border border-[#35BACB] text-[#35BACB] text-xs font-semibold px-3 py-1 rounded">
                      {tournament?.status ?? "UPCOMING"}
                    </span>
                  </div>

                  {/* Logo */}
                  <div className="py-8 flex justify-center items-center">
                    <div className="relative w-44 h-44">
                      <Image
                        src={tournament?.logo || "/champ.png"}
                        alt={tournament?.name || "Tournament"}
                        fill
                        className="object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-white font-bold text-base mb-4">
                      {tournament?.name ?? "Tournament"}
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <Image
                          src="/calendar.png"
                          alt="Calendar"
                          width={24}
                          height={24}
                        />
                        <span
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          Tournament Start: {formatDate(tournament?.startDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <Image
                          src="/cardlocation.png"
                          alt="Location"
                          width={20}
                          height={20}
                        />
                        <span
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          {tournament?.location ?? "TBA"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-300 text-sm">
                        <Image
                          src="/calendar.png"
                          alt="Registration deadline"
                          width={24}
                          height={24}
                        />
                        <span
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          Registration Deadline:{" "}
                          {formatDate(tournament?.registrationDeadline)}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-gray-300 text-sm">
                        <div className="mt-0.5 shrink-0">
                          <Image
                            src="/cells.png"
                            alt="Divisions"
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className="text-gray-300 leading-snug">
                          {tournament?.tournamentDivisions?.length > 0
                            ? tournament.tournamentDivisions
                                .map((d: any) =>
                                  d.divisionName
                                    ? d.divisionName.replace(/_/g, " ")
                                    : ""
                                )
                                .filter(Boolean)
                                .join(", ")
                            : "0 Divisions Offered"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto mb-3 h-px w-full bg-gray-500" />

                    {/* Entry Fee */}
                    <div className="mb-4 relative">
                      {tournament?.tournamentStage && (
                        <div className="absolute -top-1 right-0">
                          <span className="border border-[#92B212] bg-[#40472A] text-[#92B212] text-[10px] font-bold px-2 py-1 rounded">
                            {tournament.tournamentStage}
                          </span>
                        </div>
                      )}

                      <p className="text-gray-400 text-xs mb-1">Entry Fee:</p>
                      <p className="text-white text-sm font-semibold">
                        Youth ${tournament?.youthFee ?? "0"} | Adult $
                        {tournament?.adultFee ?? "0"}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2 pt-4">
                      <Link
                        href={`/tournament-registration?id=${tournament.id}`}
                        className="flex-2"
                      >
                        <button className="w-full bg-[#35BACB] hover:bg-[#A232D6] text-black text-sm font-bold py-2.5 px-3 rounded transition cursor-pointer">
                          Register Now
                        </button>
                      </Link>

                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="flex-1"
                      >
                        <button className="w-full bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700 text-sm font-semibold py-2.5 px-3 rounded transition cursor-pointer">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Pagination only if there are results */}
            {total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-12">
                <p className="text-gray-400 text-sm">
                  Page <span className="text-white">{meta?.page ?? page}</span>{" "}
                  of <span className="text-white">{totalPages}</span>
                  {meta?.total ? (
                    <>
                      {" "}
                      • Total <span className="text-white">{meta.total}</span>
                    </>
                  ) : null}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!canPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded border border-[#444] text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#333]"
                  >
                    Prev
                  </button>

                  <button
                    disabled={!canNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded border border-[#444] text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#333]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <section className="mb-12 rounded-xl border border-[#35BACB]/45 bg-[linear-gradient(100deg,#3F464C_0%,#363D43_45%,#145C67_100%)] p-6 sm:p-8">
          <h3 className="mb-5 font-['Oswald'] text-3xl font-bold text-[#E7ECEF] sm:text-3xl">
            Tournaments information
          </h3>
          <ul
            className="space-y-3 text-sm text-[#D0D5D9] sm:text-[22px]"
            style={{ fontFamily: "Open Sans" }}
          >
            <li className="flex items-start gap-3">
              <span className="mt-1 font-bold text-[#6EDBE8]">•</span>
              <span className="text-[18px] text-[#E7ECEF] font-semibold">
                <strong className="font-semibold text-[#E7ECEF] ">
                  3-game minimum guarantee
                </strong>{" "}
                <span className=" opacity-30 text-[16px]">
                  - Pool play + bracket format
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 font-bold text-[#6EDBE8]">•</span>
              <span className="text-[18px] text-[#E7ECEF] font-semibold">
                <strong className="font-semibold text-[#E7ECEF] text-[18px]">
                  Max 12 players per roster
                </strong>{" "}
                <span className=" opacity-30 text-[16px]">
                  - Minimum 10 teams to run division
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 font-bold text-[#6EDBE8]">•</span>
              <span className="text-[18px] text-[#E7ECEF] font-semibold">
                <strong className="font-semibold text-[#E7ECEF] text-[18px]">
                  Points toward Crown Series
                </strong>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
