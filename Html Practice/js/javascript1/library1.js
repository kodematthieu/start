function preload() {}
function setup() {}
function draw() {}

//Constants
const PI = Math.PI;
const KM3D = "webgl";
const KM2D = "2d";

//Window
var framesPerSecond1 = 60;
var framesPerSecond = framesPerSecond1;
let frameCount = 0;

var canvas, context, console;
var Width, Height;
var body = document.querySelector('body');
body.innerHTML += '<canvas id="CANVAS" width="200px" height="200px"></canvas>';
body.innerHTML += '<textarea readonly width="400px" id="console"></textarea>';
canvas = document.querySelector('#CANVAS');
consoleLog = document.querySelector('#console');
Width = canvas.width;
Height = canvas.height;

//Math Operator
const pow = function(n, e) {
  this.e = e || 2;
  return Math.pow(n, this.e);
};
const floor = function(n) {
  return Math.floor(n);
};
const round = function(n) {
  return Math.round(n);
};
const cos = function(n) {
  return Math.cos(n);
};
const sin = function(n) {
  return Math.sin(n);
};
const tan = function(n) {
  return Math.tan();
};
const abs = function(n) {
  return Math.abs(n);
};
const sqrt = function(n) {
  return Math.sqrt(n);
};
const dist = function(x, y) {
  this.result = pow(x) + pow(y);
  return sqrt(this.result);
};
const random = function(min, max) {
  this.min = min;
  this.max = max || 0;
  this.result = 0;

  this.min1 = Math.abs(this.min);
  this.max1 = Math.abs(this.max);

  this.sum = this.min1 + this.max1;

  if(!max) {
    this.result = Math.random() * (this.min + 1);
  }
  else if(max && min < 0) {
    this.result = (Math.random() * (this.sum + 1)) + this.min;
  }
  else if(max && min > 0) {
    this.result = (Math.random() * ((this.max - this.min) + 1)) + this.min;
  }
  else {
    this.result = new Error("Error Caught on random() Function");
  }
  return this.result;
};

//Math Objects
class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z || null;
  }
}

const size = function(w, h, render) {
  this.render = render || KM2D;

  canvas.width = w;
  canvas.height = h;
  Width = canvas.width;
  Height = canvas.height;

  context = canvas.getContext(this.render);
};
const background = function(r, g, b, a) {
  this.r = r;
  this.g = g || r;
  this.b = b || r;
  this.al = a || 100;
  this.a = this.al / 100;

  context.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  context.fillRect(0, 0, Width, Height); 
};
const fill = function(r, g, b, a) {
  this.r = r;
  this.g = g || r;
  this.b = b || r;
  this.al = a || 100;
  this.a = this.al / 100;

  context.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  context.fill();
};
const noFill = function() {
  context.fillStyle = "rgba(0, 0, 0, 0)";
  context.fill();
};
const stroke = function(r, g, b, a) {
  this.r = r;
  this.g = g || r;
  this.b = b || r;
  this.al = a || 100;
  this.a = this.al / 100;

  context.strokeStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  context.stroke();
};
const strokeWeight = function(n) {
  context.lineWidth = n;
};
const noStroke = function() {
  context.strokeStyle = "rgba(0, 0, 0, 0)";
  context.stroke();
};
const circle = function(cx, cy, r) {
  context.arc(cx, cy, r, 0, 2*Math.PI);
  context.stroke();
  context.fill();
};
const rect = function(x, y, w, h) {
  context.fillRect(x, y, w, h);
  context.stroke();
  context.fill();
};

//Functions Area
window.onload = function() {
  function frames() {
    draw();
    frameCount++;
    setTimeout(frames, 1000 / framesPerSecond);
    //alert(framesPerSecond);
    framesPerSecond = random(framesPerSecond1 - 0.5, framesPerSecond1 + 0.5);
  }
  preload();
  setup();
  frames();

  consoleLog.style.width = Width + "px";
  consoleLog.style.height = Height / 4 + "px";
}
function frameRate(rate) {
  if(!rate) {
    return framesPerSecond;
  }
  else {
    framesPerSecond1 = rate;
  }
}
function println(a) {
  console.log(a);
  consoleLog.innerText += a;
}

alert("Working Fine!");
