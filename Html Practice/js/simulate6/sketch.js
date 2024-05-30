const width = 400, height = 200;

let y, x = 0;
let amp, freq;

function setup() {
  createCanvas(width, height);
  background(50);
  freq = 20;
  amp = 40;
}
function draw() {
  y = height/2 + amp * Math.sin(x/freq);
  strokeWeight(0);
  ellipse(x,y,5,5);
  x += 1;
}