import * as util from "../util.js";
import Vector from "../Vector.js";
import {Line, Polygon, Shape} from "../Shapes/index.js";

class RayCast {
  constructor(x, y, angle, range) {
    let pos = new Vector(x, y);
    if(pos.y != y) {range = angle; angle = y}
    angle = util.num(angle);
    this.position = pos;
    this.direction = Vector.fromAngle(angle);
    this.range = range;
  }
  face(x, y) {
    let vec = new Vector(x, y);
    this.direction.x = vec.x - this.position.x;
    this.direction.y = vec.y - this.position.y;
    this.direction.norm();
    return this;
  }
  cast(obj) {
   if(obj instanceof Line) return this.castLine(obj);
   if(obj instanceof Shape) return this.castShape(obj);
   return null;
  }
  castLine(line) {
    if(!(line instanceof Line)) return null;
    let vec = null;
    let {x1,y1,x2,y2} = line;
    let x3 = this.position.x;
    let y3 = this.position.y;
    let x4 = this.position.x + this.direction.x;
    let y4 = this.position.y + this.direction.y;
    
    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if(den == 0) return null;
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4))/den;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3))/den;
    if(t > 0 && t < 1 && u > 0) vec = new Vector(x1 + t*(x2-x1),y1 + t*(y2-y1));
    let closest = null;
    let record = Infinity;
    if(vec != null) {
      let dist = Vector.dist(this.position,vec);
      if(dist < record) {
        record = dist;
        closest = vec;
      }
    }
    if(closest && record < this.range) return vec;
    return null;
  }
  castShape(shape) {
    if(!(shape instanceof Shape)) return null;
    shape = Array.from(Polygon.from(shape));
    let casts = [];
    for(let i = 0; i < shape.length; i++) {
      let a = shape[i];
      let b = i+1 < shape.length ? shape[i+1] : shape[0];
      let line = new Line(...a.toArray(), ...b.toArray());
      casts.push(...this.castLine(line));
    }
    return casts;
  }
}
class RayCast360 extends RayCast {
  constructor(x, y, opts) {
    super(x, y);
    delete this.direction;
    if(typeof opts !== "object") opts = {};
    let accuracy = util.num(opts.accuracy, 100);
    let viewAngle = util.num(opts.viewAngle, 360);
    let angleOffset = util.num(opts.angleOffset, 0);
    this.range = util.num(opts.range, Infinity);
    this.rays = [];
    for(let i = 0; i < viewAngle; i+=360/(360*accuracy)) this.rays.push(new super.constructor(this.position,(i+angleOffset) * (Math.PI / 180)));
  }
  castLine(line) {
    if(!(line instanceof Line)) return null;
    let casted = [];
    this.rays.forEach(e => {
      let closest = null;
      let record = Infinity;
      let pos = e.cast(line);
      if(pos != null) {
        let dist = Vector.dist(this.position,pos);
        if(dist < record) {
          record = dist;
          closest = pos;
        }
      }
      if(closest && record < this.range) casted.push(closest);
    });
    return casted;
  }
}
delete RayCast360.prototype.face;
export {RayCast, RayCast360};