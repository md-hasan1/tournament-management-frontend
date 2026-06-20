import LegalPage from "@/components/module/legal/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Policies | Crown & Pitch",
  description:
    "Read Crown & Pitch legal policies including Refund Policy, Terms and Conditions, and Privacy Policy.",
  alternates: {
    canonical: "https://www.crownandpitch.com/legal",
  },
};

export default function Page() {
  return <LegalPage />;
}
