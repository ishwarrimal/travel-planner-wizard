
interface Destination {
  id: string;
  name: string;
  country: string;
  full: string;
}

export class DestinationService {
  private static API_KEY = "dummy_destination_api_key"; // Replace with actual API key in production
  
  // This is a mock implementation. In production, you would call a real API
  static async searchDestinations(query: string): Promise<Destination[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Sample destinations data
    const allDestinations: Destination[] = [
      { id: '1', name: 'Paris', country: 'France', full: 'Paris, France' },
      { id: '2', name: 'Tokyo', country: 'Japan', full: 'Tokyo, Japan' },
      { id: '3', name: 'New York', country: 'USA', full: 'New York, USA' },
      { id: '4', name: 'Rome', country: 'Italy', full: 'Rome, Italy' },
      { id: '5', name: 'London', country: 'UK', full: 'London, UK' },
      { id: '6', name: 'Barcelona', country: 'Spain', full: 'Barcelona, Spain' },
      { id: '7', name: 'Amsterdam', country: 'Netherlands', full: 'Amsterdam, Netherlands' },
      { id: '8', name: 'Berlin', country: 'Germany', full: 'Berlin, Germany' },
      { id: '9', name: 'Prague', country: 'Czech Republic', full: 'Prague, Czech Republic' },
      { id: '10', name: 'Sydney', country: 'Australia', full: 'Sydney, Australia' },
      { id: '11', name: 'Bangkok', country: 'Thailand', full: 'Bangkok, Thailand' },
      { id: '12', name: 'Dubai', country: 'UAE', full: 'Dubai, UAE' },
      { id: '13', name: 'Singapore', country: 'Singapore', full: 'Singapore' },
      { id: '14', name: 'Istanbul', country: 'Turkey', full: 'Istanbul, Turkey' },
      { id: '15', name: 'Seoul', country: 'South Korea', full: 'Seoul, South Korea' },
      { id: '16', name: 'San Francisco', country: 'USA', full: 'San Francisco, USA' },
      { id: '17', name: 'Rio de Janeiro', country: 'Brazil', full: 'Rio de Janeiro, Brazil' },
      { id: '18', name: 'Cairo', country: 'Egypt', full: 'Cairo, Egypt' },
      { id: '19', name: 'Venice', country: 'Italy', full: 'Venice, Italy' },
      { id: '20', name: 'Kyoto', country: 'Japan', full: 'Kyoto, Japan' },
    ];
    
    // Filter destinations based on query
    const lowerQuery = query.toLowerCase();
    return allDestinations.filter(
      dest => dest.name.toLowerCase().includes(lowerQuery) || 
              dest.country.toLowerCase().includes(lowerQuery) ||
              dest.full.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 results
  }
}
