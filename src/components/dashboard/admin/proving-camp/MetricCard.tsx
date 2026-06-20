import { cn } from "@/lib/utils";
import { DollarSign, ListOrdered, Users } from "lucide-react";
import type { OverviewMetric } from "./data";

const iconMap = {
  revenue: DollarSign,
  enrollment: Users,
  waitlist: ListOrdered,
} as const;

type MetricCardProps = {
  metric: OverviewMetric;
};

export default function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.icon];

  return (
    <article className="rounded-xl border border-[#232734] bg-[#12141A] px-6 py-5">
      <div className="mb-2 flex items-center gap-3 text-[#8D93A6]">
        <Icon className="h-4 w-4 text-[#35BACB]" />
        <p className="text-xl font-medium leading-none">{metric.title}</p>
      </div>

      <p className="text-5xl font-bold tracking-tight text-[#E9EDF5]">{metric.value}</p>
      <p className={cn("mt-2 text-2xl text-[#8D93A6]", metric.accent)}>{metric.description}</p>
    </article>
  );
}
