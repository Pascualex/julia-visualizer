(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var Complex_1 = require("../utils/Complex");
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas) {
        this.gridModel = new GridModel_1.GridModel();
        this.gridView = new GridView_1.GridView(htmlCanvas, this.gridModel);
        this.setupEvents();
        this.gridModel.c = new Complex_1.Complex(0, -0.6);
        this.gridView.draw();
    }
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.oncselected = function (c) {
            _this.handleOnCSelected(c);
        };
    };
    Grid.prototype.handleOnCSelected = function (c) {
        this.gridModel.c = c;
        this.gridView.draw();
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
    }
    return GridModel;
}());
exports.GridModel = GridModel;

},{"../utils/Complex":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridView = void 0;
var Complex_1 = require("../utils/Complex");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, gridModel) {
        this.maxIterations = 30;
        this.escapeRadius = 3;
        this.imaginaryAxisHeight = 3;
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
    GridView.prototype.setupEvents = function (htmlCanvas) {
        var _this = this;
        htmlCanvas.onmousedown = function (event) {
            _this.handleOnMouseDownEvent(event);
        };
        htmlCanvas.onmousemove = function (event) {
            _this.handleOnMouseMoveEvent(event);
        };
    };
    GridView.prototype.handleOnMouseDownEvent = function (event) {
        this.updateOnMove = !this.updateOnMove;
        this.handleOnMouseMoveEvent(event);
    };
    GridView.prototype.handleOnMouseMoveEvent = function (event) {
        if (this.updateOnMove)
            this.triggerOnCSelected(event);
    };
    GridView.prototype.triggerOnCSelected = function (event) {
        if (this.oncselected == null)
            return;
        var c = this.pixelToComplex(event.x, event.y);
        this.oncselected(c);
    };
    GridView.prototype.draw = function () {
        var _a;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
        this.drawJuliaSet();
        this.drawAxis();
    };
    GridView.prototype.drawAxis = function () {
        if (this.canvas == null)
            return;
        this.canvas.fillStyle = "#000000";
        this.canvas.beginPath();
        this.canvas.moveTo(this.centerX, 0);
        this.canvas.lineTo(this.centerX, this.height);
        this.canvas.moveTo(0, this.centerY);
        this.canvas.lineTo(this.width, this.centerY);
        this.canvas.stroke();
    };
    GridView.prototype.drawJuliaSet = function () {
        if (this.canvas == null)
            return;
        var imageData = this.canvas.createImageData(this.width, this.height);
        var buf = new ArrayBuffer(imageData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var point = this.pixelToComplex(j, i);
                if (this.converges(point)) {
                    buf8[(i * this.width + j) * 4 + 3] = 255;
                }
            }
        }
        imageData.data.set(buf8);
        this.canvas.putImageData(imageData, 0, 0);
    };
    GridView.prototype.pixelToComplex = function (x, y) {
        return new Complex_1.Complex((x - this.centerX) * this.scale, (y - this.centerY) * this.scale);
    };
    GridView.prototype.converges = function (point) {
        for (var i = 0; i < this.maxIterations; i++) {
            point.square();
            point.add(this.gridModel.c);
            if (point.module() > this.escapeRadius)
                return false;
        }
        return true;
    };
    return GridView;
}());
exports.GridView = GridView;

},{"../utils/Complex":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./grid/Grid");
var grid;
var htmlGrid;
window.onload = function () {
    setupHtmlElements();
    createGrid();
};
function setupHtmlElements() {
    htmlGrid = document.getElementById('grid');
}
function createGrid() {
    if (htmlGrid instanceof HTMLCanvasElement) {
        htmlGrid.width = window.innerWidth;
        htmlGrid.height = window.innerHeight;
        grid = new Grid_1.Grid(htmlGrid);
    }
    else {
        grid = null;
    }
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
    return Complex;
}());
exports.Complex = Complex;

},{}]},{},[4]);
