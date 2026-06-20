export type OverviewMetric = {
  title: string;
  value: string;
  description: string;
  icon: "revenue" | "enrollment" | "waitlist";
  accent?: string;
};

// Duplicate CampOverviewData type removed

// Duplicate CampOverviewApiResponse type removed
export type CampOverviewData = {
  totalRevenue: number;
  revenueGrowthPct: number | null;
  totalEnrollment: {
    total: number;
    am: number;
    pm: number;
  };
  waitlist: {
    total: number;
    am: number;
    pm: number;
  };
  revenueByWeek: {
    week: string;
    revenue: number;
  }[];
  enrollmentByWeek: {
    week: string;
    am: number;
    pm: number;
    total: number;
  }[];
};

export type CampOverviewApiResponse = {
  success: boolean;
  message: string;
  data: CampOverviewData;
};
