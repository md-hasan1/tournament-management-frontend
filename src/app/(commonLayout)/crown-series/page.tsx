import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Crown Series | Crown & Pitch",
  description:
    "Explore Crown Series tournaments at Crown & Pitch. Learn how qualification works, entry fees for youth and adult teams, and current standings.",
  keywords: [
    "Crown Series",
    "Crown and Pitch",
    "basketball tournament",
    "youth teams",
    "adult teams",
    "quarterly tournament",
    "sports standings",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/crown-series",
  },
  openGraph: {
    title: "Crown Series | Crown & Pitch",
    description:
      "Explore Crown Series tournaments at Crown & Pitch. Learn qualification rules, entry fees, and standings.",
    url: "https://www.crownandpitch.com/crown-series",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crown Series | Crown & Pitch",
    description:
      "Explore Crown Series tournaments at Crown & Pitch. Learn qualification rules, entry fees, and standings.",
  },
};

export default function CrownSeriesPage() {
  return (
    <div className="w-full bg-black">
      <section className="relative h-75 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/crowns.png')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-['Oswald']">
            CROWN SERIES
          </h1>
          <p className="text-xl text-gray-300">Where Champions are Made</p>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-black relative">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 relative z-10">
          <div
            className="bg-[#2a2a2a]/90 backdrop-blur-sm border-l-4 border-[#FF6B35] p-8 rounded mb-12"
            style={{
              borderLeft: "8px solid #FF6B35",
            }}
          >
            <h3 className="text-white text-2xl font-bold mb-6 font-['Oswald']">
              HOW IT WORKS
            </h3>
            <ul className="space-y-3">
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Quarterly based tournament series</strong> 4 per year
                </span>
              </li>
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Automatic qualification</strong> top 8 teams per
                  division and Proving Series as champions
                </span>
              </li>
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Invitation based</strong> At large bids determined by
                  tournament officials
                </span>
              </li>
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Youth</strong> Must play minimum 2 Proving Series
                  tournaments
                </span>
              </li>
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Adult</strong> No minimum tournaments required
                </span>
              </li>
              <li
                className="text-sm flex items-start gap-3"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                <span className="text-[#35BACB] font-bold min-w-fit">•</span>
                <span>
                  <strong>Up to 24 team tournament</strong>
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1a1a1a]/80 border border-[#333] rounded-lg p-8 text-center">
              <h4
                className="text-lg font-semibold mb-4"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Entry Fee
              </h4>
              <p className="text-[#FF6B35] text-4xl font-bold mb-2">$900</p>
              <p
                className="text-sm"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Youth Teams
              </p>
            </div>

            <div className="bg-[#1a1a1a]/80 border border-[#333] rounded-lg p-8 text-center">
              <h4
                className="text-lg font-semibold mb-4"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Entry Fee
              </h4>
              <p className="text-[#FF6B35] text-4xl font-bold mb-2">$1,000</p>
              <p
                className="text-sm"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Adult Teams
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-12 rounded-lg shadow-lg transition">
              View Current Standings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
