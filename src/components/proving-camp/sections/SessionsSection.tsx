import { campSessions } from "@/components/proving-camp/data";
import { CalendarDays, Clock3, Users } from "lucide-react";

interface Session {
  sessionType: string;
  title: string;
  startTime: string;
  endTime: string;
  dropOffTime: string;
  capacity: number;
  totalRegistered: number;
  goalieSlots: number;
}

interface Week {
  sessions: Session[];
}

interface ScheduleData {
  weeks: Week[];
}

interface SessionCardProps {
  title: string;
  time: string;
  duration: string;
  note: string;
}

interface SessionsSectionProps {
  scheduleData?: ScheduleData | null;
}

function SessionCard({ title, time, duration, note }: SessionCardProps) {
  const isAM = title.toLowerCase().includes("am");

  return (
    <article
      className={`relative h-full overflow-hidden rounded-md border p-4 shadow-[0_0_35px_rgba(9,196,220,0.08)] sm:p-5 ${
        isAM ? "border-cyan-400/50" : "border-white/20"
      } bg-[#0e1117]/20`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/camp/series.png')" }}
      />
      <div className="absolute inset-0 bg-black/68" />

      <div className="relative">
        <span
          className={`inline-flex rounded-sm px-3 py-1 text-[11px] font-semibold ${
            isAM
              ? "bg-[#16d6e8]/20 text-[#6ce9f5]"
              : "bg-white/12 text-gray-200"
          }`}
        >
          {title}
        </span>

        <div className="mt-4 space-y-3 text-sm text-gray-100">
          <p className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 text-cyan-300" />
            <span>
              <span className="block text-[11px] text-gray-400">Drop-off</span>
              <span className="font-semibold">{time}</span>
            </span>
          </p>

          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 text-cyan-300" />
            <span>
              <span className="block text-[11px] text-gray-400">Time</span>
              <span className="font-semibold">{duration}</span>
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 text-cyan-300" />
            <span>
              <span className="block text-[11px] text-gray-400">Ages</span>
              <span className="font-semibold">
                {isAM ? "8 - 14" : "11 - 14"}
              </span>
            </span>
          </p>
        </div>

        <div className="my-4 h-px bg-white/20" />
        <p className="text-xs leading-5 text-gray-300 md:text-sm">{note}</p>
      </div>
    </article>
  );
}

export default function SessionsSection({
  scheduleData,
}: SessionsSectionProps) {
  // Get sessions from schedule data if available, otherwise use hardcoded data
  const sessions =
    scheduleData?.weeks?.[0]?.sessions?.map((session: Session) => ({
      title: `${session.sessionType} Session`,
      time: session.dropOffTime,
      duration: `${session.startTime} - ${session.endTime}`,
      note: `Designed for players ages 8–14, this training camp delivers a progressive development environment. Players aged 8–10 focus on building strong technical fundamentals, confidence, and enjoyment of the game through engaging, high-energy, game-based sessions. Players aged 11–14 are placed in a more challenging setting emphasizing technical refinement, tactical understanding, competitive small-sided games, and goalkeeper-specific training for eligible participants, with higher training intensity to enhance performance and game awareness. All players benefit from a structured learning experience, with a written evaluation provided at the end of the week to assess progress and support continued development.`,
    })) || campSessions;

  return (
    <section id="sessions" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-['Oswald'] text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] text-white">
            Single Session. Multiple Age Groups.
          </h2>
          <div className="mx-auto mt-3 h-0.75 w-28 rounded-full bg-[#14d6ea]" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base md:leading-7">
            Our session runs from 9:00 AM to 12:00 PM with differentiated
            coaching to serve both younger and older players within the same
            environment.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
          {sessions.map((session) => (
            <SessionCard key={session.title} {...session} />
          ))}
        </div>
      </div>
    </section>
  );
}
