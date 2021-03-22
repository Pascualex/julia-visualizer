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
    cContent: HTMLSpanElement,
    cButton: HTMLElement,
    pContent: HTMLSpanElement,
    pButton: HTMLElement,
    iterContent: HTMLSpanElement,
    iterSlider: HTMLInputElement,
  ) {
    this.gridModel = new GridModel();
    this.gridView = new GridView(
      fractalCanvas,
      axisCanvas,
      pCanvas,
      cContent,
      cButton,
      pContent,
      pButton,
      iterContent,
      iterSlider,
      this.gridModel,
    );

    this.setupEvents();

    this.gridModel.c = new Complex(0, -0.6);
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
    this.gridModel.c = c;
    this.gridView.updateC();
    this.gridView.drawJuliaSet();
    this.gridModel.p = new Complex(0, 0);
    this.gridView.drawP();
  }

  private handleOnPSelectedEvent(p: Complex): void {
    this.gridModel.p = p;
    this.gridView.updateP();
    this.gridView.drawP();
  }

  private handleOnIterSelectedEvent(iter: number): void {
    this.gridModel.iter = iter;
    this.gridView.updateIter();
    this.gridView.drawJuliaSet();
    this.gridView.drawP();
  }
}