import PolicyLayout from "./PolicyLayout";

export default function TermsConditionsContent() {
  return (
    <PolicyLayout title="Terms and Conditions" effectiveDate="March 2026">
      <p>
        By registering for, participating in, or attending any Crown & Pitch
        event, you agree to these Terms and Conditions.
      </p>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.1 Acceptance of Terms</h2>
        <p>
          Registration and participation constitutes acceptance of these terms.
          Registrants for minors confirm they have legal authority to accept on
          the minor&apos;s behalf.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.2 Eligibility and Registration</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Open to youth and adult soccer teams per event division rules.</li>
          <li>
            Players must be registered under correct legal name and age
            division.
          </li>
          <li>
            False age, identity, or eligibility information may lead to
            immediate disqualification without refund.
          </li>
          <li>
            Crown & Pitch may verify eligibility at any time, including ID or
            birth certificate checks.
          </li>
          <li>Teams must be fully paid to secure a spot.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.3 Waivers and Liability Release</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            All players must have an executed waiver before taking the field.
            No exceptions.
          </li>
          <li>
            Waivers submitted electronically are valid for one calendar year.
          </li>
          <li>
            Players with expired or missing waivers are denied participation with
            no refund.
          </li>
          <li>
            Players under 18 require waiver execution by parent or legal
            guardian.
          </li>
          <li>
            Participants acknowledge inherent risks of soccer and outdoor
            competition.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.4 Code of Conduct</h2>
        <p className="mb-3">
          Crown & Pitch may remove anyone from an event without refund for
          conduct violations.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Verbal or physical abuse toward officials, staff, players, or spectators.</li>
          <li>Profane, discriminatory, or threatening language.</li>
          <li>Intentional property damage, harassment, or bullying.</li>
          <li>Unauthorized alcohol possession/consumption on tournament grounds.</li>
          <li>Use of performance-enhancing drugs.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.4.1 Alcohol Policy</h2>
        <p>
          Outside alcohol is prohibited. Where alcohol is served, it must be
          served through Crown & Pitch or authorized affiliates in compliance
          with applicable rules.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.5 Payment and Fees</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Registration fees are due in full unless a written plan is offered.</li>
          <li>
            Payment methods include Visa, Mastercard, American Express, and
            other major cards via Bank of America Merchant Services.
          </li>
          <li>Transactions are processed in USD.</li>
          <li>
            Chargebacks without prior written contact may cause disqualification
            and permanent event bans.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.6 Photo and Video Release</h2>
        <p>
          Event registration and attendance grant Crown & Pitch permission to
          use event media for marketing and promotion. Opt-out requests must be
          submitted in writing at least 48 hours before each specific event and
          must include required details.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.7 Intellectual Property</h2>
        <p>
          Crown & Pitch trademarks, logos, tournament names, and site materials
          are protected. Unauthorized reproduction or commercial use is
          prohibited.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.8 Modifications to Events</h2>
        <p>
          Crown & Pitch may modify schedules, formats, fields, and rules for
          safety, fairness, or operational needs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.9 Governing Law and Dispute Resolution</h2>
        <p>
          Governed by Texas law. Disputes proceed through good-faith mediation,
          then binding arbitration in Dallas County, Texas. Participants waive
          jury trial rights to the fullest extent permitted by law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.10 Limitation of Liability and Assumption of Risk</h2>
        <p>
          Participation includes inherent risk. Crown & Pitch disclaims
          liability for indirect, incidental, consequential, or punitive damages
          to the fullest extent allowed. Aggregate liability is capped at the
          registration fee paid by the affected team.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">2.11 Severability</h2>
        <p>
          If any term is unenforceable, remaining terms continue in full force
          and effect.
        </p>
      </section>
    </PolicyLayout>
  );
}
