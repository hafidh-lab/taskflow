import { format, isToday, isTomorrow, addDays, isThisWeek, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE, h:mm a'); // e.g. "Monday, 2:30 PM"
  }
  
  return format(dateObj, 'MMM d, yyyy h:mm a'); // e.g. "May 25, 2023 2:30 PM"
}

export function formatDateShort(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d');
}

export function formatTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'h:mm a');
}

export function formatDateForInput(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'yyyy-MM-dd');
}

export function formatTimeForInput(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'HH:mm');
}

export function formatRelativeTime(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getTodayDateWithoutTime(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getTomorrowDateWithoutTime(): Date {
  return addDays(getTodayDateWithoutTime(), 1);
}

export function getNextWeekDateWithoutTime(): Date {
  return addDays(getTodayDateWithoutTime(), 7);
}

export function getDateWithTime(date: Date, hours: number, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

export function combineDateAndTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
}
