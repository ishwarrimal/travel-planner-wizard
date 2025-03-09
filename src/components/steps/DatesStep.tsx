
import React from 'react';
import { useTravelPlan } from '@/contexts/TravelPlanContext';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, isBefore } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

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
      updateDates(range.from, range.to || range.from);
    } else {
      updateDates(undefined, undefined);
    }
  };
  
  const today = new Date();
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">When will you travel?</h2>
        <p className="text-muted-foreground">Select your travel dates for {travelPlan.destination || "your trip"}.</p>
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
