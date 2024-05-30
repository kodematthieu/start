function rotate(vec, angle) {
  vec = [vec.x, vec.y];
  angle = angle * (Math.PI/180);
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return new Vector(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
}
function rotation(vec) {
  if(vec.x == 0 && vec.y == 0) return 0;
  let a = Math.atan2(vec.x, -vec.y);
  return (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI);
}
function hex_line(angle, length) {
  if(isNaN(Number(angle))) angle = 0;
  angle = Math.abs(angle % 360);
  length = Math.max(0, isNaN(Number(length)) ? 0 : length);
  const edges = Array(6).fill(1).map((e, i) => i*60);
  var start = new Vector();
  var end = Vector.fromAngle(angle);
  end.mult(length);
  var points;
  var lerps = [];
  for(let i = 0; i < length+1; i++) lerps.push(lerp_point(start, end, i/length));
  points = Array(lerps.length).fill();
  for(let i = 0; i < points.length; i++) {
    let e = lerps[i].clone();
    let prev = points[i-1];
    if(i == 0) {points[i] = e;continue}
    let angle = lerps[i-1].angle;
    angle = edges.sort((a, b) => Math.abs(angle-a) - Math.abs(angle-b))[0];
    points[i] = Vector.fromAngle(angle);
  }
  // let dir = edges.sort((a, b) => Math.abs(angle-a) - Math.abs(angle-b))[0];
  return points.map(e => e.toJSON());
}
function lerp_point(p0, p1, t) {
  return new Vector(lerp(p0.x, p1.x, t), lerp(p0.y, p1.y, t));
}
function lerp(start, end, t) {
  return start + t * (end-start);
}
class Vector extends Map {
  static angleMode = "degrees";
  constructor(x, y) {
    super();
    this.set(x, y);
  }
  get x() {return super.get("x")}
  set x(x) {super.set("x", typeof x !== "number" || isNaN(x) ? 0 : x)}
  get y() {return super.get("y")}
  set y(y) {super.set("y", typeof y !== "number" || isNaN(y) ? 0 : y)}
  get angle() {let a = Math.atan2(this.x, -this.y);if(this.constructor.angleMode === "radians") return a;return (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)}
  set angle(a) {let rotation = (typeof a !== "number" || isNaN(a) ? 0 : a) - this.angle;this.rotate(rotation)}
  get length() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    return Math.sqrt(x+y);
  }
  set(x, y) {
    if(x instanceof Array) {y = x[1];x = x[0]}
    else if(typeof x === "object") {y = x.y;x = x.x}
    this.x = x;
    this.y = y;
    return this;
  }
  get(attr) {
    if(typeof attr === "string" && ["x", "y"].includes(attr)) return this[attr];
    if(attr instanceof Array && attr.some(e => ["x", "y"].includes(e))) {
      let results = [];
      for(let coord of attr.filter(e => ["x", "y"].includes(e))) results.push(this[coord]);
      return results;
    }
    return null;
  }
  add(x, y) {
    let vec = new Vector(x, y);
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  sub(x, y) {
    let vec = new Vector(x, y);
    this.y -= vec.y;
    this.x -= vec.x;
    return this;
  }
  mult(m) {
    m = typeof m !== "number" || isNaN(m) ? 1 : m;
    this.x *= m;
    this.y *= m;
    return this;
  }
  div(d) {
    d = typeof d !== "number" || isNaN(d) ? 1 : d;
    this.x /= d;
    this.y /= d;
    return this;
  }
  rotate(angle) {return this.set(this.constructor.rotate(this, angle))}
  equals(vec, attr) {return this.constructor.equals(this, vec, attr)}
  clone() {return new this.constructor(this)}
  toJSON() {
    let attr = ["x","y"];
    let results = {};
    for(let e of attr) results[e] = this[e];
    return results;
  }
  toString() {return `${this.constructor.name} ${this.x}, ${this.y}`}
  toArray() {return [this.x, this.y]}
  static equals(vec1, vec2, attr) {
    if(!(vec1 instanceof this)) return false;  
    if(!(vec2 instanceof this)) return false;
    if(!(attr instanceof Array)) attr = [attr];
    attr = attr.filter(e => e === "x" || e === "y");
    if(attr.length == 0) attr = ["x", "y"];
    attr = Array.from(new Set(attr));
    if(attr.includes("x") && vec1.x != vec2.x) return false;
    if(attr.includes("y") && vec1.y != vec2.y) return false;
    return true;
  }
  static rotate(vec, angle) {
    if(!(vec instanceof this)) return null;
    angle = typeof angle !== "number" || isNaN(angle) ? 0 : angle;
    if(this.angleMode === "degrees") angle = angle * (Math.PI/180);
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let x = vec.x * cos - vec.y * sin;
    let y = vec.x * sin + vec.y * cos;
    return new this(Math.round(x*10000)/10000, Math.round(y*10000)/10000);
  }
  static fromAngle(angle) {return this.rotate(new this(0,-1), angle)}
}
console.log(hex_line(90, 4));
