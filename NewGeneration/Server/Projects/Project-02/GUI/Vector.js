import * as util from "./util.js";
import Matrix from "./Matrix.js";

class Vector extends Matrix {
  static angleMode = "degrees";
  constructor(x, y) {
    super(2,1);
    this.set(x, y);
    for(let e of ["0x0", "1x0", "size"]) delete this[e];
  }
  get x() {return this.get("x")}
  set x(x) {super.set(0, 0, Number(x))}
  get y() {return this.get("y")}
  set y(y) {super.set(1, 0, Number(y))}
  get angle() {let a = Math.atan2(this.x, -this.y);if(this.constructor.angleMode === "radians") return a;return (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)}
  set angle(a) {let rotation = Number(a) - this.angle;this.rotate(rotation)}
  get length() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    return Math.sqrt(x+y);
  }
  set length(l) {this.norm().mult(l)}
  get negative() {return new this.constructor().sub(this)}
  get abs() {return this.constructor.abs(this)}
  set(x, y) {
    if(x instanceof Array) {y = x[1];x = x[0]}
    else if(typeof x === "object") {y = x.y;x = x.x}
    this.x = x;
    this.y = y;
    return this;
  }
  get(attr) {
    if(attr === "x") return super.get(0, 0);
    if(attr === "y") return super.get(1, 0);
    if(attr instanceof Array && attr.some(e => ["x", "y"].includes(e))) return attr.filter(e => ["x", "y", "z"].includes(e)).map(e => this.get(e));
    return null;
  }
  add(x, y) {
    let vec = new this.constructor(x, y);
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  sub(x, y) {
    let vec = new this.constructor(x, y);
    this.y -= vec.y;
    this.x -= vec.x;
    return this;
  }
  dot(x, y) {
    let vec = new this.constructor(x, y);
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }
  cross(x, y) {
    let vec = new this.constructor(x, y);
    return this.x*vec.y - this.y*vec.x;
  }
  mult(m) {
    m = Number(m);
    this.x *= m;
    this.y *= m;
    return this;
  }
  div(d) {
    d = Number(d);
    this.x /= d;
    this.y /= d;
    return this;
  }
  pow(p) {
    p = Number(p);
    this.x **= p;
    this.y **= p;
    return this;
  }
  norm() {return this.div(this.length)}
  ceil(decimals) {return this.set(this.constructor.ceil(this, decimals))}
  round(decimals) {return this.set(this.constructor.round(this, decimals))}
  floor(decimals) {return this.set(this.constructor.floor(this, decimals))}
  limit(limit) {return this.set(this.constructor.limit(this, limit))}
  rotate(angle) {return this.set(this.constructor.rotate(this, angle))}
  dist(vec) {vec = new this.constructor(vec); return this.constructor.dist(this, vec)}
  lerp(vec, amt) {vec = new this.constructor(vec); return this.constructor.lerp(this, vec, amt)}
  equals(vec) {vec = new this.constructor(vec);return this.constructor.equals(this, vec)}
  clone() {return new this.constructor(this)}
  toJSON() {
    let attr = ["x","y"];
    let results = {};
    for(let e of attr) results[e] = this[e];
    return results;
  }
  toString() {return `<${this.constructor.name} [${this.x}, ${this.y}]>`}
  toArray() {return [this.x, this.y]}
  static equals(vec1, vec2) {
    if(!(vec1 instanceof this)) return false;  
    if(!(vec2 instanceof this)) return false;
    return vec1.x == vec2.y && vec1.y == vec2.y;
  }
  static rotate(vec, angle) {
    if(!(vec instanceof this)) return null;
    angle = Number(angle);
    if(this.angleMode === "degrees") angle = angle * (Math.PI/180);
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let x = vec.x * cos - vec.y * sin;
    let y = vec.x * sin + vec.y * cos;
    return new this(Math.round(x*10000)/10000, Math.round(y*10000)/10000);
  }
  static dist(vec1, vec2) {
    if(!(vec1 instanceof this)) return NaN;
    if(!(vec2 instanceof this)) return NaN;
    let vec = new this(); 
    vec.x = (vec1.x - vec2.x)**2;
    vec.y = (vec1.y - vec2.y)**2;
    return Math.sqrt(vec.x + vec.y);
  }
  static lerp(vec1, vec2, amt) {
    amt = typeof amt !== "number" || isNaN(amt) ? 1 : amt;
    if(!(vec1 instanceof this)) return null;
    if(!(vec2 instanceof this)) return null;
    amt = Math.max(Math.min(1, amt), 0);
    return new this(lerp(vec1.x, vec2.x, amt), lerp(vec1.y, vec2.y, amt));
    function lerp(start, end, t) {return start + t * (end-start)}
  }
  static limit(vec, limit) {
    limit = typeof limit !== "number" || isNaN(limit) ? 1 : limit;
    if(!(vec instanceof this)) return null;
    let mag = vec.length**2;
    vec = vec.clone();
    if(mag > limit**2) vec.div(Math.sqrt(mag)).mult(limit);
    return vec;
  }
  static angleFrom(vec1, vec2) {
    if(!(vec1 instanceof this)) return NaN;
    if(!(vec2 instanceof this)) return NaN;
    let angle = Math.acos((vec1.x * vec2.y + vec1.x * vec2.y) / (vec1.length * vec2.length));
    if(this.angleMode === "degrees") angle = angle * (Math.PI/180);
    return angle;
  }
  static abs(vec) {
    if(!(vec instanceof this)) return null;
    vec = vec.clone();
    vec.pow(2).pow(1/2);
    return vec;
  }
  static ceil(vec, decimals) {
    decimals = Number(decimals);
    if(!(vec instanceof this)) return null;
    let factor = 10**decimals;
    vec = vec.clone();
    vec.x = Math.ceil(vec.x*factor)/factor;
    vec.y = Math.ceil(vec.y*factor)/factor;
    return vec;
  }
  static round(vec, decimals) {
    decimals = Number(decimals);
    if(!(vec instanceof this)) return null;
    let factor = 10**decimals;
    vec = vec.clone();
    vec.x = Math.round(vec.x*factor)/factor;
    vec.y = Math.round(vec.y*factor)/factor;
    return vec;
  }
  static floor(vec, decimals) {
    decimals = Number(decimals);
    if(!(vec instanceof this)) return null;
    let factor = 10**decimals;
    vec = vec.clone();
    vec.x = Math.floor(vec.x*factor)/factor;
    vec.y = Math.floor(vec.y*factor)/factor;
    return vec;
  }
  static fromAngle(angle) {return this.rotate(new this(0,-1), angle)}
  static min(...vecs) {return vecs.filter(e => e instanceof this).sort((a, b) => b.length - a.length)[0]}
  static max(...vecs) {return vecs.filter(e => e instanceof this).sort((a, b) => a.length - b.length)[0]}
  static random() {return new this(Math.random(), Math.random())}
}
for(let e of ["forEach", "clear", "delete"]) delete Vector.prototype[e];
export default Vector;