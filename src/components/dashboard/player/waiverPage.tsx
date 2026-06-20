/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  useApproveSignMutation,
  useGetPlayerDashbaordQuery,
  // ✅ Uncomment and use your real mutation hook name if you have it:
  // useSignWaiverMutation,
} from "@/redux/apiHooks/playerApi/playerApi";

type WaiverFormData = {
  fullName: string;
  isAgree: boolean;
};

export default function WaiverCenterPage() {
  const [waiverModal, setWaiverModal] = useState(false);

  const { data: waiverData, isLoading, refetch } = useGetPlayerDashbaordQuery();

  // ✅ If you have a waiver sign mutation, use it:
  // const [signWaiver, { isLoading: isSigning }] = useSignWaiverMutation();
  const isSigning = false;

  const playerid = waiverData?.data?.playerPass?.teamPlayerId;

  const waiver = waiverData?.data?.waiver;
  const playerFullName = waiverData?.data?.playerPass?.fullName || "";
  const waiverName =
    waiverData?.data?.nextMatch?.tournamentName || "Tournament Waiver";

  // Normalize status so backend variations won't break UI
  const waiverStatus = useMemo(() => {
    const raw = waiver?.status ?? "";
    return raw.toLowerCase(); // "signed" | "unsigned" | ""
  }, [waiver?.status]);

  const isSigned = waiverStatus === "signed";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WaiverFormData>({
    defaultValues: {
      fullName: playerFullName,
      isAgree: false,
    },
    mode: "onSubmit",
  });

  // ✅ When dashboard data arrives, set default name in the form
  useEffect(() => {
    if (playerFullName) {
      reset({
        fullName: playerFullName,
        isAgree: false,
      });
    }
  }, [playerFullName, reset]);

  const watchedAgree = watch("isAgree");

  const openModal = () => {
    setWaiverModal(true);
    reset({
      fullName: playerFullName,
      isAgree: false,
    });
  };

  const closeModal = () => {
    setWaiverModal(false);
    reset({
      fullName: playerFullName,
      isAgree: false,
    });
  };

  const [signedWave] = useApproveSignMutation();

  const onSubmitWaiver = async (formData: WaiverFormData) => {
    // ✅ Confirm with SweetAlert2
    const confirm = await Swal.fire({
      title: "Confirm Signature",
      html: `
        <div style="text-align:left; font-size:14px;">
          <p><b>Waiver:</b> ${waiverName}</p>
          <p><b>Typed Name:</b> ${formData.fullName}</p>
          <p style="margin-top:10px;">
            By clicking <b>Confirm</b>, you agree this is your legal digital signature.
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm & Sign",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#35BACB",
      cancelButtonColor: "#444",
    });

    if (!confirm.isConfirmed) return;
    const payload = {
      isAgree: formData.isAgree,
      signName: formData.fullName,
    };
    try {
      console.log(payload);
      await signedWave({ id: playerid, data: payload }).unwrap();

      await Swal.fire({
        title: "Signed!",
        text: "Your waiver has been signed successfully.",
        icon: "success",
        confirmButtonColor: "#35BACB",
      });

      closeModal();
      refetch();
    } catch (err: any) {
      await Swal.fire({
        title: "Failed",
        text: err?.data?.message || "Could not sign waiver. Please try again.",
        icon: "error",
        confirmButtonColor: "#35BACB",
      });
    }
  };

  const onDownload = async () => {
    await Swal.fire({
      title: "PDF not available",
      text: "Backend has not provided a waiver PDF URL yet.",
      icon: "info",
      confirmButtonColor: "#35BACB",
    });

    // ✅ When backend adds pdfUrl:
    // if (waiver?.pdfUrl) window.open(waiver.pdfUrl, "_blank");
  };

  return (
    <div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-wider mb-8">
            Waiver & Documents
          </h1>

          <div className="space-y-4">
            <div
              className={`border rounded-xl p-6 transition-colors ${
                isSigned
                  ? "border-green-900/50 bg-green-900/10"
                  : "border-gray-800 bg-gray-900/30"
              }`}
            >
              {isLoading ? (
                <p className="text-gray-400">Loading waiver...</p>
              ) : !waiver ? (
                <p className="text-gray-400">No waiver found.</p>
              ) : !isSigned ? (
                <>
                  <div className="flex items-start gap-4 mb-6">
                    <AlertCircle
                      className="text-orange-400 shrink-0"
                      size={24}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {waiverName}
                      </h3>
                      <p className="text-orange-400 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                        <span className="text-orange-400">▲</span> UNSIGNED
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={openModal}
                    className="w-full bg-[#35BACB] text-black font-bold py-3 rounded-lg hover:bg-[#A232D6] transition-colors text-sm"
                  >
                    Sign Digital Waiver
                  </button>
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <CheckCircle
                      className="text-green-500 shrink-0"
                      size={24}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {waiverName}
                      </h3>
                      <p className="text-green-400 text-sm font-semibold">
                        ✓ Signed
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onDownload}
                    className="flex items-center gap-2 text-[#35BACB] hover:text-[#A232D6] transition-colors font-semibold text-sm whitespace-nowrap"
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-gray-900/30 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">About Waivers</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              All players must sign the tournament waiver before participating
              in matches. Digital signatures are legally binding and will be
              stored securely in your account. Waivers must be completed at
              least 48 hours before the first match.
            </p>
          </div>

          {/* Waiver Modal */}
          {waiverModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
              <div className="bg-gray-900 border-2 border-[#35BACB] rounded-xl max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide w-full">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gray-900 border-b-2 border-[#35BACB] p-6 flex items-center justify-between">
                  <h2 className="text-[#35BACB] font-bold text-xl">
                    Liability Release Form
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white font-bold text-2xl w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Form */}
                <form
                  onSubmit={handleSubmit(onSubmitWaiver)}
                  className="p-6 space-y-6"
                >
                  {/* Liability Text */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-[#35BACB] font-bold mb-4 uppercase text-sm tracking-wider">
                      LIABILITY RELEASE AND WAIVER OF CLAIMS
                    </h3>
                    <div className="text-gray-300 text-sm space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                      <p>
                        I hereby release Crown & Pitch and its organizers,
                        officers, directors, employees, volunteers, sponsors and
                        agents collectively &quot;Released&quot; I take all
                        liability claims, demands, actions and causes of action
                        whatsoever, arising out of or related to any loss,
                        damage, or injury, including but not limited to,
                        non-economic damages including pain and suffering,
                        whether caused by the negligence of the Released or
                        otherwise, which I have sustained as a result of, or in
                        connection with my participation in the program.
                      </p>
                      <p>
                        I acknowledge that participation in soccer activities
                        and related sports programs involves inherent risks
                        including, but not limited to, physical injury, property
                        damage, collision with other participants or equipment,
                        trips, falls, muscle strains, fractures, heat
                        exhaustion, and allergic reactions to turf or natural
                        fields. I assume all risks and agree to assume full
                        responsibility for any such risks, injuries, or damages.
                      </p>
                      <p>
                        I certify that I am physically fit and have not been
                        advised by a qualified medical professional to refrain
                        from participating in physical activities.
                      </p>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="border-2 border-orange-600/50 bg-orange-900/10 rounded-lg p-4">
                    <p className="text-orange-400 text-sm font-semibold flex items-start gap-2">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <span>
                        Falsifying a signature constitutes fraud and will result
                        in team disqualification and potential legal action.
                      </span>
                    </p>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isAgree", {
                        required: "You must agree before signing",
                      })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-gray-300 text-sm">
                      I certify that I am the participant (OR legal guardian)
                      and have authority to sign.
                    </span>
                  </label>
                  {errors.isAgree && (
                    <p className="text-red-500 text-sm">
                      {errors.isAgree.message}
                    </p>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="text-gray-400 text-sm block mb-2">
                      TYPE FULL NAME TO SIGN
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., John Doe"
                      {...register("fullName", {
                        required: "Full name is required",
                        validate: (value) => {
                          if (!playerFullName) return true; // if not loaded yet
                          return value === playerFullName
                            ? true
                            : "Name must match your registered name";
                        },
                      })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#35BACB]"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-gray-500 text-xs">
                        Registered name:{" "}
                        <span className="text-gray-300">
                          {playerFullName || "—"}
                        </span>
                      </p>
                      {watchedAgree && playerFullName && (
                        <button
                          type="button"
                          onClick={() =>
                            reset({ fullName: playerFullName, isAgree: true })
                          }
                          className="text-[#35BACB] text-xs font-semibold hover:text-[#A232D6]"
                        >
                          Use registered name
                        </button>
                      )}
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Button */}
                  <button
                    type="submit"
                    disabled={isSigning}
                    className="w-full bg-[#35BACB] text-black font-bold py-3 rounded-lg transition-colors uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSigning ? "Signing..." : "Confirm & Sign"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
