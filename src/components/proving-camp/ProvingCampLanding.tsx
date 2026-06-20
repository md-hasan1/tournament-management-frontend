"use client";
import CoachesSection from "@/components/proving-camp/sections/CoachesSection";
import FaqSection from "@/components/proving-camp/sections/FaqSection";
import FeaturesPricingSection from "@/components/proving-camp/sections/FeaturesPricingSection";
import FinalCtaSection from "@/components/proving-camp/sections/FinalCtaSection";
import HeroSection from "@/components/proving-camp/sections/HeroSection";
import IntroSection from "@/components/proving-camp/sections/IntroSection";
import PartnersSection from "@/components/proving-camp/sections/PartnersSection";
import ReadyToProveSection from "@/components/proving-camp/sections/ReadyToProveSection";
import RegistrationSection from "@/components/proving-camp/sections/RegistrationSection";
import ScheduleSection from "@/components/proving-camp/sections/ScheduleSection";
import SessionsSection from "@/components/proving-camp/sections/SessionsSection";
import { useGetAllSchedulesQuery } from "@/redux/apiHooks/camp/campApi";

interface Schedule {
  id: string;
  scheduleName: string;
  season: "SUMMER" | "FALL" | "WINTER" | "SPRING";
  status: "ACTIVE" | "INACTIVE";
  startDate: string;
  endDate: string;
  numberOfWeek: number;
  weeks: Week[];
}

interface Week {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: string;
  sessions: Session[];
}

interface Session {
  id: string;
  sessionType: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  totalRegistered: number;
  goalieSlots: number;
  totalGoalieRegistered: number;
}

export default function ProvingCampLanding() {
  const { data } = useGetAllSchedulesQuery({ limit: 1000, page: 1 });

  // Filter active schedules
  const activeSchedules =
    data?.data?.filter((schedule: Schedule) => schedule.status === "ACTIVE") ||
    [];

  // Get the primary active schedule (usually SUMMER if available)
  const primarySchedule = activeSchedules[0] || null;

  return (
    <main className="bg-black text-white">
      <HeroSection
        scheduleData={primarySchedule}
        allSchedules={activeSchedules}
      />
      <IntroSection />
      <SessionsSection scheduleData={primarySchedule} />
      <ScheduleSection scheduleData={primarySchedule} />
      <CoachesSection />
      <FeaturesPricingSection />
      <ReadyToProveSection />
      <RegistrationSection scheduleData={primarySchedule} />
      <FaqSection />
      <PartnersSection />
      <FinalCtaSection scheduleData={primarySchedule} />
    </main>
  );
}
