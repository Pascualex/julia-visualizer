import { Complex } from "../utils/Complex";
import { GridModel } from "./GridModel";
import { GridView } from "./GridView";

export class Grid {
  private gridModel: GridModel;
  private gridView: GridView;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.gridModel = new GridModel();
    this.gridView = new GridView(htmlCanvas, this.gridModel);

    this.setupEvents();

    this.gridModel.c = new Complex(0, -0.6);
    this.gridView.draw();
  }

  private setupEvents(): void {
    this.gridView.oncselected = (c: Complex) => {
      this.handleOnCSelected(c);
    };
  }

  private handleOnCSelected(c: Complex): void {
    this.gridModel.c = c;
    this.gridView.draw();
  }
}