export type CoachBadge = "FORMER PRO" | "NXT LIONS" | "COLLAGE PLAYER";

export type CoachApiBadge = "FORMER_PRO" | "NXT_LIONS" | "COLLEGE_PLAYER";

export type Coach = {
  id: string;
  name: string;
  badge: string;
  role?: string;
  bio: string;
  photoUrl: string;
};

export type CoachInput = {
  name: string;
  badge: string;
  role: string;
  bio: string;
  photoUrl: string;
  imageFile?: File | null;
};

export type CampCoachRecord = {
  id: string;
  createdById?: string;
  name: string;
  badge: string;
  role?: string;
  coachBio: string;
  image: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CampCoachListResponse = {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: CampCoachRecord[];
};

export type CampCoachMutationPayload = {
  name: string;
  badge: string;
  role: string;
  coachBio: string;
};
