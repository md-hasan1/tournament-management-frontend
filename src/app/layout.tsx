import Loading from "@/components/Others/Loader/Loading";
import {
  gravitas,
  lobster,
  openSans,
  oswald,
  playfair,
  roboto,
  rowdies,
} from "@/fonts/Fonts";
import ReduxProvider from "@/redux/Provider";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.crownandpitch.com"),
  title: {
    default: "Crown & Pitch",
    template: "%s | Crown & Pitch",
  },
  description:
    "Crown & Pitch is a premier tournament platform featuring Proving Series, Crown Series, and Royal Cup competitions for youth and adult teams.",
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
    title: "Crown & Pitch",
    description:
      "Crown & Pitch is a premier tournament platform featuring Proving Series, Crown Series, and Royal Cup competitions for youth and adult teams.",
    url: "https://www.crownandpitch.com",
    siteName: "Crown & Pitch",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crown & Pitch",
    description:
      "Crown & Pitch is a premier tournament platform featuring Proving Series, Crown Series, and Royal Cup competitions for youth and adult teams.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = "G-29PEMKRNCK";

  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${openSans.variable} ${playfair.variable} ${lobster.variable} ${roboto.variable} ${gravitas.variable} ${rowdies.variable} ${oswald.variable} antialiased`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <Suspense fallback={<Loading />}>
          <ReduxProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
