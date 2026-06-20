/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import InviteManagerModal, { InvitePayload } from "./InviteManagerModal";
import {
  useDeletePlayerMutation,
  useInviteManagerMutation,
} from "@/redux/apiHooks/coachDashboard/coachDashboardApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import Swal from "sweetalert2";

type Coach = {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  isPrimary?: boolean;
};

type Manager = {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
  teamManagerId?: string;
};

export type CoachingStaffData = {
  coach: Coach;
  managers: Manager[];
};

interface CoachingStaffProps {
  coachingStaff?: CoachingStaffData;
}

const CoachingStaff: React.FC<CoachingStaffProps> = ({ coachingStaff }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const role = useSelector((state: RootState) => state.auth.user?.role);

  // console.log(role);

  const [inviteManager, { isLoading }] = useInviteManagerMutation();

  const selectedTeamId = useSelector(
    (state: RootState) => state.teamSelection.selectedTeamId,
  );

  const [removeManager] = useDeletePlayerMutation();

  const handleInviteManager = async (payload: InvitePayload) => {
    try {
      await inviteManager({ id: selectedTeamId, data: payload }).unwrap();

      toast.success("Manager added successfully");
      setIsModalOpen(false); // ✅ close only after success
    } catch (err) {
      console.error("Invite manager failed:", err);
      toast.error("Failed to invite manager");
    }
  };

  const handelRemove = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Manager will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#333",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await removeManager(id).unwrap();

      await Swal.fire({
        title: "Removed!",
        text: res?.message || "Manager removed successfully.",
        icon: "success",
        confirmButtonColor: "#35BACB",
        customClass: {
          confirmButton: "swal-confirm-black-text",
        },
      });
    } catch (error: any) {
      console.error("Remove manager failed:", error);

      await Swal.fire({
        title: "Failed!",
        text:
          error?.data?.message || "Failed to remove manager. Please try again.",
        icon: "error",
        confirmButtonColor: "#35BACB",
      });
    }
  };

  const staffList = useMemo(() => {
    if (!coachingStaff?.coach) return [];

    const coachItem = {
      id: coachingStaff.coach.id,
      name: coachingStaff.coach.fullName,
      role: coachingStaff.coach.role,
      email: coachingStaff.coach.email,
      isPrimary: true,
      type: "coach" as const,
    };

    const managerItems = (coachingStaff.managers || []).map((m) => ({
      id: m.id,
      teamManagerId: m.teamManagerId,
      name: m.fullName,
      role: m.role,
      email: m.email,
      isPrimary: false,
      type: "manager" as const,
    }));

    return [coachItem, ...managerItems];
  }, [coachingStaff]);

  if (!coachingStaff) {
    return (
      <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
        <p className="text-gray-400 text-sm">Loading coaching staff...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
            COACHING STAFF
          </h3>

          {role === "MANAGER" ? (
            <div></div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Manager
            </button>
          )}
        </div>

        <div className="space-y-4">
          {staffList.length === 0 ? (
            <p className="text-gray-400 text-sm">No coaching staff found.</p>
          ) : (
            staffList.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-start pb-4 border-b border-gray-800 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-semibold">{member.name}</p>

                    {member.isPrimary && (
                      <span className="bg-[#35BACB] text-black text-xs font-bold px-2 py-1 rounded">
                        PRIMARY ACCOUNT
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm">{member.role}</p>
                  <p className="text-gray-500 text-xs">{member.email}</p>
                </div>

                {!member.isPrimary && member.type === "manager" && (
                  <button
                    onClick={() => handelRemove(member.id)}
                    disabled={role === "MANAGER"}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <InviteManagerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onInvite={handleInviteManager}
        submitting={isLoading}
      />
    </>
  );
};

export default CoachingStaff;
