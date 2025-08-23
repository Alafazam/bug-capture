import Papa from 'papaparse';
import { groupBy, debounce, throttle } from 'lodash';

/**
 * Process CSV file and return parsed data
 */
export const processCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
};

/**
 * Export data to CSV and download
 */
export const exportToCSV = (data: any[], filename: string = 'export.csv'): void => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Group array by a specific key
 */
export const groupByKey = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return groupBy(array, key);
};

/**
 * Sort array by multiple criteria
 */
export const sortByMultiple = <T>(
  array: T[],
  criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, direction } of criteria) {
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Filter array by multiple conditions
 */
export const filterByMultiple = <T>(
  array: T[],
  filters: Array<{ key: keyof T; value: any; operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' }>
): T[] => {
  return array.filter((item) => {
    return filters.every(({ key, value, operator = 'equals' }) => {
      const itemValue = item[key];
      
      switch (operator) {
        case 'equals':
          return itemValue === value;
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        case 'startsWith':
          return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
        case 'endsWith':
          return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
        default:
          return itemValue === value;
      }
    });
  });
};

/**
 * Paginate array
 */
export const paginateArray = <T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Debounced function wrapper
 */
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  return debounce(func, delay) as T;
};

/**
 * Throttled function wrapper
 */
export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  return throttle(func, delay) as T;
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merge objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)));
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  return params.toString();
};

/**
 * Parse query string to object
 */
export const queryStringToObject = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};
  
  params.forEach((value, key) => {
    obj[key] = value;
  });
  
  return obj;
};

/**
 * Flatten nested object
 */
export const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);
};
