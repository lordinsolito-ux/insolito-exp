import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { num: 1, label: "Service" },
  { num: 2, label: "Details" },
  { num: 3, label: "Vehicle" },
  { num: 4, label: "Review" }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="bg-transparent border-b border-white/[0.03] backdrop-blur-3xl">
      <div className="max-w-4xl mx-auto px-12 py-12">
        <div className="flex items-center justify-between relative">
          {/* Architectural Baseline */}
          <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-white/5 -translate-y-1/2"></div>

          {/* Precision Digital Line */}
          <div
            className="absolute top-1/2 left-0 h-[0.5px] bg-white transition-all duration-1000 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />

          {steps.map((step) => {
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`
                    w-1 h-1 transition-all duration-1000
                    ${isActive ? 'bg-white' : 'bg-white/5'}
                    ${isCurrent ? 'scale-[2.5] bg-white' : ''}
                  `}
                />

                <span className={`
                  absolute top-8 text-[9px] font-accent uppercase tracking-[1em] transition-all duration-1000 whitespace-nowrap
                  ${isActive ? 'text-white' : 'text-white/5'}
                  ${isCurrent ? 'opacity-100 text-white' : 'opacity-20'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
