/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Coach, CoachInput } from "./types";

const emptyCoachForm: CoachInput = {
  name: "",
  role: "",
  photoUrl: "",
  badge: "",
  bio: "",
  imageFile: null,
};

const labelClassName = "mb-2 block text-sm font-medium text-[#B4BDCF]";
const inputClassName =
  "h-11 w-full rounded-md border border-[#1C2B4A] bg-[#0B1630] px-3 text-sm text-[#F0F5FF] placeholder:text-[#73809A] outline-none transition-colors focus:border-[#35BACB]";
const textAreaClassName =
  "w-full rounded-md border border-[#1C2B4A] bg-[#0B1630] px-3 py-2 text-sm text-[#F0F5FF] placeholder:text-[#73809A] outline-none transition-colors focus:border-[#35BACB]";

type CoachFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  activeCoach: Coach | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CoachInput) => void | Promise<void>;
  loading: boolean;
};

export default function CoachFormDialog({
  open,
  mode,
  activeCoach,
  onOpenChange,
  onSave,
  loading,
}: CoachFormDialogProps) {
  const [form, setForm] = useState<CoachInput>(emptyCoachForm);

  const title = mode === "edit" ? "Edit Coach" : "Create New Coach";
  const description =
    mode === "edit"
      ? "Enter the details to edit coach."
      : "Enter the details to add a new coach.";

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(
      activeCoach
        ? {
            name: activeCoach.name,
            role: activeCoach.role ?? "",
            photoUrl: activeCoach.photoUrl,
            badge: activeCoach.badge,
            bio: activeCoach.bio,
            imageFile: null,
          }
        : emptyCoachForm,
    );
  }, [activeCoach, open]);

  const previewUrl = useMemo(() => {
    if (form.photoUrl.trim().length > 0) {
      return form.photoUrl;
    }
    return "";
  }, [form.photoUrl]);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, photoUrl: result, imageFile: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (
      !form.name.trim() ||
      !form.badge.trim() ||
      !form.role.trim() ||
      !form.bio.trim()
    ) {
      return;
    }

    if (mode === "create" && !form.imageFile) {
      return;
    }

    await Promise.resolve(
      onSave({
        ...form,
        name: form.name.trim(),
        badge: form.badge.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
      }),
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl border border-[#1E2A45] bg-[#05080E] p-0 text-white"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-[#15213A] px-6 py-5 text-left">
          <DialogTitle className="text-4xl font-bold uppercase tracking-wide text-[#EAF0FA]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#A4ADBE]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className={labelClassName}>Coach Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Jordan Lee"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value }))
              }
              placeholder="Trainer"
              className={inputClassName}
            />
          </div>

          <div>
            <p className="mb-2 block text-sm text-[#B4BDCF]">Photo</p>
            <label className="block cursor-pointer rounded-md border border-dashed border-[#1C2B4A] bg-[#0B1630] p-3">
              <div className="flex items-center justify-center">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Coach preview"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded border border-dashed border-[#314062] text-xs font-medium text-[#7483A2]">
                    No image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileSelect}
              />
            </label>
          </div>

          <div>
            <label className={labelClassName}>Credential Badge</label>
            <input
              type="text"
              value={form.badge}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, badge: event.target.value }))
              }
              placeholder="FORMER_PRO / COLLEGE_PLAYER / NXT_LIONS"
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-[#7483A2]">
              Accepted values: FORMER_PRO, COLLEGE_PLAYER, NXT_LIONS
            </p>
          </div>

          <div>
            <label className={labelClassName}>Bio (2-3 sentences)</label>
            <textarea
              value={form.bio}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, bio: event.target.value }))
              }
              placeholder="College-level midfielder turned coach, specializing in technical skills and team strategy."
              rows={4}
              className={textAreaClassName}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-[#15213A] px-6 py-5 sm:justify-between">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md bg-[#1C2A44] px-6 text-sm font-semibold text-[#D7DEEE] hover:bg-[#273653]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="h-11 rounded-md bg-[#35BACB] px-12 text-sm font-bold text-[#061014] hover:bg-[#2FAABA]"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
