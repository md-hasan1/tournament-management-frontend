import PolicyLayout from "./PolicyLayout";

export default function RefundPolicyContent() {
  return (
    <PolicyLayout title="Refund Policy" effectiveDate="March 2026">
      <p>
        Crown & Pitch LLC is committed to fair and transparent refund practices.
        Fees are processed securely through Stripe. Approved refunds are
        returned to the original payment method within 7-10 business days.
      </p>
      <p className="mt-3">
        Payment processing fees charged by Stripe (currently 2.9% + $0.30 per
        successful card transaction) are non-refundable unless required by law
        or otherwise stated in this policy.
      </p>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.1 Overview
        </h2>
        <p>
          We accept Visa, Mastercard, American Express, and most major cards.
          The policies below apply to team-based registrations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.2 Standard Cancellation and Refund Schedule
        </h2>
        <div className="overflow-x-auto border border-[#2d2d2d] rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#151515] text-[#35BACB]">
              <tr>
                <th className="px-4 py-3">Cancellation Scenario</th>
                <th className="px-4 py-3">Refund Amount</th>
                <th className="px-4 py-3">Credit Option</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              <tr className="border-t border-[#2d2d2d]">
                <td className="px-4 py-3">More than 14 days before event</td>
                <td className="px-4 py-3">
                  Full refund minus $50 processing fee
                </td>
                <td className="px-4 py-3">Credit equal to registration paid</td>
              </tr>
              <tr className="border-t border-[#2d2d2d] bg-[#111111]">
                <td className="px-4 py-3">7-14 days before event</td>
                <td className="px-4 py-3">
                  50% refund minus $50 processing fee
                </td>
                <td className="px-4 py-3">Credit equal to registration paid</td>
              </tr>
              <tr className="border-t border-[#2d2d2d]">
                <td className="px-4 py-3">Less than 7 days before event</td>
                <td className="px-4 py-3">No refund</td>
                <td className="px-4 py-3">
                  Credit may be offered at sole discretion
                </td>
              </tr>
              <tr className="border-t border-[#2d2d2d] bg-[#111111]">
                <td className="px-4 py-3">No-show on event day</td>
                <td className="px-4 py-3">No refund</td>
                <td className="px-4 py-3">No credit</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          The $50 administrative processing fee is non-waivable and applies to
          all refund amounts. Any Stripe processing fees are also
          non-refundable. Credits are issued in the original paid amount, may be
          used for any future Crown & Pitch event, and expire one year from the
          original event date.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.3 Weather and Force Majeure Cancellation Policy
        </h2>
        <div className="overflow-x-auto border border-[#2d2d2d] rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#151515] text-[#35BACB]">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Refund</th>
                <th className="px-4 py-3">Credit Option</th>
                <th className="px-4 py-3">Results</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              <tr className="border-t border-[#2d2d2d]">
                <td className="px-4 py-3">Tournament not started</td>
                <td className="px-4 py-3">Full refund</td>
                <td className="px-4 py-3">Full credit</td>
                <td className="px-4 py-3">N/A</td>
              </tr>
              <tr className="border-t border-[#2d2d2d] bg-[#111111]">
                <td className="px-4 py-3">1 game completed (partial)</td>
                <td className="px-4 py-3">50% refund</td>
                <td className="px-4 py-3">Full credit</td>
                <td className="px-4 py-3">Results voided</td>
              </tr>
              <tr className="border-t border-[#2d2d2d]">
                <td className="px-4 py-3">More than 1 game completed</td>
                <td className="px-4 py-3">No refund</td>
                <td className="px-4 py-3">No credit</td>
                <td className="px-4 py-3">Results stand as final</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.4 Crown & Pitch-Initiated Cancellations
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            If Crown & Pitch cancels for non-weather reasons, teams receive full
            refund including the $50 processing fee, or tournament credit.
          </li>
          <li>
            Crown & Pitch will attempt to provide at least 7 days notice where
            possible.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.5 Individual Player Medical Emergency and Extenuating Circumstances
        </h2>
        <p>
          Registration is team-based. Individual player inability to participate
          does not create refund eligibility. Teams may request roster
          substitution by emailing info@crownandpitch.com. Approval is case by
          case and is the sole remedy under this section.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.6 No-Shows
        </h2>
        <p>
          Teams that do not appear on event day without prior written notice
          forfeit all registration fees and any right to refund or credit.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-['Oswald'] text-white mb-3">
          1.7 How to Request a Refund
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Email refund requests to info@crownandpitch.com.</li>
          <li>
            Include team name, registered email, tournament name, and reason for
            cancellation.
          </li>
          <li>Requests must be submitted before the applicable deadline.</li>
          <li>Approved refunds are processed within 7-10 business days.</li>
          <li>
            Chargebacks without contacting Crown & Pitch first may result in a
            permanent ban from future events.
          </li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
