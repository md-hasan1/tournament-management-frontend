/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { DivisionCode } from "@/redux/apiHooks/tournament/tournamentApi";
import {
  ChevronLeft,
  X,
  Plus,
  Trash2,
  Check,
  Crown,
  Trophy,
  ShieldCheck,
  Camera,
  Loader,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCreateTournamentMutation } from "@/redux/apiHooks/tournament/tournamentApi";
import { toast } from "sonner";

interface Division {
  id: string;
  name: DivisionCode; // store strict enum code directly
  quantity: number;
}

type TournamentStageUI = "PROVING" | "CROWN" | "ROYAL CUP";

export default function CreateTournamentPage() {
  const router = useRouter();
  const authToken = useSelector(selectCurrentToken);
  const [createTournament, { isLoading: isSubmitting }] =
    useCreateTournamentMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ start with NO divisions (no static data)
  const [divisions, setDivisions] = useState<Division[]>([]);

  // ✅ start with EMPTY form values (use placeholders instead)
  const [formData, setFormData] = useState({
    tournamentStage: "CROWN" as TournamentStageUI,

    tournamentName: "",
    startDate: "",
    endDate: "",
    location: "",
    mapLink: "",
    registrationDeadline: "",
    numberOfFields: "",

    youthFee: "",
    adultFee: "",
    prizePayoutTiers: "",
    notes: "",
    bathrooms: "",
    foods: "",
    parking: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addDivision = () => {
    const newDivision: Division = {
      id: Date.now().toString(),
      // default selection for new row (still not "static tournament data")
      name: "U9_BOYS" as DivisionCode,
      quantity: 0,
    };
    setDivisions((prev) => [...prev, newDivision]);
  };

  const updateDivision = (
    id: string,
    field: keyof Division,
    value: string | number,
  ) => {
    setDivisions((prev) =>
      prev.map((div) => (div.id === id ? { ...div, [field]: value } : div)),
    );
  };

  const removeDivision = (id: string) => {
    setDivisions((prev) => prev.filter((div) => div.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!authToken) {
      setErrorMessage("You must be logged in as Admin to create tournaments.");
      toast.error("You must be logged in as Admin to create tournaments.");
      return;
    }

    setSuccessMessage(null);
    setErrorMessage(null);

    // ✅ required validations (prevents invalid date conversion)
    if (!formData.tournamentName || !formData.startDate || !formData.endDate) {
      setErrorMessage("Please fill in all required fields");
      toast.warning("Please fill in all required fields");
      return;
    }

    if (!formData.location || !formData.registrationDeadline) {
      setErrorMessage("Please fill in all required fields");
      toast.warning("Please fill in all required fields");
      return;
    }

    if (divisions.length === 0) {
      setErrorMessage("Please add at least one division");
      toast.warning("Please add at least one division");
      return;
    }

    // Validate divisions
    const invalidDivision = divisions.find(
      (d) => !d.name || !d.quantity || d.quantity < 1,
    );
    if (invalidDivision) {
      setErrorMessage("Each division must have a name and a quantity (>= 1).");
      toast.warning("Each division must have a name and a quantity (>= 1).");
      return;
    }

    const transformedDivisions = divisions.map((div) => ({
      divisionName: div.name,
      maxTeams: Number(div.quantity) || 0,
    }));

    const requestData = {
      tournamentStage:
        formData.tournamentStage === "ROYAL CUP"
          ? "ROYAL"
          : formData.tournamentStage,
      name: formData.tournamentName.trim(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      location: formData.location.trim(),
      mapLink: formData.mapLink?.trim() || "",
      registrationDeadline: new Date(
        formData.registrationDeadline,
      ).toISOString(),
      numberOfFields: parseInt(formData.numberOfFields) || 0,
      youthFee: parseInt(formData.youthFee) || 0,
      adultFee: parseInt(formData.adultFee) || 0,
      notes: formData.notes?.trim() || "",
      bathrooms: formData.bathrooms?.trim() || "",
      foods: formData.foods?.trim() || "",
      parking: formData.parking?.trim() || "",
      prizePool: formData.prizePayoutTiers?.trim() || "",
      status: "OPEN" as const,
      divisions: transformedDivisions,
    };

    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(requestData));
      if (logoFile) fd.append("image", logoFile);

      const result = await createTournament(fd).unwrap();
      setSuccessMessage(`Tournament created successfully!`);
      toast.success(`Tournament created successfully!`);

      setTimeout(() => {
        router.push("/dashboard/admin/tournament");
      }, 1500);
    } catch (error: any) {
      let errorMsg = "Failed to create tournament";

      if (error?.data?.errorSources && Array.isArray(error.data.errorSources) && error.data.errorSources.length > 0) {
        errorMsg = error.data.errorSources.map((err: any) => err.message).join(", ");
      } else if (error?.data?.message) {
        errorMsg = error.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Tournament creation error:", error);
    }
  };

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
              <h1 className="text-4xl font-bold">CREATE TOURNAMENT</h1>
              <p className="text-gray-400 text-sm mt-1">
                Enter the details to create a new tournament
              </p>
            </div>
          </div>
          <Link href="/dashboard/admin/tournament">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-400 font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-400 font-semibold">{errorMessage}</p>
          </div>
        )}

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* PROVING */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tournamentStage: "PROVING" })
                    }
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      formData.tournamentStage === "PROVING"
                        ? "border-[#35BACB] bg-[#35BACB]/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    {formData.tournamentStage === "PROVING" && (
                      <div className="absolute top-2 right-2 bg-[#35BACB] rounded-full p-1">
                        <Check size={16} className="text-black" />
                      </div>
                    )}
                    <div className="text-left flex items-start gap-3">
                      <ShieldCheck
                        size={20}
                        className={`mt-1 ${
                          formData.tournamentStage === "PROVING"
                            ? "text-[#35BACB]"
                            : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-bold uppercase ${
                            formData.tournamentStage === "PROVING"
                              ? "text-[#35BACB]"
                              : "text-gray-400"
                          }`}
                        >
                          PROVING
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Open to all teams
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* CROWN */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tournamentStage: "CROWN" })
                    }
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      formData.tournamentStage === "CROWN"
                        ? "border-[#35BACB] bg-[#35BACB]/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    {formData.tournamentStage === "CROWN" && (
                      <div className="absolute top-2 right-2 bg-[#35BACB] rounded-full p-1">
                        <Check size={16} className="text-black" />
                      </div>
                    )}
                    <div className="text-left flex items-start gap-3">
                      <Crown
                        size={20}
                        className={`mt-1 ${
                          formData.tournamentStage === "CROWN"
                            ? "text-[#35BACB]"
                            : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-bold uppercase ${
                            formData.tournamentStage === "CROWN"
                              ? "text-[#35BACB]"
                              : "text-gray-400"
                          }`}
                        >
                          CROWN
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qualifier event
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* ROYAL CUP */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tournamentStage: "ROYAL CUP" })
                    }
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      formData.tournamentStage === "ROYAL CUP"
                        ? "border-[#35BACB] bg-[#35BACB]/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    {formData.tournamentStage === "ROYAL CUP" && (
                      <div className="absolute top-2 right-2 bg-[#35BACB] rounded-full p-1">
                        <Check size={16} className="text-black" />
                      </div>
                    )}
                    <div className="text-left flex items-start gap-3">
                      <Trophy
                        size={20}
                        className={`mt-1 ${
                          formData.tournamentStage === "ROYAL CUP"
                            ? "text-[#35BACB]"
                            : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-bold uppercase ${
                            formData.tournamentStage === "ROYAL CUP"
                              ? "text-[#35BACB]"
                              : "text-gray-400"
                          }`}
                        >
                          ROYAL CUP
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Championship event
                        </p>
                      </div>
                    </div>
                  </button>
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
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={80}
                        height={80}
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
                </div>
              </div>

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
                  placeholder="Summer Football Championship 2026"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              </div>

              {/* Location & Map Link Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Location <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Central Sports Complex"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Map Link
                  </label>
                  <input
                    type="text"
                    name="mapLink"
                    value={formData.mapLink}
                    onChange={handleInputChange}
                    placeholder="https://maps.google.com/?q=Central+Sports+Complex"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>

              {/* Registration Deadline & Number of Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Registration Deadline{" "}
                    <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#35BACB]"
                  />
                  <p className="text-yellow-500 text-xs mt-2">
                    ⚠️ Note: Must be at least 7 days before event start date
                  </p>
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Number of Fields Available{" "}
                    <span className="text-[#35BACB]">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfFields"
                    value={formData.numberOfFields}
                    onChange={handleInputChange}
                    placeholder="4"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DIVISIONS, PRICING & CAPACITY */}
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
              
              {/* Division Setup */}
              <div>
                <label className="text-gray-400 text-sm font-semibold mb-4 block">
                  Division Setup
                </label>

                {divisions.length === 0 ? (
                  <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-gray-300 text-sm">
                    No divisions added yet. Click{" "}
                    <span className="text-[#35BACB] font-semibold">
                      Add Division
                    </span>{" "}
                    to create one.
                  </div>
                ) : (
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
                                <option value="HS_BOYS">
                                  High School Boys
                                </option>
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
                                placeholder="0"
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
                )}

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

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/admin">
              <button
                type="button"
                className="px-8 py-3 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "PUBLISH TOURNAMENT"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
