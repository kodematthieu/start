window.onerror = function(msg, url, line) {
  alert("Error Caught!");
}

let clickX, clickY;
let touchX, touchY;
let mouseX, mouseY;

/* Degrees to Radians
 * a = (n / 360)
 * b = (Math.PI * 2) * a
 */

function Canvas2DModifier(selector, obj) {
  this.canvas = document.querySelector(selector);
  this.width = (obj.width || 100);
  this.height = (obj.height || 100);
  this.resolution = obj.resolutionLvL || 1;
  this.resize = obj.resize || true;
  this.pixel = obj.pixel || true;
  this.canvas.style.width = this.width + "px";
  this.canvas.style.height = this.height + "px";
  this.canvas.width = this.width * this.resolution;
  this.canvas.height = this.height * this.resolution;
  if(this.pixel) {
    this.canvas.style.imageRendering = "-moz-crisp-edges";
    this.canvas.style.imageRendering = "-webkit-crisp-edges";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.imageRendering = "crisp-edges";
  }
  const Context = this.canvas.getContext("2d");
  Context.scale(this.resolution, this.resolution);
  Context.fillStyle = "white";
  Context.strokeStyle = "black";
  Context.lineWidth = 1;
  Context.lineCap = "round";
  this.angleMode = obj.angleMode || "radians";

  this.canvas.addEventListener('click', event => {
    clickX = event.x;
    clickY = event.y;
  });

  this.canvas.addEventListener('touchmove', event => {
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
  });

  this.canvas.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  this.background = (r, g, b, a) => {
    if(typeof r === "number" || r instanceof Number) {
      this.r = r;
      this.g = g || r;
      this.b = b || r;
      this.a = (a || 100) / 100;
    }
    else if(r instanceof Object) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = (r.a || 100) / 100;
    }
    else if(r instanceof Array) {
      this.r = r[0];
      this.g = r[1];
      this.b = r[2];
      this.a = (r[3] || 100) / 100;
    }
    else {
      return;
    }
    Context.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    Context.fillRect(0, 0, this.width, this.height);
    //Context.fillStyle = "white";
  }
  this.rotate = (rad) => {
    if(this.angleMode === "degrees") {
      this.angle = (Math.PI * 2) * (rad / 360);
    }
    else if(this.angleMode === "radians") {
      this.angle = rad;
    }
    Context.rotate(this.angle);
  }
  this.scale = (x, y) => {
    this.x = x;
    this.y = y || x;
    Context.scale(this.x, this.y);
  }
  this.translate = (x, y) => {
    this.x = x;
    this.y = y || x;
    Context.translate(this.x, this.y);
  }
  this.translateX = (x) => {
    this.x = x;
    this.y = 0;
    Context.translate(this.x, this.y);
  }
  this.translateY = (y) => {
    this.x = 0;
    this.y = y;
    Context.translate(this.x, this.y);
  }
  this.beginShape = () => {
    Context.beginPath();
  }
  this.endShape = () => {
    Context.closePath();
  }
  this.noFill = () => {
    Context.beginPath();
    Context.fillStyle = "transparent";
  }
  this.fill = (r, g, b, a) => {
    if(r instanceof Array) {
      this.r = r[0];
      this.g = r[1];
      this.b = r[2];
      this.a = (r[3] || 100) / 100;
    }
    else if(r instanceof Object) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = (r.a || 100) / 100;
    }
    else if(typeof r == "number" || r instanceof Number) {
      this.r = r;
      this.g = g || r;
      this.b = b || r;
      this.a = (a || 100) / 100;
    }
    Context.beginPath();
    Context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
  }
  this.noStroke = () => {
    Context.beginPath();
    Context.strokeStyle = "transparent";
  }
  this.stroke = (r, g, b, a) => {
    if(r instanceof Array) {
      this.r = r[0];
      this.g = r[1];
      this.b = r[2];
      this.a = (r[3] || 100) / 100;
    }
    else if(r instanceof Object) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = (r.a || 100) / 100;
    }
    else if(typeof r == "number" || r instanceof Number) {
      this.r = r;
      if((typeof g == "number" || g instanceof Number) && (typeof b == "number" || b instanceof Number)) {
        this.g = g;
        this.b = b;
      }
      else if(!g && !b) {
        this.g = r;
        this.b = r;
      }
      this.a = (a || 100) / 100;
    }
    Context.beginPath();
    Context.strokeStyle = "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
  }
  this.strokeWidth = (width) => {
    Context.lineWidth = width;
  }
  this.circle = (x, y, r) => {
    this.x = x;
    this.y = y;
    this.r = (r || 0) - r/2;
    Context.beginPath();
    Context.arc(this.x, this.y, this.r, 0, Math.PI*2);
    Context.fill();
    Context.stroke();
  }
  this.rect = (x, y, sx, sy) => {
    this.x = x;
    this.y = y;
    this.sx = sx || 1;
    this.sy = sy || sx;
    Context.beginPath();
    Context.rect(this.x, this.y, this.sx, this.sy);
    Context.fill();
    Context.stroke();
  }
  this.point = (x, y) => {
    this.x = x;
    this.y = y;
    this.r = 1;
    Context.beginPath();
    Context.fillStyle = "black"
    Context.arc(this.x, this.y, this.r, 0, Math.PI*2);
    Context.fill();
    Context.stroke();
  }
  this.arc = (x, y, r, startDeg, endDeg) => {
    var startA = startDeg / 360;
    var endA = endDeg / 360;
    this.x = x;
    this.y = y;
    this.r = (r || 1) - r/2;
    if(this.angleMode === "degrees") {
      this.startDeg = (Math.PI*2) * (startA / 360);
      this.endDeg = (Math.PI*2) * (endA / 360);
    }
    else if(this.angleMode === "radians") {
      this.startDeg = startA;
      this.endDeg = endA;
    }
    this.startDeg = (Math.PI*2) * startA;
    this.endDeg = (Math.PI*2) * endA;
    Context.beginPath();
    Context.arc(this.x, this.y, this.r, this.startDeg, this.endDeg);
    Context.fill();
    Context.stroke();
  }
  this.line = (x1, y1, x2, y2) => {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    Context.beginPath();
    Context.moveTo(this.x1, this.y1);
    Context.lineTo(this.x2, this.y2);
    Context.stroke();
  }
  this.moveTo = (x, y) => {
    this.x = x;
    this.y = y;
    Context.moveTo(this.x, this.y);
    Context.stroke();
  }
  this.lineTo = (x, y) => {
    this.x = x;
    this.y = y;
    Context.lineTo(this.x, this.y);
    Context.stroke();
  }
  this.loadImage = function(filepath, x, y, w = 16, h = w) {
    let image;
    if(filepath != undefined && filepath != "" && filepath != null) {
      image = new Image();
      image.src = filepath;
    }
    image.onload = function() {
      Context.drawImage(this, x, y, w, h);
    }
  }
  this.createImage = (w, h) => {
    return Context.createImageData(w, h);
  }
  return "[Object Canvas2DModifier]";
}
class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(x, y) {
    var addX, addY;
    if(x instanceof Array) {
      addX = x[0];
      addY = x[1];
    }
    else if(typeof x === "number" && typeof y === "number") {
      addX = x;
      addY = y;
    }
    else if(typeof x === "number" && typeof y === "undefined") {
      addX = x;
      addY = x;
    }
    else if(x instanceof Vector2D) {
      addX = x.x;
      addY = x.y;
    }
    this.x += addX;
    this.y += addY;
  }
  sub(x, y) {
    var subX, subY;
    if(x instanceof Array) {
      subX = x[0];
      subY = x[1];
    }
    else if(typeof x === "number" && typeof y === "number") {
      subX = x;
      subY = y;
    }
    else if(typeof x === "number" && typeof y === "undefined") {
      subX = x;
      subY = x;
    }
    else if(x instanceof Vector2D) {
      subX = x.x;
      subY = x.y;
    }
    this.x -= subX;
    this.y -= subY;
  }
  mult(x, y) {
    var multX, multY;
    if(x instanceof Array) {
      multX = x[0];
      multY = x[1];
    }
    else if(typeof x === "number" && typeof y === "number") {
      multX = x;
      multY = y;
    }
    else if(typeof x === "number" && typeof y === "undefined") {
      multX = x;
      multY = x;
    }
    else if(x instanceof Vector2D) {
      multX = x.x;
      multY = x.y;
    }
    this.x *= multX;
    this.y *= multY;
  }
}

const random = (min, max) => {
  var result;
  if(min == 0) {
    result = Math.random() * max;
  }
  else if(!max) {
    result = Math.random() * min;
  }
  else if(min > 0) {
    do {
      result = Math.random() * max;
    } while(result < min || result > max);
  }
  else if(min < 0) {
    result = (Math.random() * (max-min)) + min;
  }
  return result;
}

var later = new Date().getTime();
function drawShapes() {}
function runAlways() {
  requestAnimationFrame(runAlways);
  var today = new Date().getTime();
  drawShapes(today - later);
  later = new Date().getTime();
}
runAlways();

const dist = (x1, y1, x2, y2) => {
  let distX = x2 - x1;
  let distY = y2 - y1;

  return Math.sqrt(distX*distX + distY*distY);
}
