"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-75 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/abouth.png"
            alt="About background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center">
          <div className="pb-2">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-['Oswald']">
              Our Story
            </h1>
            <div className="w-25 border-2 border-[#35BACB] mx-auto" />
          </div>

          <p
            className="text-[#35BACB] text-lg font-semibold "
            style={{ fontFamily: "Open Sans" }}
          >
            FOR THE PLAYERS. FOR THE GAME.
          </p>
        </div>
      </section>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 py-16">
        {/* The Concrete Field Philosophy */}
        <section className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] border-r-2 border-r-[#00CCFF] rounded-lg p-6 mb-12">
          <h2 className="text-white font-bold text-2xl mb-4 font-['Oswald']">
            THE CONCRETE FIELD PHILOSOPHY
          </h2>
          <div
            className="space-y-4 text-gray-300"
            style={{ fontFamily: "Open Sans" }}
          >
            <p>
              In South America, it&apos;s dirt lots between buildings. In
              Europe, it&apos;s parking lots and the street.
            </p>
            <p>
              <strong>
                The best players in the world didn&apos;t start on manicured
                grass. They started on gritty fields where talent and
                determination mattered more than money.
              </strong>{" "}
            </p>
            <p className="text-gray-400">
              America doesn&apos;t have those fields.
            </p>
            <p>
              <span className="text-[#35BACB] font-bold">
                Crown & Pitch is the American field.
              </span>
            </p>
            <p>
              We&apos;re building pop-up tournaments across DFW where anyone can
              show up and prove themselves. Where performance determines your
              path, not politics. Where the field comes to you through rotating
              locations. Where quality competition doesn&apos;t require a
              country club membership.
            </p>
          </div>
        </section>

        {/* What's Broken in American Soccer */}
        <section className="bg-[#1a1a1a] border-l-4 border-l-[#FF6B35] border-r-2 border-r-[#00CCFF] rounded-lg p-6 mb-12">
          <h2 className="text-white font-bold text-2xl mb-6 font-['Oswald']">
            WHAT&apos;S BROKEN IN AMERICAN SOCCER
          </h2>
          <div className="space-y-4" style={{ fontFamily: "Open Sans" }}>
            <div>
              <h3 className="text-white font-semibold mb-2">
                <span className="text-[#FF6B35]">•</span> Politics over
                performance
              </h3>
              <p className="text-gray-300 ml-6">
                Too often, playing time depends on parents&apos; involvement or
                club politics, not player ability.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                <span className="text-[#FF6B35]">•</span> Geographic barriers
              </h3>
              <p className="text-gray-300 ml-6">
                Quality competition is concentrated in limited areas, leaving
                players in other areas with fewer options.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                <span className="text-[#FF6B35]">•</span> Win-at-all-costs
                culture
              </h3>
              <p className="text-gray-300 ml-6">
                Youth soccer prioritizes trophies over player development and
                love of the game.
              </p>
            </div>
          </div>
        </section>

        {/* The Crown & Pitch Solution */}
        <section className="bg-[#1a1a1a] border-l-4 border-l-[#35BACB] border-r-2 border-r-[#00CCFF] rounded-lg p-6 mb-12">
          <h2 className="text-white font-bold text-2xl mb-6 font-['Oswald']">
            THE CROWN & PITCH SOLUTION
          </h2>
          <div
            className="space-y-4 text-gray-300"
            style={{ fontFamily: "Open Sans" }}
          >
            <div>
              <h3 className="text-[#35BACB] font-bold mb-2">
                <span className="text-[#35BACB]">•</span> Pop-up tournaments
                across DFW
              </h3>
              <p>
                The field comes to you. Rotating locations ensure fair
                geographic access.
              </p>
            </div>
            <div>
              <h3 className="text-[#35BACB] font-bold mb-2">
                <span className="text-[#35BACB]">•</span> Open access at every
                level
              </h3>
              <p>
                No tryouts, no politics. Anyone can register for Proving Series.
              </p>
            </div>
            <div>
              <h3 className="text-[#35BACB] font-bold mb-2">
                <span className="text-[#35BACB]">•</span> Performance-based
                progression
              </h3>
              <p>
                Earn your place through results. Top teams advance to Crown
                Series → Royal Cup.
              </p>
            </div>
            <div>
              <h3 className="text-[#35BACB] font-bold mb-2">
                <span className="text-[#35BACB]">•</span> Player development
                focus
              </h3>
              <p>
                Small-sided format= 4x more touches, constant action, real
                soccer development.
              </p>
            </div>
          </div>
        </section>

        {/* Why Small-Sided Soccer */}
        <section className="bg-[#1a1a1a] border-2  rounded-lg p-8 mb-12">
          <h2 className="text-white font-bold text-2xl mb-4 font-['Oswald']">
            WHY SMALL-SIDED SOCCER?
          </h2>
          <p
            className="text-gray-300 mb-8 "
            style={{ fontFamily: "Open Sans" }}
          >
            Research and global soccer development prove that small-sided games
            (7v7, 6v6) develop better players than full-size 11v11 at youth
            levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border  rounded-lg p-6 text-center">
              <p className="text-[#35BACB] font-bold text-4xl mb-2">4X</p>
              <p className="text-gray-300 text-sm">
                More ball touches per player vs 11v11
              </p>
            </div>
            <div className="bg-black border  rounded-lg p-6 text-center">
              <p className="text-[#35BACB] font-bold text-4xl mb-2">100%</p>
              <p className="text-gray-300 text-sm">
                Players engaged in the action
              </p>
            </div>
            <div className="bg-black border  rounded-lg p-6 text-center">
              <p className="text-[#35BACB] font-bold text-3xl mb-2">More</p>
              <p className="text-gray-300 text-sm">
                Tactical decisions every minute
              </p>
            </div>
            <div className="bg-black border  rounded-lg p-6 text-center">
              <p className="text-[#35BACB] font-bold text-3xl mb-2">Better</p>
              <p className="text-gray-300 text-sm">
                Individual skill development
              </p>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-12">
          <h2 className="text-white font-bold text-2xl mb-8 font-['Oswald']">
            OUR TEAM
          </h2>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-[#35BACB] font-bold text-xl mb-2 font-['Oswald']">
                Brent Acuff - Founder
              </h3>
              <p className="text-gray-300" style={{ fontFamily: "Open Sans" }}>
                Soccer player, coach, referee, and advocate for making quality
                competition accessible to all players regardless of income or
                geography.
              </p>
            </div>
            <div>
              <h3 className="text-[#35BACB] font-bold text-xl mb-2 font-['Oswald']">
                Dean Robertson - Tournament Director
              </h3>
              <p className="text-gray-300" style={{ fontFamily: "Open Sans" }}>
                Experienced player, coach, and tournament operations specialist
                ensuring every event runs professionally and smoothly.
              </p>
            </div>
          </div>

          <p
            className="text-gray-300 italic mb-8"
            style={{ fontFamily: "Open Sans" }}
          >
            &quot;We&apos;re soccer people who love the game and want to create
            the best fun, competitive tournament experience possible.&quot;
          </p>

          {/* Team Images */}
          {/* Team Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-150 rounded-4xl overflow-hidden border-3 border-[#35BACB]">
              <Image
                src="/team1.png"
                alt="Team photo 1"
                fill
                className="object-fill"
              />
            </div>
            <div className="relative h-150 rounded-4xl overflow-hidden border-3 border-[#35BACB]">
              <Image
                src="/team2.png"
                alt="Team photo 2"
                fill
                className="object-fill"
              />
            </div>
          </div>
        </section>

        {/* Get In Touch CTA */}
        <section className="bg-linear-to-r from-[#0D272B] to-[#2B2517] border-2 border-[#35BACB] rounded-lg p-8 text-center mb-20 max-w-xl mx-auto">
          <h2 className="text-white font-bold text-2xl mb-6 font-['Oswald']">
            GET IN TOUCH
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <a
              href="mailto:info@crownandpitch.com"
              className="flex items-center gap-2 text-[#35BACB] font-semibold hover:underline"
            >
              <Mail className="w-5 h-5" />
              info@crownandpitch.com
            </a>
            <a
              href="tel:+12149458471"
              className="flex items-center gap-2 text-[#35BACB] font-semibold hover:underline"
            >
              <Phone className="w-5 h-5" />
              (214) 945-8471
            </a>
          </div>
          <Link href="/tournaments">
            <button className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-8 rounded-lg shadow-lg transition">
              View Tournaments
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
