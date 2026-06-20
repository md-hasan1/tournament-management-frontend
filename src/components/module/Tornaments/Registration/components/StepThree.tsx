"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type PaymentMethod = "stripe" | "bundle";

interface StepThreeProps {
  tournamentName: string;
  tournamentDate: string;
  tournamentLocation: string;

  divisionId: string;
  divisionName: string;

  teamName: string;
  entryFee: string;

  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;

  onStripeCompleteChange: (complete: boolean) => void;
  isProcessing: boolean;
}

export default function StepThree({
  tournamentName,
  tournamentDate,
  tournamentLocation,
  divisionId,
  divisionName,
  teamName,
  entryFee,
  paymentMethod,
  onPaymentMethodChange,
  onStripeCompleteChange,
  isProcessing,
}: StepThreeProps) {
  const numericEntryFee = useMemo(() => {
    const parsed = Number(entryFee.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [entryFee]);

  const processingFee = useMemo(
    () => numericEntryFee * 0.03,
    [numericEntryFee],
  );
  const totalFee = useMemo(
    () => numericEntryFee + processingFee,
    [numericEntryFee, processingFee],
  );

  const formatUsd = (amount: number) => `$${amount.toFixed(2)}`;

  const [cardOk, setCardOk] = useState(false);
  const [expOk, setExpOk] = useState(false);
  const [cvcOk, setCvcOk] = useState(false);

  useEffect(() => {
    if (paymentMethod !== "stripe") {
      onStripeCompleteChange(true);
      return;
    }
    onStripeCompleteChange(Boolean(cardOk && expOk && cvcOk));
  }, [paymentMethod, cardOk, expOk, cvcOk, onStripeCompleteChange]);

  const stripeElementBase =
    "w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus-within:border-[#35BACB] transition";

  const stripeOptions = useMemo(
    () =>
      ({
        style: {
          base: {
            color: "#ffffff",
            fontSize: "16px",
            "::placeholder": { color: "#4b5563" },
          },
          invalid: { color: "#f87171" },
        },
      }) as const,
    [],
  );

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide font-['Oswald']">
        Payment Information
      </h2>

      <div className="relative grid grid-cols-2 gap-8">
        {isProcessing ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-black/60 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Loader className="h-5 w-5 animate-spin text-[#35BACB]" />
              Processing payment...
            </div>
          </div>
        ) : null}
        {/* Summary */}
        <div className="border border-[#35BACB] p-4 rounded-md bg-[#2B3017]">
          <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wide">
            Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <p className="text-gray-400">Tournament:</p>
              <p className="text-white font-semibold">{tournamentName}</p>
            </div>

            <div>
              <p className="text-gray-400">Date:</p>
              <p className="text-white font-semibold">{tournamentDate}</p>
            </div>

            <div>
              <p className="text-gray-400">Location:</p>
              <p className="text-white font-semibold">{tournamentLocation}</p>
            </div>

            <div>
              <p className="text-gray-400">Division:</p>
              <p className="text-white font-semibold">
                {divisionName}
                {divisionId ? (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    ({divisionId})
                  </span>
                ) : null}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Team:</p>
              <p className="text-white font-semibold">{teamName}</p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-400">Entry Fee:</p>
              <p className="text-white font-semibold">{entryFee}</p>
            </div>

            <div>
              <p className="text-gray-400">Processing:</p>
              <p className="text-white font-semibold">
                3% ({formatUsd(processingFee)})
              </p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-400">Total:</p>
              <p className="text-white font-bold text-lg">
                {formatUsd(totalFee)}
              </p>
            </div>

            {/* {hasBundle ? (
              <div className="border-t border-gray-700 pt-3">
                <p className="text-gray-400">Bundle Available:</p>
                <p className="text-white font-semibold">
                  Yes ({totalBundle} remaining)
                </p>
              </div>
            ) : null} */}
          </div>
          <p>Processing fees are applied at checkout (3% of entry fee).</p>
        </div>

        {/* Payment Method */}
        <div className="border border-[#35BACB] p-4 rounded-md bg-[#2B3017]">
          <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wide">
            Payment Method
          </h3>

          <div className="flex gap-4 mb-6">
            {/* {hasBundle && (
              <button
                type="button"
                onClick={() => onPaymentMethodChange("bundle")}
                className={`flex items-center justify-center px-4 h-12 rounded border-2 transition text-sm font-semibold ${
                  paymentMethod === "bundle"
                    ? "border-[#35BACB] bg-gray-900 text-white"
                    : "border-gray-700 bg-gray-900 hover:border-gray-600 text-gray-200"
                }`}
              >
                🎁 Bundle
              </button>
            )} */}

            <button
              type="button"
              onClick={() => onPaymentMethodChange("stripe")}
              className={`flex items-center justify-center px-4 h-12 rounded border-2 transition text-sm font-semibold ${
                paymentMethod === "stripe"
                  ? "border-[#35BACB] bg-gray-900 text-white"
                  : "border-gray-700 bg-gray-900 hover:border-gray-600 text-gray-200"
              }`}
            >
              💳 Stripe
            </button>
          </div>

          {/* {hasBundle && paymentMethod === "bundle" && (
            <div className="space-y-3 text-sm text-gray-200">
              <div className="border border-gray-700 rounded p-4 bg-gray-900">
                <p className="text-white font-semibold mb-1">
                  Pay using Bundle
                </p>
                <p className="text-gray-400">
                  This registration will consume{" "}
                  <span className="text-white">1</span> bundle credit. You have{" "}
                  <span className="text-white font-semibold">
                    {totalBundle}
                  </span>{" "}
                  remaining.
                </p>
              </div>
            </div>
          )} */}

          {paymentMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-3 font-semibold">
                  Card Number
                </label>
                <div className={stripeElementBase}>
                  <CardNumberElement
                    options={stripeOptions}
                    onChange={(e) => setCardOk(Boolean(e.complete))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-3 font-semibold">
                    Expiration Date
                  </label>
                  <div className={stripeElementBase}>
                    <CardExpiryElement
                      options={stripeOptions}
                      onChange={(e) => setExpOk(Boolean(e.complete))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-3 font-semibold">
                    CVC
                  </label>
                  <div className={stripeElementBase}>
                    <CardCvcElement
                      options={stripeOptions}
                      onChange={(e) => setCvcOk(Boolean(e.complete))}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Your card details are securely handled by Stripe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
