"use client";
import { ChevronDown, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const divisionRows = [
    { division: "U9", timeline: "August 1, 2017 - July 31, 2018" },
    { division: "U10", timeline: "August 1, 2016 - July 31, 2017" },
    { division: "U11", timeline: "August 1, 2015 - July 31, 2016" },
    { division: "U12", timeline: "August 1, 2014 - July 31, 2015" },
    { division: "U13", timeline: "August 1, 2013 - July 31, 2014" },
    { division: "U14", timeline: "August 1, 2012 - July 31, 2013" },
    { division: "HS", timeline: "August 1, 2008- July 31, 2012" },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const faqSections = [
    {
      category: "Registration & Payment",
      color: "#35BACB",
      questions: [
        {
          id: "reg-1",
          q: "How do I register my team?",
          a: "Visit our Tournaments page, select an event, and click Register Now. You'll complete team information and add players. All players must complete individual waivers.",
        },
        {
          id: "reg-2",
          q: "What payment methods do you accept?",
          a: "We accept credit cards (Visa, MasterCard, American Express) and digital payment methods through our secure payment portal.",
        },
        {
          id: "reg-3",
          q: "What's your refund policy?",
          a: "See our full Refund Policy for complete details.",
        },
        {
          id: "reg-4",
          q: "Are there any additional fees?",
          a: "A 3% processing fee is applied at checkout to cover payment processing costs. This fee is shown transparently before you complete your registration.",
        },
      ],
    },
    {
      category: "Divisions & Age",
      color: "#35BACB",
      questions: [
        {
          id: "div-1",
          q: "Which division should my team play in?",
          a: "Choose based on your team's average age. HS for high school (15-18). Current divisions are listed below.",
        },
        {
          id: "div-2",
          q: "Can my player play up an age division?",
          a: "Players may play up one age division with prior approval. Contact us for special requests.",
        },
        {
          id: "div-3",
          q: "Why are ages combined U9/U10 instead of separate?",
          a: "Divisions are not combined. Each age group is listed separately (U9 through U19) to keep competition fair and age-appropriate.",
        },
      ],
    },
    {
      category: "Tournament Day",
      color: "#35BACB",
      questions: [
        {
          id: "tour-1",
          q: "What time should we arrive?",
          a: "Arrive 30 minutes before your first game for check-in and field orientation. We start promptly at the scheduled time.",
        },
        {
          id: "tour-2",
          q: "How many games will we play?",
          a: "Minimum 3 games guaranteed. Pool play determines bracket seeding for elimination rounds. Top teams can play 5-6 games total.",
        },
        {
          id: "tour-3",
          q: "What happens in bad weather?",
          a: "Minor weather continues play. Severe weather delays or cancellations are announced via email with refund options.",
        },
      ],
    },
    {
      category: "Rules & Game Play",
      color: "#35BACB",
      questions: [
        {
          id: "rules-1",
          q: "What are the basic game rules?",
          a: "7v7 format, two halves, running clock, unlimited on-the-fly substitutions at midfield. See our full Rules page for complete details.",
        },
        {
          id: "rules-2",
          q: "Are slide tackles allowed?",
          a: "No",
        },
        {
          id: "rules-3",
          q: "What happens if a player gets a red card?",
          a: "Immediate ejection. Player suspended for next game. Team plays short for the remainder of the current game.",
        },
        {
          id: "rules-4",
          q: "How do substitutions work?",
          a: "Unlimited substitutions, on-the-fly. Players must enter and exit at the midfield line. No stoppage required.",
        },
        {
          id: "rules-5",
          q: "What equipment is required?",
          a: "Youth- Shin guards are required, Adult- Shin guards optional. Cleats or turf shoes recommended. No jewelry permitted. Matching team colors strongly encouraged.",
        },
        {
          id: "rules-6",
          q: "Can we protest a referee decision?",
          a: "All referee decisions are final during play. Post-tournament concerns should be directed to the Tournament Director.",
        },
      ],
    },
    {
      category: "Crown Series & Royal Cup",
      color: "#35BACB",
      questions: [
        {
          id: "crown-1",
          q: "How do I qualify for Crown Series?",
          a: "Place in the top 8 of your division across Proving Series tournaments. Minimum 2 tournaments played to qualify.",
        },
        {
          id: "crown-2",
          q: "What if I don't finish top 8?",
          a: "You're always welcome to register for more Proving Series events to accumulate points and improve your standing.",
        },
        {
          id: "crown-3",
          q: "How do I qualify for Royal Cup?",
          a: "Crown Series champions earn automatic qualification. At-large spots available for top-performing runners-up.",
        },
      ],
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-75 bg-cover bg-center flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/faq.png"
            alt="FAQ background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-['Oswald']">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-1 bg-[#35BACB] mx-auto rounded"></div>
          <p
            className="text-gray-200 text-lg"
            style={{ fontFamily: "Open Sans" }}
          >
            Everything you need to know about Crown & Pitch tournaments
          </p>
        </div>
      </section>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 py-16">
        {/* FAQ Sections */}
        {faqSections.map((section) => (
          <div key={section.category} className="mb-16 ">
            {/* Section Title */}
            <h2
              className="text-2xl font-bold mb-6 font-['Oswald'] "
              style={{ color: section.color }}
            >
              {section.category}
            </h2>

            {/* Questions */}
            <div className="space-y-4">
              {section.questions.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:bg-[#222] transition group"
                  >
                    <span
                      className="text-white font-semibold text-left "
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#35BACB] transition-transform ${
                        expandedId === item.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Answer */}
                  {expandedId === item.id && (
                    <div className="bg-[#0a0a0a] border border-[#333] border-t-0 rounded-b-lg p-4">
                      {item.id === "reg-3" ? (
                        <div
                          className="space-y-3 text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          <p>Refunds depend on when you cancel:</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>
                              14+ days before tournament: full refund minus
                              processing fee
                            </li>
                            <li>
                              7-14 days before: 50% refund minus processing fee
                            </li>
                            <li>
                              7 days or less: no refund - credit toward future
                              tournament
                            </li>
                            <li>
                              C&amp;P-initiated cancellations: full refund or
                              credit
                            </li>
                          </ul>
                          <p>
                            See our full{" "}
                            <Link
                              href="/refund-policy"
                              className="text-[#35BACB] hover:underline"
                            >
                              Refund Policy
                            </Link>{" "}
                            for complete details.
                          </p>
                        </div>
                      ) : item.id === "tour-3" ? (
                        <p
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          For bad weather delays, cancellations, and credits,
                          see our{" "}
                          <Link
                            href="/refund-policy"
                            className="text-[#35BACB] hover:underline"
                          >
                            Refund Policy
                          </Link>
                          .
                        </p>
                      ) : item.id === "rules-1" ? (
                        <p
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          7v7 format, two halves, running clock, unlimited
                          on-the-fly substitutions at midfield. See our full{" "}
                          <Link
                            href="/rules"
                            className="text-[#35BACB] hover:underline"
                          >
                            Rules page
                          </Link>{" "}
                          for complete details.
                        </p>
                      ) : item.id === "div-1" ? (
                        <div className="space-y-3">
                          <p
                            className="text-gray-300"
                            style={{ fontFamily: "Open Sans" }}
                          >
                            Choose based on your team&apos;s average age. HS for
                            high school (15-18). Current divisions are listed
                            below.
                          </p>
                          <div className="overflow-x-auto">
                            <table className="min-w-130 border border-[#333] text-left text-sm text-gray-300">
                              <thead>
                                <tr className="bg-[#1a1a1a]">
                                  <th className="px-3 py-2 border-b border-[#333] text-[#35BACB] font-semibold">
                                    Division
                                  </th>
                                  <th className="px-3 py-2 border-b border-[#333] text-[#35BACB] font-semibold">
                                    Birthdate Timeline
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {divisionRows.map((row) => (
                                  <tr
                                    key={row.division}
                                    className="odd:bg-[#121212] even:bg-[#171717]"
                                  >
                                    <td className="px-3 py-2 border-b border-[#2a2a2a]">
                                      {row.division}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#2a2a2a]">
                                      {row.timeline}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="text-gray-300"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          {item.a}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions CTA */}
        <section
          className="bg-linear-to-l from-[#220A13] to-[#1D2109] border-2 border-[#35BACB] rounded-lg p-8 text-center mb-20"
          id="#contact"
        >
          <h2 className="text-white font-bold text-2xl mb-2 font-['Oswald']">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="text-gray-300 mb-8" style={{ fontFamily: "Open Sans" }}>
            We&apos;re here to help. Contact us and we&apos;ll get back to you
            within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:info@crownandpitch.com"
              className="bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-3 px-8 rounded-lg transition flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="tel:+12149458471"
              className="border-2 border-[#35BACB] text-[#35BACB] hover:bg-[#35BACB] hover:text-black font-bold py-3 px-8 rounded-lg transition flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call (214) 945-8471
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
