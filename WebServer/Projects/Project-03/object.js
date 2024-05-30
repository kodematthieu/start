class Hexagon {
  static angles = Array(6).fill().map((e,i) => 60*i);
  flat = false;
  textures = {};
  constructor(x,y, radius, textures) {
    this.center = new Vector(x, y);
    if(this.center.y !== y) radius = y;
    radius = Number(radius);
    if(isNaN(radius)) radius = 10;
    this.radius = radius;
    if(typeof textures === "object") this.textures = textures;
  }
  get points() {
    let points = Array(6).fill();
    points = points.map((_, i) => this.constructor.angles[i]+(!!this.flat?30:0));
    points = points.map(e => Vector.fromAngle(e).mult(this.radius).add(this.center));
    points.push(points[0].clone());
    return points;
  }
  render(type) {
    type += "";
    translate(width/2, height/2);
    if(Object.values(this.textures).every(e => e instanceof (type === "p5" ? p5.Image : null)) && !this.flat) rotate(60);
    if(typeof renderer[type] === "function") renderer[type](Object.values(this.textures).every(e => e instanceof (type === "p5" ? p5.Image : null)) ? this.textures.base : this.points, this.center, this.radius, this.radius);
    translate(-width/2, -height/2);
    return this;
  }
  inside(x, y) {
    let pos = new Vector(x,y);
    let points = this.points;
    let inside = false;
    for(let i = 0, j = points.length - 1; i < points.length; j = i++) {
      var xi = points[i].x, yi = points[i].y;
      var xj = points[j].x, yj = points[j].y;
      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if(intersect) inside = !inside;
    }
    return inside;
  }
  static board(sample, radius) {
    if(!(sample instanceof this) || typeof radius !== "number" || radius <= 0) return new HexaList();
    let hexes = [sample.center];
    let angles = this.angles.map(e => e+(sample.flat ? 0 : 30));
    if(radius == 1) return new HexaList(hexes.map(e => new this(e.x, e.y, sample.radius)));
    for(let i = 1; i < radius; i++) hexes.push(...ring(sample.center, i));
    hexes = hexes.map(e => new this(...e.toArray(), sample.radius, sample.textures));
    hexes.forEach(e => e.flat = sample.flat);
    return new HexaList(hexes);
    function ring(center, radius) {
      let mult = Math.sqrt(3);
      return angles.map(e => {
        let base = Vector.fromAngle(e).mult((radius*sample.radius)*mult).add(center);
        return line(base, radius, (e+120)%360);
      }).flat()
    }
    function line(center, length, angle) {
      let result = [];
      for(let i = 0; i < length; i++) result.push(Vector.fromAngle(angle).mult((i*sample.radius)*(Math.sqrt(3))).add(center));
      return result;
    }
  }
}
class HexaList {
  #list = [];
  #items = [];
  constructor(size) {
    if(typeof size === "number" && arguments.length < 2) this.#list = new Array(size).fill(null);
    else if(size instanceof Array && arguments.length < 2) this.push(...size);
    else this.push(...arguments);
  }
  get size() {return this.#list.length}
  get(index, fallback) {
    try {
      if(isNaN(Number(index))) throw new TypeError("Given index is of type NaN.");
      if(Number(index) == -1) index = this.size - 1;
      if(Number(index) >= this.size || Number(index) < 0) throw new RangeError("Given index out of range.");
    } catch(e) {if(arguments.length > 1) return fallback;throw e}
    return this.#list[index];
  }
  set(index, value) {
    try {
      if(isNaN(Number(index))) throw new TypeError("Given index is of type NaN.");
      if(Number(index) == -1) index = this.size - 1;
      if(Number(index) >= this.size || Number(index) < 0) throw new RangeError("Given index out of range.");
    } catch(e) {throw e}
    if(value instanceof Hexagon) this.#list[index] = value;
    return this;
  }
  push(...args) {
    args = args.filter(e => e instanceof Hexagon);
    this.#list.push(...args);
    this.refresh();
    return this;
  }
  pop(arg) {
    let result;
    if(!isNaN(Number(arg))) result = this.#list.pop(arg);
    else result = this.#list.pop();
    this.refresh();
    return result;
  }
  unshift(...args) {
    args = args.filter(e => e instanceof Hexagon);
    this.#list.unshift(...args);
    this.refresh();
    return this;
  }
  shift(arg) {
    let result;
    if(!isNaN(Number(arg))) result = this.#list.shift(arg);
    else result = this.#list.shift();
    this.refresh();
    return result;
  }
  find() {return this.#list.find(...arguments)}
  has() {return this.#list.includes(...arguments)}
  refresh() {
    for(let e of this.#items) delete this[e];
    this.#items = [];
    for(let i = 0; i < this.size; i++) {
      this.#items.push(i);
      Object.defineProperty(this, i, {configurable: true, enumerable: true});
      Object.defineProperty(this, i, {
        get: () => this.get(i),
        set: v => this.set(i, v),
      });
    }
    return this;
  }
  render() {
    for(let e of this.#list) e.render(...arguments);
    return this;
  }
  toArray() {return [...this.#list]}
  toJSON() {return [...this.#list]}
}
class Vector {
  static angleMode = "degrees";
  #x = NaN;
  #y = NaN;
  constructor(x, y) {
    if(arguments.length > 2) return new Vector3D(...arguments);
    if(typeof x === "undefined") x = 0;
    if(typeof y === "undefined") y = 0;
    this.set(x, y);
  }
  get x() {return this.#x}
  set x(x) {this.#x = Number(x)}
  get y() {return this.#y}
  set y(y) {this.#y = Number(y)}
  get angle() {let a = Math.atan2(this.x, -this.y);if(this.constructor.angleMode === "radians") return a;return (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)}
  set angle(a) {let rotation = Number(a) - this.angle;this.rotate(rotation)}
  get length() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    return Math.sqrt(x+y);
  }
  set length(l) {this.norm().mult(l)}
  get normal() {return this.clone().div(this.length)}
  get negative() {return new this.constructor().sub(this)}
  get absolute() {return this.constructor.absolute(this)}
  set(x, y) {
    if(x instanceof Array) {y = x[1];x = x[0]}
    else if(typeof x === "object") {y = x.y;x = x.x}
    this.x = x;
    this.y = y;
    return this;
  }
  get(attr) {
    if(["x","y"].includes(attr)) return this[attr];
    if(attr instanceof Array && attr.some(e => ["x", "y"].includes(e))) return attr.filter(e => ["x", "y"].includes(e)).map(e => this.get(e));
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
  ceil(decimals) {return this.set(this.constructor.ceil(this, decimals))}
  round(decimals) {return this.set(this.constructor.round(this, decimals))}
  floor(decimals) {return this.set(this.constructor.floor(this, decimals))}
  limit(limit) {return this.set(this.constructor.limit(this, limit))}
  rotate(angle) {return this.set(this.constructor.rotate(this, angle))}
  dist(vec) {vec = new this.constructor(vec);return this.constructor.dist(this, vec)}
  lerp(vec, amt) {vec = new this.constructor(vec);return this.constructor.lerp(this, vec, amt)}
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
  static absolute(vec) {
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
for(let e of Object.getOwnPropertyNames(Vector.prototype).filter(e => typeof (new Vector()[e]) !== "function")) Object.defineProperty(Vector.prototype, e, {configurable: true, enumerable: true});
class Vector3D {
  static angleMode = "degrees";
  #x = NaN;
  #y = NaN;
  #z = NaN;
  constructor(x, y, z) {
    if(typeof x === "undefined") x = 0;
    if(typeof y === "undefined") y = 0;
    if(typeof z === "undefined") z = 0;
    this.set(x, y, z);
  }
  get x() {return this.#x}
  set x(x) {this.#x = Number(x)}
  get y() {return this.#y}
  set y(y) {this.#y = Number(y)}
  get z() {return this.#z}
  set z(z) {this.#z = Number(z)}
  get length() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    let z = this.z ** 2;
    return Math.sqrt(x+y+z);
  }
  set length(l) {this.norm().mult(l)}
  get normal() {return this.clone().div(this.length)}
  get negative() {return new this.constructor().sub(this)}
  get absolute() {return this.constructor.absolute(this)}
  set(x, y, z) {
    if(x instanceof Array) {z = x[2];y = x[1];x = x[0]}
    else if(typeof x === "object") {z = x.z;y = x.y;x = x.x}
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  get(attr) {
    if(["x","y","z"].includes(attr)) return this[attr];
    if(attr instanceof Array && attr.some(e => ["x", "y", "z"].includes(e))) return attr.filter(e => ["x", "y", "z"].includes(e)).map(e => this.get(e));
    return null;
  }
  add(x, y, z) {
    let vec = new this.constructor(x, y, z);
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
  sub(x, y, z) {
    let vec = new this.constructor(x, y, z);
    this.y -= vec.y;
    this.x -= vec.x;
    this.z -= vec.z;
    return this;
  }
  dot(x, y, z) {
    let vec = new this.constructor(x, y, z);
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    return this;
  }
  cross(x, y, z) {
    let vec = new this.constructor(x, y, z);
    this.x = this.y*vec.z - this.z*vec.y;
    this.y = this.z*vec.x - this.x*vec.z;
    this.z = this.x*vec.y - this.y*vec.x;
    return this;
  }
  mult(m) {
    m = Number(m);
    this.x *= m;
    this.y *= m;
    this.z *= m;
    return this;
  }
  div(d) {
    d = Number(d);
    this.x /= d;
    this.y /= d;
    this.z /= d;
    return this;
  }
  pow(p) {
    p = Number(p);
    this.x **= p;
    this.y **= p;
    this.z **= p;
    return this;
  }
  ceil(decimals) {return this.set(this.constructor.ceil(this, decimals))}
  round(decimals) {return this.set(this.constructor.round(this, decimals))}
  floor(decimals) {return this.set(this.constructor.floor(this, decimals))}
  limit(limit) {return this.set(this.constructor.limit(this, limit))}
  dist(vec) {vec = new this.constructor(vec);return this.constructor.dist(this, vec)}
  lerp(vec, amt) {vec = new this.constructor(vec);return this.constructor.lerp(this, vec, amt)}
  equals(vec) {vec = new this.constructor(vec);return this.constructor.equals(this, vec)}
  clone() {return new this.constructor(this)}
  toJSON() {
    let attr = ["x","y","z"];
    let results = {};
    for(let e of attr) results[e] = this[e];
    return results;
  }
  toString() {return `<${this.constructor.name} [${this.x}, ${this.y}, ${this.z}]>`}
  toArray() {return [this.x, this.y, this.z]}
  static equals(vec1, vec2) {
    if(!(vec1 instanceof this)) return false;  
    if(!(vec2 instanceof this)) return false;
    return vec1.x == vec2.y && vec1.y == vec2.y && vec1.z == vec2.z;
  }
  static dist(vec1, vec2) {
    if(!(vec1 instanceof this)) return NaN;
    if(!(vec2 instanceof this)) return NaN;
    let vec = new this(); 
    vec.x = (vec1.x - vec2.x)**2;
    vec.y = (vec1.y - vec2.y)**2;
    vec.z = (vec1.z - vec2.z)**2;
    return Math.sqrt(vec.x + vec.y + vec.z);
  }
  static lerp(vec1, vec2, amt) {
    amt = typeof amt !== "number" || isNaN(amt) ? 1 : amt;
    if(!(vec1 instanceof this)) return null;
    if(!(vec2 instanceof this)) return null;
    amt = Math.max(Math.min(1, amt), 0);
    return new this(lerp(vec1.x, vec2.x, amt), lerp(vec1.y, vec2.y, amt), lerp(vec1.z, vec2.z, amt));
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
  static absolute(vec) {
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
    vec.z = Math.ceil(vec.z*factor)/factor;
    return vec;
  }
  static round(vec, decimals) {
    decimals = Number(decimals);
    if(!(vec instanceof this)) return null;
    let factor = 10**decimals;
    vec = vec.clone();
    vec.x = Math.round(vec.x*factor)/factor;
    vec.y = Math.round(vec.y*factor)/factor;
    vec.z = Math.round(vec.z*factor)/factor;
    return vec;
  }
  static floor(vec, decimals) {
    decimals = Number(decimals);
    if(!(vec instanceof this)) return null;
    let factor = 10**decimals;
    vec = vec.clone();
    vec.x = Math.floor(vec.x*factor)/factor;
    vec.y = Math.floor(vec.y*factor)/factor;
    vec.z = Math.floor(vec.z*factor)/factor;
    return vec;
  }
  static min(...vecs) {return vecs.filter(e => e instanceof this).sort((a, b) => b.length - a.length)[0]}
  static max(...vecs) {return vecs.filter(e => e instanceof this).sort((a, b) => a.length - b.length)[0]}
  static random() {return new this(Math.random(), Math.random(), Math.random())}
}
for(let e of Object.getOwnPropertyNames(Vector3D.prototype).filter(e => typeof (new Vector3D()[e]) !== "function")) Object.defineProperty(Vector3D.prototype, e, {configurable: true, enumerable: true});