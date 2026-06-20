import StandingsPage from "@/components/module/Standings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Standings | Crown Series Qualification | Crown & Pitch",
  description:
    "Track your team's Crown Series qualification points across all Proving Series tournaments in the Dallas-Fort Worth area.",
  keywords: [
    "Standings",
    "Crown & Pitch",
    "team rankings",
    "tournament standings",
    "competition updates",
    "sports leaderboard",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/standings",
  },
  openGraph: {
    title: "Tournament Standings | Crown Series Qualification | Crown & Pitch",
    description:
      "Track your team's Crown Series qualification points across all Proving Series tournaments in the Dallas-Fort Worth area.",
    url: "https://www.crownandpitch.com/standings",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tournament Standings | Crown Series Qualification | Crown & Pitch",
    description:
      "Track your team's Crown Series qualification points across all Proving Series tournaments in the Dallas-Fort Worth area.",
  },
};

export default function Page() {
  return (
    <div>
      <StandingsPage />
    </div>
  );
}
