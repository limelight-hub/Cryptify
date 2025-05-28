export class PlayfairCipher {
  private matrix: string[][] = [];
  private key: string = '';

  constructor(key: string) {
    this.key = this.preprocessKey(key);
    this.generateMatrix();
  }

  private preprocessKey(key: string): string {
    // Remove non-alphabetic characters and convert to uppercase
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    // Replace J with I
    key = key.replace(/J/g, 'I');
    // Remove duplicates while preserving order
    return [...new Set(key)].join('');
  }

  private generateMatrix(): void {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: I and J are combined
    const matrixChars = this.key + alphabet;
    const uniqueChars = [...new Set(matrixChars)];

    this.matrix = Array(5).fill(null).map(() => Array(5).fill(''));
    let charIndex = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.matrix[i][j] = uniqueChars[charIndex++];
      }
    }
  }

  private findPosition(char: string): [number, number] {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  }

  private preprocessText(text: string): string {
    // Remove non-alphabetic characters and convert to uppercase
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    // Replace J with I
    text = text.replace(/J/g, 'I');

    // Split text into pairs and add 'X' between same letters in a pair
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      if (i < text.length - 1) {
        if (text[i] === text[i + 1]) {
          result += 'X';
        }
      }
    }

    // Add 'X' if the length is odd
    if (result.length % 2 !== 0) {
      result += 'X';
    }

    return result;
  }

  public encrypt(plaintext: string): string {
    const text = this.preprocessText(plaintext);
    let result = '';

    for (let i = 0; i < text.length; i += 2) {
      const [row1, col1] = this.findPosition(text[i]);
      const [row2, col2] = this.findPosition(text[i + 1]);

      if (row1 === row2) {
        // Same row
        result += this.matrix[row1][(col1 + 1) % 5];
        result += this.matrix[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        // Same column
        result += this.matrix[(row1 + 1) % 5][col1];
        result += this.matrix[(row2 + 1) % 5][col2];
      } else {
        // Rectangle case
        result += this.matrix[row1][col2];
        result += this.matrix[row2][col1];
      }
    }

    return result;
  }

  public decrypt(ciphertext: string): string {
    const text = this.preprocessText(ciphertext);
    let result = '';

    for (let i = 0; i < text.length; i += 2) {
      const [row1, col1] = this.findPosition(text[i]);
      const [row2, col2] = this.findPosition(text[i + 1]);

      if (row1 === row2) {
        // Same row
        result += this.matrix[row1][(col1 + 4) % 5];
        result += this.matrix[row2][(col2 + 4) % 5];
      } else if (col1 === col2) {
        // Same column
        result += this.matrix[(row1 + 4) % 5][col1];
        result += this.matrix[(row2 + 4) % 5][col2];
      } else {
        // Rectangle case
        result += this.matrix[row1][col2];
        result += this.matrix[row2][col1];
      }
    }

    return result;
  }

  public getMatrix(): string[][] {
    return this.matrix;
  }
}
