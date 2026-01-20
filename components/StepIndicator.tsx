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
    <div className="bg-black/40 backdrop-blur-md border-b border-gold-900/50 sticky top-0 z-50">
      {/* Progress Line */}
      <div className="relative h-1 bg-gray-900 w-full">
        <div
          className="absolute h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="px-4 md:px-12 py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step) => {
            const isActive = currentStep >= step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className={`flex items-center flex-1 ${step.num === 4 ? 'flex-none' : ''}`}>
                <div className="flex flex-col items-center relative group">
                  <div
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-500 border
                      ${isActive 
                        ? "bg-gold-400 text-black border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                        : "bg-black/80 text-gray-600 border-gray-800"
                      }
                      ${isCurrent ? "scale-110" : "scale-100"}
                    `}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`
                      absolute top-12 text-[10px] md:text-xs font-serif tracking-widest uppercase whitespace-nowrap transition-colors duration-300
                      ${isActive ? "text-gold-400" : "text-gray-600"}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
                
                {step.num < 4 && (
                  <div className="flex-1 px-4 hidden md:block">
                     <div className={`h-px w-full transition-colors duration-700 ${isActive && currentStep > step.num ? 'bg-gold-900' : 'bg-gray-900'}`} />
                  </div>
                )}
                 {step.num < 4 && (
                  <div className="flex-1 w-4 md:hidden" /> /* Spacer for mobile */
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
