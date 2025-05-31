export default class PlayfairCipher {
  private matrix: string[][] = [];
  private key: string = '';

  constructor(key: string) {
    this.key = this.prepareKey(key);
    this.matrix = this.generateMatrix();
  }

  private prepareKey(key: string): string {
    return key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
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
    return { row: -1, col: -1 };
  }

  private processText(text: string): string[][] {
    const clean = this.prepareKey(text);
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
    return this.transform(this.processText(text), 1);
  }

  public decrypt(text: string): string {
    return this.transform(this.processText(text), -1);
  }

  public getMatrix(): string[][] {
    return this.matrix;
  }
}
