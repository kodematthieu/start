import * as util from "./util.js";
import Vector from "./Vector.js";
import Color from "./Color.js";
import {Polygon, Ellipse} from "./Shapes/index.js";

class Renderer extends Map {
  constructor(opts) {
    super();
    if(typeof opts !== "object") opts = {};
    opts.width = Math.max(1, util.num(opts.width, window.innerWidth));
    opts.height = Math.max(1, util.num(opts.height, window.innerHeight));
    if(typeof opts.canvas !== "string" && !(opts.canvas instanceof HTMLCanvasElement) && !(opts.canvas instanceof CanvasRenderingContext2D)) opts.canvas = document.createElement("canvas");
    if(typeof opts.canvas === "string") opts.canvas = document.querySelector(opts.canvas);
    if(opts.canvas instanceof CanvasRenderingContext2D) opts.canvas = opts.canvas.canvas;
    opts.canvas.width = opts.width;
    opts.canvas.height = opts.height;
    Object.defineProperty(this, "canvas", {value: opts.canvas, configurable: true, enumerable: true});
    Object.defineProperty(this, "context", {value: this.canvas.getContext("2d"), configurable: true, enumerable: true});
    super.set("vertices", null);
    this.canvas.ontouchmove = this.canvas.onmousemove = event => {
      let pos = new Vector();
      if(event instanceof MouseEvent) pos.set(event);
      if(event instanceof TouchEvent) {
        let touch = event.touches[event.touches.length-1];
        pos.set(touch.clientX, touch.clientY);
      }
      super.set("mouse-position", pos);
    };
    super.set("mouse-position", new Vector());
    this.stroke = new Color(0,0,0,0);
  }
  get on() {return this.canvas.addEventListener.bind(this.canvas)}
  get off() {return this.canvas.removeEventListener.bind(this.canvas)}
  get mouse() {return super.get("mouse-position")}
  get alpha() {return this.context.alpha}
  set alpha(v) {this.context.alpha = v}
  get width() {return this.canvas.width}
  set width(v) {this.canvas.width = v}
  get height() {return this.canvas.height}
  set height(v) {this.canvas.height = v}
  get fill() {return new Color(this.context.fillStyle)}
  set fill(v) {this.context.fillStyle = new Color(v).string;this.context.beginPath()}
  get stroke() {return new Color(this.context.strokeStyle)}
  set stroke(v) {this.context.strokeStyle = new Color(v).string;this.context.beginPath()}
  get strokeWidth() {return this.context.lineWidth}
  set strokeWidth(v) {if(util.num.is(v)) this.context.lineWidth = v}
  get strokeCap() {return this.context.lineCap}
  set strokeCap(v) {if(typeof v === "string") this.context.lineCap = v}
  get strokeJoint() {return this.context.lineJoin}
  set strokeJoint(v) {if(typeof v === "string") this.context.lineJoin = v}
  background(r,g,b,a) {
    a *= 255;
    let fill = this.fill;
    let stroke = this.stroke;
    this.fill = new Color(r,g,b,a);
    this.stroke = new Color(0,0,0,0);
    this.rect(0,0,this.width,this.height);
    this.context.closePath();
    this.stroke = stroke;
    this.fill = fill;
    return this;
  }
  rect(...args) {
    this.context.rect(...args);
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
    return this;
  }
  ellipse(...args) {
    let ellipse = Array.from(Polygon.from(new Ellipse(...args)));
    this.start();
    for(let e of ellipse) this.vertex(e);
    this.context.fill();
    this.context.stroke();
    this.finish();
    return this;
  }
  arc(x, y, radius, startAngle, endAngle) {
    this.context.arc(x, y, radius, util.num.degrees(startAngle), util.num.degrees(endAngle));
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
    return this;
  }
  drawImage(...args) {
    this.context.drawImage(...args);
    return this;
  }
  start() {this.context.beginPath();super.set("vertices", []);return this}
  vertex(x,y) {
    let pos = new Vector(x,y);
    let fn = "moveTo";
    if(super.get("vertices") === null) return this;
    if(super.get("vertices").length > 0) fn = "lineTo";
    this.context[fn](pos.x, pos.y);
    super.get("vertices").push(pos);
    return this;
  }
  finish() {this.context.closePath();super.set("vertices", null);return this}
}
for(let e of Object.getOwnPropertyNames(Map.prototype)) delete Renderer.prototype[e];
export default Renderer;