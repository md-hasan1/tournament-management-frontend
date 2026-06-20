import HowItWorksPage from "@/components/module/HowItWorks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Crown & Pitch Works | Proving Series to Royal Cup",
  description:
    "Learn how Crown & Pitch's three-tier tournament system works. Play Proving Series events, qualify for Crown Series, and compete for the Royal Cup.",
  keywords: [
    "How It Works",
    "Crown & Pitch",
    "tournament process",
    "registration",
    "competition details",
    "sports events",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/how-it-works",
  },
  openGraph: {
    title: "How Crown & Pitch Works | Proving Series to Royal Cup",
    description:
      "Learn how Crown & Pitch's three-tier tournament system works. Play Proving Series events, qualify for Crown Series, and compete for the Royal Cup.",
    url: "https://www.crownandpitch.com/how-it-works",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Crown & Pitch Works | Proving Series to Royal Cup",
    description:
      "Learn how Crown & Pitch's three-tier tournament system works. Play Proving Series events, qualify for Crown Series, and compete for the Royal Cup.",
  },
};

export default function Page() {
  return (
    <div>
      <HowItWorksPage />
    </div>
  );
}
