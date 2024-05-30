import Vector from "../Vector.js";
import Shape from "./Base.js";

class Ellipse extends Shape {
  constructor(x, y, width, height) {
    super();
    let pos = new Vector(x,y);
    if(pos.y != y) {
      height = width;
      width = y;
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
export default Ellipse;