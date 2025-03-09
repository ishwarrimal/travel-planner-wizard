
import React, { useState } from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import StepIndicator from '@/components/StepIndicator';
import WizardNavigation from '@/components/WizardNavigation';
import PageTransition from '@/components/PageTransition';
import DestinationStep from '@/components/steps/DestinationStep';
import DatesStep from '@/components/steps/DatesStep';
import TripStyleStep from '@/components/steps/TripStyleStep';
import BudgetStep from '@/components/steps/BudgetStep';
import ItineraryStep from '@/components/steps/ItineraryStep';

const wizardSteps = [
  {
    title: 'Destination',
    description: 'Where do you want to go?',
    component: DestinationStep
  },
  {
    title: 'Dates',
    description: 'When are you traveling?',
    component: DatesStep
  },
  {
    title: 'Trip Style',
    description: 'What type of trip is this?',
    component: TripStyleStep
  },
  {
    title: 'Budget',
    description: "What's your budget level?",
    component: BudgetStep
  },
  {
    title: 'Itinerary',
    description: 'Your custom travel plan',
    component: ItineraryStep
  }
];

const TravelPlanner: React.FC = () => {
  const { step, isGenerating } = useTravelPlan();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <StepIndicator steps={wizardSteps} />
        
        <div className="bg-white rounded-xl p-6 shadow-sm border min-h-[500px]">
          {wizardSteps.map((wizardStep, index) => {
            const Component = wizardStep.component;
            return (
              <PageTransition key={index} show={step === index}>
                <Component />
                {index !== wizardSteps.length - 1 && <WizardNavigation />}
              </PageTransition>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
