import React from 'react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        return (
          <React.Fragment key={step}>
            {step > 1 && (
              <div
                className={`flex-1 h-1 ${
                  step <= currentStep ? 'bg-[#35BACB]' : 'bg-gray-600'
                }`}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                step <= currentStep
                  ? 'bg-[#35BACB] text-black'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              {step}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
