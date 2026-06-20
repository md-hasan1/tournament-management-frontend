"use client";
import React from "react";
import VerificationQueue from "@/components/common/VerificationQueue";

export default function VerificationCenterPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Verification Center</h1>
          <p className="text-gray-400 text-sm">
            Review and manage player age verification and waiver requests.
          </p>
        </div>

        {/* Verification Queue Component */}
        <VerificationQueue />
      </div>
    </div>
  );
}
