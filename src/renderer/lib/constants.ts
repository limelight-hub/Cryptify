// Encryption methods
export const ENCRYPTION_METHODS = {
  PLAYFAIR: 'playfair',
  RSA: 'rsa',
} as const;

export type EncryptionMethod = typeof ENCRYPTION_METHODS[keyof typeof ENCRYPTION_METHODS];

// Operation modes
export const OPERATION_MODES = {
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt',
} as const;

export type OperationMode = typeof OPERATION_MODES[keyof typeof OPERATION_MODES];

// Default RSA values
export const DEFAULT_RSA_PRIMES = {
  P: '17',
  Q: '11',
} as const;

// Common prime numbers for RSA
export const COMMON_PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317
];

// File types
export const SUPPORTED_FILE_TYPES = {
  JSON: '.json',
  TEXT: '.txt',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  PROCESS: 'Ctrl+Enter',
  COPY: 'Ctrl+Shift+C',
  CLEAR: 'Ctrl+R',
  TOGGLE_THEME: 'Ctrl+T',
  METHOD_PLAYFAIR: 'Ctrl+1',
  METHOD_RSA: 'Ctrl+2',
} as const;

// App metadata
export const APP_INFO = {
  NAME: 'Cryptify',
  DESCRIPTION: 'Desktop encryption toolkit supporting Playfair and RSA algorithms',
  VERSION: '1.0.0',
  AUTHOR: 'artemsemenchenko',
} as const;
