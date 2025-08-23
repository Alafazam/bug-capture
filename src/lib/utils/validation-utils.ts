import { z } from 'zod';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate file type
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const validateFileSize = (
  file: File,
  maxSizeInBytes: number
): boolean => {
  return file.size <= maxSizeInBytes;
};

/**
 * Validate file with schema
 */
export const validateFile = (
  file: File,
  schema: z.ZodSchema<any>
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(file);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors.map(e => e.message).join(', '),
      };
    }
    return {
      isValid: false,
      error: 'File validation failed',
    };
  }
};

/**
 * Sanitize HTML input
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize text input (remove HTML tags)
 */
export const sanitizeText = (input: string): string => {
  return input.replace(/<[^>]*>/g, '');
};

/**
 * Remove special characters from input
 */
export const removeSpecialChars = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9\s]/g, '');
};

/**
 * Validate and sanitize input
 */
export const validateAndSanitizeInput = (
  input: string,
  options: {
    maxLength?: number;
    minLength?: number;
    allowHtml?: boolean;
    allowSpecialChars?: boolean;
  } = {}
): { isValid: boolean; sanitized: string; error?: string } => {
  const {
    maxLength = 1000,
    minLength = 0,
    allowHtml = false,
    allowSpecialChars = true,
  } = options;

  let sanitized = input.trim();

  // Length validation
  if (sanitized.length < minLength) {
    return {
      isValid: false,
      sanitized,
      error: `Input must be at least ${minLength} characters long`,
    };
  }

  if (sanitized.length > maxLength) {
    return {
      isValid: false,
      sanitized,
      error: `Input must be no more than ${maxLength} characters long`,
    };
  }

  // HTML sanitization
  if (!allowHtml) {
    sanitized = sanitizeHtml(sanitized);
  }

  // Special characters sanitization
  if (!allowSpecialChars) {
    sanitized = removeSpecialChars(sanitized);
  }

  return {
    isValid: true,
    sanitized,
  };
};

/**
 * Validate credit card number (Luhn algorithm)
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate social security number
 */
export const validateSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/\D/g, '');
  return cleaned.length === 9;
};

/**
 * Validate postal code (US format)
 */
export const validatePostalCode = (postalCode: string): boolean => {
  const postalRegex = /^\d{5}(-\d{4})?$/;
  return postalRegex.test(postalCode);
};

/**
 * Validate date format
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate date range
 */
export const validateDateRange = (
  startDate: string,
  endDate: string
): { isValid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format',
    };
  }

  if (start >= end) {
    return {
      isValid: false,
      error: 'Start date must be before end date',
    };
  }

  return { isValid: true };
};

/**
 * Create a debounced validation function
 */
export const createDebouncedValidator = <T>(
  validator: (value: T) => { isValid: boolean; error?: string },
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;

  return (value: T): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(validator(value));
      }, delay);
    });
  };
};

/**
 * Validate form data against schema
 */
export const validateFormData = <T>(
  data: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};
