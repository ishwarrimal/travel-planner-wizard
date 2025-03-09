
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTravelPlan } from '@/contexts/TravelPlanContext';

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  const { step: currentStep, goToStep } = useTravelPlan();

  return (
    <div className="hidden md:block">
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-1 -ml-px bg-gray-200 transform translate-x-1/2"></div>
        <ul>
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            
            return (
              <li key={index} className="relative pb-10 last:pb-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center h-8 w-8 rounded-full border-2",
                        isCompleted 
                          ? "bg-travel-green border-travel-green" 
                          : isActive 
                            ? "bg-primary border-primary"
                            : "bg-white border-gray-300"
                      )}
                      onClick={() => isCompleted && goToStep(index)}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span className={cn(
                          "h-2.5 w-2.5 rounded-full", 
                          isActive ? "bg-white" : "bg-gray-300"
                        )}></span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 min-w-0">
                    <h3 
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary" : isCompleted ? "text-gray-900" : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StepIndicator;
