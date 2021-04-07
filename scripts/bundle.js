(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var Complex_1 = require("../utils/Complex");
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var Grid = /** @class */ (function () {
    function Grid(fractalCanvas, axisCanvas, pCanvas, mandelbrotCanvas, cContent, cButton, pContent, pButton, iterContent, iterSlider, mandelbrotButton) {
        this.gridModel = new GridModel_1.GridModel();
        this.gridView = new GridView_1.GridView(fractalCanvas, axisCanvas, pCanvas, mandelbrotCanvas, cContent, cButton, pContent, pButton, iterContent, iterSlider, mandelbrotButton, this.gridModel);
        this.setupEvents();
        this.gridModel.c = new Complex_1.Complex(0, -0.6);
        this.gridView.updateC();
        this.gridView.updateP();
        this.gridView.updateIter();
        this.gridView.drawJuliaSet();
        this.gridView.drawP();
    }
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.oncselected = function (c) {
            _this.handleOnCSelectedEvent(c);
        };
        this.gridView.onpselected = function (p) {
            _this.handleOnPSelectedEvent(p);
        };
        this.gridView.oniterselected = function (iter) {
            _this.handleOnIterSelectedEvent(iter);
        };
    };
    Grid.prototype.handleOnCSelectedEvent = function (c) {
        this.gridModel.c = c;
        this.gridView.updateC();
        this.gridView.drawJuliaSet();
        this.gridModel.p = new Complex_1.Complex(0, 0);
        this.gridView.drawP();
    };
    Grid.prototype.handleOnPSelectedEvent = function (p) {
        this.gridModel.p = p;
        this.gridView.updateP();
        this.gridView.drawP();
    };
    Grid.prototype.handleOnIterSelectedEvent = function (iter) {
        this.gridModel.iter = iter;
        this.gridView.updateIter();
        this.gridView.drawJuliaSet();
        this.gridView.drawP();
    };
    return Grid;
}());
exports.Grid = Grid;

},{"../utils/Complex":5,"./GridModel":2,"./GridView":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridModel = void 0;
var Complex_1 = require("../utils/Complex");
var GridModel = /** @class */ (function () {
    function GridModel() {
        this.c = new Complex_1.Complex(0, 0);
        this.p = new Complex_1.Complex(0, 0);
        this.iter = 30;
    }
    return GridModel;
}());
exports.GridModel = GridModel;

},{"../utils/Complex":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridView = void 0;
var Complex_1 = require("../utils/Complex");
var Mode_1 = require("../utils/Mode");
var GridView = /** @class */ (function () {
    function GridView(fractalCanvas, axisCanvas, pCanvas, mandelbrotCanvas, cContent, cButton, pContent, pButton, iterContent, iterSlider, mandelbrotButton, gridModel) {
        this.escapeRadius = 2;
        this.imaginaryAxisHeight = 1.5;
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
        this.mode = Mode_1.Mode.None;
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
    GridView.prototype.setupEvents = function (fractalCanvas) {
        var _this = this;
        fractalCanvas.onmousedown = function (event) {
            _this.handleOnMouseDownEvent(event);
        };
        fractalCanvas.onmousemove = function (event) {
            _this.handleOnMouseMoveEvent(event);
        };
        this.cButton.onclick = function (event) {
            _this.handleOnCButtonClickEvent(event);
        };
        this.pButton.onclick = function (event) {
            _this.handleOnPButtonClickEvent(event);
        };
        this.iterSlider.oninput = function () {
            _this.handleOnIterChangeEvent();
        };
        this.mandelbrotButton.onclick = function (event) {
            _this.handleOnMandelbrotButtonClickEvent(event);
        };
    };
    GridView.prototype.handleOnMouseDownEvent = function (event) {
        this.mode = Mode_1.Mode.None;
    };
    GridView.prototype.handleOnMouseMoveEvent = function (event) {
        if (this.mode == Mode_1.Mode.C)
            this.triggerOnCSelectedEvent(event);
        else if (this.mode == Mode_1.Mode.P)
            this.triggerOnPSelectedEvent(event);
    };
    GridView.prototype.handleOnCButtonClickEvent = function (event) {
        this.mode = Mode_1.Mode.C;
    };
    GridView.prototype.handleOnPButtonClickEvent = function (event) {
        this.mode = Mode_1.Mode.P;
    };
    GridView.prototype.handleOnMandelbrotButtonClickEvent = function (event) {
        this.showMandelbrot = !this.showMandelbrot;
        this.updateMandelbrotVisibility();
    };
    GridView.prototype.handleOnIterChangeEvent = function () {
        this.triggerOnIterSelectedEvent();
    };
    GridView.prototype.triggerOnCSelectedEvent = function (event) {
        if (this.oncselected == null)
            return;
        var c = this.pixelToComplex(event.x, event.y);
        this.oncselected(c);
    };
    GridView.prototype.triggerOnPSelectedEvent = function (event) {
        if (this.onpselected == null)
            return;
        var p = this.pixelToComplex(event.x, event.y);
        this.onpselected(p);
    };
    GridView.prototype.triggerOnIterSelectedEvent = function () {
        if (this.oniterselected == null)
            return;
        var iter = Math.round(parseFloat(this.iterSlider.value));
        this.oniterselected(iter);
    };
    GridView.prototype.updateC = function () {
        var c = this.gridModel.c;
        var i = c.i;
        var s = i < 0 ? " - " : " + ";
        i = Math.abs(i);
        this.cContent.textContent = c.r.toFixed(4) + s + i.toFixed(4) + "i";
    };
    GridView.prototype.updateP = function () {
        var p = this.gridModel.p;
        var i = p.i;
        var s = i < 0 ? " - " : " + ";
        i = Math.abs(i);
        this.pContent.textContent = p.r.toFixed(4) + s + i.toFixed(4) + "i";
    };
    GridView.prototype.updateIter = function () {
        this.iterContent.textContent = this.gridModel.iter.toString();
    };
    GridView.prototype.updateMandelbrotVisibility = function () {
        this.mandelbrotCanvasWrapper.style.display = this.showMandelbrot ? "block" : "none";
    };
    GridView.prototype.drawAxis = function () {
        if (this.axisCanvas == null)
            return;
        this.axisCanvas.clearRect(0, 0, this.width, this.height);
        var verticalLines = Math.floor(this.width * this.scale / 2);
        this.axisCanvas.strokeStyle = "#5990b5";
        this.axisCanvas.beginPath();
        for (var i = 0; i < verticalLines; i++) {
            var posX = (i + 1) / this.scale;
            this.axisCanvas.moveTo(this.centerX + posX, 0);
            this.axisCanvas.lineTo(this.centerX + posX, this.height);
            this.axisCanvas.moveTo(this.centerX - posX, 0);
            this.axisCanvas.lineTo(this.centerX - posX, this.height);
        }
        this.axisCanvas.stroke();
        var verticalMiniLines = Math.floor(this.width * this.scale * 10 / 2);
        this.axisCanvas.strokeStyle = "#95caed";
        this.axisCanvas.beginPath();
        for (var i = 0; i < verticalMiniLines; i++) {
            if ((i + 1) % 10 == 0)
                continue;
            var posX = (i + 1) / this.scale / 10;
            this.axisCanvas.moveTo(this.centerX + posX, 0);
            this.axisCanvas.lineTo(this.centerX + posX, this.height);
            this.axisCanvas.moveTo(this.centerX - posX, 0);
            this.axisCanvas.lineTo(this.centerX - posX, this.height);
        }
        this.axisCanvas.stroke();
        var horizontalLines = Math.floor(this.imaginaryAxisHeight);
        this.axisCanvas.strokeStyle = "#5990b5";
        this.axisCanvas.beginPath();
        for (var i = 0; i < horizontalLines; i++) {
            var posY = (i + 1) / this.scale;
            this.axisCanvas.moveTo(0, this.centerY + posY);
            this.axisCanvas.lineTo(this.width, this.centerY + posY);
            this.axisCanvas.moveTo(0, this.centerY - posY);
            this.axisCanvas.lineTo(this.width, this.centerY - posY);
        }
        this.axisCanvas.stroke();
        var horizontalMiniLines = Math.floor(this.imaginaryAxisHeight * 10);
        this.axisCanvas.strokeStyle = "#95caed";
        this.axisCanvas.beginPath();
        for (var i = 0; i < horizontalMiniLines; i++) {
            if ((i + 1) % 10 == 0)
                continue;
            var posY = (i + 1) / this.scale / 10;
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
    };
    GridView.prototype.drawMandelbrot = function () {
        if (this.mandelbrotCanvas == null)
            return;
        var imageData = this.mandelbrotCanvas.createImageData(this.width, this.height);
        var buf = new ArrayBuffer(imageData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        var point = new Complex_1.Complex(0, 0);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var c = this.pixelToComplex(j, i);
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
    };
    GridView.prototype.drawJuliaSet = function () {
        if (this.fractalCanvas == null)
            return;
        var imageData = this.fractalCanvas.createImageData(this.width, this.height);
        var buf = new ArrayBuffer(imageData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var point = this.pixelToComplex(j, i);
                if (this.converges(point, this.gridModel.c, this.gridModel.iter)) {
                    buf8[(i * this.width + j) * 4 + 3] = 255;
                }
            }
        }
        imageData.data.set(buf8);
        this.fractalCanvas.putImageData(imageData, 0, 0);
        var x = this.centerX + Math.floor(this.gridModel.c.r / this.scale);
        var y = this.centerY - Math.floor(this.gridModel.c.i / this.scale);
        var radius = 5;
        this.fractalCanvas.beginPath();
        this.fractalCanvas.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.fractalCanvas.fillStyle = 'red';
        this.fractalCanvas.strokeStyle = 'red';
        this.fractalCanvas.fill();
        this.fractalCanvas.stroke();
    };
    GridView.prototype.drawP = function () {
        if (this.pCanvas == null)
            return;
        this.pCanvas.clearRect(0, 0, this.width, this.height);
        var p = this.gridModel.p.copy();
        if (p.r == 0 && p.i == 0)
            return;
        for (var i = 0; i < this.gridModel.iter; i++) {
            if (i > 0) {
                p.square();
                p.add(this.gridModel.c);
            }
            var x = this.centerX + Math.floor(p.r / this.scale);
            var y = this.centerY - Math.floor(p.i / this.scale);
            var radius = i == 0 ? 5 : 1.5;
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
            if (i < this.gridModel.iter - 1)
                this.pCanvas.moveTo(x, y);
        }
    };
    GridView.prototype.pixelToComplex = function (x, y) {
        return new Complex_1.Complex((x - this.centerX) * this.scale, -(y - this.centerY) * this.scale);
    };
    GridView.prototype.converges = function (point, c, iter) {
        var cx = c.r;
        var cy = c.i;
        var escapeRadiusSquare = this.escapeRadius * this.escapeRadius;
        var x = point.r;
        var y = point.i;
        var xTmp = 0;
        for (var i = 0; i < iter; i++) {
            xTmp = x * x - y * y + cx;
            y = (x + x) * y + cy;
            x = xTmp;
            if ((x * x + y * y) > escapeRadiusSquare)
                return false;
        }
        return true;
    };
    return GridView;
}());
exports.GridView = GridView;

},{"../utils/Complex":5,"../utils/Mode":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./grid/Grid");
var grid;
var fractalCanvas;
var axisCanvas;
var mandelbrotCanvas;
var pCanvas;
var cContent;
var cButton;
var pContent;
var pButton;
var iterContent;
var iterSlider;
var mandelbrotButton;
window.onload = function () {
    setupHtmlElements();
    createGrid();
};
function setupHtmlElements() {
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
function createGrid() {
    if (!(fractalCanvas instanceof HTMLCanvasElement))
        return;
    if (!(axisCanvas instanceof HTMLCanvasElement))
        return;
    if (!(mandelbrotCanvas instanceof HTMLCanvasElement))
        return;
    if (!(pCanvas instanceof HTMLCanvasElement))
        return;
    if (!(cContent instanceof HTMLSpanElement))
        return;
    if (!(pContent instanceof HTMLSpanElement))
        return;
    if (!(iterContent instanceof HTMLSpanElement))
        return;
    if (!(iterSlider instanceof HTMLInputElement))
        return;
    if (cButton == null)
        return;
    if (pButton == null)
        return;
    if (mandelbrotButton == null)
        return;
    fractalCanvas.width = window.innerWidth;
    fractalCanvas.height = window.innerHeight;
    axisCanvas.width = window.innerWidth;
    axisCanvas.height = window.innerHeight;
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    mandelbrotCanvas.width = window.innerWidth;
    mandelbrotCanvas.height = window.innerHeight;
    grid = new Grid_1.Grid(fractalCanvas, axisCanvas, pCanvas, mandelbrotCanvas, cContent, cButton, pContent, pButton, iterContent, iterSlider, mandelbrotButton);
}

},{"./grid/Grid":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complex = void 0;
var Complex = /** @class */ (function () {
    function Complex(r, i) {
        this.r = r;
        this.i = i;
    }
    Complex.prototype.add = function (other) {
        this.r += other.r;
        this.i += other.i;
    };
    Complex.prototype.square = function () {
        var newR = this.r * this.r - this.i * this.i;
        this.i = 2 * this.r * this.i;
        this.r = newR;
    };
    Complex.prototype.module = function () {
        return Math.sqrt(this.r * this.r + this.i * this.i);
    };
    Complex.prototype.copy = function () {
        return new Complex(this.r, this.i);
    };
    return Complex;
}());
exports.Complex = Complex;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mode = void 0;
var Mode;
(function (Mode) {
    Mode[Mode["None"] = 0] = "None";
    Mode[Mode["C"] = 1] = "C";
    Mode[Mode["P"] = 2] = "P";
})(Mode = exports.Mode || (exports.Mode = {}));

},{}]},{},[4]);
