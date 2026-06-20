import TermsConditionsContent from "@/components/module/legal/TermsConditionsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Crown & Pitch",
  description:
    "Read Crown & Pitch terms and conditions for registration, eligibility, conduct, waivers, and liability.",
  alternates: {
    canonical: "https://www.crownandpitch.com/terms-and-conditions",
  },
};

export default function Page() {
  return <TermsConditionsContent />;
}
