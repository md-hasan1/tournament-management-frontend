/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, Edit2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useUpdateTeamDetailsMutation } from "@/redux/apiHooks/team/teamApi";

type FormValues = {
  teamName: string;
};

interface TeamDetailsProps {
  teamName: string;
  division: string;
  imageUrl?: string;
  teamId: string;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({
  teamName,
  division,
  imageUrl,
  teamId,
}) => {
  const [updateTeam, { isLoading }] = useUpdateTeamDetailsMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ✅ store file in state (most reliable)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { teamName },
  });

  // keep form synced when props change
  useEffect(() => {
    reset({ teamName });
    setIsEditing(false);
    setLogoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [teamName, reset]);

  const watchedTeamName = watch("teamName");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // ✅ this is what we'll append in FormData

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        teamName: values.teamName,
      }),
    );

    // ✅ always append from state
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // ✅ debug: you should see "image" here if selectedFile exists
    // for (const [k, v] of formData.entries()) console.log(k, v);

    try {
      const res = await updateTeam({ id: teamId, formData }).unwrap();
      console.log("Updated team:", res);

      setIsEditing(false);
      setLogoPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // keep updated team name in form
      reset({ teamName: values.teamName });
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  const displayLogo = logoPreview ?? imageUrl ?? null;

  const hasChanges = watchedTeamName !== teamName || !!selectedFile;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            TEAM DETAILS
          </h3>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-2 rounded bg-[#222] hover:bg-[#2a2a2a] transition"
            >
              <Edit2 className="w-4 h-4 text-[#35BACB]" />
              <span className="text-white text-sm font-semibold">Edit</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading || !hasChanges}
                className="px-4 py-2 rounded bg-[#35BACB] text-black font-bold disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset({ teamName });
                  setLogoPreview(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-4 py-2 rounded bg-[#222] text-white hover:bg-[#2a2a2a] transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Logo Upload Area */}
          <div
            className={`relative ${
              isEditing ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => {
              if (isEditing) fileInputRef.current?.click();
            }}
          >
            <div className="border-2 border-dashed border-[#35BACB] rounded-lg p-8 w-40 h-40 flex items-center justify-center bg-[#35BACB]/10 hover:bg-[#35BACB]/20 transition">
              {displayLogo ? (
                <Image
                  src={displayLogo}
                  alt="Team Logo"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 text-[#35BACB] mx-auto" />
                  <p className="text-gray-400 text-xs mt-2">Upload Logo</p>
                </div>
              )}
            </div>

            {/* Hidden file input (NOT registered with RHF) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!isEditing}
              onChange={handleLogoUpload}
            />
          </div>

          {/* Team Info */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wide">
                TEAM NAME
              </label>

              {isEditing ? (
                <input
                  {...register("teamName", { required: "Name is required" })}
                  className="mt-1 w-full bg-[#222] border border-[#35BACB] text-white px-3 py-2 rounded font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#35BACB]"
                  autoFocus
                />
              ) : (
                <p className="mt-1 text-2xl font-bold text-white">{teamName}</p>
              )}

              {errors.teamName && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wide">
                DIVISION
              </label>
              <p className="text-white font-semibold mt-1">{division}</p>
            </div>

            {isEditing && selectedFile ? (
              <p className="text-gray-400 text-xs">
                Selected image: {selectedFile.name}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TeamDetails;
