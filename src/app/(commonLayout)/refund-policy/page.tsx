import RefundPolicyContent from "@/components/module/legal/RefundPolicyContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Crown & Pitch",
  description:
    "View Crown & Pitch refund policy including cancellation windows, weather scenarios, and refund request steps.",
  alternates: {
    canonical: "https://www.crownandpitch.com/refund-policy",
  },
};

export default function Page() {
  return <RefundPolicyContent />;
}
