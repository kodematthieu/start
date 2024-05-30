var x1, x2, y1, y2, m1;
var m2, arm1, arm2, a1, a2;
var a1_v, a2_v, a1_a, a2_a;
const G = 1;

arm1 = 200;
arm2 = 200;
m1 = 40;
m2 = 40;
a1 = Math.PI / 2;
a2 = Math.PI / 2;
a1_v = 0;
a2_v = 0;

var trail;

var px2 = -1;
var py2 = -1;

let tX, tY;

var col1, col2, col3;

function setup() {
  createCanvas(1000, 1000);

  tX = width / 2;
  tY = height / 4;

  trail = createGraphics(width, height);
  trail.beginShape();
  trail.translate(tX, tY);
  trail.background(200);
  trail.endShape();

  col1 = 0;
  col2 = 0;
  col3 = 0;
}
function draw() {
  var num1 = -G * (2 * m1 + m2) * sin(a1);
  var num2 = -m2 * G * sin(a1 - 2 * a2);
  var num3 = -2 * sin(a1 - a2) * m2;
  var num4 = a2_v * a2_v * arm2 + a1_v * a1_v * arm1 * cos(a1 - a2);
  var den = arm1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));

  a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * sin(a1 - a2);
  num2 = a1_v * a1_v * arm1 * (m1 + m2);
  num3 = G * (m1 + m2) * cos(a1);
  num4 = a2_v * a2_v * arm2 * m2 * cos(a1 - a2);
  den = arm2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));

  a2_a = (num1 * (num2 + num3 + num4)) / den;

  image(trail, 0, 0);

  translate(tX, tY);

  x1 = arm1 * sin(a1);
  y1 = arm1 * cos(a1);
  x2 = x1 + arm2 * sin(a2);
  y2 = y1 + arm2 * cos(a2);

  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  if(col1 != 255 && col2 == 0 && col3 == 0) {
    col1 += 5;
  }
  else if(col1 == 255 && col2 != 255 && col3 == 0) {
    col2 += 5;
  }
  else if(col1 != 0 && col2 == 255 && col3 == 0) {
    col1 -= 5;
  }
  else if(col1 == 0 && col2 == 255 && col3 != 255) {
  }
  else if(col1 == 0 && col2 != 0 && col3 == 255) {
    col2 -= 5;
  }
  else if(col1 != 255 && col2 == 0 && col3 == 255) {
    col1 += 5;
  }
  else if(col1 == 255 && col2 == 0 && col3 != 0) {
    col3 -= 5;
  }

  fill(0);
  strokeWeight(8);
  line(0, 0, x1, y1);
  ellipse(x1, y1, m1, m1);
  line(x1, y1, x2, y2);
  ellipse(x2, y2, m2, m2);

  trail.beginShape();
  trail.strokeWeight(4);
  trail.stroke(col1, col2, col3);
  if(frameCount > 1) {
    trail.line(px2, py2, x2, y2);
  }
  trail.endShape();

  px2 = x2;
  py2 = y2;
}
