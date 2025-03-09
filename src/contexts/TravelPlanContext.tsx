
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TripStyle = 'adventure' | 'leisure' | 'romance' | 'culture' | 'family';
export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export interface TravelPlan {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  numberOfDays: number;
  tripStyle: TripStyle;
  budgetLevel: BudgetLevel;
  interests: string[];
  itinerary: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  date: Date;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  location?: string;
  cost?: string;
  category?: 'food' | 'activity' | 'transportation' | 'accommodation' | 'free-time';
}

interface TravelPlanContextType {
  travelPlan: TravelPlan;
  updateDestination: (destination: string) => void;
  updateDates: (startDate: Date | undefined, endDate: Date | undefined) => void;
  updateTripStyle: (style: TripStyle) => void;
  updateBudgetLevel: (level: BudgetLevel) => void;
  updateInterests: (interests: string[]) => void;
  generateItinerary: () => void;
  isGenerating: boolean;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canProceed: boolean;
}

const defaultTravelPlan: TravelPlan = {
  destination: '',
  startDate: undefined,
  endDate: undefined,
  numberOfDays: 0,
  tripStyle: 'leisure',
  budgetLevel: 'moderate',
  interests: [],
  itinerary: [],
};

const TravelPlanContext = createContext<TravelPlanContextType | undefined>(undefined);

export const TravelPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan>(defaultTravelPlan);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);

  const updateDestination = (destination: string) => {
    setTravelPlan(prev => ({ ...prev, destination }));
  };

  const updateDates = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (startDate && endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setTravelPlan(prev => ({ 
        ...prev, 
        startDate, 
        endDate, 
        numberOfDays: daysDiff 
      }));
    } else {
      setTravelPlan(prev => ({ 
        ...prev, 
        startDate, 
        endDate,
        numberOfDays: 0
      }));
    }
  };

  const updateTripStyle = (tripStyle: TripStyle) => {
    setTravelPlan(prev => ({ ...prev, tripStyle }));
  };

  const updateBudgetLevel = (budgetLevel: BudgetLevel) => {
    setTravelPlan(prev => ({ ...prev, budgetLevel }));
  };

  const updateInterests = (interests: string[]) => {
    setTravelPlan(prev => ({ ...prev, interests }));
  };

  // Mock function to generate a sample itinerary
  const generateItinerary = () => {
    if (!travelPlan.startDate || !travelPlan.endDate) return;
    
    setIsGenerating(true);

    setTimeout(() => {
      const itinerary: ItineraryDay[] = [];
      
      const currentDate = new Date(travelPlan.startDate);
      const endDate = new Date(travelPlan.endDate);
      
      let dayCount = 1;
      
      while (currentDate <= endDate) {
        const activities: ItineraryActivity[] = [];
        
        // Morning activities
        activities.push({
          time: '08:00 AM',
          title: 'Breakfast',
          description: travelPlan.budgetLevel === 'luxury' 
            ? 'Gourmet breakfast at your hotel.' 
            : 'Breakfast at a local café.',
          category: 'food'
        });
        
        if (travelPlan.tripStyle === 'adventure') {
          activities.push({
            time: '09:30 AM',
            title: 'Outdoor Adventure',
            description: 'Hiking tour of local trails with stunning views.',
            location: 'Mountain Trails',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : travelPlan.budgetLevel === 'moderate' ? '$$' : '$$$',
            category: 'activity'
          });
        } else if (travelPlan.tripStyle === 'leisure') {
          activities.push({
            time: '10:00 AM',
            title: 'Relaxation Time',
            description: 'Spa session or beach relaxation.',
            location: travelPlan.budgetLevel === 'luxury' ? 'Premium Spa' : 'Local Beach',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : travelPlan.budgetLevel === 'moderate' ? '$$' : '$$$',
            category: 'activity'
          });
        } else if (travelPlan.tripStyle === 'romance') {
          activities.push({
            time: '10:00 AM',
            title: 'Couples Activity',
            description: 'Romantic walk through scenic areas of ' + travelPlan.destination,
            location: 'Scenic Areas',
            cost: '$',
            category: 'activity'
          });
        } else if (travelPlan.tripStyle === 'culture') {
          activities.push({
            time: '09:30 AM',
            title: 'Cultural Exploration',
            description: 'Visit to local museum or historical site.',
            location: travelPlan.destination + ' Museum',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : '$$',
            category: 'activity'
          });
        } else {
          activities.push({
            time: '09:30 AM',
            title: 'Family Fun',
            description: 'Visit to a family-friendly attraction.',
            location: 'Local Theme Park',
            cost: travelPlan.budgetLevel === 'budget' ? '$$' : '$$$',
            category: 'activity'
          });
        }
        
        // Lunch
        activities.push({
          time: '12:30 PM',
          title: 'Lunch',
          description: travelPlan.budgetLevel === 'budget' 
            ? 'Quick lunch at a local eatery.' 
            : 'Lunch at a popular restaurant.',
          location: 'Local Restaurant',
          cost: travelPlan.budgetLevel === 'budget' ? '$' : travelPlan.budgetLevel === 'moderate' ? '$$' : '$$$',
          category: 'food'
        });
        
        // Afternoon activities based on trip style
        if (travelPlan.tripStyle === 'adventure') {
          activities.push({
            time: '02:00 PM',
            title: 'Adventure Activity',
            description: 'Water sports or mountain biking.',
            location: 'Adventure Center',
            cost: travelPlan.budgetLevel === 'budget' ? '$$' : '$$$',
            category: 'activity'
          });
        } else if (travelPlan.tripStyle === 'leisure') {
          activities.push({
            time: '02:00 PM',
            title: 'Leisure Activity',
            description: 'Shopping or lounging by the pool.',
            location: travelPlan.budgetLevel === 'luxury' ? 'Premium Shopping Mall' : 'Local Market',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : '$$',
            category: 'activity'
          });
        } else {
          activities.push({
            time: '02:00 PM',
            title: 'Exploration Time',
            description: 'Guided tour of ' + travelPlan.destination + '\'s highlights.',
            location: 'City Center',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : '$$',
            category: 'activity'
          });
        }
        
        // Free time
        activities.push({
          time: '04:30 PM',
          title: 'Free Time',
          description: 'Rest or explore on your own.',
          category: 'free-time'
        });
        
        // Dinner
        activities.push({
          time: '07:00 PM',
          title: 'Dinner',
          description: travelPlan.budgetLevel === 'luxury' 
            ? 'Fine dining experience.' 
            : travelPlan.budgetLevel === 'moderate'
              ? 'Dinner at a well-reviewed restaurant.'
              : 'Affordable dinner at a local spot.',
          location: 'Restaurant',
          cost: travelPlan.budgetLevel === 'budget' ? '$' : travelPlan.budgetLevel === 'moderate' ? '$$' : '$$$',
          category: 'food'
        });
        
        // Evening activities
        if (travelPlan.tripStyle === 'romance') {
          activities.push({
            time: '09:00 PM',
            title: 'Romantic Evening',
            description: 'Sunset walk or drinks with a view.',
            location: 'Scenic Viewpoint',
            cost: travelPlan.budgetLevel === 'budget' ? '$' : '$$',
            category: 'activity'
          });
        } else if (dayCount % 2 === 0) { // Every other day
          activities.push({
            time: '09:00 PM',
            title: 'Evening Entertainment',
            description: 'Local show or entertainment.',
            location: 'Entertainment Venue',
            cost: travelPlan.budgetLevel === 'budget' ? '$$' : '$$$',
            category: 'activity'
          });
        }
        
        itinerary.push({
          day: dayCount,
          date: new Date(currentDate),
          activities
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }
      
      setTravelPlan(prev => ({ ...prev, itinerary }));
      setIsGenerating(false);
    }, 1500); // Simulate API delay
  };

  const nextStep = () => {
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 0));
  };

  const goToStep = (step: number) => {
    setStep(step);
  };

  // Logic to determine if user can proceed to next step
  const canProceed = (() => {
    switch (step) {
      case 0: // Destination step
        return !!travelPlan.destination;
      case 1: // Dates step
        return !!travelPlan.startDate && !!travelPlan.endDate;
      case 2: // Trip style step
        return !!travelPlan.tripStyle;
      case 3: // Budget level step
        return !!travelPlan.budgetLevel;
      default:
        return true;
    }
  })();

  return (
    <TravelPlanContext.Provider
      value={{
        travelPlan,
        updateDestination,
        updateDates,
        updateTripStyle,
        updateBudgetLevel,
        updateInterests,
        generateItinerary,
        isGenerating,
        step,
        nextStep,
        prevStep,
        goToStep,
        canProceed
      }}
    >
      {children}
    </TravelPlanContext.Provider>
  );
};

export const useTravelPlan = () => {
  const context = useContext(TravelPlanContext);
  if (context === undefined) {
    throw new Error('useTravelPlan must be used within a TravelPlanProvider');
  }
  return context;
};
