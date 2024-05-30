import * as GUI from "./GUI/index.js";

const tick = new GUI.Ticker(60);
const graphics = new GUI.Renderer({canvas: "canvas"});
graphics.background(255,255,255)
let pos = new GUI.Vector(200,200)
graphics.fill = new GUI.Color(255,0,0)
  graphics.ellipse(pos.x,pos.y,300,300)
graphics.fill = new GUI.Color(255,255,0)
  graphics.rect(pos.x,pos.y,100,100)
tick.add(() => {
  pos.x += 1;
});
tick.start()