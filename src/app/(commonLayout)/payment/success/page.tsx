/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type CheckoutSummary = {
  categoryKey?: "youth" | "adult";
  categoryName?: string;
  categoryType?: string;
  referenceNumber?: string;
  feeBreakdown?: {
    registrationFee: number;
    taxAmount: number;
    processingFee: number;
    totalDue: number;
  } | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);

  const txn = searchParams.get("txn");
  const ref = searchParams.get("ref");
  const decision = searchParams.get("decision");
  const reason = searchParams.get("reason");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem("boa-checkout-summary")
        : null;

    if (stored) {
      try {
        setSummary(JSON.parse(stored));
      } catch {
        setSummary(null);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-4 font-['Oswald']">
            Payment Successful
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Your Founder Bundle payment was received successfully.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-auto text-left">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Category</p>
                <p className="text-white font-semibold">
                  {summary?.categoryName || "Founder Bundle"}
                </p>
              </div>

              {summary?.feeBreakdown && (
                <>
                  <div>
                    <p className="text-gray-400">Registration Fee</p>
                    <p className="text-white">
                      {formatCurrency(summary.feeBreakdown.registrationFee)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Tax</p>
                    <p className="text-white">
                      {formatCurrency(summary.feeBreakdown.taxAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Processing Fee</p>
                    <p className="text-white">
                      {formatCurrency(summary.feeBreakdown.processingFee)}
                    </p>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-gray-400">Total Due</p>
                    <p className="text-[#35BACB] font-bold text-xl">
                      {formatCurrency(summary.feeBreakdown.totalDue)}
                    </p>
                  </div>
                </>
              )}

              {txn && (
                <div>
                  <p className="text-gray-400">Transaction ID</p>
                  <p className="text-white break-all">{txn}</p>
                </div>
              )}

              {(ref || summary?.referenceNumber) && (
                <div>
                  <p className="text-gray-400">Reference Number</p>
                  <p className="text-white break-all">
                    {ref || summary?.referenceNumber}
                  </p>
                </div>
              )}

              {decision && (
                <div>
                  <p className="text-gray-400">Decision</p>
                  <p className="text-white">{decision}</p>
                </div>
              )}

              {reason && (
                <div>
                  <p className="text-gray-400">Reason Code</p>
                  <p className="text-white">{reason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
