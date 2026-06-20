"use client";
import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Loader,
} from "lucide-react";
import ActivityLogs from "@/components/common/ActivityLogs";
import { useGetAdminHomeDataQuery } from "@/redux/apiHooks/auth/authApi";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useGetAdminHomeDataQuery();
  const adminData = data?.data;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">WELCOME BACK, ADMIN</h1>
          <p className="text-gray-400">Your tournament management dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div
            className="rounded-lg p-[25.117px] flex flex-col items-start gap-4  "
            style={{
              border: "1.117px solid #162B1E",
              background: "linear-gradient(135deg, #232C00 0%, #000 100%)",
            }}
          >
            <div className="bg-[#35BACB] rounded-lg p-3 flex items-center justify-center w-12 h-12">
              <DollarSign size={24} className="text-black" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-[#35BACB]" />
              </div>
            ) : error ? (
              <h3 className="text-3xl font-bold text-white">$0</h3>
            ) : (
              <h3 className="text-3xl font-bold text-white">
                ${adminData?.totalAmount?.toLocaleString()}
              </h3>
            )}
            <p className="text-gray-500 text-xs">Your Earning till now</p>
          </div>

          {/* Total Teams */}
          <div
            className="rounded-lg p-[25.117px] flex flex-col items-start gap-4 "
            style={{
              border: "1.117px solid #1E2939",
              background: "linear-gradient(135deg, #101828 0%, #000 100%)",
            }}
          >
            <div className="bg-blue-500 rounded-lg p-3 flex items-center justify-center w-12 h-12">
              <Users size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Teams</p>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <h3 className="text-3xl font-bold text-white">0</h3>
            ) : (
              <h3 className="text-3xl font-bold text-white">
                {adminData?.totalTeam}
              </h3>
            )}
            <p className="text-gray-500 text-xs">Registered</p>
          </div>

          {/* Urgent Action */}
          <div
            className="rounded-lg p-[25.117px] flex flex-col items-start gap-4 "
            style={{
              border: "1.117px solid #300D0E",
              background: "linear-gradient(180deg, #1D0000 0%, #000 100%)",
            }}
          >
            <div className="bg-red-500 rounded-lg p-3 flex items-center justify-center w-12 h-12">
              <AlertTriangle
                size={24}
                className="text-white"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Urgent Action</p>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-red-500" />
              </div>
            ) : error ? (
              <h3 className="text-3xl font-bold text-white">0</h3>
            ) : (
              <h3 className="text-3xl font-bold text-white">
                {adminData?.totalPendingWavier}
              </h3>
            )}
            <p className="text-gray-500 text-xs">Verifications Pending</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/admin/tournament/create">
              <button className="w-full bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group">
                <Plus
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                Create New Tournament
              </button>
            </Link>
            <Link href="/dashboard/admin/verification-center">
              <button className="w-full border-2 border-gray-700 hover:border-blue-600 hover:bg-blue-600/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group">
                <CheckCircle2
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                Verify Players
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <ActivityLogs />
      </div>
    </div>
  );
}
