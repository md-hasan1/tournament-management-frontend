/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer?: (playerData: any) => void;
  isSubmitting?: boolean;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  open,
  onOpenChange,
  onAddPlayer,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    jersey: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: "",
        password: "",
        email: "",
        dateOfBirth: "",
        phone: "",
        jersey: "",
      });
      setShowPassword(false);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const convertToISO = (dateString: string) => {
  //   if (!dateString) return null;
  //   return new Date(`${dateString}T00:00:00Z`).toISOString();
  // };

  const handleAddNewPlayer = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      dob: formData.dateOfBirth,
      phone: formData.phone,
      jerseyNum: formData.jersey,
    };

    onAddPlayer?.(payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isSubmitting && onOpenChange(val)}
    >
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-800 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white uppercase tracking-wide">
            ADD PLAYER
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-2">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="player@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 pr-16 focus:outline-none focus:border-[#35BACB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Select date of birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Jersey */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Jersey Number
            </label>
            <input
              type="text"
              name="jersey"
              placeholder="Enter jersey number (optional)"
              value={formData.jersey}
              onChange={handleInputChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 border border-gray-700 text-white font-semibold rounded hover:bg-gray-900 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddNewPlayer}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Player..." : "Add Player"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerModal;
