/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { alertError, alertSuccess } from "@/lib/confirm";
import {
  useGetMeQuery,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/apiHooks/auth/authApi";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AdminSettingsPage() {
  const [profileEditMode, setProfileEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: meData } = useGetMeQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();
  const userData = meData?.data;
  const fullName = userData?.fullName ?? "";
  const email = userData?.email ?? "";
  const phoneNumber = userData?.phoneNumber ?? "";
  const profileImage = userData?.profileImage ?? "";

  const [profile, setProfile] = useState({
    fullName: fullName || "",
    email: email || "",
    phone: phoneNumber || "",
    imageUrl: profileImage || "",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    const nextProfile = {
      fullName,
      email,
      phone: phoneNumber,
      imageUrl: profileImage,
    };

    setProfile(nextProfile);
    if (!profileEditMode) {
      setTempProfile(nextProfile);
    }
  }, [fullName, email, phoneNumber, profileImage, profileEditMode]);

  // useEffect(() => {
  //   const u = (meData as any)?.data || (meData as any) || {};
  //   const fullName = u?.name || u?.fullName || "";
  //   const email = u?.email || "";
  //   const phone = u?.phoneNumber || u?.phone || "";
  //   const imageUrl = u?.image || u?.avatar || u?.profileImage || "";
  //   // const next = { fullName, email, phone, imageUrl };
  //   // setProfile(next);
  //   // setTempProfile(next);
  // }, [meData]);

  const [notifications, setNotifications] = useState({
    waiverAlerts: true,
    teamUpdates: true,
    matchReminders: true,
  });

  const handleProfileEdit = () => {
    setTempProfile(profile);
    setProfileEditMode(true);
  };

  const handleSaveProfile = () => {
    (async () => {
      try {
        const payload: any = {
          fullName: tempProfile.fullName,
          phoneNumber: tempProfile.phone,
        };
        if (selectedImage) {
          payload.image = selectedImage;
        }
        console.log(selectedImage);
        await updateProfile(payload).unwrap();
        setProfile(tempProfile);
        setProfileEditMode(false);
        await alertSuccess(
          "Profile updated",
          "Your profile changes were saved.",
        );
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setSelectedImage(null);
      } catch (e) {
        console.error(e);
        await alertError("Update failed", "Please try again.");
      }
    })();
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        await alertError(
          "Missing fields",
          "Please enter and confirm the new password.",
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        await alertError(
          "Mismatch",
          "New password and confirmation do not match.",
        );
        return;
      }
      await resetPassword({
        email: email,
        password: newPassword,
      }).unwrap();
      await alertSuccess("Password updated", "Your password has been changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      console.error(e);
      await alertError("Update failed", "Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold mb-2">SETTINGS</h1>
        <p className="text-gray-400 mb-8">
          Manage your account and preferences
        </p>

        {/* Profile Information Section */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
            PROFILE INFORMATION
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 overflow-hidden">
                {previewUrl || meData?.data?.profileImage ? (
                  <Image
                    src={(previewUrl || profileImage) as string}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    } else {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setPreviewUrl(null);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-2 bg-[#35BACB] text-black p-2 rounded-full hover:bg-[#A232D6] transition-colors"
                >
                  <Camera size={25} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Full Name
                </label>
                {profileEditMode ? (
                  <input
                    type="text"
                    value={tempProfile.fullName}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#35BACB]"
                  />
                ) : (
                  <input
                    type="text"
                    value={fullName}
                    disabled
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 disabled:cursor-not-allowed"
                  />
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 disabled:cursor-not-allowed"
                />
                <p className="text-gray-500 text-xs mt-1">(Read-only)</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                  Phone Number
                </label>
                {profileEditMode ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, phone: e.target.value })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#35BACB]"
                  />
                ) : (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    disabled
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 disabled:cursor-not-allowed"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {profileEditMode ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="flex-1 bg-[#35BACB] text-black font-bold py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setProfileEditMode(false)}
                      className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleProfileEdit}
                    className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password & Security */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
            PASSWORD & SECURITY
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
              />
            </div>

            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2 block">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
              />
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={isResetting}
            className="bg-[#35BACB] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#A232D6] transition-colors disabled:opacity-60"
          >
            {isResetting ? "Updating..." : "Update Password"}
          </button>
        </div>
        {/* Notification Preferences */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
            NOTIFICATIONS
          </h2>

          <div className="space-y-4">
            {/* Waiver Alerts */}
            <div className="flex items-center justify-between py-4 border-b border-gray-800">
              <div>
                <p className="text-white font-semibold">Waiver Alerts</p>
                <p className="text-gray-500 text-sm">
                  Alert for pending waivers and documents
                </p>
              </div>
              <button
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

            {/* Team Updates */}
            <div className="flex items-center justify-between py-4 border-b border-gray-800">
              <div>
                <p className="text-white font-semibold">Team Updates</p>
                <p className="text-gray-500 text-sm">
                  News and announcements about tournaments
                </p>
              </div>
              <button
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

            {/* Match Reminders */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-white font-semibold">Match Reminders</p>
                <p className="text-gray-500 text-sm">
                  Reminders before match start times and field assignments
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange("matchReminders")}
                className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                  notifications.matchReminders ? "bg-[#35BACB]" : "bg-gray-700"
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
          </div>
        </div>
      </div>
    </div>
  );
}
