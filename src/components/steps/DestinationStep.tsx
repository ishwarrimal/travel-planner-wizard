
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { DestinationService } from '@/services/DestinationService';
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

interface Destination {
  id: string;
  name: string;
  country: string;
  full: string;
}

const DestinationStep: React.FC = () => {
  const { travelPlan, updateDestination } = useTravelPlan();
  const [inputValue, setInputValue] = useState(travelPlan.destination);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchTerm = useRef<string>('');
  
  // Popular destinations for quick selection
  const popularDestinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'Rome, Italy',
    'Bali, Indonesia',
    'Barcelona, Spain',
  ];

  const handleSelectDestination = (destination: string) => {
    setInputValue(destination);
    updateDestination(destination);
    setOpen(false);
    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    currentSearchTerm.current = value;
    
    // Cancel any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Only search if input has 3 or more characters
    if (value.length >= 3) {
      setIsSearching(true);
      
      // Throttle API calls with a 300ms delay
      searchTimeoutRef.current = setTimeout(() => {
        // Only proceed if this is still the current search term
        if (value === currentSearchTerm.current) {
          searchDestinations(value);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const searchDestinations = async (query: string) => {
    // Store this search term to compare when results return
    const searchTerm = query;
    
    try {
      const results = await DestinationService.searchDestinations(query);
      
      // Only update results if this is still the current search term
      if (searchTerm === currentSearchTerm.current) {
        setSearchResults(results);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error searching destinations:", error);
      // Only show toast if this is still the current search
      if (searchTerm === currentSearchTerm.current) {
        toast({
          title: "Search failed",
          description: "Could not search destinations. Please try again later.",
          variant: "destructive"
        });
        setSearchResults([]);
        setIsSearching(false);
      }
    }
  };

  // Update destination in travel plan when input is committed
  const handleInputCommit = () => {
    if (inputValue) {
      updateDestination(inputValue);
    }
  };

  // Cancel any pending searches when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Where do you want to go?</h2>
        <p className="text-muted-foreground">
          Enter your dream destination for this trip.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="destination"
                placeholder="Enter a city, country, or region"
                className="pl-10 travel-input"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputCommit}
                onClick={() => inputValue.length >= 3 && setOpen(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandInput 
                placeholder="Search destinations..." 
                value={inputValue}
                onValueChange={handleInputChange}
              />
              <CommandList>
                {isSearching && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                  </div>
                )}
                {!isSearching && searchResults.length > 0 && (
                  <CommandGroup heading="Destinations">
                    {searchResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.full}
                        onSelect={() => handleSelectDestination(result.full)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{result.name}, <span className="text-muted-foreground">{result.country}</span></span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {!isSearching && inputValue.length >= 3 && searchResults.length === 0 && (
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">No destinations found</p>
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 pt-4">
        <Label>Popular destinations</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {popularDestinations.map((destination) => (
            <button
              key={destination}
              onClick={() => handleSelectDestination(destination)}
              className={`
                p-3 text-sm rounded-md transition-all 
                ${
                  inputValue === destination
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }
              `}
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationStep;
