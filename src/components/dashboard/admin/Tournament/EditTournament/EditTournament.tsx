/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  CreateTournamentRequest,
  DivisionCode,
  useDeleteDivisionMutation,
  useDeleteTournamentMutation,
  useGetTournamentByIdQuery,
  useUpdateTournamentMutation,
} from "@/redux/apiHooks/tournament/tournamentApi";
import {
  Camera,
  Check,
  ChevronLeft,
  Crown,
  Loader,
  Plus,
  ShieldCheck,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormDivision {
  id: string;
  name: DivisionCode;
  quantity: number;
}

type TournamentStageUI = "PROVING" | "CROWN" | "ROYAL CUP";

export default function EditTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const {
    data: tournamentData,
    isLoading: isFetching,
    error,
  } = useGetTournamentByIdQuery(tournamentId);

  const [updateTournament, { isLoading: isUpdating }] =
    useUpdateTournamentMutation();
  const [deleteTournament, { isLoading: isDeleting }] =
    useDeleteTournamentMutation();

  // IMPORTANT: your data shape indicates array in data[0]
  const tournament = tournamentData?.data?.data?.[0];

  const [divisions, setDivisions] = useState<FormDivision[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null); // ✅ keep this used

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tournamentStage: "PROVING" as TournamentStageUI,
    tournamentName: "",
    startDate: "",
    endDate: "",
    location: "",
    mapLink: "",
    registrationDeadline: "",
    numberOfFields: "1",
    youthFee: "0",
    adultFee: "0",
    prizePayoutTiers: "",
    notes: "",
    bathrooms: "",
    foods: "",
    parking: "",
  });

  // ✅ Initialize form data when tournament loads
  useEffect(() => {
    if (!tournament) return;

    const stage: TournamentStageUI =
      tournament.tournamentStage === "ROYAL"
        ? "ROYAL CUP"
        : (tournament.tournamentStage as TournamentStageUI);

    setFormData({
      tournamentStage: stage,
      tournamentName: tournament.name || "",
      startDate: tournament.startDate?.split("T")[0] || "",
      endDate: tournament.endDate?.split("T")[0] || "",
      location: tournament.location || "",
      mapLink: tournament.mapLink || "",
      registrationDeadline:
        tournament.registrationDeadline?.split("T")[0] || "",
      numberOfFields: tournament.numberOfFields?.toString() || "1",
      youthFee: tournament.youthFee?.toString() || "0",
      adultFee: tournament.adultFee?.toString() || "0",
      prizePayoutTiers: tournament.prizePool || "",
      notes: tournament.notes || "",
      bathrooms: tournament.bathrooms || "",
      foods: tournament.foods || "",
      parking: tournament.parking || "",
    });

    setDivisions(
      (tournament.tournamentDivisions || []).map((d: any) => ({
        id: d.id,
        name: d.divisionName,
        quantity: d.maxTeams,
      })),
    );

    // ✅ keep existing logo preview
    setLogoPreview(tournament.logo || null);

    // ✅ IMPORTANT: when loading existing tournament, we haven't selected a new file yet
    setLogoFile(null);
  }, [tournament]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    // preview
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addDivision = () => {
    const newDivision: FormDivision = {
      id: `new_${Date.now()}`,
      name: "U9_BOYS",
      quantity: 0,
    };
    setDivisions((prev) => [...prev, newDivision]);
  };

  const updateDivision = (
    id: string,
    field: keyof FormDivision,
    value: string | number,
  ) => {
    setDivisions((prev) =>
      prev.map((div) => (div.id === id ? { ...div, [field]: value } : div)),
    );
  };

  const removeDivision = async (id: string) => {
    if (!id.startsWith("new_")) {
      try {
        await deleteDivision({ id }).unwrap();
        toast.success("Division deleted successfully");
      } catch (err: any) {
        console.error("Delete division failed:", err);
        toast.error(err?.data?.message || err?.message || "Failed to delete division");
        return; // stop and don't remove from UI if backend delete fails
      }
    }
    setDivisions((prev) => prev.filter((div) => div.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tournament) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.tournamentName || !formData.startDate || !formData.endDate) {
      const msg = "Please fill in all required fields";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (divisions.length === 0) {
      const msg = "Please add at least one division";
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    try {
      const transformedDivisions = divisions.map((div) => {
        const payload: any = {
          divisionName: div.name,
          maxTeams: Number(div.quantity) || 0,
        };
        if (!div.id.startsWith("new_")) {
          payload.id = div.id;
        }
        return payload;
      });

      // ✅ IMPORTANT: DO NOT send logo: null in updateData
      const updateData: Partial<CreateTournamentRequest> = {
        tournamentStage:
          formData.tournamentStage === "ROYAL CUP"
            ? "ROYAL"
            : formData.tournamentStage,
        name: formData.tournamentName,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        location: formData.location,
        mapLink: formData.mapLink,
        registrationDeadline: new Date(
          formData.registrationDeadline,
        ).toISOString(),
        numberOfFields: parseInt(formData.numberOfFields) || 0,
        youthFee: parseFloat(formData.youthFee) || 0,
        adultFee: parseFloat(formData.adultFee) || 0,
        notes: formData.notes?.trim() || "",
        bathrooms: formData.bathrooms?.trim() || "",
        foods: formData.foods?.trim() || "",
        parking: formData.parking?.trim() || "",
        prizePool: formData.prizePayoutTiers?.trim() || "",
        status: "OPEN",
        divisions: transformedDivisions,
      };

      // ✅ Send multipart IF a new logo is selected
      //    Otherwise send JSON payload only (or still send multipart with just data).
      if (logoFile) {
        const fd = new FormData();
        fd.append("data", JSON.stringify(updateData));
        fd.append("image", logoFile);

        // Your mutation must support sending FormData
        await updateTournament({
          id: tournamentId,
          data: fd as any,
        }).unwrap();
      } else {
        // ✅ keep existing logo on backend by NOT sending image at all
        await updateTournament({
          id: tournamentId,
          data: updateData as any,
        }).unwrap();
      }

      setSuccessMessage("Tournament updated successfully!");
      toast.success("Tournament updated successfully!");

      setTimeout(() => {
        router.push("/dashboard/admin/tournament");
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to update tournament";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Tournament update error:", err);
    }
  };

  const [deleteDivision, { isLoading: isDeletingDivision }] =
    useDeleteDivisionMutation();

  const handleDelete = async () => {
    try {
      await deleteTournament(tournamentId).unwrap();
      toast.success("Tournament deleted successfully!");
      router.push("/dashboard/admin/tournament");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete tournament");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin text-[#35BACB] mx-auto mb-4"
          />
          <p className="text-gray-400">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-6">
            Tournament not found or failed to load.
          </p>
          <Link
            href="/dashboard/admin/tournament"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/tournament"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold">EDIT TOURNAMENT</h1>
              <p className="text-gray-400 text-sm mt-1">
                Update the tournament details below
              </p>
            </div>
          </div>
          <Link href="/dashboard/admin/tournament">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </Link>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-400 font-semibold">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-400 font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* BASIC INFO & LOGISTICS */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
              Basic Info & Logistics
            </h2>

            <div className="space-y-6">
              {/* Tournament Stage */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Tournament Stage <span className="text-[#35BACB]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(
                    ["PROVING", "CROWN", "ROYAL CUP"] as TournamentStageUI[]
                  ).map((stage) => {
                    const active = formData.tournamentStage === stage;
                    const Icon =
                      stage === "PROVING"
                        ? ShieldCheck
                        : stage === "CROWN"
                          ? Crown
                          : Trophy;
                    const subtitle =
                      stage === "PROVING"
                        ? "Open to all teams"
                        : stage === "CROWN"
                          ? "Qualifier event"
                          : "Championship event";
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, tournamentStage: stage })
                        }
                        className={`relative p-6 rounded-lg border-2 transition-all ${
                          active
                            ? "border-[#35BACB] bg-[#35BACB]/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        {active && (
                          <div className="absolute top-2 right-2 bg-[#35BACB] rounded-full p-1">
                            <Check size={16} className="text-black" />
                          </div>
                        )}
                        <div className="text-left flex items-start gap-3">
                          <Icon
                            size={20}
                            className={`mt-1 ${
                              active ? "text-[#35BACB]" : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-bold uppercase ${
                                active ? "text-[#35BACB]" : "text-gray-400"
                              }`}
                            >
                              {stage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {subtitle}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tournament Logo */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Tournament Logo
                </label>

                <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-[#35BACB] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <>
                        <Camera size={32} className="text-gray-500" />
                        <div>
                          <p className="text-white font-semibold">
                            Upload Logo
                          </p>
                          <p className="text-gray-500 text-xs">Max 10 MB</p>
                        </div>
                      </>
                    )}
                  </label>

                  {/* ✅ helpful hint */}
                  <p className="text-gray-500 text-xs mt-3">
                    {logoFile
                      ? "New logo selected — it will be uploaded on update."
                      : "Leave empty to keep the current logo."}
                  </p>
                </div>
              </div>

              {/* ... keep the rest of your inputs exactly as you had ... */}
              {/* (Your existing form fields below can remain unchanged) */}
              {/* Tournament Name */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Tournament Name <span className="text-[#35BACB]">*</span>
                </label>
                <input
                  type="text"
                  name="tournamentName"
                  value={formData.tournamentName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Start Date <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    End Date <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Tournament Location{" "}
                    <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Map Link <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="text"
                    name="mapLink"
                    value={formData.mapLink}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
                />
              </div>
            </div>
          </div>

          {/* DIVISIONS, PRICING & CAPACITY (unchanged) */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
              Divisions, Pricing & Capacity
            </h2>

            <div className="space-y-6">
              {/* Youth Fee & Adult Fee Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Youth Fee (D1/U14) <span className="text-[#35BACB]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      name="youthFee"
                      value={formData.youthFee}
                      onChange={handleInputChange}
                      placeholder="500"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Adult Fee (Men/Women/Masters){" "}
                    <span className="text-[#35BACB]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      name="adultFee"
                      value={formData.adultFee}
                      onChange={handleInputChange}
                      placeholder="800"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                    />
                  </div>
                </div>
              </div>

              {/* Prize & Payout Tiers */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Prize & Payout Tiers
                </label>
                <textarea
                  name="prizePayoutTiers"
                  value={formData.prizePayoutTiers}
                  onChange={handleInputChange}
                  placeholder="E.g. Men's: $1500; Women's: $500; Youth: $0..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="All teams must arrive 1 hour before kickoff."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              {/* Bathrooms, Foods, Parking */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Bathrooms
                  </label>
                  <input
                    type="text"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="E.g. On-site"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Foods
                  </label>
                  <input
                    type="text"
                    name="foods"
                    value={formData.foods}
                    onChange={handleInputChange}
                    placeholder="E.g. Concessions available"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Parking
                  </label>
                  <input
                    type="text"
                    name="parking"
                    value={formData.parking}
                    onChange={handleInputChange}
                    placeholder="E.g. Free parking"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>

              {/* Division table */}
              <div>
                <label className="text-gray-400 text-sm font-semibold mb-4 block">
                  Division Setup
                </label>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">
                          Division Name
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">
                          #
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {divisions.map((division) => (
                        <tr
                          key={division.id}
                          className="border-b border-gray-800 hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <select
                              value={division.name}
                              onChange={(e) =>
                                updateDivision(
                                  division.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                            >
                              <option value="U9_BOYS">U9 Boys</option>
                              <option value="U10_BOYS">U10 Boys</option>
                              <option value="U9_GIRLS">U9 Girls</option>
                              <option value="U10_GIRLS">U10 Girls</option>
                              <option value="U11_BOYS">U11 Boys</option>
                              <option value="U11_GIRLS">U11 Girls</option>
                              <option value="U12_BOYS">U12 Boys</option>
                              <option value="U12_GIRLS">U12 Girls</option>
                              <option value="U13_BOYS">U13 Boys</option>
                              <option value="U14_BOYS">U14 Boys</option>
                              <option value="U13_GIRLS">U13 Girls</option>
                              <option value="U14_GIRLS">U14 Girls</option>
                              <option value="U15_BOYS">U15 Boys</option>
                              <option value="U16_BOYS">U16 Boys</option>
                              <option value="U15_GIRLS">U15 Girls</option>
                              <option value="U16_GIRLS">U16 Girls</option>
                              <option value="U17_BOYS">U17 Boys</option>
                              <option value="U18_BOYS">U18 Boys</option>
                              <option value="U17_GIRLS">U17 Girls</option>
                              <option value="U18_GIRLS">U18 Girls</option>
                              <option value="HS_BOYS">High School Boys</option>
                              <option value="HS_GIRLS">
                                High School Girls
                              </option>
                              <option value="MENS_DIV_1">
                                Men&apos;s Div 1
                              </option>
                              <option value="MENS_DIV_2">
                                Men&apos;s Div 2
                              </option>
                              <option value="MENS_DIV_3">
                                Men&apos;s Div 3
                              </option>
                              <option value="WOMENS">Womens</option>
                              <option value="COED">Coed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={division.quantity}
                              onChange={(e) =>
                                updateDivision(
                                  division.id,
                                  "quantity",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#35BACB]"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => removeDivision(division.id)}
                              className="text-red-500 hover:text-red-400 transition-colors p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={addDivision}
                  className="mt-4 text-[#35BACB] hover:text-[#A232D6] font-semibold flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Add Division
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-8 py-3 border border-red-700 text-red-400 hover:bg-red-900/20 font-semibold rounded-lg transition-colors"
            >
              Delete
            </button>

            <Link href="/dashboard/admin/tournament">
              <button
                type="button"
                className="px-8 py-3 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              disabled={isUpdating}
              className={`px-8 py-3 bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold rounded-lg transition-colors flex items-center gap-2 ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "UPDATE TOURNAMENT"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Delete Tournament?</h2>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              tournament?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-900 hover:bg-red-800 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader size={18} className="animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
