export default function CoachCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#2A3140] bg-[#0F131B] shadow-[0_16px_45px_-30px_rgba(0,0,0,0.95)]">
      {/* Image */}
      <div className="h-56 w-full bg-[#1A2230]" />

      <div className="space-y-5 p-5">
        {/* Badge + Role */}
        <div className="flex justify-between">
          <div className="h-5 w-20 rounded-full bg-[#1A2230]" />
          <div className="h-5 w-16 rounded-full bg-[#1A2230]" />
        </div>

        {/* Name */}
        <div className="h-6 w-2/3 rounded bg-[#1A2230]" />

        {/* Bio */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-[#1A2230]" />
          <div className="h-3 w-5/6 rounded bg-[#1A2230]" />
          <div className="h-3 w-4/6 rounded bg-[#1A2230]" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-9 w-full rounded-lg bg-[#1A2230]" />
          <div className="h-9 w-full rounded-lg bg-[#1A2230]" />
        </div>
      </div>
    </div>
  );
}
