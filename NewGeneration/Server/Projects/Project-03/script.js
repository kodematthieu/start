let world, textures = {}, hex;

function preload() {
  textures.base = loadImage("assets/textures/plain.svg");
}
function setup() {
  createCanvas(window.innerWidth, window.innerWidth);
  hex = new Hexagon(window.innerWidth/2, window.innerWidth/2, window.innerWidth/20, textures);
  world = Hexagon.board(hex, 6);
}
function draw() {
  noLoop()
  background(255);
  fill(0,255,255);
  stroke(0);
  rect(200,200,100,100)
  // try {
  world.render("p5");
  // }catch(e) {alert(e)}
}