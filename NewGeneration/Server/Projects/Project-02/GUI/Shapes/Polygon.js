import Vector from "../Vector.js";
import Shape from "./Base.js";
import Rectangle from "./Rectangle.js";
import Ellipse from "./Ellipse.js";

class Polygon extends Shape {
  constructor(...points) {
    super();
    if(points.length == 1 && points[0] instanceof Array) points = points[0];
    points = points.map(e => new Vector(e));
    [].push.call(this, ...points);
  }
  static from(val) {
    if(val instanceof Array || val instanceof this) return new this(...Array.from(val));
    if(val instanceof Rectangle) return new this(new Vector(val.x, val.y), new Vector(val.x+val.width, val.y), new Vector(val.x+val.width, val.y+val.height), new Vector(val.x, val.y+val.height));
    if(val instanceof Ellipse) {
      let points = [];
      for(let i = 0; i < 360; i+=45/Math.max(val.width/2,val.height/2)) {
        let npos = new Vector();
        let rad = i * (Math.PI / 180);
        npos.x = val.x + Math.cos(rad) * (val.width/2);
        npos.y = val.y + Math.sin(rad) * (val.height/2);
        points.push(npos);
      }
      return new this(...points);
    }
    return null;
  }
}
export default Polygon;