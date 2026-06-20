"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type InvitePayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "MANAGER";
};

interface InviteManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (payload: InvitePayload) => void;
  submitting?: boolean; // ✅ renamed prop (was isSubmitting)
}

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const InviteManagerModal: React.FC<InviteManagerModalProps> = ({
  open,
  onOpenChange,
  onInvite,
  submitting = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formSubmitting }, // ✅ renamed RHF state
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: FormValues) => {
    onInvite({
      ...values,
      role: "MANAGER",
    });
  };

  const disabled = submitting || formSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset(); // clears form when closing
      }}
    >
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 max-w-sm">
        <DialogHeader className="pb-6 border-b border-gray-800">
          <DialogTitle className="text-xl font-bold text-white uppercase tracking-wide">
            INVITE TEAM MANAGER
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full bg-gray-900 text-white border rounded px-4 py-3 focus:outline-none transition placeholder-gray-600 ${
                errors.fullName ? "border-red-500" : "border-gray-700"
              }`}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "Full name is too short" },
              })}
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-2">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="staffmember@email.com"
              className={`w-full bg-gray-900 text-white border rounded px-4 py-3 focus:outline-none transition placeholder-gray-600 ${
                errors.email ? "border-red-500" : "border-gray-700"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+8801712345678"
              className={`w-full bg-gray-900 text-white border rounded px-4 py-3 focus:outline-none transition placeholder-gray-600 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-700"
              }`}
              {...register("phoneNumber", {
                required: "Phone number is required",
                minLength: { value: 7, message: "Phone number is too short" },
              })}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-xs mt-2">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="123456"
                className={`w-full bg-gray-900 text-white border rounded px-4 py-3 pr-12 focus:outline-none transition placeholder-gray-600 ${
                  errors.password ? "border-red-500" : "border-gray-700"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3 flex gap-3">
            <div className="shrink-0 mt-0.5">
              <span className="text-yellow-400">ℹ</span>
            </div>
            <p className="text-[#EAB634] text-xs">
              An invitation email will be sent to this address. They will have
              access to view the roster and tournament schedule. Only the head
              coach can edit player information.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-3 border border-gray-700 text-white font-semibold rounded hover:bg-gray-900 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={disabled}
              className="flex-1 px-4 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {disabled ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteManagerModal;
