import Vector from "../Vector.js";
import {Shape} from "../Shapes/index.js";
import {RayCast} from "./RayCast.js";

class Body extends Map {
  constructor(x, y, hitArea) {
    super();
    let pos = new Vector(x, y);
    if(pos.y != y) hitArea = y;
    if(!(hitArea instanceof Shape)) throw new TypeError("The given `hitArea` is not of type Shape");
    super.set("pos", pos);
    super.set("vel", new Vector());
    this.hitArea = this.renderArea = hitArea;
    this.transparent = true;
    this.clickable = false;
  }
  get position() {return super.get("pos")}
  set position(v) {return super.set("pos", v instanceof Vector ? v : new Vector(v))}
  get x() {return this.position.x}
  set x(n) {this.position.x = n}
  get y() {return this.position.y}
  set y(n) {this.position.y = n}
  get velocity() {return super.get("vel")}
  set velocity(v) {return super.set("vel", v instanceof Vector ? v : new Vector(v))}
}
for(let e of Object.getOwnPropertyNames(Map.prototype)) if(e !== "constructor") delete Body.prototype[e];
export default Body;