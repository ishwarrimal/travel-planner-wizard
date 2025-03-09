
import React from 'react';
import { TravelPlanProvider } from '@/contexts/TravelPlanContext';
import TravelPlanner from '@/components/TravelPlanner';
import { Plane, MapPin, Calendar, CircleDollarSign } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-travel-pattern py-16 px-4">
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
          Plan Your Perfect Trip
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp">
          Answer a few questions and get a personalized day-by-day itinerary for your next adventure.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <FeatureCard 
            icon={<MapPin className="h-6 w-6 text-travel-blue" />}
            title="Select Destination"
            description="Choose from popular destinations or enter your dream location"
          />
          <FeatureCard 
            icon={<Calendar className="h-6 w-6 text-travel-green" />}
            title="Pick Dates"
            description="Set your travel timeline from a day to multiple weeks"
          />
          <FeatureCard 
            icon={<Plane className="h-6 w-6 text-travel-purple" />}
            title="Trip Style"
            description="Adventure, leisure, romance, culture or family-friendly"
          />
          <FeatureCard 
            icon={<CircleDollarSign className="h-6 w-6 text-travel-orange" />}
            title="Budget Level"
            description="Options for every budget from affordable to luxury"
          />
        </div>
      </div>
      
      <TravelPlanProvider>
        <TravelPlanner />
      </TravelPlanProvider>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="travel-card p-5 animate-fadeIn">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
