import PrivacyPolicyContent from "@/components/module/legal/PrivacyPolicyContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Crown & Pitch",
  description:
    "Learn how Crown & Pitch collects, uses, shares, stores, and protects participant and website data.",
  alternates: {
    canonical: "https://www.crownandpitch.com/privacy-policy",
  },
};

export default function Page() {
  return <PrivacyPolicyContent />;
}
