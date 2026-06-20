/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCampPaymentMutation } from "@/redux/apiHooks/camp/campApi";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Calendar, CreditCard, Lock, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const elementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

export default function CampPaymentWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CampPayment />
    </Elements>
  );
}

function CampPayment() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const params = useSearchParams();
  const registrationId = params.get("registrationId");
  const amount = params.get("amount");

  const [payment] = useCampPaymentMutation();

  const [cardHolderName, setCardHolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card number element not found.");
      return;
    }

    setLoading(true);

    // Create payment method and send to backend
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: { name: cardHolderName.trim() },
    });

    if (pmError) {
      setError(pmError.message || "Payment failed.");
      setLoading(false);
      return;
    }

    try {
      const res = await payment({
        id: registrationId,
        data: { paymentMethodId: paymentMethod?.id },
      }).unwrap();
      // Show SweetAlert modal on success
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Thank you for your payment. You will be redirected to the home page.",
        timer: 2500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch (err: any) {
      setError(err?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center justify-center">
        <form
          onSubmit={handlePayment}
          className="w-full rounded-2xl bg-white p-5 shadow-lg sm:p-6 md:p-8"
        >
          <div className="mb-6 rounded-lg bg-[#35bacb] p-3 text-sm text-black">
            <div className="flex items-start gap-2 sm:items-center">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div className="rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
                <CardNumberElement options={elementOptions} />
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
                  <CardExpiryElement options={elementOptions} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                CVC
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <div className="rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
                  <CardCvcElement options={elementOptions} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading || !cardHolderName.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#35bacb] px-4 py-4 text-base font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>
                  Pay Now
                  {amount ? ` - $${amount}` : ""}
                </span>
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500 sm:text-sm">
            By completing this payment, you agree to our{" "}
            <button type="button" className="text-blue-600 hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-blue-600 hover:underline">
              Privacy Policy
            </button>
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
