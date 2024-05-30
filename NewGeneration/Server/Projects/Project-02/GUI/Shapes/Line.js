import Vector from "../Vector.js";

class Line {
  constructor(x1, y1, x2, y2) {
    if(x1 instanceof this.constructor) return new this.constructor(x1.x1, x1.y1, x1.x2, x1.y2);
    let pos1 = new Vector(x1, y1);
    if(pos1.y != y1) {
      y2 = x2;
      x2 = y1;
    }
    let pos2 = new Vector(x2, y2);
    this.x1 = pos1.x;
    this.y1 = pos1.y;
    this.x2 = pos2.x;
    this.y2 = pos2.y;
  }
}
export default Line;