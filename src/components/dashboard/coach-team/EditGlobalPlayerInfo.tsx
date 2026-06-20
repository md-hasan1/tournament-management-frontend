/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApiPlayer {
  id: string;
  fullName?: string;
  dob?: string | null;
  phoneNumber?: string | null;
  jerseyNum?: string | null;
}

interface EditPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: ApiPlayer | null;
  onUpdatePlayer: (data: any) => void;
  isSubmitting?: boolean;
}

const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  open,
  onOpenChange,
  player,
  onUpdatePlayer,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    jersey: "",
  });

  // Convert ISO date → YYYY-MM-DD for input type="date"
  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  // Fill form when player changes
  useEffect(() => {
    if (player) {
      setFormData({
        fullName: player.fullName || "",
        dateOfBirth: formatDateForInput(player.dob),
        phone: player.phoneNumber || "",
        jersey: player.jerseyNum || "",
      });
    }
  }, [player]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: "",
        dateOfBirth: "",
        phone: "",
        jersey: "",
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.fullName) return;

    const payload = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth || null,
      phoneNumber: formData.phone || null,
      jerseyNum: formData.jersey || null,
    };

    onUpdatePlayer(payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isSubmitting && onOpenChange(val)}
    >
      <DialogContent className="bg-[#1a1a1a] border border-gray-800 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bold uppercase tracking-wide">
            EDIT PLAYER
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-[#35BACB]"
            />
          </div>

          {/* Jersey */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Jersey Number
            </label>
            <input
              name="jersey"
              value={formData.jersey}
              onChange={handleChange}
              placeholder="Enter jersey number"
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Player"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerModal;
