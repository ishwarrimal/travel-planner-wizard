
import { format, differenceInDays, addDays } from 'date-fns';

export const calculateDuration = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate) + 1;
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  if (startDate.getTime() === endDate.getTime()) {
    return format(startDate, 'MMMM d, yyyy');
  }
  
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${format(startDate, 'MMMM d')} - ${format(endDate, 'd, yyyy')}`;
  }
  
  return `${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d, yyyy')}`;
};

export const generateDateArray = (startDate: Date, numberOfDays: number): Date[] => {
  const dateArray: Date[] = [];
  
  for (let i = 0; i < numberOfDays; i++) {
    dateArray.push(addDays(startDate, i));
  }
  
  return dateArray;
};
