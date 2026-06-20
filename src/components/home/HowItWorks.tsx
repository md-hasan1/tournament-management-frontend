"use client";
import { Crown, Target, Trophy } from "lucide-react";
import Link from "next/link";

const series = [
  {
    id: 1,
    title: "Proving Series",
    icon: Target,
    description:
      "Weekly tournaments. Open to all. Earn points toward Crown Series qualification.",
    extra: "↓ Earn Points ↓",
    borderColor: "border-[#35BACB]",
    iconColor: "text-[#35BACB]",
  },
  {
    id: 2,
    title: "Crown Series",
    icon: Trophy,
    description:
      "Quarterly Championships. Invitation-based. Top 8 teams (2 tournament minimum).",
    extra: "↓ Champions ↓",
    borderColor: "border-[#A232D6]",
    iconColor: "text-[#A232D6]",
  },
  {
    id: 3,
    title: "Royal Cup",
    icon: Crown,
    description:
      "Annual Championship- Up to 48 elite teams per age group. Full tournament weekend. To crown the Best of the Best.",
    extra: "👑 Champions Crowned 👑",
    borderColor: "border-[#EAB634]",
    iconColor: "text-[#EAB634]",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full bg-black py-16">
      <div className="text-center mb-12">
        <h2 className="text-[#F5F5F5] font-['Oswald'] text-[36px] sm:text-[44px] md:text-[56px] font-extrabold leading-[120%]">
          How It Works
        </h2>
        <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-8 justify-center w-full max-w-5xl mb-10">
          {series.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between border ${item.borderColor} rounded-lg bg-[#181818] px-8 py-8 w-full md:w-1/3 min-h-92.5 shadow-lg`}
            >
              <div className="flex flex-col items-center mb-4">
                <span
                  className={`mb-4 text-4xl ${item.iconColor} bg-[#35BACB1A] p-4 rounded-full`}
                >
                  <item.icon size={48} />
                </span>
                <h3 className="text-white text-2xl font-bold mb-2 font-['Oswald'] text-center">
                  {item.title}
                </h3>
                <p
                  className="text-gray-300 text-center mb-4"
                  style={{ fontFamily: "Open Sans" }}
                >
                  {item.description}
                </p>
                <div className="w-full border-t border-gray-700 my-2"></div>
              </div>
              <div className="text-center text-gray-300 text-sm">
                {item.extra}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={"/how-it-works"}
          className="border border-gray-300 text-white font-bold py-3 px-10 rounded-md text-lg transition hover:bg-[#222]"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
