import waterMarkTop from "@/assets/wartermark-hit-top.png";
import { Gift, Star, Trophy, Users } from "lucide-react";
import Image from "next/image";

import { campPillars } from "@/components/proving-camp/data";

const iconMap = [
  {
    Icon: Trophy,
    color: "text-[#A232D6]",
    ring: "border-[#A232D61A]/30 bg-[#A232D61A]/90",
    title: "Credentialed Coaches",
    border: "border-[#A232D6]/20",
  },
  {
    Icon: Users,
    color: "text-[#EBB736]",
    ring: "border-[#EBB736]/30 bg-[#EBB736]/20",
    title: "Small Groups",
    border: "border-[#EBB736]/20",
  },
  {
    Icon: Star,
    color: "text-[#5FD335]",
    ring: "border-[#5FD335]/30 bg-[#5FD335]/10",
    title: "All Skill Levels",
    border: "border-[#5FD335]/20",
  },
  {
    Icon: Gift,
    color: "text-[#E19E9C]",
    ring: "border-[#E19E9C]/30 bg-[#E19E9C]/10",
    title: "Gear Included",
    border: "border-[#E19E9C]/20",
  },
] as const;

export default function IntroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Watermark */}
      <div className="pointer-events-none absolute -bottom-12 left-0 h-60 w-50 opacity-70 sm:h-80 sm:w-64 md:h-96 md:w-80">
        <Image
          src={waterMarkTop}
          alt="Watermark"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 
      <div className="pointer-events-none absolute left-52 top-[58%] hidden h-20 w-16 -rotate-45 rounded-lg bg-[#18d6e8]/18 lg:block" /> */}

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid items-center gap-7 md:grid-cols-[1.02fr_0.98fr] md:gap-10">
          <div className="text-center md:text-left">
            <h2 className="font-['Oswald'] text-[clamp(2.2rem,5.2vw,4.1rem)] leading-[0.98] text-white">
              More Than a Summer Camp.
            </h2>
            <div className="mx-auto mt-3 h-0.75 w-44 rounded-full bg-[#16d6e8] md:mx-0 md:w-60" />

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg md:mx-0 md:max-w-none md:text-base">
              Crown & Pitch Proving Camp isn&lsquo;t your average summer
              program. Every session is run by former professional, current
              semi-professional, and college-level players and coaches who bring
              real game experience to every drill, every rep, and every
              conversation on the pitch.  We keep groups small, the pace high,
              and the energy higher. Whether your player is picking up the game
              for the first time or looking to sharpen what they already have,
              Proving Camp is where the work gets done — and where the fun
              happens too.
            </p>
            <p className="mt-3 text-sm font-semibold text-[#1fd4e7] md:text-base">
              Work hard. Get better. Come back.
            </p>
          </div>

          <div className="relative aspect-16/10 overflow-hidden rounded-md border border-cyan-300/35 shadow-[0_18px_38px_rgba(0,0,0,0.45)] sm:aspect-video lg:aspect-4/3">
            <Image
              src="/camp/series.png"
              alt="Players training at proving camp"
              fill
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 40vw"
            />
          </div>
        </div>

        <div className="mb-10 mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {campPillars.map((item, index) => {
            const meta = iconMap[index];

            return (
              <article
                key={item.title}
                className={`rounded-md border ${meta.border} bg-[#1A1A1A] px-4 py-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:bg-[#1f1f1f]`}
              >
                <span
                  className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border ${meta.ring}`}
                >
                  <meta.Icon className={`h-8 w-8 ${meta.color}`} />
                </span>

                <h3 className="mt-3 font-['Oswald'] text-xl leading-none text-white sm:text-2xl">
                  {meta.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-400">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
