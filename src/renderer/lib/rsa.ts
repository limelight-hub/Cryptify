export default class RSACipher {
  private p: number;
  private q: number;
  private n: number;
  private phi: number;
  private e: number;
  private d: number;

  constructor(p: number, q: number) {
    // Validate inputs
    if (!Number.isInteger(p) || !Number.isInteger(q)) {
      throw new Error('P and Q must be integers');
    }

    if (p <= 1 || q <= 1) {
      throw new Error('P and Q must be greater than 1');
    }

    if (!this.isPrime(p) || !this.isPrime(q)) {
      throw new Error('Both P and Q must be prime numbers');
    }

    if (p === q) {
      throw new Error('P and Q must be different prime numbers');
    }

    this.p = p;
    this.q = q;
    this.n = p * q;
    this.phi = (p - 1) * (q - 1);

    try {
      this.e = this.findE(this.phi);
      this.d = this.modInverse(this.e, this.phi);
    } catch (error) {
      throw new Error(`RSA key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  private findE(phi: number): number {
    for (let e = 2; e < phi; e++) {
      if (this.gcd(e, phi) === 1) return e;
    }
    throw new Error('No valid public exponent E found');
  }

  private modInverse(a: number, m: number): number {
    let m0 = m, x0 = 0, x1 = 1;
    while (a > 1) {
      const q = Math.floor(a / m);
      [a, m] = [m, a % m];
      [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + m0 : x1;
  }

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

  public encrypt(text: string): number[] {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }

    try {
      return Array.from(text).map(c => {
        const charCode = c.charCodeAt(0);
        if (charCode >= this.n) {
          throw new Error(`Character '${c}' (code: ${charCode}) is too large for current key size (n=${this.n})`);
        }
        return this.modPow(charCode, this.e, this.n);
      });
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public decrypt(cipher: number[]): string {
    if (!Array.isArray(cipher)) {
      throw new Error('Cipher must be an array of numbers');
    }

    if (cipher.length === 0) {
      throw new Error('Cipher array cannot be empty');
    }

    try {
      return cipher.map(c => {
        if (!Number.isInteger(c) || c < 0) {
          throw new Error(`Invalid cipher value: ${c}`);
        }
        return String.fromCharCode(this.modPow(c, this.d, this.n));
      }).join('');
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getPublicKey() {
    return { e: this.e, n: this.n };
  }

  public getPrivateKey() {
    return { d: this.d, n: this.n };
  }

  public getKeyInfo() {
    return {
      p: this.p,
      q: this.q,
      n: this.n,
      phi: this.phi,
      e: this.e,
      d: this.d,
    };
  }
}
