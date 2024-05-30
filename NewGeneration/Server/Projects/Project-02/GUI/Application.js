import * as util from "./util.js";
import Ticker from "./Ticker.js";
import Color from "./Color.js";

class Application extends Map {
  constructor(opts = {}) {
    if(typeof opts !== "object") opts = {};
    if(typeof opts === "string" || (opts instanceof HTMLCanvasElement) || (opts instanceof CanvasRenderingContext2D)) opts = {canvas: opts, width: opts.width, height: opts.height};
    if(isNaN(Number(opts.width))) opts.width = window.innerWidth;
    if(isNaN(Number(opts.height))) opts.height = window.innerHeight;
    if(isNaN(Number(opts.resolution))) opts.resolution = 1;
    if(typeof opts.canvas !== "string" && !(opts.canvas instanceof HTMLCanvasElement) && !(opts.canvas instanceof CanvasRenderingContext2D)) opts.canvas = document.createElement("canvas");
    if(typeof opts.canvas === "string") opts.canvas = document.querySelector(opts.canvas);
    if(opts.canvas instanceof CanvasRenderingContext2D) opts.canvas = opts.canvas.canvas;
    opts.background = new Color(opts.background);
    this.width = opts.width;
    this.height = opts.height;
  }
  get width() {return super.get("width")}
  set width(val) {
    if(!util.num.is(val)) return;
    super.set("width", Math.max(val, 1));
  }
  get height() {return super.get("height")}
  set height(val) {
    if(!util.num.is(val)) return;
    super.set("height", Math.max(val, 1));
  }
  get resolution() {return super.get("resolution")}
  
}
export default Application;