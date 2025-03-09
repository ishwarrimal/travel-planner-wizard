
interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenCompletionRequest {
  model: string;
  messages: QwenMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

interface QwenCompletionResponse {
  id: string;
  choices: {
    message: QwenMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class QwenService {
  private static API_KEY = "dummy_qwen_api_key"; // Replace with actual API key in production
  private static API_URL = "https://api.qwen.ai/v1/chat/completions";
  
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

      const requestData: QwenCompletionRequest = {
        model: "qwen2.5-72b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        top_p: 0.95
      };

      console.log("Sending request to Qwen API:", requestData);

      // Simulate API call for now
      // In production, this would be a real fetch call:
      // const response = await fetch(this.API_URL, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${this.API_KEY}`
      //   },
      //   body: JSON.stringify(requestData)
      // });
      // const data = await response.json();

      // Instead, simulate a response for development
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Create a sample response based on the travel details
      return this.createSampleItinerary(travelDetails);
    } catch (error) {
      console.error("Error calling Qwen API:", error);
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
