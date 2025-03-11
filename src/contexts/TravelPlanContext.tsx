import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeminiService } from '@/services/GeminiService';

export type TripStyle = 'sightseeing' | 'adventure' | 'nature' | 'beach' | 'culture' | 'food' | 'wine' | 'shopping' | 'luxury' | 'camping' | 'wellness' | 'romance' | 'family' | 'budget';
export type BudgetLevel = 'ultra_budget' | 'smart_budget' | 'moderate' | 'luxury';

export interface TravelPlan {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  arrivalTime?: string;
  departureTime?: string;
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
  updateDates: (
    startDate: Date | undefined, 
    endDate: Date | undefined,
    arrivalTime?: string,
    departureTime?: string
  ) => void;
  updateTripStyle: (style: TripStyle) => void;
  updateBudgetLevel: (level: BudgetLevel) => void;
  updateInterests: (interests: string[]) => void;
  generateItinerary: () => void;
  isGenerating: boolean;
  error: string | null;
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
  arrivalTime: undefined,
  departureTime: undefined,
  numberOfDays: 0,
  tripStyle: 'sightseeing',
  budgetLevel: 'moderate',
  interests: [],
  itinerary: [],
};

const TravelPlanContext = createContext<TravelPlanContextType | undefined>(undefined);

export const TravelPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan>(defaultTravelPlan);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const updateDestination = (destination: string) => {
    setTravelPlan(prev => ({ ...prev, destination }));
  };

  const updateDates = (
    startDate: Date | undefined, 
    endDate: Date | undefined,
    arrivalTime?: string,
    departureTime?: string
  ) => {
    if (startDate && endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setTravelPlan(prev => ({ 
        ...prev, 
        startDate, 
        endDate, 
        arrivalTime,
        departureTime,
        numberOfDays: daysDiff 
      }));
    } else {
      setTravelPlan(prev => ({ 
        ...prev, 
        startDate, 
        endDate,
        arrivalTime: undefined,
        departureTime: undefined,
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

  const generateItinerary = async () => {
    if (!travelPlan.startDate || !travelPlan.endDate) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const result = await GeminiService.generateItinerary({
        destination: travelPlan.destination,
        numberOfDays: travelPlan.numberOfDays,
        tripStyle: travelPlan.tripStyle,
        budgetLevel: travelPlan.budgetLevel,
        startDate: travelPlan.startDate,
        endDate: travelPlan.endDate,
        arrivalTime: travelPlan.arrivalTime,
        departureTime: travelPlan.departureTime,
        interests: travelPlan.interests
      });
      
      if (result && result.itinerary) {
        const processedItinerary = result.itinerary.map(day => ({
          ...day,
          date: day.date instanceof Date ? day.date : new Date(day.date)
        }));
        
        setTravelPlan(prev => ({ ...prev, itinerary: processedItinerary }));
      } else {
        setError('Failed to generate itinerary. Please try again.');
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setError('An error occurred while generating your itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  const canProceed = (() => {
    switch (step) {
      case 0:
        return !!travelPlan.destination;
      case 1:
        return !!travelPlan.startDate && !!travelPlan.endDate;
      case 2:
        return !!travelPlan.tripStyle;
      case 3:
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
        error,
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
