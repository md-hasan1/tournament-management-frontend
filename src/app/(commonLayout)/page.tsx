import Home from "@/components/home/Home";
import type { Metadata } from "next";
import Script from "next/script";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Crown & Pitch",
  url: "https://www.crownandpitch.com",
  logo: "https://www.crownandpitch.com/Logo.png",
  description:
    "Merit-based small-sided soccer tournaments across the Dallas-Fort Worth Metroplex",
  telephone: "+12149458471",
  email: "info@crownandpitch.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Prosper",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: "Dallas-Fort Worth Metroplex",
  sport: "Soccer",
};

export const metadata: Metadata = {
  title: "Crown & Pitch | Small-Sided Soccer Tournaments in DFW",
  description:
    "Merit-based 7v7 soccer tournaments across the Dallas-Fort Worth area. Open registration. Proving Series, Crown Series, and Royal Cup. Where Players Rise.",
  keywords: [
    "Crown & Pitch",
    "basketball tournament",
    "sports platform",
    "Crown Series",
    "Royal Cup",
    "Proving Series",
    "youth tournaments",
    "adult competitions",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com",
  },
  openGraph: {
    title: "Crown & Pitch | Small-Sided Soccer Tournaments in DFW",
    description:
      "Merit-based 7v7 soccer tournaments across the Dallas-Fort Worth area. Open registration. Proving Series, Crown Series, and Royal Cup. Where Players Rise.",
    url: "https://www.crownandpitch.com",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crown & Pitch | Small-Sided Soccer Tournaments in DFW",
    description:
      "Merit-based 7v7 soccer tournaments across the Dallas-Fort Worth area. Open registration. Proving Series, Crown Series, and Royal Cup. Where Players Rise.",
  },
};

export default function Page() {
  return (
    <div>
      <Script
        id="home-sports-organization-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(homeStructuredData)}
      </Script>
      <Home />
    </div>
  );
}
