export default class PlayfairCipher {
  private matrix: string[][] = [];
  private key: string = '';

  constructor(key: string) {
    if (!key || typeof key !== 'string') {
      throw new Error('Playfair key must be a non-empty string');
    }

    this.key = this.prepareKey(key);
    if (this.key.length < 1) {
      throw new Error('Playfair key must contain at least one letter');
    }

    this.matrix = this.generateMatrix();
  }

  private prepareKey(key: string): string {
    const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    if (cleaned.length === 0) {
      throw new Error('Playfair key must contain valid letters');
    }
    return cleaned;
  }

  private generateMatrix(): string[][] {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    const keyUnique = Array.from(new Set(this.key + alphabet)).filter(c => c !== 'J');
    const matrix: string[][] = [];
    for (let i = 0; i < 5; i++) {
      matrix.push(keyUnique.slice(i * 5, i * 5 + 5));
    }
    return matrix;
  }

  private findPosition(char: string): { row: number; col: number } {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (this.matrix[row][col] === char) return { row, col };
      }
    }
    throw new Error(`Character '${char}' not found in matrix`);
  }

  private processText(text: string): string[][] {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }

    const clean = this.prepareKey(text);
    if (clean.length === 0) {
      throw new Error('Input text must contain valid letters');
    }

    const pairs: string[][] = [];
    for (let i = 0; i < clean.length; i += 2) {
      let a = clean[i];
      let b = clean[i + 1] || 'X';
      if (a === b) b = 'X';
      pairs.push([a, b]);
    }
    return pairs;
  }

  private shiftChar(pos: { row: number; col: number }, dir: number, isRow: boolean): string {
    if (isRow) {
      return this.matrix[pos.row][(pos.col + dir + 5) % 5];
    } else {
      return this.matrix[(pos.row + dir + 5) % 5][pos.col];
    }
  }

  private transform(pairs: string[][], dir: number): string {
    let result = '';
    for (const [a, b] of pairs) {
      const posA = this.findPosition(a);
      const posB = this.findPosition(b);
      if (posA.row === posB.row) {
        result += this.shiftChar(posA, dir, true);
        result += this.shiftChar(posB, dir, true);
      } else if (posA.col === posB.col) {
        result += this.shiftChar(posA, dir, false);
        result += this.shiftChar(posB, dir, false);
      } else {
        result += this.matrix[posA.row][posB.col];
        result += this.matrix[posB.row][posA.col];
      }
    }
    return result;
  }

  public encrypt(text: string): string {
    try {
      return this.transform(this.processText(text), 1);
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public decrypt(text: string): string {
    try {
      return this.transform(this.processText(text), -1);
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getMatrix(): string[][] {
    return this.matrix.map(row => [...row]); // Return a copy to prevent external modification
  }
}
