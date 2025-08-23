import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

// Date formatting options
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  RELATIVE: 'relative',
  DISTANCE: 'distance',
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

/**
 * Format a date using various formats
 */
export const formatDate = (
  date: Date | string | number,
  formatType: DateFormat = 'SHORT'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  switch (formatType) {
    case 'SHORT':
      return format(dateObj, DATE_FORMATS.SHORT);
    case 'LONG':
      return format(dateObj, DATE_FORMATS.LONG);
    case 'TIME':
      return format(dateObj, DATE_FORMATS.TIME);
    case 'DATETIME':
      return format(dateObj, DATE_FORMATS.DATETIME);
    case 'ISO':
      return format(dateObj, DATE_FORMATS.ISO);
    case 'RELATIVE':
      return formatRelative(dateObj, new Date());
    case 'DISTANCE':
      return formatDistance(dateObj, new Date(), { addSuffix: true });
    default:
      return format(dateObj, DATE_FORMATS.SHORT);
  }
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date);
};

/**
 * Get the start of a day
 */
export const startOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a day
 */
export const endOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get the start of a week
 */
export const startOfWeek = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day;
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a week
 */
export const endOfWeek = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + 6;
  newDate.setDate(diff);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get the start of a month
 */
export const startOfMonth = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a month
 */
export const endOfMonth = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1, 0);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = subtractDays(new Date(), 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Get age from birth date
 */
export const getAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get time ago in a human-readable format
 */
export const getTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Parse a date string and return a Date object
 */
export const parseDate = (dateString: string): Date | null => {
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
};
