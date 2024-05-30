import * as util from "./util.js";

const animation = Symbol("animation");

class Ticker extends Map {
  constructor(fps) {
    super();
    super.set("lambda", new Set());
    super.set("animation", {});
    this.fps = 0;
    this.fps = fps;
    super.set("run", (function run() {
      if(!this[animation].stopped) requestAnimationFrame(run.bind(this));
      let now = Date.now();
      let elapsed = now - this[animation].then;
      let fps = 1000/this.fps;
      if(elapsed > fps) {
        this[animation].then = now - (elapsed % fps);
        for(let fn of this.lambda) fn.call(this);
      }
    }).bind(this));
  }
  get [animation]() {return super.get("animation")}
  get started() {return !this[animation].stopped}
  get lambda() {return Array.from(super.get("lambda"))}
  get fps() {return super.get("fps")}
  set fps(fps) {
    fps = util.num.max(fps, 0);
    if(fps == 0) return;
    super.set("fps", fps);
  }
  add(...vals) {
    vals = vals.filter(e => typeof e === "function");
    for(let val of vals) super.get("lambda").add(val);
    return this;
  }
  remove(...vals) {
    vals = vals.filter(e => typeof e === "function");
    for(let val of vals) super.get("lambda").delete(val);
    return this;
  }
  start() {
    this[animation].stopped = false;
    this[animation].start = this[animation].then = Date.now();
    super.get("run")();
    return this;
  }
  stop() {
    this[animation].stopped = true;
    return this;
  }
}
for(let e of Object.getOwnPropertyNames(Map.prototype)) delete Ticker.prototype[e];
export default Ticker;