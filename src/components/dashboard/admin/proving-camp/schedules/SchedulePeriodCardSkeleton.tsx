export default function SchedulePeriodCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#2E3340] bg-[#151821] p-4">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-[#2A3140]" />
          <div className="h-6 w-40 rounded bg-[#2A3140]" />
          <div className="h-3 w-32 rounded bg-[#2A3140]" />
        </div>

        <div className="flex gap-2">
          <div className="h-7 w-7 rounded bg-[#2A3140]" />
          <div className="h-7 w-7 rounded bg-[#2A3140]" />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-24 rounded bg-[#2A3140]" />
          <div className="h-3 w-10 rounded bg-[#2A3140]" />
        </div>

        <div className="flex justify-between">
          <div className="h-3 w-28 rounded bg-[#2A3140]" />
          <div className="h-3 w-16 rounded bg-[#2A3140]" />
        </div>

        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-[#2A3140]" />
          <div className="h-3 w-12 rounded bg-[#2A3140]" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded bg-[#2A3140]" />

      {/* Button */}
      <div className="mt-4 h-4 w-32 rounded bg-[#2A3140]" />
    </div>
  );
}
