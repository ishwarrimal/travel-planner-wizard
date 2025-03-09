
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';

const DestinationStep: React.FC = () => {
  const { travelPlan, updateDestination } = useTravelPlan();
  const [inputValue, setInputValue] = useState(travelPlan.destination);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateDestination(e.target.value);
  };

  const popularDestinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'Rome, Italy',
    'Bali, Indonesia',
    'Barcelona, Spain',
  ];

  const handleSelectDestination = (destination: string) => {
    setInputValue(destination);
    updateDestination(destination);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Where do you want to go?</h2>
        <p className="text-muted-foreground">
          Enter your dream destination for this trip.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="destination"
            placeholder="Enter a city, country, or region"
            className="pl-10 travel-input"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Label>Popular destinations</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {popularDestinations.map((destination) => (
            <button
              key={destination}
              onClick={() => handleSelectDestination(destination)}
              className={`
                p-3 text-sm rounded-md transition-all 
                ${
                  inputValue === destination
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }
              `}
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationStep;
