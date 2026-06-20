/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/apiHooks/auth/authApi";
import { toast } from "sonner";

type FormValues = {
  code0: string;
  code1: string;
  code2: string;
  code3: string;
};

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "";

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: { code0: "", code1: "", code2: "", code3: "" },
  });

  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp, { isLoading }] = useResendOtpMutation();

  const values = watch(["code0", "code1", "code2", "code3"]);

  const focusIndex = (i: number) => {
    inputRefs.current[i]?.focus();
  };

  const onValidSubmit = async (data: FormValues) => {
    const verificationCodeStr = `${data.code0}${data.code1}${data.code2}${data.code3}`;
    const otp = Number(verificationCodeStr);

    if (verificationCodeStr.length !== 4 || Number.isNaN(otp)) {
      toast.error("Please enter a valid 4-digit code.");
      return;
    }

    const toastId = toast.loading("Verifing OTP.....");
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("Account Verification Successful", { id: toastId });
      router.push("/auth/signin"); // change if needed
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Invalid verification code.";
      toast.error(msg);
    }
  };

  const handleDigitChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setValue(`code${index}` as keyof FormValues, digit, {
      shouldValidate: true,
    });

    if (digit && index < 3) focusIndex(index + 1);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      const current = values[index] || "";
      if (!current && index > 0) focusIndex(index - 1);
    }

    if (key === "ArrowLeft" && index > 0) focusIndex(index - 1);
    if (key === "ArrowRight" && index < 3) focusIndex(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;

    for (let i = 0; i < 4; i++) {
      setValue(`code${i}` as keyof FormValues, pasted[i] ?? "", {
        shouldValidate: true,
      });
    }

    const next = Math.min(pasted.length, 3);
    focusIndex(next);
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp({ email }).unwrap(); // ✅ call unwrap()

      if (response?.success) {
        toast.success(response.message || `Resent code to: ${email}`);
        // or: toast.success(`Resent code to: ${email}`);
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
      );
    }
  };

  const inputBase =
    "w-16 h-16 bg-gray-900 text-white border-2 border-gray-700 rounded text-center text-2xl font-bold focus:outline-none focus:border-[#35BACB] transition";

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/auth.png"
            alt="Verification"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#201B1A] p-8 rounded-3xl">
          <h1 className="text-5xl font-bold text-white mb-3">
            Verification Code
          </h1>

          <p className="text-gray-400 mb-3">
            Please check your mail. We have sent the code verification to your
            e-mail.
          </p>

          <p className="text-gray-500 text-sm mb-10 break-all">
            Sent to: <span className="text-gray-300">{email || "N/A"}</span>
          </p>

          <form onSubmit={handleSubmit(onValidSubmit)}>
            <div className="flex gap-4 mb-3 justify-center">
              {[0, 1, 2, 3].map((i) => {
                const name = `code${i}` as keyof FormValues;

                // ✅ Get RHF props, then merge refs
                const reg = register(name, {
                  required: true,
                  validate: (v) => (v && /^\d$/.test(v) ? true : false),
                });

                return (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={`${inputBase} ${
                      errors[name] ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    {...reg}
                    ref={(el) => {
                      // keep our local refs
                      inputRefs.current[i] = el;
                      // keep react-hook-form ref working
                      reg.ref(el);
                    }}
                    value={values[i] ?? ""}
                    onChange={(e) => {
                      reg.onChange(e); // keep RHF updated
                      handleDigitChange(i, e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    aria-label={`Verification digit ${i + 1}`}
                  />
                );
              })}
            </div>

            <div className="min-h-5 text-center mb-5">
              {(errors.code0 ||
                errors.code1 ||
                errors.code2 ||
                errors.code3) && (
                <p className="text-red-400 text-sm">
                  Please enter the 4-digit code.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#35BACB] text-black font-bold py-3 rounded hover:bg-[#A232D6] transition text-lg mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>

          <div className="text-center space-y-4">
            <div>
              <span className="text-gray-400 text-sm">
                Didn&apos;t get a code?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-[#35BACB] font-semibold hover:text-[#A232D6] transition text-sm cursor-pointer"
              >
                {isLoading ? "Sending..." : "Click to resend"}
              </button>
            </div>

            <div>
              <Link
                href="/"
                className="text-gray-400 text-sm hover:text-[#35BACB] transition"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
