import AboutPage from "@/components/module/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Crown & Pitch | Where Players Rise",
  description:
    "Crown & Pitch is building the first merit-based small-sided soccer tournament series across DFW. For the players. For the game.",
  keywords: [
    "Crown & Pitch",
    "About Crown & Pitch",
    "About Us",
    "fashion",
    "lifestyle",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/about",
  },
  openGraph: {
    title: "About Crown & Pitch | Where Players Rise",
    description:
      "Crown & Pitch is building the first merit-based small-sided soccer tournament series across DFW. For the players. For the game.",
    url: "https://www.crownandpitch.com/about",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Crown & Pitch | Where Players Rise",
    description:
      "Crown & Pitch is building the first merit-based small-sided soccer tournament series across DFW. For the players. For the game.",
  },
};

export default function Page() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
