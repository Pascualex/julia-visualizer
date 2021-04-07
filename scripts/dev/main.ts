import { Grid } from "./grid/Grid";

let grid: Grid | null;
let fractalCanvas: HTMLElement | null;
let axisCanvas: HTMLElement | null;
let mandelbrotCanvas: HTMLElement | null;
let pCanvas: HTMLElement | null;
let cContent: HTMLElement | null;
let cButton: HTMLElement | null;
let pContent: HTMLElement | null;
let pButton: HTMLElement | null;
let iterContent: HTMLElement | null;
let iterSlider: HTMLElement | null;
let mandelbrotButton: HTMLElement | null;

window.onload = () => {
  setupHtmlElements();
  createGrid();
}

function setupHtmlElements(): void {
  fractalCanvas = document.getElementById("grid");
  axisCanvas = document.getElementById("axis");
  pCanvas = document.getElementById("p");
  mandelbrotCanvas = document.getElementById("mandelbrot");
  cContent = document.getElementById("c-content");
  cButton = document.getElementById("c-button");
  pContent = document.getElementById("p-content");
  pButton = document.getElementById("p-button");
  iterContent = document.getElementById("iter-content");
  iterSlider = document.getElementById("iter-slider");
  mandelbrotButton = document.getElementById("mandelbrot-button");
}

function createGrid(): void {
  if (!(fractalCanvas instanceof HTMLCanvasElement)) return;
  if (!(axisCanvas instanceof HTMLCanvasElement)) return;
  if (!(mandelbrotCanvas instanceof HTMLCanvasElement)) return;
  if (!(pCanvas instanceof HTMLCanvasElement)) return;
  if (!(cContent instanceof HTMLSpanElement)) return;
  if (!(pContent instanceof HTMLSpanElement)) return;
  if (!(iterContent instanceof HTMLSpanElement)) return;
  if (!(iterSlider instanceof HTMLInputElement)) return;
  if (cButton == null) return;
  if (pButton == null) return;
  if (mandelbrotButton == null) return;

  fractalCanvas.width = window.innerWidth;
  fractalCanvas.height = window.innerHeight;
  axisCanvas.width = window.innerWidth;
  axisCanvas.height = window.innerHeight;
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  mandelbrotCanvas.width = window.innerWidth;
  mandelbrotCanvas.height = window.innerHeight;

  grid = new Grid(
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
  );
}