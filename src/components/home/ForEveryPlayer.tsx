"use client";
import { Trophy, Users } from "lucide-react";
import Image from "next/image";
import waterMarkTop from "@/assets/wartermark-hit-top.png";

const divisions = [
  {
    id: 1,
    title: "Youth ( Ages 8 - 18 )",
    icon: Users,
    borderColor: "border-l-4 border-[#A232D6]",
    iconBg: "bg-[#A232D6]",
    iconColor: "text-white",
    priceColor: "text-[#A232D6]",
    bulletColor: "text-[#A232D6]",
    categories: [
      "U9/U10 Boys & Girls",
      "U11/U12 Boys & Girls",
      "U13/U14 Boys & Girls",
      "High School Boys & Girls",
    ],
    entryFee: "$350-$650",
    feeLabel: "Per Team",
    bgImage: "url('/forevery1.png')",
  },
  {
    id: 2,
    title: "Adult ( Ages 16+ )",
    icon: Trophy,
    borderColor: "border-l-4 border-[#EAB634]",
    iconBg: "bg-[#EAB634]",
    iconColor: "text-white",
    priceColor: "text-[#EAB634]",
    bulletColor: "text-[#EAB634]",
    categories: [
      "Men's Division 1 (Premier)",
      "Men's Division 2 (Intermediate)",
      "Women's (All Levels)",
      "Coed (Recreational)",
    ],
    entryFee: "$500-$5,000",
    feeLabel: "Per Team",
    bgImage: "url('/forevery2.png')",
  },
];

const ForEveryPlayer = () => {
  return (
    <section className="relative w-full bg-black py-16 md:py-24">
      {/* Container */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image src={waterMarkTop} alt="Watermark" className="w-100 h-150" />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-['Oswald'] font-bold text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-2">
            For Every Player, Every Level
          </h2>
          <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
        </div>

        {/* Cards Grid (responsive + centered, no weird max-w jumps) */}
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {divisions.map((division) => (
            <div
              key={division.id}
              className={`bg-[#2a2a2a] p-5 sm:p-6 ${division.borderColor} border border-[#444] rounded-lg hover:shadow-lg transition-all duration-300 flex flex-col`}
              style={{
                backgroundImage: division.bgImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div
                  className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 ${division.iconBg} rounded-full flex items-center justify-center`}
                >
                  <division.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${division.iconColor}`}
                  />
                </div>

                <h3 className="font-['Oswald'] text-xl sm:text-2xl font-bold text-white leading-snug">
                  {division.title}
                </h3>
              </div>

              {/* Categories */}
              <ul className="space-y-2.5 sm:space-y-3 mb-8">
                {division.categories.map((category, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span
                      className={`${division.bulletColor} font-bold mt-0.5`}
                    >
                      ●
                    </span>
                    <span
                      className="text-gray-300 text-sm sm:text-[15px] leading-relaxed"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {category}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Entry Fee aligned */}
              <div className="border-t border-[#444] pt-4 mt-auto">
                <p className="text-gray-400 text-xs font-semibold mb-2">
                  Entry Fee
                </p>
                <p
                  className={`${division.priceColor} text-2xl sm:text-3xl font-bold`}
                >
                  {division.entryFee}
                  <span className="text-xs font-normal text-gray-400 ml-2 block">
                    {division.feeLabel}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-10 md:mt-12">
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 rounded transition">
            Find Your Division
          </button>
        </div>
      </div>
    </section>
  );
};

export default ForEveryPlayer;
