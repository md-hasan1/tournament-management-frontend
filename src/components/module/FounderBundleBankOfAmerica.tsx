/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { useInitialPaymentMutation } from "@/redux/apiHooks/BankofAmerica/boa";
import { toast } from "sonner";

type CategoryKey = "youth" | "adult";

const categories: Record<
  CategoryKey,
  { name: string; price: number; type: "Youth" | "Adult" }
> = {
  youth: { name: "Youth Category", price: 1300, type: "Youth" },
  adult: { name: "Adult Category", price: 2200, type: "Adult" },
};

type CardData = {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  zipCode: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
};

type FeeBreakdown = {
  registrationFee: number;
  taxAmount: number;
  processingFee: number;
  totalDue: number;
};

type BoaInitData = {
  formAction: string;
  fields: Record<string, string>;
  referenceNumber?: string;
  transactionUuid?: string;
  feeBreakdown?: FeeBreakdown;
};

const initialCardData: CardData = {
  cardholderName: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  zipCode: "",
  addressLine1: "",
  city: "",
  state: "",
  country: "US",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function normalizeAlpha(value: string, maxLength = 60) {
  return value
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizeAlphaNumeric(value: string, maxLength = 60) {
  return value
    .replace(/[^a-zA-Z0-9\s.,#\-]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isCardDataValid(cardData: CardData) {
  const cardNumberDigits = onlyDigits(cardData.cardNumber);
  const zip = onlyDigits(cardData.zipCode);
  const month = Number(cardData.expiryMonth);
  const year = Number(cardData.expiryYear);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (!cardData.cardholderName.trim()) return false;
  if (!cardData.addressLine1.trim()) return false;
  if (!cardData.city.trim()) return false;
  if (!cardData.state.trim() || cardData.state.trim().length < 2) return false;
  if (!cardData.country.trim() || cardData.country.trim().length !== 2)
    return false;
  if (zip.length < 5) return false;
  if (cardNumberDigits.length < 13 || cardNumberDigits.length > 16)
    return false;
  if (!month || month < 1 || month > 12) return false;
  if (!year || cardData.expiryYear.length !== 2) return false;
  if (year < currentYear || (year === currentYear && month < currentMonth))
    return false;
  if (cardData.cvv.length < 3 || cardData.cvv.length > 4) return false;

  return true;
}

function resolveCardType(cardNumber: string): string | null {
  const digits = onlyDigits(cardNumber);

  if (!digits) return null;

  if (/^4/.test(digits)) return "001"; // Visa
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "002"; // Mastercard
  if (/^3[47]/.test(digits)) return "003"; // American Express
  if (/^(6011|65|64[4-9])/.test(digits)) return "004"; // Discover

  return null;
}

function parseFieldNames(list: string) {
  return list
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getSignedFieldDiagnostics(fields: Record<string, string>) {
  const signedList = parseFieldNames(fields.signed_field_names || "");
  const actualKeys = Object.keys(fields);

  const missingInPayload = signedList.filter((key) => !(key in fields));
  const extraUnsignedKeys = actualKeys.filter(
    (key) =>
      !signedList.includes(key) &&
      key !== "card_type" &&
      key !== "card_number" &&
      key !== "card_expiry_date" &&
      key !== "card_cvn",
  );

  return {
    signedList,
    actualKeys,
    missingInPayload,
    extraUnsignedKeys,
  };
}

function logInitPayloadDebug(
  formAction: string,
  fields: Record<string, string>,
) {
  if (process.env.NODE_ENV === "production") return;

  const requiredCore = [
    "access_key",
    "profile_id",
    "reference_number",
    "transaction_uuid",
    "signed_date_time",
    "transaction_type",
    "amount",
    "currency",
    "locale",
    "payment_method",
    "signed_field_names",
    "unsigned_field_names",
    "signature",
  ];
  const missingCore = requiredCore.filter((k) => !(k in fields));
  const diagnostics = getSignedFieldDiagnostics(fields);

  console.group("[BOA DEBUG] Init payload validation");
  console.log("form_action", formAction);
  console.log("field_count", diagnostics.actualKeys.length);
  console.log("field_keys", diagnostics.actualKeys.sort());
  console.log("signed_field_names", fields.signed_field_names || "");
  console.log("unsigned_field_names", fields.unsigned_field_names || "");
  console.log("missing_required_core_fields", missingCore);
  console.log("signed_fields_missing_in_payload", diagnostics.missingInPayload);
  console.log(
    "payload_keys_not_in_signed_field_names_excluding_card_inputs",
    diagnostics.extraUnsignedKeys,
  );
  console.groupEnd();
}

function logSecureAcceptanceDebug(
  action: string,
  fields: Record<string, string>,
) {
  if (process.env.NODE_ENV === "production") return;

  const requiredCore = [
    "access_key",
    "profile_id",
    "reference_number",
    "transaction_uuid",
    "signed_date_time",
    "transaction_type",
    "amount",
    "currency",
    "locale",
    "payment_method",
    "signed_field_names",
    "unsigned_field_names",
    "signature",
  ];

  const missingRequiredCore = requiredCore.filter((k) => !(k in fields));
  const finalKeys = Object.keys(fields).sort();
  const unsignedFieldNames = parseFieldNames(fields.unsigned_field_names || "");
  const signedDiagnostics = getSignedFieldDiagnostics(fields);
  const missingUnsigned = [
    "card_type",
    "card_number",
    "card_expiry_date",
    "card_cvn",
  ].filter((k) => !unsignedFieldNames.includes(k));

  console.group("[BOA DEBUG] Secure Acceptance submit");
  console.log("action", action);
  console.log("method", "POST");
  console.log("signed_field_names", fields.signed_field_names || "");
  console.log("unsigned_field_names", fields.unsigned_field_names || "");
  console.log("final_field_keys", finalKeys);
  console.log("missing_required_core_fields", missingRequiredCore);
  console.log(
    "signed_fields_missing_in_payload",
    signedDiagnostics.missingInPayload,
  );
  console.log(
    "payload_keys_not_in_signed_field_names_excluding_card_inputs",
    signedDiagnostics.extraUnsignedKeys,
  );
  console.log("missing_required_unsigned_fields", missingUnsigned);
  console.groupEnd();
}

function PaymentForm({
  selectedCategory,
  isSubmitting,
  onPay,
}: {
  selectedCategory: CategoryKey;
  isSubmitting: boolean;
  onPay: (cardData: CardData) => Promise<void>;
}) {
  const selected = categories[selectedCategory];

  const [cardData, setCardData] = useState<CardData>(initialCardData);

  const canSubmit = isCardDataValid(cardData) && !isSubmitting;

  const setField = <K extends keyof CardData>(key: K, value: CardData[K]) => {
    setCardData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePay = async () => {
    if (!canSubmit) {
      toast.error("Please complete valid billing and card details.");
      return;
    }

    const cardType = resolveCardType(cardData.cardNumber);
    if (!cardType) {
      toast.error(
        "Unsupported card type. Use Visa, Mastercard, Amex, or Discover.",
      );
      return;
    }

    await onPay(cardData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <p className="text-gray-400">Base Price:</p>
            <p className="text-white font-bold text-lg">
              {formatCurrency(selected.price)}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Tax and processing fee will be calculated by the backend and sent in
            the signed BOA payload before redirect.
          </p>
        </div>
      </div>

      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wide font-['Oswald']">
          Bank of America Card Payment
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-semibold">
              Cardholder Name
            </label>
            <input
              value={cardData.cardholderName}
              onChange={(e) =>
                setField(
                  "cardholderName",
                  normalizeAlphaNumeric(e.target.value),
                )
              }
              autoComplete="cc-name"
              placeholder="Name on card"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-semibold">
              Billing Address
            </label>
            <input
              value={cardData.addressLine1}
              onChange={(e) =>
                setField("addressLine1", normalizeAlphaNumeric(e.target.value))
              }
              autoComplete="address-line1"
              placeholder="123 Main St"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                City
              </label>
              <input
                value={cardData.city}
                onChange={(e) =>
                  setField("city", normalizeAlphaNumeric(e.target.value, 50))
                }
                autoComplete="address-level2"
                placeholder="Dallas"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                State
              </label>
              <input
                value={cardData.state}
                onChange={(e) =>
                  setField(
                    "state",
                    normalizeAlpha(e.target.value, 2).toUpperCase(),
                  )
                }
                autoComplete="address-level1"
                placeholder="TX"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                ZIP Code
              </label>
              <input
                value={cardData.zipCode}
                onChange={(e) =>
                  setField("zipCode", onlyDigits(e.target.value).slice(0, 10))
                }
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="75000"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                Country
              </label>
              <input
                value={cardData.country}
                onChange={(e) =>
                  setField(
                    "country",
                    normalizeAlpha(e.target.value, 2).toUpperCase(),
                  )
                }
                autoComplete="country"
                placeholder="US"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-semibold">
              Card Number
            </label>
            <input
              value={cardData.cardNumber}
              onChange={(e) =>
                setField("cardNumber", formatCardNumber(e.target.value))
              }
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                Exp. Month
              </label>
              <input
                value={cardData.expiryMonth}
                onChange={(e) =>
                  setField(
                    "expiryMonth",
                    onlyDigits(e.target.value).slice(0, 2),
                  )
                }
                inputMode="numeric"
                autoComplete="cc-exp-month"
                placeholder="MM"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                Exp. Year
              </label>
              <input
                value={cardData.expiryYear}
                onChange={(e) =>
                  setField("expiryYear", onlyDigits(e.target.value).slice(0, 2))
                }
                inputMode="numeric"
                autoComplete="cc-exp-year"
                placeholder="YY"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-semibold">
                CVV
              </label>
              <input
                value={cardData.cvv}
                onChange={(e) =>
                  setField("cvv", onlyDigits(e.target.value).slice(0, 4))
                }
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={!canSubmit}
          className="mt-6 w-full px-6 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Redirecting to Bank of America..." : "Pay Now"}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Your payment is securely processed by Bank of America Merchant
          Services.
        </p>
      </div>
    </div>
  );
}

export default function FounderBundleBankOfAmericaPage() {
  const router = useRouter();

  const [initialPaymentMutation, { isLoading: initialPaymentLoading }] =
    useInitialPaymentMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("youth");

  const selected = useMemo(
    () => categories[selectedCategory],
    [selectedCategory],
  );

  const handleSubmitToGateway = async (cardData: CardData) => {
    const cardType = resolveCardType(cardData.cardNumber);
    if (!cardType) {
      toast.error(
        "Unsupported card type. Use Visa, Mastercard, Amex, or Discover.",
      );
      return;
    }

    try {
      const result = await initialPaymentMutation({
        amount: selected.price,
        category: selected.type,
        isCredit: true,
        transactionType: "sale",
        cardholderName: cardData.cardholderName.trim(),
        billToAddressLine1: cardData.addressLine1.trim(),
        billToAddressCity: cardData.city.trim(),
        billToAddressState: cardData.state.trim(),
        billToAddressPostalCode: onlyDigits(cardData.zipCode),
        billToAddressCountry: cardData.country.trim().toUpperCase(),
      }).unwrap();

      if (!result?.success) {
        throw new Error(result?.message || "Initial payment failed.");
      }

      const data: BoaInitData | undefined = result?.data;
      const fields = data?.fields;
      const formAction = data?.formAction;

      if (!formAction || !fields) {
        throw new Error(
          "Invalid Bank of America response. Missing form fields.",
        );
      }

      logInitPayloadDebug(formAction, fields);

      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", formAction);
      form.setAttribute("accept-charset", "UTF-8");
      form.style.display = "none";

      const normalizedFields = { ...fields };
      const unsignedFieldNames = parseFieldNames(
        normalizedFields.unsigned_field_names || "",
      );
      const requiredUnsigned = [
        "card_type",
        "card_number",
        "card_expiry_date",
        "card_cvn",
      ];
      const missingUnsigned = requiredUnsigned.filter(
        (k) => !unsignedFieldNames.includes(k),
      );

      if (missingUnsigned.length) {
        throw new Error(
          `Invalid signed payload from backend. unsigned_field_names is missing: ${missingUnsigned.join(", ")}`,
        );
      }

      const fieldEntries: Array<[string, string]> = [
        ...Object.entries(normalizedFields),
        ["card_type", cardType],
        ["card_number", onlyDigits(cardData.cardNumber)],
        [
          "card_expiry_date",
          `${cardData.expiryMonth.padStart(2, "0")}-20${cardData.expiryYear}`,
        ],
        ["card_cvn", cardData.cvv],
      ];

      const finalFields = Object.fromEntries(fieldEntries);

      if (process.env.NODE_ENV !== "production") {
        console.group("[BOA DEBUG] Card input summary");
        console.log("card_type", cardType);
        console.log(
          "card_number_length",
          onlyDigits(cardData.cardNumber).length,
        );
        console.log(
          "card_expiry_date",
          `${cardData.expiryMonth.padStart(2, "0")}-20${cardData.expiryYear}`,
        );
        console.log("cvn_length", cardData.cvv.length);
        console.groupEnd();
      }

      logSecureAcceptanceDebug(formAction, finalFields);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "boa-checkout-summary",
          JSON.stringify({
            categoryKey: selectedCategory,
            categoryName: selected.name,
            categoryType: selected.type,
            referenceNumber:
              data?.referenceNumber || finalFields.reference_number,
            feeBreakdown: data?.feeBreakdown || null,
          }),
        );

        sessionStorage.setItem(
          "boa-submit-debug",
          JSON.stringify({
            action: formAction,
            signed_field_names: finalFields.signed_field_names,
            unsigned_field_names: finalFields.unsigned_field_names,
            final_field_keys: Object.keys(finalFields).sort(),
            reference_number: finalFields.reference_number,
            transaction_uuid: finalFields.transaction_uuid,
            signed_date_time: finalFields.signed_date_time,
          }),
        );
      }

      fieldEntries.forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      toast.error(error?.message || "Payment initialization failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 font-['Oswald']">
          Founder Bundle (Bank of America)
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Step {currentStep} of 2
        </p>

        <div className="flex items-center justify-center mb-12 gap-8">
          {[1, 2].map((step) => (
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
                Billing & Payment Information
              </h2>

              <PaymentForm
                selectedCategory={selectedCategory}
                isSubmitting={initialPaymentLoading}
                onPay={handleSubmitToGateway}
              />
            </>
          )}
        </div>

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
