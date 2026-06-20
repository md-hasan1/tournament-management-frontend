import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <article className="rounded-xl border border-[#232734] bg-[#12141A] px-6 py-5">
      <h3 className="mb-4 text-4xl font-semibold text-[#E9EDF5]">{title}</h3>
      {children}
    </article>
  );
}
