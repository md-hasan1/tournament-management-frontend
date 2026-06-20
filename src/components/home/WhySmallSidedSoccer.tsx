"use client";
import React from "react";
import Image from "next/image";

const stats = [
  { label: "Ball touches per player", value: 340, percentage: 65 },
  { label: "High Intensity Sprints", value: 120, percentage: 55 },
  { label: "Transitions Per Minute", value: 180, percentage: 45 },
];

const WhySmallSidedSoccer = () => {
  return (
    <section className="w-full min-h-175 md:min-h-200 relative overflow-hidden py-16">
      {/* Background Image */}
      <div className="absolute inset-0 top-0 left-0 w-full h-full">
        <Image
          src="/players.png"
          alt="Soccer background"
          fill
          className="object-cover object-center w-full h-full"
        />
        {/* Dark overlay to match Figma contrast */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="max-w-[90%] mx-auto px-2 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-white mb-4">
              Why Small-Sided Soccer
            </h2>
            {/* Heading underline */}
            <p className="bg-[#35BACB] w-24 h-1 mb-6 rounded"></p>
            <p
              className="text-gray-400 text-lg mb-10 leading-relaxed"
              style={{ fontFamily: "Open Sans" }}
            >
              Standard 11v11 limits touches. Small-sided maximizes individual
              impact, more touches on the ball, and quicker decisions.
            </p>

            {/* Stats Bars */}
            <div className="space-y-6 max-w-xl">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-white font-medium"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="text-[#35BACB] font-bold"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {stat.value}%
                    </span>
                  </div>
                  <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#35BACB] rounded-full transition-all duration-1000"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Could add an image or leave empty for the background effect */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default WhySmallSidedSoccer;
