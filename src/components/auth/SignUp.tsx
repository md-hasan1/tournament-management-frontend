/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/redux/apiHooks/auth/authApi";
import { toast } from "sonner";

type SignUpFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const SignUpPage = () => {
  const router = useRouter();

  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await registerUser(data).unwrap();

      toast.success(response.message);

      // ✅ use data.email
      router.push(`/auth/verification?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
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
            alt="Soccer Player"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#201B1A] p-8 rounded-3xl">
          <h1 className="text-5xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 mb-10">
            Welcome back! Continue Register tournament and manage everything
            properly.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                {...register("fullName", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">Phone</label>
              <input
                type="tel"
                placeholder="Enter Your Number"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number seems too short",
                  },
                })}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-3">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-4 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#35BACB] text-black font-bold py-3 rounded hover:bg-[#A232D6] transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div>
              <span className="text-gray-400">Already have any account? </span>
              <Link
                href="/auth/signin"
                className="text-[#35BACB] font-semibold hover:text-[#A232D6] transition"
              >
                Log In
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
};

export default SignUpPage;
