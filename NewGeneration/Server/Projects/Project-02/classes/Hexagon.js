import {showAttrs} from "../functools/index.js";
import Vector from "./Vector.js";

const angles = Array(6).fill(60).map((e,i) => e*i);
const secret = {};
for(let e of ["center"]) secret[e] = Symbol(e);
class Hexagon {
  #center = new Vector();
  #radius = 0;
  #rotation = 0;
  #points = [];
  constructor(x, y, radius, type) {
    let center = new Vector(x, y);
    if(center.y !== y && arguments.length < 3) {type = radius;radius = y}
    if(isNaN(Number(radius))) radius = 10;
    if(!["flat", "pointy"].includes(type) && isNaN(Number(radius))) type = "flat";
    if(type === "flat") type = 30;
    if(type === "pointy") type = 0;
    if(isNaN(Number(type))) type = 0;
    this.center = center;
    this.rotation = type;
    this.radius = radius;
  }
  get center() {return this.#center}
  set center(vec) {if(typeof vec === "object")this.#center.set(vec);this.reset()}
  get radius() {return this.#radius}
  set radius(n) {if(!(isNaN(Number(n)) || Math.abs(n) != n)) this.#radius = n;this.reset()}
  get rotation() {return this.#rotation}
  set rotation(n) {if(!isNaN(Number(n))) this.#rotation = n;this.reset()}
  get points() {return [...this.#points].map(e => e.clone())}
  reset() {
    this.#points.splice(0,Infinity);
    for(let a of angles) {
      let point = Vector.fromAngle(a + this.rotation);
      point.mult(this.radius);
      point.add(this.center);
      this.#points.push(point);
    }
    // this.#points.push(this.points[0]);
    return this;
  }
  toJSON() {return this.points}
  static line(sample, length, angle) {
    if(!(sample instanceof this)) return [];
    length = Math.max(0, isNaN(Number(length)) ? 0 : Math.round(length));
    angle = isNaN(Number(angle)) ? 0 : angle;
    if(length == 0 || length == 1) return length == 0 ? [] : [new this(...sample.center.toArray(), sample.radius, sample.rotation)];
    length -= 1;
    let start = new Vector();
    let end = Vector.fromAngle(angle).mult(length+1);
    let hexes = angles.map(e => e+30+sample.rotation);
    hexes = hexes.map((e,i) => {
      let {x, y} = sample.center.clone().add(Vector.fromAngle(angle).mult(sample.radius*i*2));
      
      return new Hexagon(x, y, sample.radius, sample.rotation);
    });
    return hexes;
  }
  static ring(sample, radius) {
    if(!(sample instanceof this)) return [];
    radius = Math.max(0, isNaN(Number(radius)) ? 0 : Math.round(radius));
    if(radius == 0 || radius == 1) return radius == 0 ? [] : [new this(sample.center, sample.radius, sample.rotation)];
    let hexes = [];
    for(let i of angles) hexes.push(...this.line(new this(Vector.fromAngle(i+30+sample.rotation).mult(sample.radius).add(sample.center), sample.radius, sample.rotation), i+30+sample.rotation+120, radius-1));
    return hexes;
  }
}

export default showAttrs(Hexagon, ["x", "y"]);