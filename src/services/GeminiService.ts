
interface GeminiMessage {
  role: 'user' | 'model' | 'system';
  parts: {
    text: string;
  }[];
}

interface GeminiCompletionRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiCompletionResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
}

export class GeminiService {
  private static API_KEY = "dummy_gemini_api_key"; // Replace with actual API key in production
  private static API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
  
  static async generateItinerary(travelDetails: {
    destination: string;
    numberOfDays: number;
    tripStyle: string;
    budgetLevel: string;
    startDate: Date;
    endDate: Date;
    interests: string[];
  }) {
    try {
      const systemPrompt = `You are a knowledgeable travel assistant that creates detailed travel itineraries. 
      Make recommendations based on the location, duration, trip style, and budget level.
      Structure your response as a JSON object that follows this exact format:
      {
        "itinerary": [
          {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "time": "08:00 AM",
                "title": "Activity Title",
                "description": "Detailed description",
                "location": "Location name",
                "cost": "$" (budget), "$$" (moderate), or "$$$" (luxury),
                "category": "food", "activity", "transportation", "accommodation", or "free-time"
              }
            ]
          }
        ]
      }`;

      const userPrompt = `Create a detailed ${travelDetails.numberOfDays}-day itinerary for a ${travelDetails.tripStyle} trip to ${travelDetails.destination} with a ${travelDetails.budgetLevel} budget. The trip starts on ${travelDetails.startDate.toISOString().split('T')[0]} and ends on ${travelDetails.endDate.toISOString().split('T')[0]}.${travelDetails.interests.length > 0 ? ` The traveler is interested in: ${travelDetails.interests.join(', ')}.` : ''}`;

      const requestData: GeminiCompletionRequest = {
        contents: [
          {
            role: "system",
            parts: [{ text: systemPrompt }]
          },
          {
            role: "user",
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
          topP: 0.95
        }
      };

      console.log("Sending request to Gemini API:", requestData);

      // Simulate API call for now
      // In production, this would be a real fetch call:
      // const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(requestData)
      // });
      // const data = await response.json();

      // Instead, simulate a response for development
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Create a sample response based on the travel details
      return this.createSampleItinerary(travelDetails);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to generate itinerary");
    }
  }

  // Helper method to generate a sample itinerary without calling the API
  private static createSampleItinerary(travelDetails: {
    destination: string;
    numberOfDays: number;
    tripStyle: string;
    budgetLevel: string;
    startDate: Date;
    endDate: Date;
  }) {
    const itinerary = [];
    const currentDate = new Date(travelDetails.startDate);
    
    for (let day = 1; day <= travelDetails.numberOfDays; day++) {
      const activities = this.generateActivitiesForDay(day, travelDetails.tripStyle, travelDetails.budgetLevel, travelDetails.destination);
      
      itinerary.push({
        day,
        date: new Date(currentDate),
        activities
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { itinerary };
  }
  
  private static generateActivitiesForDay(day: number, tripStyle: string, budgetLevel: string, destination: string) {
    const activities = [];
    
    // Sample activities structure
    activities.push({
      time: "08:00 AM",
      title: "Breakfast",
      description: budgetLevel === "luxury" 
        ? `Gourmet breakfast at a top-rated restaurant in ${destination}` 
        : `Local breakfast at a charming café in ${destination}`,
      location: budgetLevel === "luxury" ? "Luxury Hotel Restaurant" : "Local Café",
      cost: budgetLevel === "budget" ? "$" : budgetLevel === "moderate" ? "$$" : "$$$",
      category: "food"
    });
    
    if (tripStyle === "adventure") {
      activities.push({
        time: "10:00 AM",
        title: `${destination} Outdoor Adventure`,
        description: `Exciting hiking experience through the beautiful landscapes of ${destination}.`,
        location: `${destination} Nature Reserve`,
        cost: budgetLevel === "budget" ? "$" : budgetLevel === "moderate" ? "$$" : "$$$",
        category: "activity"
      });
    } else if (tripStyle === "culture") {
      activities.push({
        time: "10:00 AM",
        title: `${destination} Cultural Tour`,
        description: `Guided tour of historical landmarks in ${destination}.`,
        location: `${destination} Old Town`,
        cost: budgetLevel === "budget" ? "$" : "$$",
        category: "activity"
      });
    } else {
      activities.push({
        time: "10:00 AM",
        title: `Explore ${destination}`,
        description: `Leisurely exploration of ${destination}'s main attractions.`,
        location: `${destination} City Center`,
        cost: "$",
        category: "activity"
      });
    }
    
    // Add more activities based on time of day
    activities.push({
      time: "01:00 PM",
      title: "Lunch",
      description: `Enjoy local cuisine at a ${budgetLevel} restaurant.`,
      location: `${destination} Eatery`,
      cost: budgetLevel === "budget" ? "$" : budgetLevel === "moderate" ? "$$" : "$$$",
      category: "food"
    });
    
    // Afternoon activity
    activities.push({
      time: "03:00 PM",
      title: day % 2 === 0 ? `${destination} Shopping` : `${destination} Sightseeing`,
      description: day % 2 === 0 
        ? `Shop for local crafts and souvenirs in ${destination}.` 
        : `Visit the famous landmarks of ${destination}.`,
      location: day % 2 === 0 ? `${destination} Market` : `${destination} Landmarks`,
      cost: budgetLevel === "budget" ? "$" : "$$",
      category: "activity"
    });
    
    // Evening
    activities.push({
      time: "07:00 PM",
      title: "Dinner",
      description: budgetLevel === "luxury" 
        ? `Fine dining experience at a top-rated restaurant in ${destination}.` 
        : `Dinner at a popular restaurant in ${destination}.`,
      location: `${destination} Restaurant`,
      cost: budgetLevel === "budget" ? "$" : budgetLevel === "moderate" ? "$$" : "$$$",
      category: "food"
    });
    
    if (tripStyle === "nightlife" || day % 3 === 0) {
      activities.push({
        time: "09:00 PM",
        title: `${destination} Nightlife`,
        description: `Experience the vibrant nightlife of ${destination}.`,
        location: `${destination} Entertainment District`,
        cost: budgetLevel === "budget" ? "$$" : "$$$",
        category: "activity"
      });
    }
    
    return activities;
  }
}
