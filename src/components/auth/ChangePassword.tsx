/* eslint-disable react-hooks/incompatible-library */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { useResetPasswordMutation } from "@/redux/apiHooks/auth/authApi";
import { alertError, alertSuccess } from "@/lib/confirm";

type ChangePasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (values: ChangePasswordForm) => {
    try {
      if (!email) {
        await alertError("Missing email", "Email not found in the URL.");
        return;
      }

      // ✅ Your backend expects: { email, password }
      await resetPassword({
        email,
        password: values.newPassword,
      }).unwrap();

      await alertSuccess(
        "Password changed",
        "You can now sign in with your new password.",
      );
      router.push("/auth/signin");
    } catch (e) {
      console.error(e);
      await alertError("Change failed", "Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src="/auth.png"
            alt="Change Password"
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
            Change Password
          </h1>
          <p className="text-gray-400 mb-10">
            Create your new password so you can access your account again.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter Your New Password"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600 disabled:opacity-60"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.newPassword?.message && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Confirm Password"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600 disabled:opacity-60"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (v) =>
                    v === newPasswordValue || "Passwords do not match",
                })}
              />
              {errors.confirmPassword?.message && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#35BACB] text-black font-bold py-3 rounded hover:bg-[#A232D6] transition text-lg disabled:opacity-60"
            >
              {isLoading ? "Updating..." : "Done"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div>
              <Link
                href="/auth/signin"
                className="text-gray-400 text-sm hover:text-[#35BACB] transition"
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
        </div>
      </div>
    </div>
  );
}
