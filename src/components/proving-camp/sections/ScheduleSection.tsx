import { campSchedule } from "@/components/proving-camp/data";

interface Session {
  sessionType: string;
  capacity: number;
  totalRegistered: number;
  startTime?: string;
  endTime?: string;
}

interface Week {
  weekNumber: number;
  startDate: string;
  endDate: string;
  sessions: Session[];
}

interface ScheduleData {
  scheduleName: string;
  weeks: Week[];
}

interface ScheduleSectionProps {
  scheduleData?: ScheduleData | null;
}

const tableHeaders = ["Week", "Dates", "Location", "Session Time", "Capacity"];

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
  const endMonth = end.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
  return `${startMonth} - ${endMonth}`;
}

const DEFAULT_LOCATION = "Allen Training Facility";

export default function ScheduleSection({
  scheduleData,
}: ScheduleSectionProps) {
  // Extract year from scheduleName
  const extractYear = (scheduleName: string): string => {
    const yearMatch = scheduleName.match(/\d{4}/);
    return yearMatch ? yearMatch[0] : "2026";
  };

  const extractSeason = (scheduleName: string): string => {
    const seasonMatch = scheduleName.match(/^(\w+)\s/);
    return seasonMatch ? seasonMatch[1] : "Summer";
  };

  // Generate schedule data from weeks
  const scheduleRows =
    scheduleData?.weeks?.map((week) => {
      const totalCapacity = week.sessions.reduce(
        (sum, session) => sum + session.capacity,
        0,
      );
      const sessionTimes = week.sessions
        .map(
          (s) =>
            `${s.sessionType}: ${s.startTime || "TBD"} - ${s.endTime || "TBD"}`,
        )
        .join(", ");

      return [
        `Week ${week.weekNumber}`,
        formatDateRange(week.startDate, week.endDate),
        DEFAULT_LOCATION,
        sessionTimes,
        totalCapacity.toString(),
      ];
    }) || campSchedule;

  const title = scheduleData
    ? `${extractSeason(scheduleData.scheduleName)} ${extractYear(scheduleData.scheduleName)} Schedule`
    : "Summer 2026 Schedule";

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-14 sm:px-6 md:py-20 lg:px-8">
      <div className="overflow-hidden rounded-sm border border-white/10 bg-[#0b0f14] shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
        <div className="bg-[#68727A] py-2">
          <h3 className="text-center font-['Oswald'] text-[clamp(1.75rem,6vw,3rem)] leading-tight text-white">
            {title}
          </h3>
        </div>

        {scheduleRows.length === 0 ? (
          <div className="flex items-center justify-center px-4 py-12">
            <p className="text-center text-lg text-gray-300">
              No schedule data found. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full border-collapse text-left text-[11px] sm:text-sm">
              <caption className="sr-only">{title}</caption>
              <thead className="bg-[#272727] text-gray-200">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-1.5 py-2.5 font-semibold leading-tight sm:px-3 sm:py-3"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-white/10 bg-[#1A1A1A] transition-colors hover:bg-[#171d26]"
                  >
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className="px-1.5 py-2.5 text-gray-200 leading-tight sm:px-3 sm:py-3"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
