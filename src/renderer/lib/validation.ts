import { COMMON_PRIMES } from './constants';

/**
 * Validates if a string contains only alphabetic characters
 */
export const isAlphabetic = (text: string): boolean => {
  return /^[A-Za-z]+$/.test(text);
};

/**
 * Validates if a number is prime
 */
export const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

/**
 * Validates if a string can be parsed as a valid integer
 */
export const isValidInteger = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && isFinite(num) && num.toString() === value.trim();
};

/**
 * Validates if a string can be parsed as valid JSON
 */
export const isValidJSON = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates Playfair key
 */
export const validatePlayfairKey = (key: string): { isValid: boolean; error?: string } => {
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: 'Key must be a non-empty string' };
  }

  const trimmedKey = key.trim();
  if (trimmedKey.length === 0) {
    return { isValid: false, error: 'Key cannot be empty' };
  }

  if (!isAlphabetic(trimmedKey.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Key must contain only alphabetic characters' };
  }

  return { isValid: true };
};

/**
 * Validates RSA parameters
 */
export const validateRSAParams = (pStr: string, qStr: string): { isValid: boolean; error?: string } => {
  if (!isValidInteger(pStr) || !isValidInteger(qStr)) {
    return { isValid: false, error: 'P and Q must be valid integers' };
  }

  const p = parseInt(pStr, 10);
  const q = parseInt(qStr, 10);

  if (p <= 1 || q <= 1) {
    return { isValid: false, error: 'P and Q must be greater than 1' };
  }

  if (!isPrime(p) || !isPrime(q)) {
    return { isValid: false, error: 'P and Q must be prime numbers' };
  }

  if (p === q) {
    return { isValid: false, error: 'P and Q must be different values' };
  }

  if (p * q < 256) {
    return { isValid: false, error: 'Product of P and Q should be at least 256 for practical use' };
  }

  return { isValid: true };
};

/**
 * Validates input text for encryption/decryption
 */
export const validateInputText = (text: string, method: 'playfair' | 'rsa', mode: 'encrypt' | 'decrypt'): { isValid: boolean; error?: string } => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Input text cannot be empty' };
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return { isValid: false, error: 'Input text cannot be empty' };
  }

  if (method === 'playfair') {
    if (mode === 'encrypt' && !isAlphabetic(trimmedText.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Playfair encryption requires only alphabetic characters' };
    }
  } else if (method === 'rsa') {
    if (mode === 'decrypt' && !isValidJSON(trimmedText)) {
      return { isValid: false, error: 'RSA decryption requires valid JSON array format' };
    }
  }

  return { isValid: true };
};

/**
 * Suggests common primes for RSA
 */
export const suggestPrimes = (excludeValues: number[] = []): number[] => {
  return COMMON_PRIMES.filter(prime => !excludeValues.includes(prime)).slice(0, 10);
};
