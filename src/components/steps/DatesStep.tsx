import React from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, parse } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DatesStep: React.FC = () => {
  const { travelPlan, updateDates } = useTravelPlan();
  
  const dateRange: DateRange | undefined = travelPlan.startDate && travelPlan.endDate
    ? {
        from: travelPlan.startDate,
        to: travelPlan.endDate
      }
    : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      updateDates(
        range.from,
        range.to || range.from,
        travelPlan.arrivalTime,
        travelPlan.departureTime
      );
    } else {
      updateDates(undefined, undefined, undefined, undefined);
    }
  };

  const handleArrivalTimeChange = (time: string) => {
    updateDates(
      travelPlan.startDate,
      travelPlan.endDate,
      time,
      travelPlan.departureTime
    );
  };

  const handleDepartureTimeChange = (time: string) => {
    updateDates(
      travelPlan.startDate,
      travelPlan.endDate,
      travelPlan.arrivalTime,
      time
    );
  };
  
  const today = new Date();

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">When will you travel?</h2>
        <p className="text-muted-foreground">Select your travel dates and times for {travelPlan.destination || "your trip"}.</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    <span className="ml-2 text-muted-foreground">
                      ({travelPlan.numberOfDays} {travelPlan.numberOfDays === 1 ? 'day' : 'days'})
                    </span>
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                'Select dates'
              )}
            </span>
          </div>
        </div>
        
        {dateRange?.from && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">Arrival Time</span>
              </div>
              <Select
                value={travelPlan.arrivalTime || ""}
                onValueChange={handleArrivalTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select arrival time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`arrival-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm font-medium">Departure Time</span>
              </div>
              <Select
                value={travelPlan.departureTime || ""}
                onValueChange={handleDepartureTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select departure time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`departure-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="flex justify-center p-2 rounded-lg border bg-card">
          <Calendar
            mode="range"
            defaultMonth={today}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            disabled={{ before: today }}
            className="rounded-md border-0 pointer-events-auto"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Quick select:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDateRangeChange({ 
                from: addDays(today, 7), 
                to: addDays(today, 10) 
              })}
              className="px-3 py-1 text-sm bg-secondary rounded-md transition-colors hover:bg-secondary/80"
            >
              Weekend Getaway (4 days)
            </button>
            <button
              onClick={() => handleDateRangeChange({ 
                from: addDays(today, 14), 
                to: addDays(today, 20) 
              })}
              className="px-3 py-1 text-sm bg-secondary rounded-md transition-colors hover:bg-secondary/80"
            >
              Week Trip (7 days)
            </button>
            <button
              onClick={() => handleDateRangeChange({ 
                from: addDays(today, 30), 
                to: addDays(today, 43) 
              })}
              className="px-3 py-1 text-sm bg-secondary rounded-md transition-colors hover:bg-secondary/80"
            >
              2 Week Vacation (14 days)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesStep;
