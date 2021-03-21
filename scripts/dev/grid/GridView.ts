import { GridModel } from "./GridModel";
import { Complex } from "../utils/Complex";

export class GridView {
  private maxIterations: number = 30;
  private escapeRadius: number = 3;
  private imaginaryAxisHeight: number = 3;

  private htmlCanvas: HTMLCanvasElement;
  private canvas: CanvasRenderingContext2D | null;
  private gridModel: GridModel;

  private width: number;
  private height: number;
  private centerX: number;
  private centerY: number;
  private scale: number;

  private updateOnMove: boolean;

  public oncselected: ((c: Complex) => any) | null;

  constructor(htmlCanvas: HTMLCanvasElement, gridModel: GridModel) {
    this.htmlCanvas = htmlCanvas;
    this.canvas = htmlCanvas.getContext('2d');
    this.gridModel = gridModel;

    this.width = this.htmlCanvas.width;
    this.height = this.htmlCanvas.height;
    this.centerX = Math.floor(this.width / 2);
    this.centerY = Math.floor(this.height / 2);
    this.scale = this.imaginaryAxisHeight / this.height;

    this.updateOnMove = false;

    this.oncselected = null;
    this.setupEvents(htmlCanvas);
  }

  private setupEvents(htmlCanvas: HTMLCanvasElement): void {
    htmlCanvas.onmousedown = (event: MouseEvent) => {
      this.handleOnMouseDownEvent(event);
    };
    htmlCanvas.onmousemove = (event: MouseEvent) => {
      this.handleOnMouseMoveEvent(event);
    };
  }

  private handleOnMouseDownEvent(event: MouseEvent): void {
    this.updateOnMove = !this.updateOnMove;
    this.handleOnMouseMoveEvent(event);
  }

  private handleOnMouseMoveEvent(event: MouseEvent): void {
    if (this.updateOnMove) this.triggerOnCSelected(event);
  }

  private triggerOnCSelected(event: MouseEvent): void {
    if (this.oncselected == null) return;

    const c: Complex = this.pixelToComplex(event.x, event.y);
    this.oncselected(c);
  }

  public draw(): void {
    this.canvas?.clearRect(0, 0, this.width, this.height);
    this.drawJuliaSet();
    this.drawAxis();
  }

  private drawAxis(): void {
    if (this.canvas == null) return;

    this.canvas.fillStyle = "#000000";
    this.canvas.beginPath();
    this.canvas.moveTo(this.centerX, 0);
    this.canvas.lineTo(this.centerX, this.height);
    this.canvas.moveTo(0, this.centerY);
    this.canvas.lineTo(this.width, this.centerY);
    this.canvas.stroke();
  }

  private drawJuliaSet(): void {
    if (this.canvas == null) return;

    const imageData = this.canvas.createImageData(this.width, this.height);
    const buf = new ArrayBuffer(imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const point: Complex = this.pixelToComplex(j, i);
        if (this.converges(point)) {
          buf8[(i * this.width + j)*4+3] = 255;
        }
      }
    }

    imageData.data.set(buf8);
    this.canvas.putImageData(imageData, 0, 0);
  }

  private pixelToComplex(x: number, y: number): Complex {
    return new Complex((x - this.centerX) * this.scale, (y - this.centerY) * this.scale);
  }

  private converges(point: Complex): boolean {
    for (let i = 0; i < this.maxIterations; i++) {
      point.square();
      point.add(this.gridModel.c);

      if (point.module() > this.escapeRadius) return false;
    }

    return true;
  }
}