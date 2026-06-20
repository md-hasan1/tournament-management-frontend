import PolicyLayout from "./PolicyLayout";

export default function PrivacyPolicyContent() {
  return (
    <PolicyLayout title="Privacy Policy" effectiveDate="March 2026">
      <p>
        Crown & Pitch LLC is committed to protecting personal information of
        participants, teams, guardians, and website users.
      </p>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.1 Introduction</h2>
        <p>
          This Privacy Policy describes what we collect, how we use it, and your
          rights related to your information when using our platform or
          participating in events.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.2 Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Information provided directly: name, DOB, email, phone, address,
            team/roster details, emergency contacts, waivers.
          </li>
          <li>
            Payment details are processed by Bank of America Merchant Services;
            Crown & Pitch does not store full card numbers.
          </li>
          <li>
            Automatic data: IP address, browser/device type, and usage data.
          </li>
          <li>Event data: photos, videos, and check-in/attendance records.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.3 How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Process registration and payments.</li>
          <li>Send event updates and operational notices.</li>
          <li>Send promotional emails (with opt-out).</li>
          <li>Verify eligibility and maintain waiver records.</li>
          <li>Improve platform and event operations.</li>
          <li>Meet legal and regulatory obligations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.4 Sharing and Disclosure</h2>
        <p className="mb-3">
          Crown & Pitch does not sell, rent, or trade personal information.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Trusted service providers supporting operations.</li>
          <li>Bank of America Merchant Services for payment processing.</li>
          <li>Legal compliance or emergency safety needs.</li>
          <li>Business transfer events (merger, acquisition, or sale).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.5 Data Retention</h2>
        <p>
          Data is retained as needed for operations, legal compliance, dispute
          resolution, and agreement enforcement. Waiver records are kept for at
          least seven years.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.6 Cookies and Tracking</h2>
        <p>
          Cookies and similar tools may be used for experience, analytics, and
          registration functionality. Browser settings can control cookie use,
          but disabling cookies may reduce portal functionality.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.7 Children&apos;s Privacy</h2>
        <p>
          Data for minors is collected through parents/guardians for
          registration, safety, and event operations. Crown & Pitch does not
          knowingly collect personal data directly from children under 13
          without verified parental consent.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.8 Data Security</h2>
        <p>
          Reasonable administrative, technical, and physical safeguards are
          applied. Payment transactions are encrypted and processed through Bank
          of America Merchant Services.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.9 Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access copies of your personal information.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion subject to legal retention requirements.</li>
          <li>Opt out of marketing communications.</li>
          <li>Withdraw consent when processing is consent-based.</li>
        </ul>
        <p className="mt-3">To exercise rights, contact info@crownandpitch.com.</p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.10 Policy Changes</h2>
        <p>
          Crown & Pitch may update this policy at any time. Material changes are
          communicated via website posting and/or participant email.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">3.11 Contact</h2>
        <p>Email: info@crownandpitch.com</p>
        <p>Website: www.crownandpitch.com</p>
        <p>Location: Dallas-Fort Worth Metroplex, Texas</p>
      </section>
    </PolicyLayout>
  );
}
