
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';

interface WizardNavigationProps {
  onFinish?: () => void;
  loading?: boolean;
  hideNext?: boolean;
  hidePrev?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onFinish,
  loading = false,
  hideNext = false,
  hidePrev = false,
  nextLabel = "Next",
  backLabel = "Back",
}) => {
  const { step, nextStep, prevStep, canProceed } = useTravelPlan();
  const isLastStep = step === 4;

  return (
    <div className="flex justify-between mt-8">
      {!hidePrev && (
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 0 || loading}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> {backLabel}
        </Button>
      )}
      
      {!hideNext && (
        <Button
          onClick={isLastStep ? onFinish : nextStep}
          disabled={!canProceed || loading}
          className="ml-auto gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              {isLastStep ? "Finish" : nextLabel} {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
