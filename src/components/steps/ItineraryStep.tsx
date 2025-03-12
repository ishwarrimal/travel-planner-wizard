import React, { useEffect } from 'react';
import { ItineraryDay, TravelPlan, useTravelPlan } from '@/contexts/TravelPlanContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Coffee, UtensilsCrossed, Car, Bed, Clock, DollarSign, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ItineraryActivity } from '@/contexts/TravelPlanContext';

const categoryIcons = {
  'food': <UtensilsCrossed className="h-4 w-4" />,
  'activity': <Coffee className="h-4 w-4" />,
  'transportation': <Car className="h-4 w-4" />,
  'accommodation': <Bed className="h-4 w-4" />,
  'free-time': <Clock className="h-4 w-4" />
};

function generateBookingURL(destination, checkin) {
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 1);

  const url = new URL("https://www.booking.com/searchresults.html");
  url.searchParams.set("ss", destination);
  url.searchParams.set("checkin_year", checkin.getFullYear());
  url.searchParams.set("checkin_month", checkin.getMonth() + 1);
  url.searchParams.set("checkin_monthday", checkin.getDate());

  return url.toString();
}

const ItineraryStep: React.FC = () => {
  const { travelPlan, generateItinerary, isGenerating, error } = useTravelPlan();
  
  useEffect(() => {
    if (travelPlan.itinerary.length === 0 && !isGenerating && !error) {
      generateItinerary();
    }
  }, []);
  
  const ActivityCard: React.FC<{ activity: ItineraryActivity, day: ItineraryDay }> = ({ activity, day }) => {
    const getBookingButton = () => {
      if (activity.category === 'accommodation') {
        return (
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2"
            onClick={() => window.open(generateBookingURL(activity.location, day.date), '_blank')}
          >
            Book Hotel
          </Button>
        );
      }
      if (activity.category.includes('transportation')) {
        const type = activity.category.split('-')[1]
        return (
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2"
            onClick={() => window.open('https://www.skyscanner.com', '_blank')}
          >
            Book {type}
          </Button>
        );
      }
      return null;
    };

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
                    {activity.cost} (approx)
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

              {getBookingButton()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const formatItineraryForShare = () => {
    let message = `*** My Amazing Travel Itinerary ***\n\n`;
    message += `${travelPlan.numberOfDays}-day ${travelPlan.tripStyle} trip to ${travelPlan.destination}\n`;
    message += `Budget: ${travelPlan.budgetLevel}\n\n`;
    
    travelPlan.itinerary.forEach(day => {
      message += `DAY ${day.day} - ${format(day.date, 'EEEE, MMMM d, yyyy')}\n`;
      message += `-----------------\n`;
      day.activities.forEach(activity => {
        message += `* ${activity.time} - ${activity.title}\n`;
        if (activity.location) message += `  - Location: ${activity.location}\n`;
        if (activity.cost) message += `  - Cost: ${activity.cost}\n`;
        message += '\n';
      });
    });

    message += `=================\n`;
    message += `Plan your own perfect trip at TripPlanner.ai!\n`;
    message += `Create personalized AI-powered itineraries in seconds.\n`;
    message += `Visit: https://tripplanner.ai\n`;

    return encodeURIComponent(message);
  };

  const shareViaWhatsApp = () => {
    const formattedMessage = formatItineraryForShare();
    window.open(`https://wa.me/?text=${formattedMessage}`, '_blank');
  };

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center animate-fadeIn">
        <div className="text-destructive mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2 text-destructive">{error}</h3>
        <Button 
          onClick={() => generateItinerary()} 
          className="mt-4"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your {travelPlan.numberOfDays}-Day Itinerary</h2>
          <p className="text-muted-foreground">
            {travelPlan.tripStyle.charAt(0).toUpperCase() + travelPlan.tripStyle.slice(1)} trip to {travelPlan.destination} 
            with a {travelPlan.budgetLevel} budget.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={shareViaWhatsApp}
        >
          <Share2 className="h-4 w-4" />
          Share via WhatsApp
        </Button>
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
                <ActivityCard key={`activity-${index}`} activity={activity} day={day} />
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
