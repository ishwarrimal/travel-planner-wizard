
import React, { useEffect } from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Coffee, UtensilsCrossed, Car, Bed, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ItineraryActivity } from '@/contexts/TravelPlanContext';

const categoryIcons = {
  'food': <UtensilsCrossed className="h-4 w-4" />,
  'activity': <Coffee className="h-4 w-4" />,
  'transportation': <Car className="h-4 w-4" />,
  'accommodation': <Bed className="h-4 w-4" />,
  'free-time': <Clock className="h-4 w-4" />
};

const ItineraryStep: React.FC = () => {
  const { travelPlan, generateItinerary, isGenerating } = useTravelPlan();
  
  useEffect(() => {
    if (travelPlan.itinerary.length === 0 && !isGenerating) {
      generateItinerary();
    }
  }, []);
  
  const ActivityCard: React.FC<{ activity: ItineraryActivity }> = ({ activity }) => {
    return (
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="w-20 bg-primary flex-shrink-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-xs">{activity.time.split(' ')[1]}</div>
                <div className="text-lg font-bold">{activity.time.split(' ')[0]}</div>
              </div>
            </div>
            <div className="p-4 flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{activity.title}</h3>
                {activity.cost && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {activity.cost}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              
              <div className="flex items-center mt-2 space-x-4">
                {activity.category && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    {categoryIcons[activity.category] || null}
                    <span className="ml-1 capitalize">{activity.category.replace('-', ' ')}</span>
                  </div>
                )}
                {activity.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {activity.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isGenerating) {
    return (
      <div className="h-96 flex flex-col items-center justify-center animate-fadeIn">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium mb-2">Crafting your perfect itinerary...</h3>
        <p className="text-center text-muted-foreground max-w-md">
          We're creating a personalized {travelPlan.numberOfDays}-day {travelPlan.tripStyle} itinerary
          for your trip to {travelPlan.destination} with a {travelPlan.budgetLevel} budget.
        </p>
      </div>
    );
  }
  
  if (travelPlan.itinerary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fadeIn">
        <h3 className="text-xl font-medium mb-4">Ready to create your itinerary?</h3>
        <Button onClick={generateItinerary} size="lg">
          Generate Itinerary
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your {travelPlan.numberOfDays}-Day Itinerary</h2>
        <p className="text-muted-foreground">
          {travelPlan.tripStyle.charAt(0).toUpperCase() + travelPlan.tripStyle.slice(1)} trip to {travelPlan.destination} 
          with a {travelPlan.budgetLevel} budget.
        </p>
      </div>
      
      <Tabs defaultValue={`day-1`} className="w-full">
        <TabsList className="w-full overflow-x-auto flex-nowrap mb-4 justify-start h-auto p-1">
          {travelPlan.itinerary.map((day) => (
            <TabsTrigger 
              key={`day-${day.day}`} 
              value={`day-${day.day}`}
              className="py-2 px-4 whitespace-nowrap"
            >
              <div className="text-left">
                <div className="font-medium">Day {day.day}</div>
                <div className="text-xs opacity-80">{format(day.date, 'EEE, MMM d')}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {travelPlan.itinerary.map((day) => (
          <TabsContent key={`content-day-${day.day}`} value={`day-${day.day}`} className="mt-0">
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-semibold">
                Day {day.day}: {format(day.date, 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <MapPin className="h-4 w-4" /> Map View
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <DollarSign className="h-4 w-4" /> Cost Breakdown
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              {day.activities.map((activity, index) => (
                <ActivityCard key={`activity-${index}`} activity={activity} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={generateItinerary}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Regenerating...
            </>
          ) : (
            <>Regenerate Itinerary</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ItineraryStep;
