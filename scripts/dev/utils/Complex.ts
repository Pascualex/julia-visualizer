export class Complex {
  public r: number;
  public i: number;

  constructor(r: number, i: number) {
    this.r = r;
    this.i = i;
  }

  public add(other: Complex): void {
    this.r += other.r;
    this.i += other.i;
  }

  public square(): void {
    const newR: number = this.r * this.r - this.i * this.i;
    this.i = 2 * this.r * this.i;
    this.r = newR;
  }
  
  public module(): number {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }
}