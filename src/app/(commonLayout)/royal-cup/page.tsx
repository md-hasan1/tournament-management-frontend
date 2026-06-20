import RoyalCupPage from "@/components/module/RoyelCup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Royal Cup | Crown & Pitch",
  description:
    "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
  keywords: [
    "Royal Cup",
    "Crown & Pitch",
    "basketball tournament",
    "championship",
    "team participation",
    "sports event",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/royal-cup",
  },
  openGraph: {
    title: "Royal Cup | Crown & Pitch",
    description:
      "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
    url: "https://www.crownandpitch.com/royal-cup",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Cup | Crown & Pitch",
    description:
      "Explore the Royal Cup at Crown & Pitch, including tournament format, team participation, entry details, and championship experience.",
  },
};

export default function Page() {
  return (
    <div>
      <RoyalCupPage />
    </div>
  );
}
