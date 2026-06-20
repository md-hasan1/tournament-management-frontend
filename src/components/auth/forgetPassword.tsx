/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "@/redux/apiHooks/auth/authApi";
import { alertError, alertSuccess } from "@/lib/confirm";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    try {
      // 1) Trigger forgot password (send OTP / code)
      await forgotPassword({ email: values.email }).unwrap();

      await alertSuccess(
        "Code sent",
        "Please check your email for the verification code.",
      );

      // 2) Navigate to verification screen
      router.push(
        `/auth/forgot-password-verify?email=${encodeURIComponent(values.email)}`,
      );
    } catch (e) {
      console.error(e);
      await alertError(
        "Request failed",
        "Could not send verification code. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/auth.png"
            alt="Forgot Password"
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
            Forgot Password
          </h1>
          <p className="text-gray-400 mb-10">
            Please enter your email to reset the password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-3">Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600 disabled:opacity-60"
                disabled={isLoading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email?.message && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#35BACB] text-black font-bold py-3 rounded hover:bg-[#A232D6] transition text-lg disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div>
              <Link
                href="/auth/signin"
                className="text-[#35BACB] font-semibold hover:text-[#A232D6] transition"
              >
                Back to Login
              </Link>
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

          {/* tiny helper (optional): shows what will be submitted */}
          {/* <p className="text-xs text-gray-600 mt-6">Email: {getValues("email")}</p> */}
        </div>
      </div>
    </div>
  );
}
