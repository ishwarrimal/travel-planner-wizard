
import React from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { TripStyle } from '@/contexts/TravelPlanContext';
import { Compass, Palmtree, Heart, Building, Users } from 'lucide-react';

interface TripStyleOption {
  value: TripStyle;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TripStyleStep: React.FC = () => {
  const { travelPlan, updateTripStyle } = useTravelPlan();
  
  const tripStyleOptions: TripStyleOption[] = [
    {
      value: 'adventure',
      label: 'Adventure',
      icon: <Compass className="h-6 w-6" />,
      description: 'Outdoor activities, thrills, and exploration.'
    },
    {
      value: 'leisure',
      label: 'Leisure',
      icon: <Palmtree className="h-6 w-6" />,
      description: 'Relaxation, comfort, and peace of mind.'
    },
    {
      value: 'romance',
      label: 'Romance',
      icon: <Heart className="h-6 w-6" />,
      description: 'Intimate experiences for couples.'
    },
    {
      value: 'culture',
      label: 'Culture',
      icon: <Building className="h-6 w-6" />,
      description: 'Museums, history, and local experiences.'
    },
    {
      value: 'family',
      label: 'Family',
      icon: <Users className="h-6 w-6" />,
      description: 'Fun for all ages, kid-friendly activities.'
    }
  ];
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">What's your travel style?</h2>
        <p className="text-muted-foreground">
          Choose the style that best fits your trip to {travelPlan.destination || "your destination"}.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tripStyleOptions.map((option) => (
          <div
            key={option.value}
            className={`
              rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md
              ${travelPlan.tripStyle === option.value 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => updateTripStyle(option.value)}
          >
            <div className="flex items-center">
              <div className={`
                rounded-full p-2 mr-3
                ${travelPlan.tripStyle === option.value 
                  ? 'bg-primary text-white' 
                  : 'bg-muted'
                }
              `}>
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripStyleStep;
