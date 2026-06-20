import React from "react";

export default function RoyalCupPage() {
  return (
    <div className="w-full bg-black">
      {/* Hero Section */}
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
            Royal Cup
          </h1>
          <p className="text-xl font-semibold" style={{ color: "#35BACB" }}>
            THE ULTIMATE TEST. ONE WEEKEND. ONE CHAMPION.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-16 md:py-24 bg-black relative">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 relative z-10">
          {/* Tournament Format Box */}
          <div
            className="bg-[#2a2a2a]/90 backdrop-blur-sm border-l-4 p-8 rounded mb-8"
            style={{
              borderLeft: "8px solid #FF6B35",
            }}
          >
            <h3 className="text-white text-2xl font-bold mb-6 font-['Oswald']">
              TOURNAMENT FORMAT
            </h3>
            <div
              className="text-sm space-y-4"
              style={{
                color: "var(--Text-2nd, #E3E3E3)",
                fontFamily: "Open Sans",
              }}
            >
              <p>
                <strong>NOT</strong> single elimination; Full tournament
                weekend.
              </p>
              <div>
                <p className="font-bold mb-2">Day 1</p>
                <ul className="space-y-1 ml-4">
                  <li>• 8 groups of 4 teams</li>
                  <li>• Each team guaranteed 3 games</li>
                  <li>• Top 2 from each pool advance</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2">Day 2</p>
                <ul className="space-y-1 ml-4">
                  <li>• 16 teams compete for the title</li>
                  <li>• Sweet 16, Quarterfinals, Semifinals, Championship</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Qualification Box */}
          <div
            className="bg-[#2a2a2a]/90 backdrop-blur-sm border-l-4 p-8 rounded mb-10"
            style={{
              borderLeft: "8px solid #FF1493",
            }}
          >
            <h3 className="text-white text-2xl font-bold mb-6 font-['Oswald']">
              QUALIFICATION
            </h3>
            <div
              className="text-sm space-y-4"
              style={{
                color: "var(--Text-2nd, #E3E3E3)",
                fontFamily: "Open Sans",
              }}
            >
              <div>
                <p className="font-bold mb-2" style={{ color: "#FF006E" }}>
                  AUTOMATIC QUALIFIERS
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Crown Series tournament champions (4 per year)</li>
                  <li>• Crown Series runners-up</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2" style={{ color: "#FF006E" }}>
                  AT-LARGE SELECTIONS
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Proving Series champions</li>
                  <li>• Dominant Proving Series teams</li>
                  <li>
                    • Teams demonstrating elite performance on and off the field
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Entry Fee Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1a1a1a]/80 border border-[#333] rounded-lg p-8 text-center">
              <h4
                className="text-lg font-semibold mb-2"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Youth Royal Cup
              </h4>
              <p
                className="text-sm mb-4"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                March (Annually)
              </p>
              <p className="text-[#FF006E] text-4xl font-bold">$800</p>
            </div>

            <div className="bg-[#1a1a1a]/80 border border-[#333] rounded-lg p-8 text-center">
              <h4
                className="text-lg font-semibold mb-2"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Adult Royal Cup
              </h4>
              <p
                className="text-sm mb-4"
                style={{
                  color: "var(--Text-2nd, #E3E3E3)",
                  fontFamily: "Open Sans",
                }}
              >
                Late July (Annually)
              </p>
              <p className="text-[#FF006E] text-4xl font-bold">$1,200</p>
            </div>
          </div>

          {/* How to Qualify Button */}
          <div className="text-center">
            <button className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-12 rounded-lg shadow-lg transition">
              How to Qualify
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
