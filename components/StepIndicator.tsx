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
    <div className="bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-10 py-10">
        <div className="flex items-center justify-between relative">

          {/* Background Path Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2"></div>

          {/* Active Digital Thread */}
          <div
            className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-white via-white/40 to-transparent -translate-y-1/2 transition-all duration-1000 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>

          {steps.map((step) => {
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-500
                    ${isActive ? 'bg-white scale-125' : 'bg-white/5 scale-100'}
                    ${isCurrent ? 'ring-4 ring-white/10' : ''}
                  `}
                />

                <span
                  className={`
                    absolute top-8 text-[10px] font-accent uppercase tracking-[0.6em] whitespace-nowrap transition-all duration-500
                    ${isActive ? 'text-white/80 opacity-100' : 'text-[#C0C0C0]/10 opacity-40'}
                    ${isCurrent ? 'translate-y-[-2px] text-white' : ''}
                  `}
                >
                  {step.label}
                </span>

                {isCurrent && (
                  <div className="absolute -top-10 text-[9px] font-accent text-white/20 uppercase tracking-[0.4em] animate-pulse">
                    Step {step.num}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
