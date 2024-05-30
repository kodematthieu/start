// 5px = 1m

const GRAVITY = 9.8 / 20;
let ball, surface;

function setup() {
  createCanvas(600, 600);

  ball = new Ball(width / 2, 100, 10, 75);
  surface = new Surface(0, (height / 6) * 5, width, height);
}

function draw() {
  background(175);

  //surface.show();

  ball.show();
  ball.update();
  //ball.applySurface(surface);
  ball.classical();
}
