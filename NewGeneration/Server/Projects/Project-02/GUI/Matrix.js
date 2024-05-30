import * as util from "./util.js";

class Matrix extends Map {
  constructor(x, y) {
    super();
    if(x.constructor.name === this.constructor.name) {
      let other = new this.constructor(...x.size);
      x.forEach((v,k) => other.set(...k, v));
      return other;
    }
    else if(x instanceof Array && x[0] instanceof Array) {
      let other = new this.constructor(x[0].length, x.length);
      for(let j = 0; j < x.length; j++) for(let i = 0; i < x[j].length; i++) other.set(i, j, x[j][i]);
      return other;
    }
    else if(x instanceof Array) {
      y = x[1];
      x = x[0];
    }
    else if(typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    x = util.num.max(x,1);
    y = util.num.max(y,1);
    Object.defineProperty(this, "size", {value: [x, y], configurable: true});
    for(let j = 0; j < y; j++) {
      for(let i = 0; i < x; i++) {
        super.set([i, j], 0);
        Object.defineProperty(this, i + "x" + j, {configurable: true, enumerable: true});
        Object.defineProperty(this, i + "x" + j, {
          get: () => this.get(i, j),
          set: v => this.set(i, j, v)
        });
      }
    }
  }
  set(x, y, val) {
    if(x instanceof Array) {
      val = y;
      y = x[1];
      x = x[0];
    }
    else if(typeof x === "object") {
      val = y;
      y = x.y;
      x = x.x;
    }
    if((isNaN(Number(x)) || isNaN(Number(y))) || (x < 0 || y < 0) || (x > this.size[0] || y > this.size[0])) return this;
    val = Number(val);
    if(x > this.size[0] || x < 0 || y > this.size[1] || y < 0) throw new RangeError(`Out of range. Matrix's size is ${this.size.join("x")} but given index was ${x + "x" + y}`);
    let key;
    super.forEach((v,k) => {if(util.arr.equals(k,[x,y])) key = k});
    if(typeof key === "undefined") key = [x,y];
    super.set(key, val);
    return this;
  }
  get(x, y) {
    if(x instanceof Array) {
      y = x[1];
      x = x[0];
    }
    else if(typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    let key;
    if(x > this.size[0] || x < 0 || y > this.size[1] || y < 0) throw new RangeError(`Out of range. Matrix's size is ${this.size.join("x")} but given index was ${x + "x" + y}`);
    super.forEach((v,k) => {if(util.arr.equals(k,[x,y])) key = k});
    if(typeof key === "undefined") key = [x,y];
    return super.get(key);
  }
  add(m) {m = new this.constructor(m);if(!util.arr.equals(this.size,m.size)) throw new RangeError("Matrices that should be operated should have the same sizes!");m.forEach((v,k) => m.set(...k, v+this.get(...k)));return this}
  sub(m) {m = new this.constructor(m);if(!util.arr.equals(this.size,m.size)) throw new RangeError("Matrices that should be operated should have the same sizes!");m.forEach((v,k) => m.set(...k, v-this.get(...k)));return this}
  pow(n) {
    if(typeof n !== "number") return this;
    super.forEach((v,k) => this.set(...k, v**n));
    return this;
  }
  mult(m) {
    if(typeof m === "number") super.forEach((v,k) => this.set(...k, v*m));
    return this;
  }
  div(m) {
    if(typeof m === "number") super.forEach((v,k) => this.set(...k, v/m));
    return this;
  }
  clear() {super.forEach((v,k) => this.set(...k, 0));return this}
  clone() {return new this.constructor(this)}
  toJSON() {
    let arr = [];
    super.forEach((v,k) => {
      if(typeof arr[k[1]] === "undefined") arr[k[1]] = [];
      arr[k[1]][k[0]] = v;
    });
    return arr;
  }
  get [Symbol.toStringTag]() {return this.constructor.name+this.size.join("x")}
}
for(let e of ["has", "size", "entries", "keys", "values", "delete"]) delete Matrix.prototype[e];
export default Matrix;