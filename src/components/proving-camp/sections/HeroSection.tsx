interface Session {
  sessionType: string;
  startTime: string;
  endTime: string;
  dropOffTime: string;
}

interface Week {
  sessions: Session[];
}

interface ScheduleData {
  scheduleName: string;
  season: "SUMMER" | "FALL" | "WINTER" | "SPRING";
  startDate: string;
  weeks: Week[];
}

interface HeroSectionProps {
  scheduleData?: ScheduleData | null;
  allSchedules?: ScheduleData[];
}

export default function HeroSection({
  scheduleData,
  allSchedules = [],
}: HeroSectionProps) {
  // Extract year from scheduleName or use current year
  const extractYear = (scheduleName: string): string => {
    const yearMatch = scheduleName.match(/\d{4}/);
    return yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
  };

  // Get season label
  const getSeasonLabel = (season: string): string => {
    return season.charAt(0).toUpperCase() + season.slice(1).toLowerCase();
  };

  const scheduleYear = scheduleData
    ? extractYear(scheduleData.scheduleName)
    : "2026";
  const seasonLabel = scheduleData
    ? getSeasonLabel(scheduleData.season)
    : "Summer";

  // Get session info from first week's sessions
  const firstSession = scheduleData?.weeks?.[0]?.sessions?.[0];
  const amSession = scheduleData?.weeks?.[0]?.sessions?.find(
    (s) => s.sessionType === "AM",
  );
  const pmSession = scheduleData?.weeks?.[0]?.sessions?.find(
    (s) => s.sessionType === "PM",
  );

  return (
    <section className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-black bg-[url('/hero2.png')] bg-cover bg-position-[62%_center] bg-no-repeat sm:min-h-[85vh] sm:bg-center lg:min-h-screen">
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/35 sm:from-black/80 sm:via-black/55 sm:to-black/25" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-6xl text-center">
            <h1 className="mx-auto mb-5 max-w-6xl font-oswald text-[clamp(2rem,7vw,5rem)] leading-[1.12] font-bold tracking-tight text-white uppercase">
              Crown and Pitch Proving Camp
            </h1>

            <p className="mx-auto mt-3 font-['Oswald'] text-[clamp(1.5rem,5vw,3rem)] font-semibold text-[#1fd4e7]">
              Where legends are born.
            </p>

            <p className="mx-auto mt-3 max-w-3xl text-[clamp(1.1rem,3.8vw,1.9rem)] leading-snug text-gray-100">
              Coached by pros. Skills-focused. {seasonLabel} {scheduleYear}.
            </p>

            <div className="mt-7 flex items-center justify-center">
              <a
                href="#registration"
                className="w-full max-w-sm rounded-sm bg-[#1ccde0] px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-[#4ddbe9] sm:w-auto sm:max-w-none sm:px-7 sm:text-base md:text-lg"
              >
                Register Now - {seasonLabel} {scheduleYear}
              </a>
            </div>

            <p className="mx-auto mt-6 max-w-4xl px-2 text-sm leading-relaxed text-gray-200 sm:px-0 sm:text-base md:text-lg">
              {amSession && (
                <>
                  <span className="block sm:inline">
                    AM Session ({amSession.dropOffTime} drop-off) •{" "}
                    {amSession.startTime} - {amSession.endTime}
                  </span>
                  <span className="hidden sm:inline"> | </span>
                </>
              )}
              {pmSession && (
                <>
                  <span className="block sm:inline">
                    PM Session ({pmSession.dropOffTime} drop-off) •{" "}
                    {pmSession.startTime} - {pmSession.endTime}
                  </span>
                  <span className="hidden sm:inline"> | </span>
                </>
              )}
              <span className="block sm:inline">$225 per 3-day session</span>
            </p>

            {/* Season Selector */}
            {allSchedules.length > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-gray-300">Seasons: </span>
                {allSchedules.map((schedule) => (
                  <a
                    key={schedule.season}
                    href="#registration"
                    className="inline-block rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-[#1fd4e7] transition hover:bg-[#1fd4e7] hover:text-black"
                  >
                    {getSeasonLabel(schedule.season)}{" "}
                    {extractYear(schedule.scheduleName)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
