/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { alertSuccess, confirmDelete } from "@/lib/confirm";
import {
  useCreateCampCoachMutation,
  useDeleteCampCoachMutation,
  useGetCampCoachListQuery,
  useUpdateCampCoachMutation,
} from "@/redux/apiHooks/camp/coachApi";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CoachCard from "./coaches/CoachCard";
import CoachFormDialog from "./coaches/CoachFormDialog";
import type {
  CampCoachMutationPayload,
  CampCoachRecord,
  Coach,
  CoachInput,
} from "./coaches/types";
import CoachCardSkeleton from "./coaches/CoachCardSkeleton";

const formatBadgeForUi = (badge: string): string =>
  badge.trim().replace(/_/g, " ");

const normalizeBadgeToApi = (badge: string): string => {
  return badge.trim();
};

const mapCoachRecordToUi = (coach: CampCoachRecord): Coach => ({
  id: coach.id,
  name: coach.name,
  badge: formatBadgeForUi(coach.badge),
  role: coach.role,
  bio: coach.coachBio,
  photoUrl: coach.image,
});

const buildCoachPayload = (coach: CoachInput): CampCoachMutationPayload => ({
  name: coach.name,
  badge: normalizeBadgeToApi(coach.badge),
  role: coach.role,
  coachBio: coach.bio,
});

const buildCoachFormData = (coach: CoachInput): FormData => {
  const payload = buildCoachPayload(coach);
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload));
  if (coach.imageFile) {
    formData.append("image", coach.imageFile);
  }

  return formData;
};

const buildCoachUpdateBody = (
  coach: CoachInput,
): CampCoachMutationPayload | FormData => {
  if (coach.imageFile) {
    return buildCoachFormData(coach);
  }
  return buildCoachPayload(coach);
};

export default function ProvingCampCoachesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    data: coachListResponse,
    isLoading,
    isError,
  } = useGetCampCoachListQuery({
    page: 1,
    limit: 10,
  });

  const [createCampCoach] = useCreateCampCoachMutation();
  const [updateCampCoach] = useUpdateCampCoachMutation();
  const [deleteCampCoach] = useDeleteCampCoachMutation();

  const coaches = useMemo(
    () => coachListResponse?.data.map(mapCoachRecordToUi) ?? [],
    [coachListResponse],
  );

  const handleAddClick = () => {
    setDialogMode("create");
    setActiveCoach(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (coach: Coach) => {
    setDialogMode("edit");
    setActiveCoach(coach);
    setIsDialogOpen(true);
  };

  const handleDelete = async (coach: Coach) => {
    const confirmed = await confirmDelete({
      title: `Delete ${coach.name}?`,
      text: "Are you sure you want to delete this coach?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    await deleteCampCoach({ id: coach.id }).unwrap();
    await alertSuccess("Coach deleted", `${coach.name} removed.`);
  };

  const handleSaveCoach = async (payload: CoachInput) => {
    setLoading(true);
    try {
      if (dialogMode === "edit" && activeCoach) {
        const updateBody = buildCoachUpdateBody(payload);
        await updateCampCoach({
          id: activeCoach.id,
          payload: updateBody,
        }).unwrap();
        toast.success("Coach updated!");
      } else {
        const formData = buildCoachFormData(payload);
        await createCampCoach({ payload: formData }).unwrap();
        toast.success("Coach added!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#090B10] p-5 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-[#F2F4F8]">Coaches</h1>
          <p className="text-[#8D93A6]">Manage coaches</p>
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#35BACB] px-5 font-bold text-[#061014]"
        >
          <Plus className="h-4 w-4" />
          Create Coach
        </button>
      </div>

      {/* ❗ Skeleton Loader */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CoachCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-lg text-rose-400">Failed to load coaches</p>
      )}

      {/* Data */}
      {!isLoading && !isError && coaches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && coaches.length === 0 && (
        <p className="text-center text-[#8D93A6]">No coaches found</p>
      )}

      <CoachFormDialog
        open={isDialogOpen}
        mode={dialogMode}
        activeCoach={activeCoach}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCoach}
        loading={loading}
      />
    </section>
  );
}
