function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}
function draw() {
  var hr, min, sec;
  hr = hour();
  min = minute();
  sec = second();

  background(255);
  noFill();
  strokeWeight(10);
  translate(width/2, height/2);

  var a = map(hr % 12, 0, 12, 0, 360);
  stroke(100, 150, 255);
  arc(0, 0, 350, 350, 270, a + 270);

  push();
  rotate(a + 270);
  line(0, 0, 50, 0);
  pop();

  a = map(min, 0, 60, 0, 360);
  stroke(100, 255, 150);
  arc(0, 0, 325, 325, 270, a + 270);

  push();
  rotate(a + 270);
  line(0, 0, 87.5, 0);
  pop();

  a = map(sec, 0, 60, 0, 360);
  stroke(255, 100, 150);
  arc(0, 0, 300, 300, 270, a + 270);

  push();
  rotate(a + 270);
  line(0, 0, 125, 0);
  pop();

  stroke(0);
  strokeWeight(15);
  point(0, 0);
}
