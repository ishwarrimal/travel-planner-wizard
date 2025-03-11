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
  private static API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  private static API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
  
  static async generateItinerary(travelDetails: {
    destination: string;
    numberOfDays: number;
    tripStyle: string;
    budgetLevel: string;
    startDate: Date;
    endDate: Date;
    arrivalTime?: string;
    departureTime?: string;
    interests: string[];
  }) {
    try {
      const systemPrompt = `You are a knowledgeable travel assistant that creates detailed travel itineraries. 
      Make recommendations based on the location, duration, trip style, and budget level.
      Consider arrival and departure times when planning the first and last day activities.
      Let me know in semi-detail what each day and within the day what each activity will look like, but don't exhaust the response limit and don't break the json.
      For ultra_budget options, prioritize cost-saving over time (e.g., public transport, longer routes).
      For smart_budget options, balance cost with time efficiency (e.g., budget flights when time-saving).
      Also recommend local cuisines, activities, approximate cost, etc.
      Please ensure the JSON response is complete and properly formatted. The response should end with proper closing brackets for all objects and arrays.
      Structure your response as a JSON object that follows this exact format:
      [Note]: Please ensure your response is a valid JSON object with this exact structure:
      {
        "itinerary": [
          {
            "day": 1,
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "time": "HH:mm",
                "title": "Activity Title",
                "description": "Detailed description",
                "location": "Location name",
                "cost": "10$", "120$", 
                "category": "food", "activity", "transportation-train", "transportation-flight", "transportation-cab", "transportation-bus", "accommodation", or "free-time",
              }
            ]
          }
        ]
      }
      Do not include any additional text or markdown formatting.`;

      const arrivalInfo = travelDetails.arrivalTime 
        ? `Arrival on the first day is at ${travelDetails.arrivalTime}.` 
        : '';
      const departureInfo = travelDetails.departureTime 
        ? `Departure on the last day is at ${travelDetails.departureTime}.` 
        : '';

      const userPrompt = `Create a detailed ${travelDetails.numberOfDays}-day itinerary for a ${travelDetails.tripStyle} trip to ${travelDetails.destination} with a ${travelDetails.budgetLevel} budget. 
      The trip starts on ${travelDetails.startDate.toISOString().split('T')[0]} and ends on ${travelDetails.endDate.toISOString().split('T')[0]}. 
      ${arrivalInfo} ${departureInfo}
      ${travelDetails.interests.length > 0 ? `The traveler is interested in: ${travelDetails.interests.join(', ')}.` : ''}
      ${travelDetails.budgetLevel === 'ultra_budget' ? 'Please prioritize cost-saving options over time efficiency.' : ''}
      ${travelDetails.budgetLevel === 'smart_budget' ? 'Please balance cost with time efficiency, choosing budget-friendly but time-saving options when reasonable.' : ''}`;

      const requestData: GeminiCompletionRequest = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
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
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Failed to parse itinerary JSON from response");
      }
      const parsedItinerary = JSON.parse(jsonMatch[1]);
      return parsedItinerary; 
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to generate itinerary");
    }
  }
}
