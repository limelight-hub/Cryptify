export default class RSACipher {
  private p: number;
  private q: number;
  private n: number;
  private phi: number;
  private e: number;
  private d: number;

  constructor(p: number, q: number) {
    if (!this.isPrime(p) || !this.isPrime(q)) {
      throw new Error("Both P and Q must be prime numbers");
    }
    this.p = p;
    this.q = q;
    this.n = p * q;
    this.phi = (p - 1) * (q - 1);
    this.e = this.findE(this.phi);
    this.d = this.modInverse(this.e, this.phi);
  }

  private isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  //Tìm ước chung lớn nhất
  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  //Tìm e sao cho gcd(e, phi) = 1.
  private findE(phi: number): number {
    for (let e = 2; e < phi; e++) {
      if (this.gcd(e, phi) === 1) return e;
    }
    throw new Error("No valid public exponent E found");
  }

  //Tính nghịch đảo modular (dựa trên thuật toán Euclid mở rộng).
  private modInverse(a: number, m: number): number {
    let m0 = m,
      x0 = 0,
      x1 = 1;
    while (a > 1) {
      const q = Math.floor(a / m);
      [a, m] = [m, a % m];
      [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + m0 : x1;
  }

  //	Tính lũy thừa modulo hiệu quả (Exponentiation by squaring).
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
    return Array.from(text).map((c) =>
      this.modPow(c.charCodeAt(0), this.e, this.n)
    );
  }

  public decrypt(cipher: number[]): string {
    return cipher
      .map((c) => String.fromCharCode(this.modPow(c, this.d, this.n)))
      .join("");
  }

  public getPublicKey() {
    return { e: this.e, n: this.n };
  }

  public getPrivateKey() {
    return { d: this.d, n: this.n };
  }
}
