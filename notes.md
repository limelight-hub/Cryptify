# Cryptify Codebase & Algorithm Breakdown

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture](#architecture)
3. [Cryptographic Algorithms](#cryptographic-algorithms)
4. [Component Breakdown](#component-breakdown)
5. [Custom Hooks](#custom-hooks)
6. [Data Flow](#data-flow)
7. [Performance Optimizations](#performance-optimizations)
8. [File Structure](#file-structure)

---

## 🎯 Application Overview

**Cryptify** is a desktop encryption toolkit built with Electron and React that implements two classical cryptographic algorithms:
- **Playfair Cipher** (Classical polyalphabetic substitution)
- **RSA Encryption** (Public-key cryptography)

### Core Features:
- Real-time encryption/decryption
- Dark/Light theme with persistence
- Performance monitoring
- File import/export
- Modern notification system
- Keyboard shortcuts
- Error boundaries and validation

---

## 🏗️ Architecture

### Technology Stack:
```
Frontend: React 19 + TypeScript
Desktop: Electron 35.1.2
Styling: Tailwind CSS + Radix UI
State Management: React Hooks + Context
Build Tool: Vite
Testing: Jest + Testing Library
```

### Architectural Patterns:
- **Component Composition**: Small, focused components
- **Custom Hooks**: Business logic separation
- **Context API**: Global state (theme)
- **Error Boundaries**: Graceful error handling
- **Performance Monitoring**: Real-time metrics

---

## 🔐 Cryptographic Algorithms

### 1. Playfair Cipher Algorithm

#### How It Works:
The Playfair cipher is a digraph substitution cipher that encrypts pairs of letters.

#### Step-by-Step Process:

**1. Key Preparation:**
```typescript
private prepareKey(key: string): string {
  // Convert to uppercase, remove non-letters, replace J with I
  return key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
}
```

**2. Matrix Generation:**
```typescript
private generateMatrix(): string[][] {
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J
  const keyUnique = Array.from(new Set(this.key + alphabet));

  // Create 5x5 matrix
  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(keyUnique.slice(i * 5, i * 5 + 5));
  }
  return matrix;
}
```

**3. Text Processing:**
```typescript
private processText(text: string): string[][] {
  const clean = this.prepareKey(text);
  const pairs: string[][] = [];

  for (let i = 0; i < clean.length; i += 2) {
    let a = clean[i];
    let b = clean[i + 1] || 'X'; // Pad with X if odd length
    if (a === b) b = 'X';       // Replace duplicate with X
    pairs.push([a, b]);
  }
  return pairs;
}
```

**4. Encryption Rules:**
```typescript
private transform(pairs: string[][], dir: number): string {
  let result = '';
  for (const [a, b] of pairs) {
    const posA = this.findPosition(a);
    const posB = this.findPosition(b);

    if (posA.row === posB.row) {
      // Same row: move right (encrypt) or left (decrypt)
      result += this.shiftChar(posA, dir, true);
      result += this.shiftChar(posB, dir, true);
    } else if (posA.col === posB.col) {
      // Same column: move down (encrypt) or up (decrypt)
      result += this.shiftChar(posA, dir, false);
      result += this.shiftChar(posB, dir, false);
    } else {
      // Rectangle: swap corners
      result += this.matrix[posA.row][posB.col];
      result += this.matrix[posB.row][posA.col];
    }
  }
  return result;
}
```

#### Example:
```
Key: "MONARCHY"
Matrix:
M O N A R
C H Y B D
E F G I K
L P Q S T
U V W X Z

Plain: "HELLO" → Pairs: [HE][LL][OX]
HE: Rectangle → GD
LL: Same row → PQ
OX: Rectangle → NZ
Result: "GDPQNZ"
```

### 2. RSA Encryption Algorithm

#### Mathematical Foundation:
RSA is based on the mathematical difficulty of factoring large prime numbers.

#### Step-by-Step Process:

**1. Key Generation:**
```typescript
constructor(p: number, q: number) {
  // Validate primes
  if (!this.isPrime(p) || !this.isPrime(q)) {
    throw new Error('Both P and Q must be prime numbers');
  }

  this.p = p;
  this.q = q;
  this.n = p * q;                    // Modulus
  this.phi = (p - 1) * (q - 1);     // Euler's totient
  this.e = this.findE(this.phi);    // Public exponent
  this.d = this.modInverse(this.e, this.phi); // Private exponent
}
```

**2. Finding Public Exponent (e):**
```typescript
private findE(phi: number): number {
  // Common values: 3, 5, 17, 257, 65537
  const commonEs = [3, 5, 17, 257, 65537];

  for (const e of commonEs) {
    if (e < phi && this.gcd(e, phi) === 1) {
      return e;
    }
  }

  // Search linearly if common values don't work
  for (let e = 2; e < phi; e++) {
    if (this.gcd(e, phi) === 1) return e;
  }
}
```

**3. Modular Inverse (Extended Euclidean Algorithm):**
```typescript
private modInverse(a: number, m: number): number {
  let m0 = m, x0 = 0, x1 = 1;
  while (a > 1) {
    const q = Math.floor(a / m);
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0 ? x1 + m0 : x1;
}
```

**4. Modular Exponentiation:**
```typescript
private modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base %= mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
}
```

**5. Encryption/Decryption:**
```typescript
public encrypt(text: string): number[] {
  return Array.from(text).map(c =>
    this.modPow(c.charCodeAt(0), this.e, this.n)
  );
}

public decrypt(cipher: number[]): string {
  return cipher.map(c =>
    String.fromCharCode(this.modPow(c, this.d, this.n))
  ).join('');
}
```

#### Example:
```
p = 17, q = 11
n = 17 × 11 = 187
φ(n) = 16 × 10 = 160
e = 7 (gcd(7, 160) = 1)
d = 23 (7 × 23 ≡ 1 mod 160)

Public Key: (e=7, n=187)
Private Key: (d=23, n=187)

Encrypt 'A' (ASCII 65):
65^7 mod 187 = 124

Decrypt 124:
124^23 mod 187 = 65 → 'A'
```

---

## 🧩 Component Breakdown

### 1. App.tsx
- **Purpose**: Root component with error boundary and theme provider
- **Key Features**:
  - Wraps entire app with ErrorBoundary
  - Provides ThemeContext to all components

### 2. EncryptionApp.tsx (Main Component)
- **Purpose**: Core application logic and state management
- **State Management**:
  ```typescript
  // Core state
  const [method, setMethod] = useState<'playfair' | 'rsa'>('playfair');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Custom hooks
  const { copied, copyToClipboard } = useClipboard();
  const { notifications, addNotification, removeNotification } = useNotification();
  ```

### 3. Sidebar.tsx
- **Purpose**: Configuration panel for encryption settings
- **Features**:
  - Method selection (Playfair/RSA)
  - Operation mode (Encrypt/Decrypt)
  - Key input with visibility toggle
  - Playfair matrix visualization

### 4. TextPanel.tsx
- **Purpose**: Reusable input/output text areas
- **Props Interface**:
  ```typescript
  interface TextPanelProps {
    type: 'input' | 'output';
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    copied?: boolean;
    onCopy?: () => void;
  }
  ```

### 5. ProcessButton.tsx
- **Purpose**: Main encryption/decryption action button
- **Features**:
  - Loading states with spinner
  - Disabled states for invalid input
  - Visual feedback for current operation

### 6. NotificationContainer.tsx
- **Purpose**: Modern notification system
- **Features**:
  - Multiple notification types (success, error, warning, info)
  - Auto-dismiss with configurable duration
  - Slide-in animations

### 7. ErrorBoundary.tsx
- **Purpose**: Catch and handle React errors gracefully
- **Features**:
  - Beautiful error UI
  - Reload functionality
  - Development error details

---

## 🎣 Custom Hooks

### 1. useClipboard.ts
```typescript
export const useClipboard = (resetDelay: number = 2000) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (error) {
      return false;
    }
  }, [resetDelay]);

  return { copied, copyToClipboard };
};
```

### 2. useKeyboardShortcuts.ts
```typescript
export const useKeyboardShortcuts = (shortcuts: Partial<KeyboardShortcuts>) => {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = `${e.ctrlKey ? 'Ctrl+' : 'Cmd+'}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
        const handler = shortcuts[key];

        if (handler) {
          e.preventDefault();
          handler();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [shortcuts]);
};
```

### 3. useNotification.ts
```typescript
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => removeNotification(id), newNotification.duration);
    }

    return id;
  }, []);

  return { notifications, addNotification, removeNotification };
};
```

### 4. usePerformanceMonitor.ts
```typescript
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const startTimeRef = useRef<number>(0);

  const startTimer = () => {
    startTimeRef.current = performance.now();
  };

  const recordMetric = (operation, method, inputLength, outputLength, success) => {
    const duration = performance.now() - startTimeRef.current;
    const metric = { operation, method, inputLength, outputLength, duration, timestamp: new Date(), success };

    setMetrics(prev => [...prev.slice(-99), metric]); // Keep last 100
    return metric;
  };

  return { startTimer, recordMetric, getStats, clearMetrics };
};
```

---

## 🔄 Data Flow

### Encryption Process Flow:
```
1. User inputs text in TextPanel
   ↓
2. User selects method/mode in Sidebar
   ↓
3. User clicks ProcessButton or presses Ctrl+Enter
   ↓
4. EncryptionApp.handleEncryptDecrypt() called
   ↓
5. Performance timer starts (usePerformanceMonitor)
   ↓
6. Input validation (validateInputText)
   ↓
7. Algorithm execution:
   - Playfair: new PlayfairCipher(key).encrypt/decrypt(text)
   - RSA: new RSACipher(p, q).encrypt/decrypt(text)
   ↓
8. Result displayed in output TextPanel
   ↓
9. Performance metric recorded
   ↓
10. Success/error notification shown
```

### State Management Flow:
```
App.tsx (ErrorBoundary + ThemeProvider)
  ↓
EncryptionApp.tsx (Main state + custom hooks)
  ├─ Sidebar.tsx (Configuration)
  ├─ TextPanel.tsx (Input/Output)
  ├─ ProcessButton.tsx (Action)
  └─ NotificationContainer.tsx (Feedback)
```

---

## ⚡ Performance Optimizations

### 1. React Optimizations:
```typescript
// Component memoization
const Sidebar = memo(({ isOpen, method, ... }) => { ... });

// Callback memoization
const handleEncryptDecrypt = useCallback(async () => { ... }, [deps]);

// Value memoization
const isValidInput = useMemo(() => {
  if (!inputText.trim()) return false;
  if (method === 'playfair' && !playfairKey.trim()) return false;
  return true;
}, [inputText, method, playfairKey]);
```

### 2. Algorithm Optimizations:
```typescript
// RSA: Use common small primes for efficiency
private findE(phi: number): number {
  const commonEs = [3, 5, 17, 257, 65537];
  for (const e of commonEs) {
    if (e < phi && this.gcd(e, phi) === 1) return e;
  }
}

// Playfair: Return matrix copy to prevent external modification
public getMatrix(): string[][] {
  return this.matrix.map(row => [...row]);
}
```

### 3. Performance Monitoring:
```typescript
// Track operation performance
const metric = recordMetric(
  mode,
  method,
  inputText.length,
  result.length,
  true
);

// Display real-time stats
const stats = {
  totalOperations: metrics.length,
  averageDuration: totalDuration / successfulMetrics.length,
  totalInputChars: metrics.reduce((sum, m) => sum + m.inputLength, 0)
};
```

---

## 📁 File Structure

```
src/
├── main/                     # Electron main process
│   ├── main.ts              # Main window creation
│   ├── preload.ts           # Secure context bridge
│   └── ipc/                 # Inter-process communication
├── renderer/                 # React frontend
│   ├── components/          # UI components
│   │   ├── ui/             # Radix UI components
│   │   ├── EncryptionApp.tsx    # Main app component
│   │   ├── Sidebar.tsx          # Configuration panel
│   │   ├── TextPanel.tsx        # Input/output areas
│   │   ├── ProcessButton.tsx    # Action button
│   │   ├── NotificationContainer.tsx # Notifications
│   │   ├── ErrorBoundary.tsx    # Error handling
│   │   ├── SettingsPanel.tsx    # Settings & stats
│   │   └── SystemHeader.tsx     # App header
│   ├── context/            # React context
│   │   └── ThemeContext.tsx     # Theme management
│   ├── hooks/              # Custom hooks
│   │   ├── useClipboard.ts      # Clipboard operations
│   │   ├── useKeyboardShortcuts.ts # Keyboard handling
│   │   ├── useNotification.ts   # Notification system
│   │   └── usePerformanceMonitor.ts # Performance tracking
│   ├── lib/                # Core algorithms & utilities
│   │   ├── playfair.ts         # Playfair cipher implementation
│   │   ├── rsa.ts              # RSA encryption implementation
│   │   ├── constants.ts        # App constants & types
│   │   └── validation.ts       # Validation utilities
│   ├── App.tsx             # Root component
│   ├── renderer.tsx        # React DOM root
│   └── index.css           # Global styles
├── shared/                  # Shared types & utilities
│   └── electron.d.ts       # Electron type definitions
└── index.ts                # Entry point
```

---

## 🔧 Key Implementation Details

### Theme Management:
```typescript
// Persistent theme with localStorage
const [theme, setTheme] = useState<'dark' | 'light'>(() => {
  try {
    const savedTheme = localStorage.getItem('cryptify-theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  } catch {
    return 'dark';
  }
});

// Auto-save on change
useEffect(() => {
  localStorage.setItem('cryptify-theme', theme);
}, [theme]);
```

### Error Handling Strategy:
```typescript
// Algorithm level
try {
  const cipher = new PlayfairCipher(playfairKey);
  result = cipher.encrypt(inputText);
} catch (error) {
  throw new Error(`Encryption failed: ${error.message}`);
}

// Component level
catch (error: any) {
  addNotification({
    type: 'error',
    title: 'Encryption failed',
    message: error.message || 'Unknown error'
  });
}

// App level (ErrorBoundary)
public static getDerivedStateFromError(error: Error): State {
  return { hasError: true, error };
}
```

### Validation Pipeline:
```typescript
// Input validation
const validation = validateInputText(inputText, method, mode);
if (!validation.isValid) {
  addNotification({ type: 'error', title: validation.error });
  return;
}

// Algorithm-specific validation
if (method === 'playfair') {
  const keyValidation = validatePlayfairKey(playfairKey);
  if (!keyValidation.isValid) { /* handle error */ }
} else {
  const rsaValidation = validateRSAParams(rsaP, rsaQ);
  if (!rsaValidation.isValid) { /* handle error */ }
}
```

---

## 📈 Future Enhancement Ideas

1. **Additional Algorithms**: Caesar cipher, Vigenère cipher, AES
2. **Key Management**: Generate, save, and load encryption keys
3. **Batch Processing**: Encrypt/decrypt multiple files
4. **Network Features**: Share encrypted messages
5. **Advanced RSA**: Larger key sizes, OAEP padding
6. **Plugins**: Extensible algorithm architecture
7. **Analytics**: Detailed usage statistics and patterns
8. **Export Options**: PDF reports, formatted outputs

---

This breakdown provides a comprehensive understanding of the Cryptify codebase, from the mathematical foundations of the cryptographic algorithms to the modern React architecture that powers the user interface. Each component is designed with performance, maintainability, and user experience in mind.
