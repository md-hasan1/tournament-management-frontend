import FAQPage from "@/components/module/Faq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Crown & Pitch Soccer Tournaments",
  description:
    "Everything you need to know about Crown & Pitch tournaments — registration, refunds, divisions, game rules, and Crown Series qualification.",
  keywords: [
    "FAQ",
    "Crown & Pitch",
    "frequently asked questions",
    "tournament questions",
    "registration help",
    "sports events",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/faq",
  },
  openGraph: {
    title: "FAQ | Crown & Pitch Soccer Tournaments",
    description:
      "Everything you need to know about Crown & Pitch tournaments — registration, refunds, divisions, game rules, and Crown Series qualification.",
    url: "https://www.crownandpitch.com/faq",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Crown & Pitch Soccer Tournaments",
    description:
      "Everything you need to know about Crown & Pitch tournaments — registration, refunds, divisions, game rules, and Crown Series qualification.",
  },
};

export default function Page() {
  return (
    <div>
      <FAQPage />
    </div>
  );
}
