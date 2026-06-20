import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  currentStep,
  onBack,
  onNext,
  disabled = false,
}: ActionButtonsProps) {
  const router = useRouter();

  if (currentStep < 4) {
    return (
      <div className="flex gap-4 justify-between">
        <button
          onClick={onBack}
          disabled={disabled}
          className="px-8 py-3 border-2 border-gray-600 text-white font-bold rounded hover:border-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={disabled}
          className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {disabled ? "Processing..." : "Next"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => router.push("/")}
        className="px-8 py-3 border-2 border-[#35BACB] text-[#35BACB] font-bold rounded hover:bg-[#35BACB] hover:text-black transition"
      >
        Continue
      </button>
      <button
        onClick={() => router.push("/dashboard/coach/tournament")}
        className="px-8 py-3 bg-[#35BACB] text-black font-bold rounded hover:bg-[#A232D6] transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
