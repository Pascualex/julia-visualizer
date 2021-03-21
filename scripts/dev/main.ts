import { Grid } from "./grid/Grid";

let grid: Grid | null;
let htmlGrid: HTMLElement | null;

window.onload = () => {
  setupHtmlElements();
  createGrid();
}

function setupHtmlElements(): void {
  htmlGrid = document.getElementById('grid');
}

function createGrid(): void {    
  if (htmlGrid instanceof HTMLCanvasElement) {
    htmlGrid.width = window.innerWidth;
    htmlGrid.height = window.innerHeight;
    grid = new Grid(htmlGrid);
  } else {
    grid = null;
  }
}