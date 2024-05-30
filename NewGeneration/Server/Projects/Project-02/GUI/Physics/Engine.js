import * as util from "../util.js";
import Ticker from "../Ticker.js";
import Renderer from "../Renderer.js";
import Body from "./Body.js";

class Engine extends Map {
  constructor(opts) {
    super();
    if(typeof opts !== "object") opts = {};
    super.set("bodies", []);
    super.set("ticker", null);
    super.set("renderer", null);
  }
  get bodies() {return super.get("bodies")}
  get ticker() {return super.get("ticker")}
  set ticker(v) {if(this.ticker instanceof Ticker) this.ticker.stop();if(v instanceof Ticker) super.set("ticker", v)}
  get renderer() {return super.get("renderer")}
  set renderer(v) {if(v instanceof Renderer) super.set("renderer", v)}
  connect(...obj) {
    if(obj.length > 1) for(let e of obj) this.connect(e);
    if(obj.length == 1) {
      obj = obj[0];
      this.ticker = obj;
      this.renderer = obj;
    }
    return this;
  }
  start() {
    if(this.ticker == null) throw new TypeError("engine.ticker was not specified.");
    if(this.ticker.started) throw new Error("engine.ticker has already started.");
    this.ticker.start();
    return this;
  }
  stop() {
    if(this.ticker == null) throw new TypeError("engine.ticker was not specified.");
    if(!this.ticker.started) throw new Error("engine.ticker has not started yet.");
    this.ticker.stop();
    return this;
  }
  add(...body) {
    if(body.length > 1) {
      for(let e of body) this.add(e);
      return this;
    }
    body = body[0];
    if(body instanceof Body) {
      let bodies = this.bodies;
      bodies.push(Object.freeze({
        get exclude() {return bodies.filter(e => e !== this)},
        get prev() {return bodies[bodies.indexOf(this)-1]},
        get value() {return body},
        get next() {return bodies[bodies.indexOf(this)+1]},
        get include() {return bodies.filter(e => true)},
      }));
    }
    return this;
  }
  remove(...body) {
    if(body.length > 1) {
      for(let e of body) this.remove(e);
      return this;
    }
    body = body[0];
    if(body instanceof Body) {
      let bodies = this.bodies;
      let index = bodies.indexOf(bodies.find(e => e.value === body));
      bodies.splice(index, 1);
    }
    return this;
  }
}
for(let e of Object.getOwnPropertyNames(Map.prototype)) delete Engine.prototype[e];