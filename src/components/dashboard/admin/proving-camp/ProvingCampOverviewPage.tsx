"use client";
import { useGetCampOverviewQuery } from "@/redux/apiHooks/camp/campApi";
import ChartCard from "./ChartCard";
import MetricCard from "./MetricCard";
import SimpleBarChart from "./SimpleBarChart";
import SimpleLineChart from "./SimpleLineChart";
import type { CampOverviewData, OverviewMetric } from "./data";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getGrowthLabel = (growth: number | null | undefined) => {
  if (growth === null || growth === undefined) {
    return "No comparison yet";
  }

  const sign = growth > 0 ? "+" : "";
  return `${sign}${growth.toFixed(1)}% vs last year`;
};

export default function ProvingCampOverviewPage() {
  const {
    data: provingCampOverview,
    isLoading,
    isError,
  } = useGetCampOverviewQuery();

  const overviewData: CampOverviewData | undefined = provingCampOverview?.data;

  const overviewMetrics: OverviewMetric[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(overviewData?.totalRevenue ?? 0),
      description: getGrowthLabel(overviewData?.revenueGrowthPct),
      icon: "revenue",
      accent:
        (overviewData?.revenueGrowthPct ?? 0) >= 0
          ? "text-emerald-400"
          : "text-rose-400",
    },
    {
      title: "Total Enrollment",
      value: String(overviewData?.totalEnrollment?.total ?? 0),
      description: `AM: ${overviewData?.totalEnrollment?.am ?? 0} - PM: ${overviewData?.totalEnrollment?.pm ?? 0}`,
      icon: "enrollment",
    },
    {
      title: "Waitlist",
      value: String(overviewData?.waitlist?.total ?? 0),
      description: `AM: ${overviewData?.waitlist?.am ?? 0} - PM: ${overviewData?.waitlist?.pm ?? 0}`,
      icon: "waitlist",
    },
  ];

  const weeklyRevenue = overviewData?.revenueByWeek?.map((item) => ({
    week: item.week,
    value: item.revenue,
  })) ?? [{ week: "Week 1", value: 0 }];

  const weeklyEnrollment = overviewData?.enrollmentByWeek?.map((item) => ({
    week: item.week,
    value: item.total,
  })) ?? [{ week: "Week 1", value: 0 }];

  return (
    <section className="space-y-6 p-5 lg:p-8 bg-[#090B10] min-h-screen">
      <header>
        <h1 className="text-5xl font-extrabold uppercase tracking-wide text-[#F2F4F8]">
          Camp Overview
        </h1>
        <p className="mt-1 text-2xl text-[#8D93A6]">
          Your camp management dashboard
        </p>
      </header>

      {isLoading && (
        <p className="text-lg text-[#8D93A6]">Loading overview...</p>
      )}

      {isError && (
        <p className="text-lg text-rose-400">
          Failed to load camp overview data.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue by Week">
          <SimpleLineChart data={weeklyRevenue} />
        </ChartCard>

        <ChartCard title="Enrollment by Week">
          <SimpleBarChart data={weeklyEnrollment} />
        </ChartCard>
      </div>
    </section>
  );
}
