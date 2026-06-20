/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import { useBuyBundleMutation } from "@/redux/apiHooks/homePage/homePageApi";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type CategoryKey = "youth" | "adult";

const categories: Record<
  CategoryKey,
  { name: string; price: number; type: string }
> = {
  youth: { name: "Youth Category", price: 1300, type: "Youth" },
  adult: { name: "Adult Category", price: 2200, type: "Adult" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const elementOptions = {
  style: {
    base: {
      color: "#ffffff",
      fontSize: "16px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      "::placeholder": { color: "#6b7280" },
    },
    invalid: { color: "#ef4444" },
  },
};

function PaymentForm({
  selectedCategory,
  onPaid,
}: {
  selectedCategory: CategoryKey;
  onPaid: (paymentIntentId?: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const selected = categories[selectedCategory];

  const [buyBundle, { isLoading: apiLoading }] = useBuyBundleMutation();
  const [localLoading, setLocalLoading] = useState(false);

  const loading = localLoading || apiLoading;

  const handlePay = async () => {
    if (loading) return;

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again.");
      return;
    }

    const cardNumberEl = elements.getElement(CardNumberElement);
    if (!cardNumberEl) {
      toast.error("Card Number element not found.");
      return;
    }

    setLocalLoading(true);
    const toastId = toast.loading("Creating payment...");

    try {
      // 1) Create PaymentMethod (pm_...)
      const pmRes = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberEl,
      });

      if (pmRes.error) {
        toast.error(pmRes.error.message || "Card validation failed.", {
          id: toastId,
        });
        return;
      }

      const paymentMethodId = pmRes.paymentMethod?.id;
      if (!paymentMethodId) {
        toast.error("Unable to create payment method.", { id: toastId });
        return;
      }

      // 2) Payload exactly as backend expects
      const payload = {
        category: selected.type, // "Youth" | "Adult"
        amount: selected.price, // 1300 | 2200
        methodId: paymentMethodId, // pm_...
      };

      // 3) Call API
      const res = await buyBundle(payload).unwrap();

      // ✅ Your response format:
      // {
      //   success: true,
      //   message: "Payment created successfully",
      //   data: { success: true, paymentIntentId: "...", bundle: "Youth" }
      // }

      if (!res?.success) {
        toast.error(res?.message || "Payment failed.", { id: toastId });
        return;
      }

      // Optional: also check res.data.success if needed
      if (res?.data?.success === false) {
        toast.error(res?.message || "Payment failed.", { id: toastId });
        return;
      }

      toast.success(res?.message || "Payment successful 🎉", { id: toastId });

      // move to step 3 (send paymentIntentId if you want)
      onPaid(res?.data?.paymentIntentId);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Something went wrong.";
      toast.error(msg, { id: toastId });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Summary */}
      <div className="bg-[#3a4a2a] rounded-lg border border-[#35BACB] p-6">
        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wide font-['Oswald']">
          Summary
        </h3>

        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <p className="text-gray-400">Category:</p>
            <p className="text-white font-semibold">{selected.name}</p>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <p className="text-gray-400">Total:</p>
            <p className="text-white font-bold text-lg">
              {formatCurrency(selected.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Split Stripe Elements */}
      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wide font-['Oswald']">
          Card Payment
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-semibold">
              Card Number
            </label>
            <div className="bg-gray-900 border border-gray-700 rounded px-4 py-3">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                Expiry
              </label>
              <div className="bg-gray-900 border border-gray-700 rounded px-4 py-3">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                CVC
              </label>
              <div className="bg-gray-900 border border-gray-700 rounded px-4 py-3">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading || !stripe || !elements}
          className="mt-6 w-full px-6 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Your payment is securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}

export default function FounderBundlePage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("youth");

  // Optional: store PI id for success page
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");

  const selected = useMemo(
    () => categories[selectedCategory],
    [selectedCategory],
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 font-['Oswald']">
          Founder Bundle
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Step {currentStep} of 3
        </p>

        {/* Steps */}
        <div className="flex items-center justify-center mb-12 gap-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              {step > 1 && (
                <div
                  className={`w-10 h-1 ${step <= currentStep ? "bg-[#35BACB]" : "bg-gray-700"}`}
                />
              )}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step <= currentStep
                    ? "bg-[#35BACB] text-black"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {step}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-8 mb-8">
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide font-['Oswald']">
                Select Category
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["youth", "adult"] as CategoryKey[]).map((key) => {
                  const c = categories[key];
                  const active = selectedCategory === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`p-6 rounded-lg border-2 transition text-left ${
                        active
                          ? "border-[#35BACB] bg-gray-950"
                          : "border-gray-700 bg-gray-900 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {c.name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">{c.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#35BACB]">
                            {formatCurrency(c.price)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide font-['Oswald']">
                Payment Information
              </h2>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  selectedCategory={selectedCategory}
                  onPaid={(piId) => {
                    if (piId) setPaymentIntentId(piId);
                    setCurrentStep(3);
                  }}
                />
              </Elements>
            </>
          )}

          {currentStep === 3 && (
            <div className="text-center py-10">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-4xl font-bold mb-4 font-['Oswald']">
                Welcome to Founder Program
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Payment received successfully!
              </p>

              <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-sm mx-auto">
                <div className="space-y-2 text-sm text-center">
                  <div className="text-white font-semibold text-lg">
                    {selected.name}
                  </div>
                  <div className="text-[#35BACB] font-bold text-2xl">
                    {formatCurrency(selected.price)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Category: {selected.type}
                  </div>

                  {/* {paymentIntentId && (
                    <div className="text-gray-500 text-xs mt-2 break-all">
                      PaymentIntent: {paymentIntentId}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          {currentStep === 1 && (
            <>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 border-2 border-gray-600 text-white font-bold rounded hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition"
              >
                Continue
              </button>
            </>
          )}

          {currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="px-8 py-3 border-2 border-gray-600 text-white font-bold rounded hover:border-gray-400 transition"
            >
              Back
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition"
            >
              Return to Home
            </button>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gray-400 text-sm hover:text-[#35BACB] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
