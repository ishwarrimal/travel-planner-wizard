import React, { useEffect } from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { TripStyle } from '@/contexts/TravelPlanContext';
import { 
  Compass, 
  Heart, 
  Users, 
  Crown,
  UtensilsCrossed, 
  Camera, 
  Mountain, 
  ShoppingBag, 
  Landmark,
  Waves,
  AlertCircle
} from 'lucide-react';

interface TripStyleOption {
  value: TripStyle;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TripStyleStep: React.FC = () => {
  const { travelPlan, updateTripStyle } = useTravelPlan();
  const [selectedStyles, setSelectedStyles] = React.useState<TripStyle[]>(
    travelPlan.tripStyle || []
  );
  const [error, setError] = React.useState<string | null>(null);
  
  const MAX_SELECTIONS = 3;
  
  const tripStyleOptions: TripStyleOption[] = [
    {
      value: 'sightseeing',
      label: 'Sightseeing',
      icon: <Camera className="h-6 w-6" />,
      description: 'Popular attractions, landmarks, and photo opportunities.'
    },
    {
      value: 'adventure',
      label: 'Adventure',
      icon: <Compass className="h-6 w-6" />,
      description: 'Outdoor activities, thrills, and exploration.'
    },
    {
      value: 'nature',
      label: 'Nature & Wildlife',
      icon: <Mountain className="h-6 w-6" />,
      description: 'National parks, wildlife viewing, and natural wonders.'
    },
    {
      value: 'beach',
      label: 'Beach',
      icon: <Waves className="h-6 w-6" />,
      description: 'Coastal activities, swimming, and sun bathing.'
    },
    {
      value: 'culture',
      label: 'Culture & History',
      icon: <Landmark className="h-6 w-6" />,
      description: 'Museums, historical sites, and local traditions.'
    },
    {
      value: 'food',
      label: 'Food & Dining',
      icon: <UtensilsCrossed className="h-6 w-6" />,
      description: 'Local cuisine, restaurants, and food markets.'
    },
    {
      value: 'shopping',
      label: 'Shopping',
      icon: <ShoppingBag className="h-6 w-6" />,
      description: 'Markets, malls, and local boutiques.'
    },
    {
      value: 'wellness',
      label: 'Wellness',
      icon: <Crown className="h-6 w-6" />,
      description: 'Spa, yoga, and relaxation activities.'
    },
    {
      value: 'romance',
      label: 'Romance',
      icon: <Heart className="h-6 w-6" />,
      description: 'Intimate experiences for couples.'
    },
    {
      value: 'family',
      label: 'Family',
      icon: <Users className="h-6 w-6" />,
      description: 'Kid-friendly activities and family fun.'
    },
  ];
  
  const handleStyleToggle = (style: TripStyle) => {
    setError(null);
    
    if (selectedStyles.includes(style)) {
      // Remove the style if already selected
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      // Add the style if not at max selections
      if (selectedStyles.length < MAX_SELECTIONS) {
        setSelectedStyles([...selectedStyles, style]);
      } else {
        setError(`You can select up to ${MAX_SELECTIONS} travel styles`);
      }
    }
  };

  useEffect(() => {
    updateTripStyle(selectedStyles)
  }, [selectedStyles])

  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">What's your travel style?</h2>
        <p className="text-muted-foreground">
          Choose up to 3 styles that best fit your trip to {travelPlan.destination || "your destination"}.
        </p>
        {selectedStyles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-sm font-medium">Selected:</span>
            {selectedStyles.map((style) => (
              <span key={style} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {tripStyleOptions.find(option => option.value === style)?.label}
              </span>
            ))}
          </div>
        )}
        {error && (
          <div className="mt-2 flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tripStyleOptions.map((option) => (
          <div
            key={option.value}
            className={`
              rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md
              ${selectedStyles.includes(option.value) 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleStyleToggle(option.value)}
          >
            <div className="flex items-center">
              <div className={`
                rounded-full p-2 mr-3
                ${selectedStyles.includes(option.value) 
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