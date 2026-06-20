import Link from "next/link";

const legalLinks = [
  {
    title: "Refund Policy",
    description:
      "Cancellation windows, weather outcomes, no-show policy, and refund request steps.",
    href: "/refund-policy",
  },
  {
    title: "Terms and Conditions",
    description:
      "Eligibility, waivers, conduct rules, payments, media release, liability, and dispute terms.",
    href: "/terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    description:
      "How Crown & Pitch collects, uses, stores, and protects personal information.",
    href: "/privacy-policy",
  },
];

export default function LegalPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="border-b border-[#2a2a2a] bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-[#35BACB] text-sm mb-2">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold font-['Oswald'] mb-4">
            Legal Policies
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Review the official Crown & Pitch legal pages for refunds, terms,
            and privacy practices. Effective Date: March 2026.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {legalLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-[#2f2f2f] bg-[#101010] p-6 hover:border-[#35BACB] transition-colors"
          >
            <h2 className="text-2xl font-['Oswald'] mb-3">{item.title}</h2>
            <p className="text-sm text-gray-300 mb-5">{item.description}</p>
            <span className="text-[#35BACB] text-sm font-semibold">Read Policy</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
