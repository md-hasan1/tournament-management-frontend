/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Bell, Camera } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  useGetMeQuery,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/apiHooks/auth/authApi";
import { alertError, alertSuccess } from "@/lib/confirm";

type ProfileFormValues = {
  fullName: string;
  phoneNumber: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function CoachSettingsPage() {
  const { data: meData } = useGetMeQuery({});
  const me = meData?.data;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const [profileEditMode, setProfileEditMode] = useState(false);

  // Image handling
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const avatarSrc = useMemo(() => {
    return previewUrl || me?.profileImage || null;
  }, [previewUrl, me?.profileImage]);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = profileForm;

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = passwordForm;

  const newPasswordValue = watchPassword("newPassword");

  // When profile data arrives/changes, sync into RHF
  useEffect(() => {
    if (!me) return;

    resetProfile({
      fullName: me.fullName ?? "",
      phoneNumber: me.phoneNumber ?? "",
    });
  }, [me, resetProfile]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onClickEditProfile = () => {
    // Reset to latest server values when entering edit mode
    resetProfile({
      fullName: me?.fullName ?? "",
      phoneNumber: me?.phoneNumber ?? "",
    });

    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setProfileEditMode(true);
  };

  const onCancelEditProfile = () => {
    setProfileEditMode(false);

    // revert form state to server values
    resetProfile({
      fullName: me?.fullName ?? "",
      phoneNumber: me?.phoneNumber ?? "",
    });

    // revert image preview
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmitProfile = async (values: ProfileFormValues) => {
    try {
      const payload: any = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
      };

      if (selectedImage) {
        payload.image = selectedImage;
      }

      await updateProfile(payload).unwrap();

      await alertSuccess("Profile updated", "Your profile changes were saved.");
      setProfileEditMode(false);

      // Clear local image state after successful save
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedImage(null);
    } catch (e) {
      console.error(e);
      await alertError("Update failed", "Please try again.");
    }
  };

  const onSubmitPassword = async (values: PasswordFormValues) => {
    try {
      // Keep your current API shape: { email, password }
      // If backend needs currentPassword too, add it here.
      if (!me?.email) {
        await alertError("Missing email", "Could not detect your email.");
        return;
      }

      await resetPassword({
        email: me.email,
        password: values.newPassword,
      }).unwrap();

      await alertSuccess("Password updated", "Your password has been changed.");
      resetPasswordForm();
    } catch (e) {
      console.error(e);
      await alertError("Update failed", "Please try again.");
    }
  };

  const [notifications, setNotifications] = useState({
    tournaments: true,
    roster: true,
    games: true,
  });

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SETTINGS</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile Information */}
        <div className="bg-black border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-wide">
            PROFILE INFORMATION
          </h2>

          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 overflow-hidden">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700" />
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!profileEditMode}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;

                    // clear previous preview
                    if (previewUrl) URL.revokeObjectURL(previewUrl);

                    setSelectedImage(file);

                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    profileEditMode && fileInputRef.current?.click()
                  }
                  disabled={!profileEditMode}
                  className={`absolute bottom-0 right-2 text-black p-2 rounded-full transition-colors ${
                    profileEditMode
                      ? "bg-[#35BACB] hover:bg-[#A232D6]"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Camera size={25} />
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={handleSubmitProfile(onSubmitProfile)}
              className="flex-1 space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Full Name
                </label>

                <input
                  type="text"
                  disabled={!profileEditMode}
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-2 text-white focus:outline-none ${
                    profileEditMode
                      ? "border-gray-700 focus:border-[#35BACB]"
                      : "border-gray-800 text-gray-300 disabled:cursor-not-allowed"
                  }`}
                  {...registerProfile("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                {profileErrors.fullName?.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={me?.email ?? ""}
                  disabled
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-gray-400 disabled:cursor-not-allowed"
                />
                <p className="text-gray-500 text-xs mt-1">(Read-only)</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Phone Number
                </label>

                <input
                  type="tel"
                  disabled={!profileEditMode}
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-2 text-white focus:outline-none ${
                    profileEditMode
                      ? "border-gray-700 focus:border-[#35BACB]"
                      : "border-gray-800 text-gray-300 disabled:cursor-not-allowed"
                  }`}
                  {...registerProfile("phoneNumber", {
                    required: "Phone number is required",
                    minLength: { value: 8, message: "Invalid phone number" },
                  })}
                />
                {profileErrors.phoneNumber?.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {profileErrors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {profileEditMode ? (
                  <>
                    <button
                      type="submit"
                      disabled={
                        isUpdating || (!isProfileDirty && !selectedImage)
                      }
                      className="flex-1 bg-[#35BACB] text-black font-bold py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={onCancelEditProfile}
                      className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onClickEditProfile}
                    className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Password & Security */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-white">
            PASSWORD & SECURITY
          </h2>

          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  {...registerPassword("currentPassword")}
                />
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  {...registerPassword("newPassword", {
                    required: "New password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                />
                {passwordErrors.newPassword?.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) =>
                      v === newPasswordValue || "Passwords do not match",
                  })}
                />
                {passwordErrors.confirmPassword?.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="bg-[#35BACB] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60"
            >
              {isResetting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="border border-[#35BACB]/30 rounded-lg p-8 mb-8 bg-black/20 backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} className="text-[#35BACB]" />
            NOTIFICATIONS
          </h2>

          <div className="space-y-6">
            <ToggleRow
              title="Tournament Updates & Schedules"
              desc="Get notified about tournament registrations, schedules, and updates"
              checked={notifications.tournaments}
              onClick={() => handleToggleNotification("tournaments")}
            />

            <ToggleRow
              title="Roster & Waiver Alerts"
              desc="Alerts when players are signed, or roster changes occur"
              checked={notifications.roster}
              onClick={() => handleToggleNotification("roster")}
              bordered
            />

            <ToggleRow
              title="Game Day Reminders"
              desc="Reminders before match start times and field assignments"
              checked={notifications.games}
              onClick={() => handleToggleNotification("games")}
              bordered
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onClick,
  bordered,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onClick: () => void;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bordered ? "pb-4 border-b border-[#35BACB]/30" : ""
      }`}
    >
      <div>
        <div className="text-white font-bold">{title}</div>
        <div className="text-gray-500 text-sm">{desc}</div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          checked ? "bg-[#35BACB]" : "bg-gray-700"
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-black rounded-full transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
