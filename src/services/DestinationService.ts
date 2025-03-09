
interface Destination {
  id: string;
  name: string;
  country: string;
  full: string;
}

export class DestinationService {
  private static BASE_URL = "https://nominatim.openstreetmap.org/search";
  
  static async searchDestinations(query: string): Promise<Destination[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    try {
      // Build the API request URL with parameters
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '8',
        'accept-language': 'en',
      });
      
      const url = `${this.BASE_URL}?${params.toString()}`;
      
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Fetch data from the API
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TravelPlannerApp/1.0',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API response into our Destination format
      const destinations: Destination[] = data.map((item: any, index: number) => {
        // Extract the city/town name from the display name
        const nameParts = item.display_name.split(',');
        const name = nameParts[0].trim();
        
        // Get the country from address data if available
        const country = item.address?.country || nameParts[nameParts.length - 1].trim();
        
        return {
          id: item.place_id || index.toString(),
          name: name,
          country: country,
          full: `${name}, ${country}`
        };
      });
      
      return destinations;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      
      // Fallback to some sample data in case of API failure
      const fallbackDestinations: Destination[] = [
        { id: '1', name: 'Paris', country: 'France', full: 'Paris, France' },
        { id: '2', name: 'Tokyo', country: 'Japan', full: 'Tokyo, Japan' },
        { id: '3', name: 'New York', country: 'USA', full: 'New York, USA' },
        { id: '4', name: 'Rome', country: 'Italy', full: 'Rome, Italy' },
      ];
      
      // Filter the fallback data with the query
      const lowerQuery = query.toLowerCase();
      return fallbackDestinations.filter(
        dest => dest.name.toLowerCase().includes(lowerQuery) || 
                dest.country.toLowerCase().includes(lowerQuery) ||
                dest.full.toLowerCase().includes(lowerQuery)
      );
    }
  }
}
