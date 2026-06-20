import ProvingCampLanding from "@/components/proving-camp/ProvingCampLanding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proving Camp | Crown & Pitch",
  description:
    "Explore the Crown and Pitch Proving Camp page with sessions, weekly schedule, coaches, pricing, registration, and FAQs.",
  keywords: [
    "Proving Camp",
    "Crown & Pitch",
    "soccer training camp",
    "player development",
    "summer sessions",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/proving-camp",
  },
  openGraph: {
    title: "Proving Camp | Crown & Pitch",
    description:
      "Explore session structure, weekly schedule, coaches, pricing, and registration for Crown and Pitch Proving Camp.",
    url: "https://www.crownandpitch.com/proving-camp",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proving Camp | Crown & Pitch",
    description:
      "Explore session structure, weekly schedule, coaches, pricing, and registration for Crown and Pitch Proving Camp.",
  },
};

export default function ProvingCampPage() {
  return <ProvingCampLanding />;
}
