import { Clock3 } from "lucide-react";

type WaitlistStatCardProps = {
  title: string;
  value: number;
  valueClassName?: string;
};

export default function WaitlistStatCard({
  title,
  value,
  valueClassName,
}: WaitlistStatCardProps) {
  return (
    <article className="rounded-xl border border-[#2A2F3C] bg-[#151821] p-4 md:p-5">
      <div className="mb-2 flex items-center gap-2 text-[#95A0B6]">
        <Clock3 className="h-4 w-4 text-[#35BACB]" />
        <p className="text-sm font-medium md:text-base">{title}</p>
      </div>

      <p className={`text-3xl font-bold text-[#EAF0FA] md:text-4xl ${valueClassName ?? ""}`}>
        {value}
      </p>
    </article>
  );
}
