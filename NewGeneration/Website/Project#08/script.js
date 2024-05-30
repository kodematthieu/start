window.onerror = (a, b, c) => alert(`${a}\n${b}\n${c}`);

let joy;
let Engine = Matter.Engine,
    Render = Matter.Render,
    World  = Matter.World,
    Bodies = Matter.Bodies;

let engine;

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create()
  joy = nipplejs.create({
    fadeTime: 500,
    mode: "static",
    position: {x: (width/3)/1.75, y: (height/3)*1.7}
  });
  window.addEventListener("click", () => {
    if(document.body.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
    else document.body.mozRequestFullScreen();
    screen.orientation.lock("landscape");
    joy.on("plain dir", (evt, dat) => {
      
    });
  });
}
function draw() {
  background(200);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function renderBody(body, palette) {
  
}