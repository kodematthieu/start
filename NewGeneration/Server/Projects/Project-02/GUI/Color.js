import * as util from "./util.js";
import Matrix from "./Matrix.js";

const colors = {};

class Color extends Matrix {
  constructor(r,g,b,a) {
    if(arguments.length === 1) {
      if(typeof r === "string" && r.startsWith("#")) r = parseInt(r.slice(1,Infinity), 16);
      if(typeof r === "string" && (/^(rgb|rgba)/).test(r)) {
        r = r.match(/\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(\d+)\s*)?\)\s*$/);
        r.splice(0,1);
        r.splice(3,1);
        r[3] *= 255;
      }
      if(typeof r === "string") r = colors[r] || {};
      if(typeof r === "number") r = r.toString(16).padStart(3, "0").match(/^(([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?|([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?)/).slice(2,Infinity).filter(e => e).map(e => e.length == 1 ? e+e : e).map(e => parseInt(e, 16));
      if(r instanceof Array) {
        a = r[3];
        b = r[2];
        g = r[1];
        r = r[0];
      }
      else if(typeof r === "object") {
        a = r.a;
        b = r.b;
        g = r.g;
        r = r.r;
      }
    }
    super(4,1);
    for(let e of ["0x0", "1x0", "2x0", "3x0", "size"]) delete this[e];
    this.r = util.num.max(r,0) != r ? 0 : r;
    this.g = util.num.max(g,0) != g ? 0 : g;
    this.b = util.num.max(b,0) != b ? 0 : b;
    this.a = util.num.max(a,0) != a ? 255 : a;
  }
  get r() {return super.get(0, 0)}
  get g() {return super.get(1, 0)}
  get b() {return super.get(2, 0)}
  get a() {return super.get(3, 0)}
  set r(v) {if(util.num.max(v, 0) != v)return; super.set(0, 0, v > 255 ? 255 : v)}
  set g(v) {if(util.num.max(v, 0) != v)return; super.set(1, 0, v > 255 ? 255 : v)}
  set b(v) {if(util.num.max(v, 0) != v)return; super.set(2, 0, v > 255 ? 255 : v)}
  set a(v) {if(util.num.max(v, 0) != v)return; super.set(3, 0, v > 255 ? 255 : v)}
  get normal() {return new this.constructor(this.r/255, this.g/255, this.b/255, this.a/255)}
  get string() {return `rgba(${this.r},${this.g},${this.b},${this.a/255})`}
  toJSON() {return {r:this.r,g:this.g,b:this.b,a:this.a}}
  toString() {return `<Color [${this.r}, ${this.g}, ${this.b}, ${this.a}]>`}
}
for(let e of ["forEach", "set", "get", "clear", "pow", "delete", "add", "sub", "mult", "div"]) delete Color.prototype[e];
export default Color;