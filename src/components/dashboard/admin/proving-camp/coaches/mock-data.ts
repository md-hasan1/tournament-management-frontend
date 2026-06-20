import type { Coach, CoachBadge } from "./types";

export const coachBadgeOptions: CoachBadge[] = [
  "FORMER PRO",
  "NXT LIONS",
  "COLLAGE PLAYER",
];

export const initialCoaches: Coach[] = [
  {
    id: "coach-1",
    name: "Brent Acuff",
    badge: "FORMER PRO",
    bio: "Brent Acuff is the founder of Crown & Pitch. A former professional player dean brings decades of experiences and a passion for developing young talent at every level.",
    photoUrl:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "coach-2",
    name: "Mrs Piash Ain",
    badge: "NXT LIONS",
    bio: "Mrs Piash is the founder of Crown & Pitch. A former professional player dean brings decades of experiences and a passion for developing young talent at every level.",
    photoUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "coach-3",
    name: "Ali Masud Rocks",
    badge: "COLLAGE PLAYER",
    bio: "Ali masud is the founder of Crown & Pitch. A former professional player dean brings decades of experiences and a passion for developing young talent at every level.",
    photoUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80",
  },
];
