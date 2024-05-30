import * as util from "./util.js";
import Vector from "../Vector.js";
import {Line} from "../Shapes/index.js";

const collision = {};

collision.polyToPoly = function polyToPoly(p1, p2) {
  p1 = Array.from(p1).map(e => new Vector(e));
  p2 = Array.from(p2).map(e => new Vector(e));
  let next = 0;
  for(let current = 0; current < p1.length; current++) {
    next = current+1;
    if(next == p1.length) next = 0;
    let vc = p1[current];
    let vn = p1[next];
    let collision = polyToLine(p2, vc.x,vc.y,vn.x,vn.y);
    if(collision) return true;
    collision = polyToPoint(p1, p2[0].x, p2[0].y);
    if(collision) return true;
  }
  return false;
};
collision.polyToLine = function polyToLine(vertices, lx1, ly1, lx2, ly2) {
  vertices = Array.from(vertices).map(e => new Vector(e));
  let {x1, y1, x2, y2} = new Line(lx1, ly1, lx2, ly2);
  let next = 0;
  for(let current = 0; current < vertices.length; current++) {
    next = current+1;
    if(next == vertices.length) next = 0;
    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;
    let hit = lineToLine([x1, y1], [x2, y2], [x3, y3], [x4, y4]);
    if(hit) return true;
  }
  return false;
};
collision.lineToLine = function lineToLine(vec1, vec2, vec3, vec4) {
  let {x: x1, y: y1} = new Vector(vec1);
  let {x: x2, y: y2} = new Vector(vec2);
  let {x: x3, y: y3} = new Vector(vec3);
  let {x: x4, y: y4} = new Vector(vec4);
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true;
  return false;
};
collision.polyToPoint = function polyToPoint(vertices, x, y) {
  vertices = Array.from(vertices).map(e => new Vector(e));
  let {x: px, y: py} = new Vector(x, y);
  let collision = false;
  let next = 0;
  for(let current = 0; current < vertices.length; current++) {
    next = current+1;
    if(next == vertices.length) next = 0;
    let vc = vertices[current];
    let vn = vertices[next];
    if(
      ((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
      (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)
    ) collision = !collision;
  }
  return collision;
};
export {collision};