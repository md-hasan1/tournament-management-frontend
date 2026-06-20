export type WaitlistEntry = {
  id: string;
  players: {
    playerName: string;
    dateOfBirth: string;
    playerType: string;
    shirtSize: string;
  }[];
  scheduleSessionIds: string[];
  numberOfKids: number;
  numberOfWeeks: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  waitlistType: "SESSION_FULL" | "PERIOD_FULL";
  queuePosition: number;
  status: "OFFER_SENT" | "ACTIVE" | "ACCEPTED" | "DECLINED";
  notifiedAt: string | null;
  offerExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};
