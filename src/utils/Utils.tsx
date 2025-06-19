/**
 * Checks if a string is null, undefined, or empty
 * @param str - String to check
 * @returns true if string is null, undefined, or empty
 */
export const isEmpty = (str: string | null | undefined): boolean => 
    str === null || str === undefined || str.trim() === '';

/**
 * Generates a unique ID using timestamp and random number
 * @returns string - Unique identifier
 */
export const generateId = (): string => 
    `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;