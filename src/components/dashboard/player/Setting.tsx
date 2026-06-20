/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  useChangePasswordMutation,
  useGetMeQuery,
} from "@/redux/apiHooks/auth/authApi";
import { useUpdatePlayerProfileMutation } from "@/redux/apiHooks/playerApi/playerApi";
import { alertError, alertSuccess } from "@/lib/confirm";

type ProfileFormState = {
  fullName: string;
  dob: string; // "YYYY-MM-DD"
  emergency_phone: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function isoToDateInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function PlayerSettingsPage() {
  const { data, isLoading, isError, refetch } = useGetMeQuery({});
  const apiUser = data?.data;

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdatePlayerProfileMutation();
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const prevBlobUrlRef = useRef<string | null>(null);

  const [profileEditMode, setProfileEditMode] = useState(false);

  // Build initial defaults from API
  const initialProfile: ProfileFormState = useMemo(
    () => ({
      fullName: apiUser?.fullName ?? "",
      dob: isoToDateInput(apiUser?.dob),
      emergency_phone: apiUser?.phoneNumber ?? "",
    }),
    [apiUser],
  );

  const avatarSrc = useMemo(
    () => localPreviewUrl || apiUser?.profileImage || null,
    [localPreviewUrl, apiUser?.profileImage],
  );

  const isBlob = typeof avatarSrc === "string" && avatarSrc.startsWith("blob:");

  const handleOpenCamera = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Max 5MB.");
        return;
      }

      // Clean up previous blob URL
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }

      const blobUrl = URL.createObjectURL(file);
      prevBlobUrlRef.current = blobUrl;

      setLocalPreviewUrl(blobUrl);
      setSelectedImageFile(file);

      // Allow reselect same file
      e.target.value = "";
    },
    [],
  );

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
    };
  }, []);

  // -----------------------
  // Profile form (react-hook-form)
  // -----------------------
  const {
    control,
    handleSubmit,
    reset: resetProfile,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormState>({
    defaultValues: initialProfile,
    mode: "onChange",
  });

  // When API data arrives/changes, populate the form (ONLY if not editing)
  useEffect(() => {
    if (apiUser && !profileEditMode) {
      resetProfile(initialProfile);
    }
  }, [apiUser, initialProfile, resetProfile, profileEditMode]);

  const handleProfileEdit = useCallback(() => {
    // Start editing with current form values (not stale defaults)
    resetProfile(getValues());
    setProfileEditMode(true);
  }, [getValues, resetProfile]);

  const onSaveProfile = useCallback(
    async (values: ProfileFormState) => {
      if (!apiUser) {
        toast.error("User not loaded yet.");
        return;
      }

      try {
        const payloadData = {
          fullName: values.fullName,
          dob: values.dob,
          phoneNumber: values.emergency_phone,
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(payloadData));

        if (selectedImageFile) {
          formData.append("image", selectedImageFile);
        }

        await updateProfile(formData).unwrap();
        await refetch();

        // Clear preview/file after success
        if (prevBlobUrlRef.current) {
          URL.revokeObjectURL(prevBlobUrlRef.current);
          prevBlobUrlRef.current = null;
        }
        setLocalPreviewUrl(null);
        setSelectedImageFile(null);

        setProfileEditMode(false);
        await alertSuccess(
          "Profile updated",
          "Your profile changes were saved.",
        );
      } catch (err: any) {
        const msg =
          err?.data?.message ||
          err?.error ||
          err?.data?.error ||
          "Failed to update profile. Please try again.";
        await alertError(msg || "Update failed", "Please try again.");
      }
    },
    [apiUser, refetch, selectedImageFile, updateProfile],
  );

  const handleSaveClick = useCallback(() => {
    handleSubmit(onSaveProfile)();
  }, [handleSubmit, onSaveProfile]);

  const handleCancelProfile = useCallback(() => {
    resetProfile(initialProfile);

    // Revert image preview
    if (prevBlobUrlRef.current) {
      URL.revokeObjectURL(prevBlobUrlRef.current);
      prevBlobUrlRef.current = null;
    }
    setLocalPreviewUrl(null);
    setSelectedImageFile(null);

    setProfileEditMode(false);
  }, [initialProfile, resetProfile]);

  const isProfileBusy = isLoading || isSubmitting || isUpdating;

  // -----------------------
  // Notifications (local only)
  // -----------------------
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    matchReminders: true,
    waiverAlerts: true,
    teamUpdates: false,
  });

  const handleNotificationChange = useCallback(
    (key: keyof typeof notifications) => {
      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  // -----------------------
  // Password form (separate react-hook-form)
  // -----------------------
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const pw = watchPassword();

  const onUpdatePassword = useCallback(
    async (values: PasswordFormValues) => {
      if (values.newPassword !== values.confirmPassword) {
        await alertError("Missing email", "Could not detect your email.");
        return;
      }

      const payload = {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      try {
        await changePassword(payload).unwrap();
        await alertSuccess(
          "Password updated",
          "Your password has been changed.",
        );
        resetPassword();
      } catch (error: any) {
        const msg =
          error?.data?.message ||
          error?.message ||
          error?.error ||
          "Password update error";
        toast.error(msg);
      }
    },
    [changePassword, resetPassword],
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-linear-to-br from-gray-900 to-[#1a1a1a] border border-gray-800 rounded-xl p-8">
          <h2 className="font-bold text-2xl mb-6 uppercase tracking-wider">
            My Profile & Settings
          </h2>

          {isLoading && (
            <div className="text-gray-400 mb-6">Loading profile...</div>
          )}
          {isError && (
            <div className="text-red-400 mb-6">
              Failed to load profile. Please try again.
            </div>
          )}

          {/* Profile Information */}
          <div className="mb-8 pb-8 border-b border-gray-800">
            <h3 className="text-[#35BACB] font-bold text-lg mb-6 uppercase tracking-wider">
              Profile Information
            </h3>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 overflow-hidden">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized={isBlob}
                      sizes="128px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={!profileEditMode || isProfileBusy}
                  />

                  <button
                    type="button"
                    onClick={handleOpenCamera}
                    disabled={!profileEditMode || isProfileBusy}
                    className="absolute bottom-0 right-3 bg-[#35BACB] text-black p-2 rounded-full hover:bg-[#A232D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Change profile photo"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                {/* {selectedImageFile && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    New image selected: {selectedImageFile.name}
                  </p>
                )} */}
              </div>

              {/* Profile Form */}
              <div className="flex-1 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                    Full Name
                  </label>

                  {profileEditMode ? (
                    <Controller
                      control={control}
                      name="fullName"
                      rules={{ required: "Full name is required" }}
                      render={({ field }) => (
                        <div>
                          <input
                            type="text"
                            {...field}
                            disabled={isProfileBusy}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                          />
                          {errors.fullName && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300">
                      {apiUser?.fullName || "Not set"}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                    Date of Birth
                  </label>

                  {profileEditMode ? (
                    <Controller
                      control={control}
                      name="dob"
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          disabled={isProfileBusy}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                        />
                      )}
                    />
                  ) : (
                    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300">
                      {isoToDateInput(apiUser?.dob) || "Not set"}
                    </div>
                  )}
                </div>

                {/* Email Address (Read-only from API) */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                    Email Address
                  </label>

                  <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-400">
                    {apiUser?.email || "Not set"}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">(Read-only)</p>
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                    Emergency Contact Phone
                  </label>

                  {profileEditMode ? (
                    <Controller
                      control={control}
                      name="emergency_phone"
                      render={({ field }) => (
                        <input
                          type="tel"
                          {...field}
                          disabled={isProfileBusy}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                        />
                      )}
                    />
                  ) : (
                    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300">
                      {apiUser?.phoneNumber || "Not set"}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  {profileEditMode ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveClick}
                        disabled={isProfileBusy}
                        className="flex-1 bg-[#35BACB] text-black font-bold py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isProfileBusy ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelProfile}
                        disabled={isProfileBusy}
                        className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleProfileEdit}
                      className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={isLoading || !apiUser}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="mb-8 pb-8 border-b border-gray-800">
            <h3 className="text-[#35BACB] font-bold text-lg mb-4 uppercase tracking-wider">
              Change Password
            </h3>

            <form
              className="space-y-4"
              onSubmit={handleSubmitPassword(onUpdatePassword)}
            >
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  disabled={isChanging}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                  {...registerPassword("currentPassword", { required: true })}
                />
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  disabled={isChanging}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                  {...registerPassword("newPassword", {
                    required: true,
                    minLength: 6,
                  })}
                />
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  disabled={isChanging}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#35BACB] disabled:opacity-60"
                  {...registerPassword("confirmPassword", { required: true })}
                />
              </div>

              <button
                type="submit"
                disabled={
                  isChanging ||
                  !pw.currentPassword ||
                  !pw.newPassword ||
                  !pw.confirmPassword
                }
                className="mt-2 bg-[#35BACB] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isChanging ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-[#35BACB] font-bold text-lg mb-4 uppercase tracking-wider">
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-white font-semibold">
                    Email Notifications
                  </p>
                  <p className="text-gray-500 text-sm">
                    Receive updates via email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("emailNotifications")}
                  className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                    notifications.emailNotifications
                      ? "bg-[#35BACB]"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-black rounded-full transition-transform ${
                      notifications.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-white font-semibold">Match Reminders</p>
                  <p className="text-gray-500 text-sm">
                    Get notified before upcoming matches
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("matchReminders")}
                  className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                    notifications.matchReminders
                      ? "bg-[#35BACB]"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-black rounded-full transition-transform ${
                      notifications.matchReminders
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="text-white font-semibold">Waiver Alerts</p>
                  <p className="text-gray-500 text-sm">
                    Alert for pending waivers and documents
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("waiverAlerts")}
                  className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                    notifications.waiverAlerts ? "bg-[#35BACB]" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-black rounded-full transition-transform ${
                      notifications.waiverAlerts
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-semibold">Team Updates</p>
                  <p className="text-gray-500 text-sm">
                    News and announcements from your team
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange("teamUpdates")}
                  className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                    notifications.teamUpdates ? "bg-[#35BACB]" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-black rounded-full transition-transform ${
                      notifications.teamUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Optional: if you later persist notifications, add a Save button & loading here */}
          </div>
        </div>
      </div>
    </div>
  );
}
