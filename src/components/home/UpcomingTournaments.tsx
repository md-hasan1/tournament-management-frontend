/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import waterMarkTop from "@/assets/wartermark-hit-top.png";
import { useGetTournamentQuery } from "@/redux/apiHooks/homePage/homePageApi";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../common/Spinner";

const UpcomingTournaments = () => {
  const { data, isLoading, isError } = useGetTournamentQuery({
    query: "",
    page: 1,
    limit: 4,
  });

  // ✅ handle both shapes safely: data.data.data OR data.data
  const tournaments: any[] =
    (data as any)?.data?.data ?? (data as any)?.data ?? [];

  const total = (data as any)?.data?.meta?.total ?? tournaments.length;

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

  if (isLoading) {
    return (
      <div className="bg-black flex items-center justify-center text-white py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-black py-16 md:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6">
          <p className="text-center text-red-400">
            Failed to load tournaments.
          </p>
        </div>
      </section>
    );
  }

  // ✅ Empty state when API returns [] (meta.total = 0)
  if (!tournaments || tournaments.length === 0 || total === 0) {
    return (
      <section className="w-full bg-black py-16 md:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-[#F5F5F5] font-['Oswald'] text-[36px] sm:text-[44px] md:text-[56px] font-extrabold leading-[120%]">
              Upcoming Tournaments
            </h2>
            <div className="bg-[#35BACB] w-24 h-1 mx-auto my-3 rounded-lg" />
            <p className="text-gray-300 text-lg">Where players rise</p>
          </div>

          {/* Empty Content */}
          <div className="rounded-lg border border-gray-700 bg-white/5 p-8 text-center">
            <p className="text-white font-semibold text-lg">
              No tournaments available right now.
            </p>
            <p className="text-gray-300 mt-2">
              Check back soon — new events will be posted here.
            </p>

            <div className="mt-6">
              <Link href="/tournaments">
                <button className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-sm transition cursor-pointer">
                  View All Tournaments
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-black py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image src={waterMarkTop} alt="Watermark" className="w-100 h-150" />
      </div>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[#F5F5F5] font-['Oswald'] text-[36px] sm:text-[44px] md:text-[56px] font-extrabold leading-[120%]">
            Upcoming Tournaments
          </h2>
          <div className="bg-[#35BACB] w-24 h-1 mx-auto my-3 rounded-lg" />
          <p className="text-gray-300 text-lg">Where players rise</p>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tournaments.map((tournament: any) => {
            return (
              <div
                key={tournament.id}
                className="rounded-lg overflow-hidden border border-gray-500 hover:shadow-xl transition-all duration-300 relative"
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

                {/* Tournament Details */}
                <div className="p-5">
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
                      <span className="text-gray-300">
                        {formatDate(tournament?.startDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                      <Image
                        src="/cardlocation.png"
                        alt="Location"
                        width={20}
                        height={20}
                      />
                      <span className="text-gray-300">
                        {tournament?.location ?? "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                      <Image
                        src="/calendar.png"
                        alt="Calendar"
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-300">
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

                  <div className="h-px w-full bg-gray-500 mb-3" />

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
                  <div className="flex gap-2 mt-4">
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
            );
          })}
        </div>

        <p
          className="text-gray-300 text-sm sm:text-base text-center mt-8"
          style={{ fontFamily: "Open Sans" }}
        >
          Crown &amp; Pitch brings small-sided soccer to communities across DFW
          — from Celina and Little Elm in the north to Arlington, Irving, and
          Grand Prairie in the west, Garland and Mesquite to the east, and
          Lewisville, Carrollton, Flower Mound, Southlake, and Grapevine
          throughout Denton County.
        </p>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/tournaments">
            <button className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-sm transition cursor-pointer">
              View All Tournaments
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments;
