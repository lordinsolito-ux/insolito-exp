import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { num: 1, label: "Protocollo" },
  { num: 2, label: "Missione" },
  { num: 3, label: "Profilo" },
  { num: 4, label: "Revisione" }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={`transition-colors duration-1000 border-b ${currentStep >= 2 ? 'bg-transparent border-[var(--antracite-elite)]/5' : 'bg-transparent border-[var(--oro-lucido)]/10 backdrop-blur-3xl'}`}>
      <div className="max-w-4xl mx-auto px-12 py-12">
        <div className="flex items-center justify-between relative">
          {/* Architectural Baseline */}
          <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-[var(--oro-lucido)]/10 -translate-y-1/2"></div>

          {/* Precision Liquid Gold Line */}
          <div
            className="absolute top-1/2 left-0 h-[0.5px] bg-gold-gradient transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(197,160,89,0.3)]"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, var(--oro-lucido), var(--oro-rosa))'
            }}
          />

          {steps.map((step) => {
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`
                    w-1 h-1 transition-all duration-1000
                    ${isActive ? 'bg-[var(--oro-lucido)]' : 'bg-[var(--oro-lucido)]/10'}
                    ${isCurrent ? 'scale-[2.5] bg-[var(--oro-lucido)] shadow-glow-gold' : ''}
                  `}
                />

                <span className={`
                  absolute top-8 text-[9px] font-accent uppercase tracking-[1em] transition-all duration-1000 whitespace-nowrap
                  ${isActive
                    ? (currentStep >= 2 ? 'text-[var(--antracite-elite)] font-bold' : 'text-[var(--oro-lucido)] font-bold')
                    : (currentStep >= 2 ? 'text-[var(--antracite-elite)]/30' : 'text-[var(--oro-lucido)]/20')
                  }
                  ${isCurrent ? 'opacity-100' : 'opacity-40'}
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
