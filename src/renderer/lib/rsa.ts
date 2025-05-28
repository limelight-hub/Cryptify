export class RSACipher {
  private p: number;
  private q: number;
  private n: number;
  private phi: number;
  private e: number;
  private d: number;

  constructor(p: number, q: number) {
    this.p = p;
    this.q = q;
    this.n = p * q;
    this.phi = (p - 1) * (q - 1);
    this.e = this.calculateE();
    this.d = this.calculateD();
  }

  private gcd(a: number, b: number): number {
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }

  private calculateE(): number {
    // Choose e such that 1 < e < phi and e is coprime with phi
    for (let e = 2; e < this.phi; e++) {
      if (this.gcd(e, this.phi) === 1) {
        return e;
      }
    }
    throw new Error('Could not find suitable e');
  }

  private modInverse(a: number, m: number): number {
    // Extended Euclidean Algorithm
    let m0 = m;
    let y = 0;
    let x = 1;

    if (m === 1) return 0;

    while (a > 1) {
      const q = Math.floor(a / m);
      let t = m;

      m = a % m;
      a = t;
      t = y;

      y = x - q * y;
      x = t;
    }

    if (x < 0) x += m0;

    return x;
  }

  private calculateD(): number {
    return this.modInverse(this.e, this.phi);
  }

  private modPow(base: number, exponent: number, modulus: number): number {
    if (modulus === 1) return 0;

    let result = 1;
    base = base % modulus;

    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      base = (base * base) % modulus;
      exponent = Math.floor(exponent / 2);
    }

    return result;
  }

  public encrypt(message: string): number[] {
    return message.split('').map(char => {
      const m = char.charCodeAt(0);
      return this.modPow(m, this.e, this.n);
    });
  }

  public decrypt(encrypted: number[]): string {
    return encrypted.map(c => {
      const m = this.modPow(c, this.d, this.n);
      return String.fromCharCode(m);
    }).join('');
  }

  public getPublicKey(): { e: number; n: number } {
    return { e: this.e, n: this.n };
  }

  public getPrivateKey(): { d: number; n: number } {
    return { d: this.d, n: this.n };
  }
}
