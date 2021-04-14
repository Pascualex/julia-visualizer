import { Complex } from "../utils/Complex";
import { GridModel } from "./GridModel";
import { GridView } from "./GridView";

export class Grid {
  private gridModel: GridModel;
  private gridView: GridView;

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
  ) {
    this.gridModel = new GridModel();
    this.gridView = new GridView(
      fractalCanvas,
      axisCanvas,
      pCanvas,
      mandelbrotCanvas,
      cContent,
      cButton,
      pContent,
      pButton,
      iterContent,
      iterSlider,
      mandelbrotButton,
      this.gridModel,
    );

    this.setupEvents();

    this.gridModel.c = new Complex(0, 0);
    this.gridView.updateC();
    this.gridView.updateP();
    this.gridView.updateIter();
    this.gridView.drawJuliaSet();
    this.gridView.drawP();
  }

  private setupEvents(): void {
    this.gridView.oncselected = (c: Complex) => {
      this.handleOnCSelectedEvent(c);
    };
    this.gridView.onpselected = (p: Complex) => {
      this.handleOnPSelectedEvent(p);
    };
    this.gridView.oniterselected = (iter: number) => {
      this.handleOnIterSelectedEvent(iter);
    };
  }

  private handleOnCSelectedEvent(c: Complex): void {
    if (c.r == this.gridModel.c.r && c.i == this.gridModel.c.i) return;
    this.gridModel.c = c;
    this.gridView.updateC();
    this.gridView.drawJuliaSet();
    this.gridModel.p = new Complex(0, 0);
    this.gridView.drawP();
  }

  private handleOnPSelectedEvent(p: Complex): void {
    if (p.r == this.gridModel.p.r && p.i == this.gridModel.p.i) return;
    this.gridModel.p = p;
    this.gridView.updateP();
    this.gridView.drawP();
  }

  private handleOnIterSelectedEvent(iter: number): void {
    if (iter == this.gridModel.iter) return;
    this.gridModel.iter = iter;
    this.gridView.updateIter();
    this.gridView.drawJuliaSet();
    this.gridView.drawP();
  }
}