
import React from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { BudgetLevel } from '@/contexts/TravelPlanContext';
import { CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BudgetOption {
  value: BudgetLevel;
  label: string;
  description: string;
  priceIndicator: string;
}

const BudgetStep: React.FC = () => {
  const { travelPlan, updateBudgetLevel } = useTravelPlan();
  
  const budgetOptions: BudgetOption[] = [
    {
      value: 'budget',
      label: 'Budget-Friendly',
      description: 'Affordable options prioritizing value and essential experiences.',
      priceIndicator: '$'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balance between cost and comfort with some premium experiences.',
      priceIndicator: '$$'
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: 'Premium experiences with high-end accommodations and services.',
      priceIndicator: '$$$'
    }
  ];
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">What's your budget preference?</h2>
        <p className="text-muted-foreground">
          Choose a budget level for your {travelPlan.numberOfDays}-day trip to {travelPlan.destination || "your destination"}.
        </p>
      </div>
      
      <div className="space-y-4">
        {budgetOptions.map((option) => (
          <div
            key={option.value}
            className={`
              border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md
              ${travelPlan.budgetLevel === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border'
              }
            `}
            onClick={() => updateBudgetLevel(option.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CircleDollarSign className={`h-5 w-5 ${
                  travelPlan.budgetLevel === option.value 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`} />
                <div>
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <div className="text-lg font-semibold">
                {option.priceIndicator}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">Understanding budget levels:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><span className="font-medium">Budget-Friendly:</span> Hostels, public transportation, street food</li>
          <li><span className="font-medium">Moderate:</span> 3-star hotels, mix of dining options, some guided tours</li>
          <li><span className="font-medium">Luxury:</span> 4/5-star hotels, fine dining, premium experiences</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetStep;
