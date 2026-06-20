"use client";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      number: 1,
      title: "START IN THE PROVING SERIES",
      description:
        "Weekly tournaments across DFW. Open registration, anyone can play. Earn points based on tournament finishes.",
      points: [
        "Youth and adult divisions available",
        "Registration fees vary by division- current pricing always listed on the event registration page",
        "3-game minimum guarantee",
      ],
      color: "#35BACB",
      borderClass: "border-l-4 border-l-[#35BACB]",
      numberBg: "bg-[#35BACB]",
    },
    {
      id: 2,
      number: 2,
      title: "QUALIFY FOR CROWN SERIES",
      description:
        "Top performers earn invitations to quarterly championship tournaments.",
      points: [
        "Youth: Top 8 teams (minimum 2 Proving Series tournaments played)",
        "Adult: Top performers (no minimum required)",
        "4 Crown Series per year",
        "Registration fees vary by division- current pricing listed on the event page",
      ],
      color: "#FF6B35",
      borderClass: "border-l-4 border-l-[#FF6B35]",
      numberBg: "bg-[#FF6B35]",
    },
    {
      id: 3,
      number: 3,
      title: "COMPETE FOR THE ROYAL CUP",
      description:
        "Annual championship. Up to 48 elite teams. Full weekend tournament format.",
      points: [
        "Crown Series champions earn automatic qualification",
        "At-large selections for top performers",
        "Cash prizes awarded across all divisions",
        "The biggest stage in DFW 7v7 soccer",
      ],
      color: "#FF1493",
      borderClass: "border-l-4 border-l-[#FF1493]",
      numberBg: "bg-[#FF1493]",
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-75 items-center justify-center overflow-hidden bg-cover bg-center sm:min-h-90 md:min-h-105">
        <div className="absolute inset-0">
          <Image
            src="/howitswork.png"
            alt="How It Works background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 px-4 text-center">
          <h1 className="mb-3 font-['Oswald'] text-4xl font-bold text-white sm:text-5xl md:mb-4 md:text-6xl">
            How It Works
          </h1>
          <p
            className="mx-auto max-w-xl text-base text-gray-200 sm:text-lg"
            style={{ fontFamily: "Open Sans" }}
          >
            Your path from the Proving Series to the Royal Cup.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[90%] px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
        {/* Steps */}
        <div className="mb-14 space-y-6 sm:space-y-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`${step.borderClass} relative rounded-lg border border-[#333] bg-[#1a1a1a] p-5 sm:p-6`}
            >
              {/* Number Circle */}
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-black sm:absolute sm:-left-6 sm:top-6 sm:h-12 sm:w-12 sm:text-lg ${step.numberBg}`}
              >
                {step.number}
              </div>

              <div className="sm:ml-4">
                <h3 className="mb-3 font-['Oswald'] text-xl font-bold text-white md:text-2xl">
                  {step.title}
                </h3>
                <p
                  className="mb-4 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7"
                  style={{ fontFamily: "Open Sans" }}
                >
                  {step.description}
                </p>

                <ul className="space-y-2 text-sm text-gray-300 sm:text-base">
                  {step.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: step.color }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mb-10 flex justify-center">
          <Link href="/tournaments" className="w-full sm:w-auto">
            <button className="w-full rounded-lg bg-[#35BACB] px-8 py-3 text-base font-bold text-black shadow-lg transition hover:bg-[#A232D6] sm:w-auto sm:px-12 sm:text-lg font-['Oswald']">
              Register Your First Tournament
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
