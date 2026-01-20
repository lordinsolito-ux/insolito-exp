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
    <div className="bg-[#050507]/80 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between relative">

          {/* Background Path Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2"></div>

          {/* Active Digital Thread */}
          <div
            className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-gold-titan via-platinum to-platinum/20 -translate-y-1/2 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(var(--gold-titan-rgb),0.3)]"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-platinum shadow-[0_0_10px_var(--gold-titan)]"></div>
          </div>

          {steps.map((step) => {
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-500
                    ${isActive ? 'bg-gold-titan scale-125' : 'bg-white/5 scale-100'}
                    ${isCurrent ? 'ring-4 ring-gold-titan/20' : ''}
                  `}
                />

                <span
                  className={`
                    absolute top-6 text-[9px] md:text-[10px] font-accent uppercase tracking-[0.4em] whitespace-nowrap transition-all duration-500
                    ${isActive ? 'text-pearl-warm opacity-100' : 'text-platinum/10 opacity-40'}
                    ${isCurrent ? 'translate-y-[-2px] text-white' : ''}
                  `}
                >
                  {step.label}
                </span>

                {isCurrent && (
                  <div className="absolute -top-8 text-[8px] font-sans text-gold-titan/40 uppercase tracking-[0.2em] animate-pulse">
                    Step 0{step.num}
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
