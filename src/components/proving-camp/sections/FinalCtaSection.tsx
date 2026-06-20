interface ScheduleData {
  scheduleName: string;
}

interface FinalCtaSectionProps {
  scheduleData?: ScheduleData | null;
}

export default function FinalCtaSection({
  scheduleData,
}: FinalCtaSectionProps) {
  // Extract year from scheduleName
  const extractYear = (scheduleName: string): string => {
    const yearMatch = scheduleName.match(/\d{4}/);
    return yearMatch ? yearMatch[0] : "2026";
  };

  const extractSeason = (scheduleName: string): string => {
    const seasonMatch = scheduleName.match(/^(\w+)\s/);
    return seasonMatch ? seasonMatch[1] : "Summer";
  };

  const season = scheduleData
    ? extractSeason(scheduleData.scheduleName)
    : "Summer";
  const year = scheduleData ? extractYear(scheduleData.scheduleName) : "2026";
  const title = `${season} ${year} Spots are Filling Up.`;

  return (
    <section className="py-16 text-center md:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <h3 className="font-['Oswald'] text-[clamp(1.9rem,6vw,3rem)] leading-tight text-white">
          {title.split("Filling Up.")[0]}
          <span className="text-[#14d6ea]">Filling Up.</span>
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
          Don&apos;t wait - register your player today and lock in your week.
        </p>

        <a
          href="#registration"
          className="mt-7 inline-flex rounded bg-[#14d6ea] px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#49e0ef]"
        >
          Register Now
        </a>

        {/* <div className="mx-auto mt-10 h-px w-full max-w-md bg-white/15" />
        <p className="mt-4 text-[11px] text-gray-400">
          © 2026 Crown &amp; Pitch, LLC. All rights reserved.
        </p> */}
      </div>
    </section>
  );
}
