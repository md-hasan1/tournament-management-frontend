/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type CheckoutSummary = {
  categoryName?: string;
  referenceNumber?: string;
  feeBreakdown?: {
    totalDue: number;
  } | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);

  const reason = searchParams.get("reason");
  const decision = searchParams.get("decision");
  const message = searchParams.get("message");

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
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold mb-4 font-['Oswald']">
            Payment Failed
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            We could not complete your Bank of America payment.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-auto text-left">
            <div className="space-y-3 text-sm">
              {summary?.categoryName && (
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="text-white">{summary.categoryName}</p>
                </div>
              )}

              {summary?.feeBreakdown?.totalDue !== undefined && (
                <div>
                  <p className="text-gray-400">Attempted Amount</p>
                  <p className="text-white">
                    {formatCurrency(summary.feeBreakdown.totalDue)}
                  </p>
                </div>
              )}

              {summary?.referenceNumber && (
                <div>
                  <p className="text-gray-400">Reference Number</p>
                  <p className="text-white break-all">
                    {summary.referenceNumber}
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
                  <p className="text-gray-400">Reason</p>
                  <p className="text-white">{reason}</p>
                </div>
              )}

              {message && (
                <div>
                  <p className="text-gray-400">Message</p>
                  <p className="text-white">{message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/founder-bundle-bank-of-america"
              className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="px-8 py-3 border-2 border-gray-600 text-white font-bold rounded hover:border-gray-400 transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
