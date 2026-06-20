// import type { Metadata } from "next";
// import FounderBundlePage from "@/components/module/FounderBundle";
// import React from "react";

// export const metadata: Metadata = {
//   title: "Founder Bundle | Crown & Pitch",
//   description:
//     "Explore the Founder Bundle from Crown & Pitch, including exclusive offers, benefits, and opportunities for early supporters.",
//   keywords: [
//     "Founder Bundle",
//     "Crown & Pitch",
//     "exclusive bundle",
//     "early supporter offer",
//     "special package",
//   ],
//   alternates: {
//     canonical: "https://www.crownandpitch.com/founder-bundle",
//   },
//   openGraph: {
//     title: "Founder Bundle | Crown & Pitch",
//     description:
//       "Explore the Founder Bundle from Crown & Pitch, including exclusive offers, benefits, and opportunities for early supporters.",
//     url: "https://www.crownandpitch.com/founder-bundle",
//     siteName: "Crown & Pitch",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Founder Bundle | Crown & Pitch",
//     description:
//       "Explore the Founder Bundle from Crown & Pitch, including exclusive offers, benefits, and opportunities for early supporters.",
//   },
// };

// export default function Page() {
//   return (
//     <div>
//       {/* <FounderBundlePage /> */}
//     </div>
//   );
// }

import FounderBundleBankOfAmericaPage from "@/components/module/FounderBundleBankOfAmerica";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Bundle (Bank of America) | Crown & Pitch",
  description:
    "Purchase Founder Bundle using Bank of America card payment flow.",
  keywords: [
    "Founder Bundle",
    "Bank of America",
    "card payment",
    "Crown & Pitch",
  ],
  alternates: {
    canonical: "https://www.crownandpitch.com/founder-bundle-bank-of-america",
  },
  openGraph: {
    title: "Founder Bundle (Bank of America) | Crown & Pitch",
    description:
      "Purchase Founder Bundle using Bank of America card payment flow.",
    url: "https://www.crownandpitch.com/founder-bundle-bank-of-america",
    siteName: "Crown & Pitch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Bundle (Bank of America) | Crown & Pitch",
    description:
      "Purchase Founder Bundle using Bank of America card payment flow.",
  },
};

export default function Page() {
  return (
    <div>
      <FounderBundleBankOfAmericaPage />
    </div>
  );
}
