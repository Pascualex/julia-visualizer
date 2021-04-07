import { GridModel } from "./GridModel";
import { Complex } from "../utils/Complex";
import { Mode } from "../utils/Mode";

export class GridView {
  private escapeRadius: number = 2;
  private imaginaryAxisHeight: number = 1.5;

  private fractalCanvas: CanvasRenderingContext2D | null;
  private axisCanvas: CanvasRenderingContext2D | null;
  private pCanvas: CanvasRenderingContext2D | null;
  private mandelbrotCanvasWrapper: HTMLCanvasElement;
  private mandelbrotCanvas: CanvasRenderingContext2D | null;
  private cContent: HTMLSpanElement;
  private cButton: HTMLElement;
  private pContent: HTMLSpanElement;
  private pButton: HTMLElement;
  private iterContent: HTMLSpanElement;
  private iterSlider: HTMLInputElement;
  private mandelbrotButton: HTMLElement;
  private gridModel: GridModel;

  private width: number;
  private height: number;
  private centerX: number;
  private centerY: number;
  private scale: number;

  private mode: Mode;
  private showMandelbrot: boolean;

  public oncselected: ((c: Complex) => any) | null;
  public onpselected: ((p: Complex) => any) | null;
  public oniterselected: ((iter: number) => any) | null;

  constructor(
    fractalCanvas: HTMLCanvasElement,
    axisCanvas: HTMLCanvasElement,
    pCanvas: HTMLCanvasElement,
    mandelbrotCanvas: HTMLCanvasElement,
    cContent: HTMLSpanElement,
    cButton: HTMLElement,
    pContent: HTMLSpanElement,
    pButton: HTMLElement,
    iterContent: HTMLSpanElement,
    iterSlider: HTMLInputElement,
    mandelbrotButton: HTMLElement,
    gridModel: GridModel,
  ) {
    this.fractalCanvas = fractalCanvas.getContext("2d");
    this.axisCanvas = axisCanvas.getContext("2d");
    this.pCanvas = pCanvas.getContext("2d");
    this.mandelbrotCanvasWrapper = mandelbrotCanvas;
    this.mandelbrotCanvas = mandelbrotCanvas.getContext("2d");
    this.cContent = cContent;
    this.cButton = cButton;
    this.pContent = pContent;
    this.pButton = pButton;
    this.iterContent = iterContent;
    this.iterSlider = iterSlider;
    this.gridModel = gridModel;
    this.mandelbrotButton = mandelbrotButton;

    this.width = fractalCanvas.width;
    this.height = fractalCanvas.height;
    this.centerX = Math.floor(this.width / 2);
    this.centerY = Math.floor(this.height / 2);
    this.scale = (2 * this.imaginaryAxisHeight) / this.height;

    this.mode = Mode.None;

    this.oncselected = null;
    this.onpselected = null;
    this.oniterselected = null;
    this.setupEvents(fractalCanvas);

    this.showMandelbrot = false;
    this.updateMandelbrotVisibility();
    this.drawAxis();
    this.drawMandelbrot();
    this.updateIter();
  }

  private setupEvents(fractalCanvas: HTMLCanvasElement): void {
    fractalCanvas.onmousedown = (event: MouseEvent) => {
      this.handleOnMouseDownEvent(event);
    };
    fractalCanvas.onmousemove = (event: MouseEvent) => {
      this.handleOnMouseMoveEvent(event);
    };
    this.cButton.onclick = (event: MouseEvent) => {
      this.handleOnCButtonClickEvent(event);
    };
    this.pButton.onclick = (event: MouseEvent) => {
      this.handleOnPButtonClickEvent(event);
    };
    this.iterSlider.oninput = () => {
      this.handleOnIterChangeEvent();
    };
    this.mandelbrotButton.onclick = (event: MouseEvent) => {
      this.handleOnMandelbrotButtonClickEvent(event);
    };
  }

  private handleOnMouseDownEvent(event: MouseEvent): void {
    this.mode = Mode.None;
  }

  private handleOnMouseMoveEvent(event: MouseEvent): void {
    if (this.mode == Mode.C) this.triggerOnCSelectedEvent(event);
    else if (this.mode == Mode.P) this.triggerOnPSelectedEvent(event);
  }

  private handleOnCButtonClickEvent(event: MouseEvent): void {
    this.mode = Mode.C;
  }

  private handleOnPButtonClickEvent(event: MouseEvent): void {
    this.mode = Mode.P;
  }

  private handleOnMandelbrotButtonClickEvent(event: MouseEvent): void {
    this.showMandelbrot = !this.showMandelbrot;
    this.updateMandelbrotVisibility();
  }
  
  private handleOnIterChangeEvent(): void {
    this.triggerOnIterSelectedEvent();
  }

  private triggerOnCSelectedEvent(event: MouseEvent): void {
    if (this.oncselected == null) return;

    const c: Complex = this.pixelToComplex(event.x, event.y);
    this.oncselected(c);
  }

  private triggerOnPSelectedEvent(event: MouseEvent): void {
    if (this.onpselected == null) return;

    const p: Complex = this.pixelToComplex(event.x, event.y);
    this.onpselected(p);
  }
  
  private triggerOnIterSelectedEvent(): void {
    if (this.oniterselected == null) return;
    
    const iter = Math.round(parseFloat(this.iterSlider.value));
    this.oniterselected(iter);
  }

  public updateC(): void {
    const c: Complex = this.gridModel.c;
    let i: number = c.i;
    const s: string = i < 0 ? " - " : " + ";
    i = Math.abs(i);
    this.cContent.textContent = c.r.toFixed(4) + s + i.toFixed(4) + "i";
  }

  public updateP(): void {
    const p: Complex = this.gridModel.p;
    let i: number = p.i;
    const s: string = i < 0 ? " - " : " + ";
    i = Math.abs(i);
    this.pContent.textContent = p.r.toFixed(4) + s + i.toFixed(4) + "i";
  }

  public updateIter(): void {
    this.iterContent.textContent = this.gridModel.iter.toString();
  }
  
  public updateMandelbrotVisibility(): void {
    this.mandelbrotCanvasWrapper.style.display = this.showMandelbrot ? "block" : "none";
  }

  private drawAxis(): void {
    if (this.axisCanvas == null) return;

    this.axisCanvas.clearRect(0, 0, this.width, this.height);

    const verticalLines: number = Math.floor(this.width * this.scale / 2);
    this.axisCanvas.strokeStyle = "#5990b5";
    this.axisCanvas.beginPath();
    for (let i = 0; i < verticalLines; i++) {
      const posX: number = (i + 1) / this.scale;
      this.axisCanvas.moveTo(this.centerX + posX, 0);
      this.axisCanvas.lineTo(this.centerX + posX, this.height);
      this.axisCanvas.moveTo(this.centerX - posX, 0);
      this.axisCanvas.lineTo(this.centerX - posX, this.height);
    }
    this.axisCanvas.stroke();

    const verticalMiniLines: number = Math.floor(this.width * this.scale * 10 / 2);
    this.axisCanvas.strokeStyle = "#95caed";
    this.axisCanvas.beginPath();
    for (let i = 0; i < verticalMiniLines; i++) {
      if ((i + 1) % 10 == 0) continue;
      const posX: number = (i + 1) / this.scale / 10;
      this.axisCanvas.moveTo(this.centerX + posX, 0);
      this.axisCanvas.lineTo(this.centerX + posX, this.height);
      this.axisCanvas.moveTo(this.centerX - posX, 0);
      this.axisCanvas.lineTo(this.centerX - posX, this.height);
    }
    this.axisCanvas.stroke();

    const horizontalLines: number = Math.floor(this.imaginaryAxisHeight);
    this.axisCanvas.strokeStyle = "#5990b5";
    this.axisCanvas.beginPath();
    for (let i = 0; i < horizontalLines; i++) {
      const posY: number = (i + 1) / this.scale;
      this.axisCanvas.moveTo(0, this.centerY + posY);
      this.axisCanvas.lineTo(this.width, this.centerY + posY);
      this.axisCanvas.moveTo(0, this.centerY - posY);
      this.axisCanvas.lineTo(this.width, this.centerY - posY);
    }
    this.axisCanvas.stroke();

    const horizontalMiniLines: number = Math.floor(this.imaginaryAxisHeight * 10);
    this.axisCanvas.strokeStyle = "#95caed";
    this.axisCanvas.beginPath();
    for (let i = 0; i < horizontalMiniLines; i++) {
      if ((i + 1) % 10 == 0) continue;
      const posY: number = (i + 1) / this.scale / 10;
      this.axisCanvas.moveTo(0, this.centerY + posY);
      this.axisCanvas.lineTo(this.width, this.centerY + posY);
      this.axisCanvas.moveTo(0, this.centerY - posY);
      this.axisCanvas.lineTo(this.width, this.centerY - posY);
    }
    this.axisCanvas.stroke();

    this.axisCanvas.strokeStyle = "#0b273b";
    this.axisCanvas.lineWidth = 2;
    this.axisCanvas.beginPath();
    this.axisCanvas.moveTo(this.centerX, 0);
    this.axisCanvas.lineTo(this.centerX, this.height);
    this.axisCanvas.moveTo(0, this.centerY);
    this.axisCanvas.lineTo(this.width, this.centerY);
    this.axisCanvas.stroke();
    this.axisCanvas.lineWidth = 1;
  }

  public drawMandelbrot(): void {
    if (this.mandelbrotCanvas == null) return;

    const imageData = this.mandelbrotCanvas.createImageData(this.width, this.height);
    const buf = new ArrayBuffer(imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);

    const point: Complex = new Complex(0, 0);
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const c: Complex = this.pixelToComplex(j, i);
        if (this.converges(point, c, 150)) {
          buf8[(i * this.width + j) * 4 + 0] = 106;
          buf8[(i * this.width + j) * 4 + 1] = 114;
          buf8[(i * this.width + j) * 4 + 2] = 122;
          buf8[(i * this.width + j) * 4 + 3] = 255;
        }
      }
    }

    imageData.data.set(buf8);
    this.mandelbrotCanvas.putImageData(imageData, 0, 0);
  }

  public drawJuliaSet(): void {
    if (this.fractalCanvas == null) return;

    const imageData = this.fractalCanvas.createImageData(this.width, this.height);
    const buf = new ArrayBuffer(imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const point: Complex = this.pixelToComplex(j, i);
        if (this.converges(point, this.gridModel.c, this.gridModel.iter)) {
          buf8[(i * this.width + j) * 4 + 3] = 255;
        }
      }
    }

    imageData.data.set(buf8);
    this.fractalCanvas.putImageData(imageData, 0, 0);

    const x: number = this.centerX + Math.floor(this.gridModel.c.r / this.scale);
    const y: number = this.centerY - Math.floor(this.gridModel.c.i / this.scale);
    const radius: number = 5;

    this.fractalCanvas.beginPath();
    this.fractalCanvas.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.fractalCanvas.fillStyle = 'red';
    this.fractalCanvas.strokeStyle = 'red';
    this.fractalCanvas.fill();
    this.fractalCanvas.stroke();
  }

  public drawP(): void {
    if (this.pCanvas == null) return;

    this.pCanvas.clearRect(0, 0, this.width, this.height);
    let p: Complex = this.gridModel.p.copy();

    if (p.r == 0 && p.i == 0) return;

    for (let i = 0; i < this.gridModel.iter; i++) {
      if (i > 0) {
        p.square();
        p.add(this.gridModel.c);
      }

      const x: number = this.centerX + Math.floor(p.r / this.scale);
      const y: number = this.centerY - Math.floor(p.i / this.scale);
      const radius: number = i == 0 ? 5 : 1.5;

      if (i > 0) {
        this.pCanvas.lineTo(x, y);
        this.pCanvas.stroke();
      }

      this.pCanvas.beginPath();
      this.pCanvas.arc(x, y, radius, 0, 2 * Math.PI, false);
      this.pCanvas.fillStyle = "#ff19fb";
      this.pCanvas.strokeStyle = "#ff19fb";
      this.pCanvas.fill();
      this.pCanvas.stroke();

      this.pCanvas.strokeStyle = "#ff19fb";
      if (i < this.gridModel.iter - 1) this.pCanvas.moveTo(x, y);
    }
  }

  private pixelToComplex(x: number, y: number): Complex {
    return new Complex((x - this.centerX) * this.scale, -(y - this.centerY) * this.scale);
  }

  private converges(point: Complex, c: Complex, iter: number): boolean {
    const cx: number = c.r;
    const cy: number = c.i;
    const escapeRadiusSquare: number = this.escapeRadius * this.escapeRadius;

    let x: number = point.r;
    let y: number = point.i;
    let xTmp: number = 0;

    for (let i = 0; i < iter; i++) {
      xTmp = x * x - y * y + cx;
      y = (x + x) * y + cy;
      x = xTmp;

      if ((x * x + y * y) > escapeRadiusSquare) return false;
    }

    return true;
  }
}