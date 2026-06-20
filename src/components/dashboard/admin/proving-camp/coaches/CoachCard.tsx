import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Coach } from "./types";

type CoachCardProps = {
  coach: Coach;
  onEdit: (coach: Coach) => void;
  onDelete: (coach: Coach) => void;
};

export default function CoachCard({ coach, onEdit, onDelete }: CoachCardProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const hasLongBio = coach.bio.trim().length > 140;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#2A3140] bg-[#0F131B] shadow-[0_16px_45px_-30px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-[#35BACB]/50">
      <div className="relative h-56 w-full bg-[#10131A]">
        {coach.photoUrl ? (
          <Image
            src={coach.photoUrl}
            alt={coach.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0C1118] px-4 text-center text-sm font-medium text-[#7E8AA1]">
            No image uploaded
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#080B11] via-[#080B11]/45 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-[#35BACB]/50 bg-[#0A2830]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7EDBE7] backdrop-blur">
            {coach.badge}
          </span>
          {coach.role && (
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              {coach.role}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-3xl font-black uppercase tracking-wide text-[#F5F8FF]">
            {coach.name}
          </h3>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p
          className={`${isBioExpanded ? "" : "line-clamp-3"} text-sm leading-7 text-[#AAB5C9]`}
        >
          {coach.bio}
        </p>

        {hasLongBio && (
          <button
            type="button"
            onClick={() => setIsBioExpanded((prev) => !prev)}
            className="text-xs font-semibold uppercase tracking-wider text-[#35BACB] hover:text-[#6DD3E0]"
          >
            {isBioExpanded ? "Read Less" : "Read More"}
          </button>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-[#1F2634] bg-[#0B0F15] p-2">
          <button
            type="button"
            onClick={() => onEdit(coach)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#2B3547] bg-[#121927] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#D6DEEE] transition-colors hover:border-[#3A4962] hover:bg-[#182133]"
            aria-label={`Edit ${coach.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(coach)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#4A252B] bg-[#2A1518] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#FF8D9A] transition-colors hover:border-[#6A2E37] hover:bg-[#35191E]"
            aria-label={`Delete ${coach.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
