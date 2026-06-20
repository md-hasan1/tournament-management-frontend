"use client";
import Image from "next/image";
import { useState } from "react";

export default function RulesPage() {
  const [activeSection, setActiveSection] = useState("game-format");

  const sections = [
    { id: "game-format", label: "Game Format" },
    { id: "game-duration", label: "Game Duration" },
    { id: "substitutions", label: "Substitutions" },
    { id: "scoring", label: "Scoring" },
    { id: "tiebreakers", label: "Tiebreakers" },
    { id: "overtime", label: "Overtime & Elimination" },
    { id: "rosters", label: "Rosters" },
    { id: "cards", label: "Cards & Conduct" },
    { id: "weather", label: "Weather Policy" },
    { id: "code-conduct", label: "Code of Conduct" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-70 sm:h-85 md:h-105 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/standing.png"
            alt="Rules background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 font-['Oswald']">
            Official Tournament Rules
          </h1>
          <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
          <p
            className="text-gray-200 text-sm sm:text-base md:text-lg"
            style={{ fontFamily: "Open Sans" }}
          >
            Complete guide to Crown Series tournament competition standards
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-[#1a1a1a] border-2 border-[#35BACB] rounded-lg p-4 md:p-6">
              <h3 className="text-white font-bold text-lg mb-4 font-['Oswald']">
                Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm md:text-base ${
                      activeSection === section.id
                        ? "bg-[#35BACB] text-black font-semibold"
                        : "text-gray-300 hover:text-[#35BACB] hover:bg-[#2a2a2a]"
                    }`}
                    style={{ fontFamily: "Open Sans" }}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              {/* Download PDF Button */}
              <button
                className="w-full mt-6 bg-[#35BACB] text-black font-bold py-3 rounded-lg hover:bg-[#A232D6] transition flex items-center justify-center gap-2"
                style={{ fontFamily: "Open Sans" }}
              >
                <span>📄</span> Download Rules PDF
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* 1. Game Format */}
            <section
              id="game-format"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                1. Game Format
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  <strong className="text-[#35BACB]">Team Size:</strong> 7v7
                  (seven players per side on the field at one time)
                </p>
                <p>
                  <strong className="text-[#35BACB]">Field Size:</strong> 50-65
                  yards long x 30-40 yards wide, depending on venue
                </p>
                <p>
                  <strong className="text-[#35BACB]">Ball Size:</strong>{" "}
                  Determined by age group. Size 4 for ages 11 and under. Size 5
                  for ages 12 and older.
                </p>
                <p>
                  All games follow FIFA Laws of the Game with modifications as
                  specified in these Crown and Pitch rules.
                </p>
              </div>
            </section>

            {/* 2. Game Duration */}
            <section
              id="game-duration"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                2. Game Duration
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  <strong className="text-[#35BACB]">Game Length:</strong> Two
                  12-minute halves (24 minutes total) for all divisions
                </p>
                <p>
                  <strong className="text-[#35BACB]">Clock Style:</strong>{" "}
                  Running clock throughout (no stop time for substitutions or
                  throw-ins)
                </p>
                <p>
                  <strong className="text-[#35BACB]">Halftime:</strong> Short
                  2-minute break between halves
                </p>
                <p>Time-outs are not permitted. No restriction on coaching.</p>
              </div>
            </section>

            {/* 3. Substitutions */}
            <section
              id="substitutions"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                3. Substitutions
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  <strong className="text-[#35BACB]">
                    Unlimited Substitutions:
                  </strong>{" "}
                  Teams may substitute unlimited players during play
                </p>
                <p>
                  <strong className="text-[#35BACB]">On-the-Fly:</strong>{" "}
                  Substitutes enter at midfield without stopping play (similar
                  to ice hockey)
                </p>
                {/* Timing section removed as per instructions */}
                <p>
                  Substitutes must be properly checked in with the referee
                  before entering play. Player safety and roster compliance are
                  mandatory.
                </p>
              </div>
            </section>

            {/* 4. Scoring */}
            <section
              id="scoring"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                4. Scoring (Pool Play)
              </h2>
              <div
                className="space-y-6 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p className="text-base">
                  <strong className="text-[#35BACB]">
                    Pool play uses a Win/Tie/Loss system:
                  </strong>
                </p>
                <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong className="text-[#35BACB]">Win:</strong> 3 points
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong className="text-[#35BACB]">Tie:</strong> 1 point
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong className="text-[#35BACB]">Loss:</strong> 0 points
                    </span>
                  </div>
                </div>
                <p>
                  <strong className="text-[#35BACB]">
                    Crown Series Qualification Points:
                  </strong>{" "}
                  Prize placement in elimination rounds earns Crown Series
                  points (see Standings page for details).
                </p>
              </div>
            </section>

            {/* 5. Tiebreakers */}
            <section
              id="tiebreakers"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                5. Tiebreakers
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  When teams have equal points, the following criteria break
                  ties in order:
                </p>
                <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-[#35BACB] font-bold">1. Head-to-Head</p>
                    <p className="text-sm">Result between the tied teams</p>
                  </div>
                  <div>
                    <p className="text-[#35BACB] font-bold">
                      2. Goal Differential
                    </p>
                    <p className="text-sm">
                      Capped at ±5 goals (for pool play fairness)
                    </p>
                  </div>
                  <div>
                    <p className="text-[#35BACB] font-bold">3. Goals Scored</p>
                    <p className="text-sm">
                      Capped at 7 goals maximum per game
                    </p>
                  </div>
                  <div>
                    <p className="text-[#35BACB] font-bold">
                      4. Fewest Goals Allowed
                    </p>
                    <p className="text-sm">Defensive record in pool play</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Overtime & Elimination */}
            <section
              id="overtime"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                6. Overtime & Elimination Rounds
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  <strong className="text-[#35BACB]">Elimination Draws:</strong>{" "}
                  If a knockout game ends in a tie:
                </p>
                <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-3">
                  <p>
                    <strong className="text-[#35BACB]">
                      2 x 5-Minute Sudden Death
                    </strong>
                  </p>
                  <p>
                    If still tied after two 5-minute sudden death periods,
                    proceed to penalty kicks.
                  </p>
                </div>
                <p>
                  <strong className="text-[#35BACB]">Penalty Kicks:</strong> 5
                  kicks per team in regulation PKs (best-of-5 series). If still
                  tied, alternating sudden-death PKs until a winner is
                  determined.
                </p>
              </div>
            </section>

            {/* 7. Rosters */}
            <section
              id="rosters"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                7. Rosters
              </h2>
              <div
                className="space-y-4 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <p>
                  <strong className="text-[#35BACB]">Roster Size:</strong>{" "}
                  Maximum 12 players per tournament team
                </p>
                <p>
                  <strong className="text-[#35BACB]">
                    Player Eligibility:
                  </strong>{" "}
                  All players must meet the age requirements of their registered
                  division
                </p>
                <p>
                  <strong className="text-[#35BACB]">
                    Registration Deadline:
                  </strong>{" "}
                  All rosters must be submitted 48 hours before the tournament
                  start date
                </p>
              </div>
            </section>

            {/* 8. Cards & Conduct */}
            <section
              id="cards"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                8. Cards & Conduct
              </h2>
              <div
                className="space-y-6 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Yellow Card</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>1 yellow card: no suspension</li>
                    <li>
                      2 yellow cards in one game: removal from current match and
                      disqualified for next match
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Red Card</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Immediate ejection from game</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">
                    Tournament Card Accumulation
                  </p>
                  <p className="text-sm">
                    If a player receives 3 cards throughout the tournament, they
                    must sit out the next game.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Weather Policy */}
            <section
              id="weather"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                9. Weather Policy
              </h2>
              <div
                className="space-y-6 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Minor Weather</p>
                  <p className="text-sm">
                    Light rain, wind, or overcast conditions: Play continues
                    normally
                  </p>
                </div>
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">
                    Severe Weather
                  </p>
                  <p className="text-sm">
                    Lightning, heavy rain, hail, or heat index above 105°F:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>Tournament director may delay or suspend games</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 10. Code of Conduct */}
            <section
              id="code-conduct"
              className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 font-['Oswald']">
                10. Code of Conduct
              </h2>
              <div
                className="space-y-6 text-gray-300"
                style={{ fontFamily: "Open Sans" }}
              >
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Players</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Respect referees and opposing players at all times</li>
                    <li>
                      No abusive language, threats, or aggressive physical
                      contact
                    </li>
                    <li>Play with integrity and sportsmanship</li>
                    <li>
                      Violations may result in yellow/red cards or tournament
                      suspension
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Coaches</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Set example of professionalism and respect</li>
                    <li>Disputes resolved civilly with tournament director</li>
                    <li>Failure to comply may result in team ejection</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[#35BACB] font-bold mb-2">Spectators</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Cheer respectfully for your team</li>
                    <li>No heckling, insulting opposing teams or referees</li>
                    <li>
                      Violence, intoxication, or discrimination = immediate
                      removal
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Download PDF CTA */}
            <section className="bg-linear-to-r from-[#35BACB]/10 to-[#00CCFF]/10 border-2 border-[#35BACB] rounded-lg p-6 md:p-8 text-center">
              <h3 className="text-white font-bold text-xl md:text-2xl mb-3 font-['Oswald']">
                Download Official Rules
              </h3>
              <p
                className="text-gray-300 mb-6"
                style={{ fontFamily: "Open Sans" }}
              >
                Get a PDF copy of all tournament rules and regulations
              </p>
              <button
                className="inline-block bg-[#35BACB] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#A232D6] transition"
                style={{ fontFamily: "Open Sans" }}
              >
                📄 Download PDF
              </button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
