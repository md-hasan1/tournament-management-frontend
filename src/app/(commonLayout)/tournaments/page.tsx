import TournamentsPage from "@/components/module/Tornaments/Tournaments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Soccer Tournaments | Crown & Pitch DFW",
  description:
    "Find and register for upcoming small-sided soccer tournaments across DFW. Youth and adult divisions available. 3-game minimum guarantee at every event.",
  keywords: [
    "Tournaments",
    "Crown & Pitch",
    "sports tournaments",
    "team competition",
    "event schedule",
    "basketball tournaments",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/tournaments",
  },
  openGraph: {
    title: "Upcoming Soccer Tournaments | Crown & Pitch DFW",
    description:
      "Find and register for upcoming small-sided soccer tournaments across DFW. Youth and adult divisions available. 3-game minimum guarantee at every event.",
    url: "https://www.crownandpitch.com/tournaments",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Soccer Tournaments | Crown & Pitch DFW",
    description:
      "Find and register for upcoming small-sided soccer tournaments across DFW. Youth and adult divisions available. 3-game minimum guarantee at every event.",
  },
};

export default function Page() {
  return (
    <div>
      <TournamentsPage />
    </div>
  );
}
