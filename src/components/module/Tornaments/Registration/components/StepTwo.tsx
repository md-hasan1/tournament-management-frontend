"use client";

import { useGetMyTeamQuery } from "@/redux/apiHooks/team/teamApi";
import React, { useEffect, useMemo } from "react";

type TeamApiItem = {
  id: string;
  teamName: string;
  division?: string;
  image?: string;
  manager?: {
    id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  coach?: {
    id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
};

interface StepTwoProps {
  teamMode: "new" | "existing";
  selectedExistingTeamId: string;
  onTeamModeChange: (mode: "new" | "existing") => void;
  onExistingTeamChange: (id: string) => void;

  teamName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  onTeamNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepTwo(props: StepTwoProps) {
  const {
    teamMode,
    selectedExistingTeamId,
    onTeamModeChange,
    onExistingTeamChange,
    teamName,
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    onTeamNameChange,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPhoneChange,
    onPasswordChange,
    onConfirmPasswordChange,
  } = props;

  const { data: teamList } = useGetMyTeamQuery("");

  const teams: TeamApiItem[] = useMemo(() => {
    return (teamList?.data ?? []) as TeamApiItem[];
  }, [teamList]);

  const selectedTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedExistingTeamId);
  }, [teams, selectedExistingTeamId]);

  // helper to call parent handlers with a fake event object
  const setInput = (
    setter: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
  ) => {
    setter({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  };

  // ✅ Auto-fill when existing team is selected
  useEffect(() => {
    if (teamMode !== "existing") return;
    if (!selectedTeam) return;

    setInput(onTeamNameChange, selectedTeam.teamName ?? "");

    const contact = selectedTeam.manager ?? selectedTeam.coach ?? null;

    if (contact?.fullName) {
      const parts = String(contact.fullName).trim().split(" ");
      const f = parts[0] ?? "";
      const l = parts.slice(1).join(" ") ?? "";
      setInput(onFirstNameChange, f);
      setInput(onLastNameChange, l);
    } else {
      setInput(onFirstNameChange, "");
      setInput(onLastNameChange, "");
    }

    setInput(onEmailChange, contact?.email ?? "");
    setInput(onPhoneChange, contact?.phoneNumber ?? "");
  }, [
    teamMode,
    selectedTeam,
    onTeamNameChange,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPhoneChange,
  ]);

  const isExisting = teamMode === "existing";

  return (
    <>
      <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide font-['Oswald']">
        Team Information
      </h2>

      {/* Mode Toggle */}
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => onTeamModeChange("new")}
          className={`px-4 py-2 rounded border ${
            !isExisting
              ? "border-[#35BACB] text-[#35BACB]"
              : "border-gray-700 text-gray-300"
          }`}
        >
          Create New Team
        </button>

        <button
          type="button"
          onClick={() => onTeamModeChange("existing")}
          className={`px-4 py-2 rounded border ${
            isExisting
              ? "border-[#35BACB] text-[#35BACB]"
              : "border-gray-700 text-gray-300"
          }`}
        >
          Select Existing Team
        </button>
      </div>

      <div className="space-y-6">
        {/* Existing Team Dropdown */}
        {isExisting && (
          <div>
            <label className="block text-gray-300 text-sm mb-3 font-semibold">
              Choose Team <span className="text-red-500">*</span>
            </label>

            <select
              value={selectedExistingTeamId}
              onChange={(e) => onExistingTeamChange(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition"
            >
              <option value="">Select your team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.teamName}
                </option>
              ))}
            </select>

            {!teams.length && (
              <p className="text-xs text-gray-400 mt-2">
                No teams found for your account.
              </p>
            )}
          </div>
        )}

        {/* Team Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-3 font-semibold">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Arong Fighter"
            value={teamName}
            onChange={onTeamNameChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
            required
          />
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wide">
            Team Manager / Coach Contact
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-3 font-semibold">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={onFirstNameChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-3 font-semibold">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={onLastNameChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-3 font-semibold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={onEmailChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-3 font-semibold">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={onPhoneChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Password ONLY for New Team */}
        {!isExisting && (
          <div>
            <h3 className="text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wide">
              Create Account Password
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-3 font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="●●●●●●"
                  value={password}
                  onChange={onPasswordChange}
                  minLength={8}
                  title="Password must be at least 8 characters"
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-3 font-semibold">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="●●●●●●"
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                  minLength={8}
                  title="Password must be at least 8 characters"
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB] transition placeholder-gray-600"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Password must be at least 8 characters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
