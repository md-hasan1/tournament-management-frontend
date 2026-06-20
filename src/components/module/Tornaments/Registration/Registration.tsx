/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { skipToken } from "@reduxjs/toolkit/query";

import Spinner from "@/components/common/Spinner";
import {
  useGetSingleTournamentQuery,
  useGetTournamentQuery,
} from "@/redux/apiHooks/homePage/homePageApi";
import { setSelectedTeamId } from "@/redux/features/teamSelection/teamSelectionSclice";
import { useAppDispatch } from "@/redux/hooks";

// ✅ CHANGE THIS import to your real mutation hook path/name

import { useTeamRegistationMutation } from "@/redux/apiHooks/team/teamApi";
import {
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ActionButtons from "./components/ActionButtons";
import ProgressSteps from "./components/ProgressSteps";
import StepFour from "./components/StepFour";
import StepOne from "./components/StepOne";
import StepThree, { PaymentMethod } from "./components/StepThree";
import StepTwo from "./components/StepTwo";

export type TournamentDivision = {
  id: string;
  tournamentId: string;
  divisionName: string;
  maxTeams: number;
  slotsLeft: number;
  status: string;
  feeOverride: number | null;
};

export type Tournament = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  youthFee: number;
  adultFee: number;
  tournamentDivisions: TournamentDivision[];
};

const YOUTH_DIVISIONS = new Set<string>([
  "U9_BOYS",
  "U10_BOYS",
  "U9_GIRLS",
  "U10_GIRLS",
  "U11_BOYS",
  "U11_GIRLS",
  "U12_BOYS",
  "U12_GIRLS",
  "U13_BOYS",
  "U14_BOYS",
  "U13_GIRLS",
  "U14_GIRLS",
  "U15_BOYS",
  "U16_BOYS",
  "U15_GIRLS",
  "U16_GIRLS",
  "U17_BOYS",
  "U18_BOYS",
  "U17_GIRLS",
  "U18_GIRLS",
  "HS_BOYS",
  "HS_GIRLS",
]);

const ADULT_DIVISIONS = new Set<string>([
  "MENS_DIV_1",
  "MENS_DIV_2",
  "MENS_DIV_3",
  "WOMENS",
  "COED",
]);

const normalizeDivisionName = (name?: string) =>
  (name ?? "").trim().toUpperCase();

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const PREFERRED_TEAM_ID_KEY = "preferredTeamId";

function RegistrationInner() {
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() || null;

  // ✅ Mutation hook (RTK Query)
  const [createTeamRegistration, { isLoading: isCreating }] =
    useTeamRegistationMutation();

  // Use single-tournament endpoint only when id exists.
  const {
    data: getSingleTournament,
    isLoading: isSingleTournamentLoading,
    isFetching: isSingleTournamentFetching,
  } = useGetSingleTournamentQuery(id ? { id } : skipToken);
  const {
    data: getTournament,
    isLoading: isTournamentListLoading,
    isFetching: isTournamentListFetching,
  } = useGetTournamentQuery(id ? skipToken : { page: 1, limit: 100 });

  const [currentStep, setCurrentStep] = useState(1);

  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [teamMode, setTeamMode] = useState<"new" | "existing">("new");
  const [selectedExistingTeamId, setSelectedExistingTeamId] = useState("");

  const [teamName, setTeamName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [stripeComplete, setStripeComplete] = useState(false);

  const [submitError, setSubmitError] = useState<string>("");

  const tournaments: Tournament[] = useMemo(() => {
    const source = id ? getSingleTournament : getTournament;
    return (source?.data?.data ?? []) as Tournament[];
  }, [id, getSingleTournament, getTournament]);

  useEffect(() => {
    if (tournaments.length === 1) {
      const only = tournaments[0];
      setSelectedTournament(only.id);

      if (only.tournamentDivisions?.length) {
        const firstAvailable =
          only.tournamentDivisions.find((d) => d.slotsLeft > 0) ??
          only.tournamentDivisions[0];
        setSelectedDivision(firstAvailable.id);
      }
    }
  }, [tournaments]);

  const selectedTournamentData = tournaments.find(
    (t) => t.id === selectedTournament,
  );
  const selectedDivisionData =
    selectedTournamentData?.tournamentDivisions?.find(
      (d) => d.id === selectedDivision,
    );

  const feeType = useMemo<"youth" | "adult" | "unknown">(() => {
    const name = normalizeDivisionName(selectedDivisionData?.divisionName);
    if (!name) return "unknown";
    if (YOUTH_DIVISIONS.has(name)) return "youth";
    if (ADULT_DIVISIONS.has(name)) return "adult";
    return "unknown";
  }, [selectedDivisionData?.divisionName]);

  const entryFeeNumber = useMemo<number | null>(() => {
    if (!selectedTournamentData) return null;
    if (selectedDivisionData?.feeOverride != null)
      return selectedDivisionData.feeOverride;
    if (feeType === "adult") return selectedTournamentData.adultFee;
    return selectedTournamentData.youthFee;
  }, [selectedTournamentData, selectedDivisionData?.feeOverride, feeType]);

  const entryFeeLabel = entryFeeNumber == null ? "" : `$${entryFeeNumber}`;

  const tournamentDateRange = useMemo(() => {
    if (!selectedTournamentData?.startDate || !selectedTournamentData?.endDate)
      return "";
    return `${formatDate(selectedTournamentData.startDate)} - ${formatDate(
      selectedTournamentData.endDate,
    )}`;
  }, [selectedTournamentData]);

  const handleTournamentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedTournament(e.target.value);
      setSelectedDivision("");
    },
    [],
  );

  const handleDivisionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedDivision(e.target.value);
    },
    [],
  );

  const clearStepTwoFields = useCallback(() => {
    setTeamName("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  const handleTeamModeChange = useCallback(
    (mode: "new" | "existing") => {
      setTeamMode(mode);
      if (mode === "new") setSelectedExistingTeamId("");
      clearStepTwoFields();
    },
    [clearStepTwoFields],
  );

  const handleExistingTeamChange = useCallback((teamId: string) => {
    setSelectedExistingTeamId(teamId);
  }, []);

  // ✅ Stripe: create payment method id (pm_...)
  const createStripePaymentMethodId = async (): Promise<string> => {
    if (!stripe || !elements) throw new Error("Stripe is not ready");

    const cardNumberEl = elements.getElement(CardNumberElement);
    if (!cardNumberEl) throw new Error("Card element not found");

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberEl,
      billing_details: {
        name: `${firstName} ${lastName}`.trim() || undefined,
        email: email || undefined,
        phone: phone || undefined,
      },
    });

    if (result.error) {
      throw new Error(result.error.message || "Stripe payment method failed");
    }
    if (!result.paymentMethod?.id) {
      throw new Error("Payment method id missing");
    }

    return result.paymentMethod.id;
  };

  const buildRegistrationPayload = async () => {
    if (!selectedTournamentData?.id || !selectedDivisionData?.id) {
      throw new Error("Tournament/Division missing");
    }

    const payload: any = {
      tournamentId: selectedTournamentData.id,
      teamDivisionId: selectedDivisionData.id,
    };

    // existing vs new
    if (teamMode === "existing") {
      payload.teamId = selectedExistingTeamId;
    } else {
      payload.teamName = teamName;
      payload.manager = {
        email,
        firstName,
        lastName,
        password,
        phone,
      };
    }

    // payment
    if (paymentMethod === "bundle") {
      payload.isBundle = true;
      // no methodId
    } else {
      payload.isBundle = false;
      payload.methodId = await createStripePaymentMethodId();
    }

    return payload;
  };

  const getRegisteredTeamId = (response: any): string | null => {
    return (
      response?.data?.registration?.teamId ??
      response?.data?.registration?.team?.id ??
      response?.data?.teamId ??
      response?.data?.team?.id ??
      null
    );
  };

  const handleNext = async () => {
    if (isCreating) return;
    setSubmitError("");

    // Step 1
    if (currentStep === 1) {
      if (!selectedTournament || !selectedDivision) {
        setSubmitError("Please select both tournament and division.");
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Step 2
    if (currentStep === 2) {
      if (teamMode === "existing") {
        if (!selectedExistingTeamId) {
          setSubmitError("Please select your existing team.");
          return;
        }
      } else {
        if (
          !teamName ||
          !firstName ||
          !lastName ||
          !email ||
          !phone ||
          !password ||
          !confirmPassword
        ) {
          setSubmitError("Please fill in all fields.");
          return;
        }
        if (password.length < 8 || confirmPassword.length < 8) {
          setSubmitError("Password must be at least 8 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setSubmitError("Passwords do not match.");
          return;
        }
      }
      setCurrentStep(3);
      return;
    }

    // Step 3 -> SUBMIT via redux mutation
    if (currentStep === 3) {
      if (paymentMethod === "stripe" && !stripeComplete) {
        setSubmitError("Please complete card information.");
        return;
      }

      try {
        const payload = await buildRegistrationPayload();

        // ✅ RTK Query call
        // If your API returns { success, message, data }, keep this style.
        const res = await createTeamRegistration(payload).unwrap();

        if (!res?.success) {
          setSubmitError(res?.message || "Registration failed.");
          return;
        }

        const teamId =
          getRegisteredTeamId(res) ||
          (teamMode === "existing" ? selectedExistingTeamId : null);

        if (teamId) {
          dispatch(setSelectedTeamId(teamId));
          localStorage.setItem(PREFERRED_TEAM_ID_KEY, teamId);
        }

        setCurrentStep(4);
      } catch (err: any) {
        // RTK unwrap gives either server response or error shape
        const msg =
          err?.data?.message ||
          err?.message ||
          "Something went wrong while registering.";
        setSubmitError(msg);
      }

      return;
    }

    // Step 4 -> done
    if (currentStep === 4) {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    setSubmitError("");
    if (currentStep > 1) setCurrentStep((s) => s - 1);
    else router.push("/");
  };

  const isSubmitting = isCreating;
  const isTournamentLoading = id
    ? isSingleTournamentLoading || isSingleTournamentFetching
    : isTournamentListLoading || isTournamentListFetching;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2 font-['Oswald']">
          Team Registration
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Select your tournament and division
        </p>

        <div className="max-w-2xl mx-auto">
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
        </div>

        <div className="bg-[#201B1A] rounded-3xl p-8 mb-8">
          {currentStep === 1 && isTournamentLoading ? (
            <div className="py-5">
              <Spinner size={36} className="min-h-0" />
            </div>
          ) : null}

          {currentStep === 1 && !isTournamentLoading && (
            <StepOne
              selectedTournament={selectedTournament}
              selectedDivision={selectedDivision}
              tournaments={tournaments}
              onTournamentChange={handleTournamentChange}
              onDivisionChange={handleDivisionChange}
            />
          )}

          {currentStep === 2 && (
            <StepTwo
              teamMode={teamMode}
              selectedExistingTeamId={selectedExistingTeamId}
              onTeamModeChange={handleTeamModeChange}
              onExistingTeamChange={handleExistingTeamChange}
              teamName={teamName}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              onTeamNameChange={(e) => setTeamName(e.target.value)}
              onFirstNameChange={(e) => setFirstName(e.target.value)}
              onLastNameChange={(e) => setLastName(e.target.value)}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPhoneChange={(e) => setPhone(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onConfirmPasswordChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          )}

          {currentStep === 3 && (
            <StepThree
              tournamentName={selectedTournamentData?.name ?? ""}
              tournamentDate={tournamentDateRange}
              tournamentLocation={selectedTournamentData?.location ?? ""}
              divisionId={selectedDivisionData?.id ?? ""}
              divisionName={selectedDivisionData?.divisionName ?? ""}
              teamName={teamName}
              entryFee={entryFeeLabel}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={(m) => {
                setPaymentMethod(m);
                if (m === "stripe") setStripeComplete(false);
              }}
              onStripeCompleteChange={setStripeComplete}
              isProcessing={isSubmitting}
            />
          )}

          {currentStep === 4 && (
            <StepFour
              selectedTournamentData={selectedTournamentData}
              selectedDivisionData={selectedDivisionData}
              teamName={teamName}
              entryFee={entryFeeLabel}
            />
          )}

          {submitError ? (
            <div className="mt-6 p-3 rounded border border-red-500 bg-red-500/10 text-red-200 text-sm">
              {submitError}
            </div>
          ) : null}
        </div>

        <ActionButtons
          currentStep={currentStep}
          onBack={handleBack}
          onNext={handleNext}
          disabled={isSubmitting}
        />

        {isSubmitting ? (
          <p className="text-center text-gray-300 mt-4">Submitting...</p>
        ) : null}

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

export default function TournamentRegistrationPage() {
  return (
    <Elements stripe={stripePromise}>
      <RegistrationInner />
    </Elements>
  );
}
