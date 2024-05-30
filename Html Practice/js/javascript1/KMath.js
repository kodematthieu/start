const module = {};
module.package = {
  name: "KMattLog.js",
  version: "0.0.1",
  author: "Karel Matthieu L. Logro"
};

const ROUND = 0;
const FLOOR = 1;
const CEIL = 2;
const FIXED = 3;

const PI = Math.PI;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

class KMath {
  constructor(type, fix) {
    this.type = type || null;
    if(this.type == FIXED) {
      this.fixed = fix || 0;
    }
  }
  dist(x, y) {
    var ans = Math.sqrt(x*x + y*y);
    if(this.type == ROUND) {
      return Math.round(ans);
    }
    else if(this.type == FLOOR) {
      return Math.floor(ans);
    }
    else if(this.type == CEIL) {
      return Math.ceil(ans);
    }
    else if(this.type == FIXED && this.fixed) {
      return ans.toFixed(this.fixed);
    }
    else if(this.type == null) {
      return ans;
    }
  }
  percent(x, y) {
    var ans, num, perc;
    num = x;
    perc = y + "";
    if(perc.match("%")) {
      ans = num * (parseFloat(perc) / 100);
    }
    else if(!perc.match("%") && !perc.match("0.")) {
      ans = (perc / num) * 100 + "%";
    }
    else if(perc.match("0.")) {
      ans = num * perc;
    }
    if(this.type == ROUND) {
      return Math.round(ans);
    }
    else if(this.type == FLOOR) {
      return Math.floor(ans);
    }
    else if(this.type == CEIL) {
      return Math.ceil(ans);
    }
    else if(this.type == FIXED && this.fixed) {
      return ans.toFixed(this.fixed);
    }
    else if(this.type == null) {
      return ans;
    }
  }
  map(a, b, c, d, e) {
    var ans1, ans2, ans3, ansFinal;
    this.n = a;
    this.min1 = b;
    this.max1 = c;
    this.min2 = d;
    this.max2 = e;

    if((this.min2 == 0 || this.min2 != 0) && this.min1 == 0) {
      ans1 = this.max2 - this.min2;
      ans2 = this.n / (this.max1 - this.min1);
      ans3 = ans1 * ans2;
      ansFinal = ans3 + this.min2;
    }

    this.min = this.min2;
    if(this.type == ROUND) {
      return Math.round(ansFinal);
    }
    else if(this.type == FLOOR) {
      return Math.floor(ansFinal);
    }
    else if(this.type == CEIL) {
      return Math.ceil(ansFinal);
    }
    else if(this.type == FIXED && this.fixed) {
      return ansFinal.toFixed(this.fixed);
    }
    else if(this.type == null) {
      return ansFinal;
    }
  }
}
class Random {
  constructor(min, max) {
    this.min = min;
    this.max = max || 0;
    this.result = 0;

    this.min1 = Math.abs(this.min);
    this.max1 = Math.abs(this.max);

    this.sum = this.min1 + this.max1;
  }
  generate(type) {
    if(this.max == 0) {
      this.result = Math.random() * this.min;
    }
    else if(this.max != 0 && this.min < 0) {
      this.result = (Math.random() * this.sum) + this.min;
    }
    else if(this.max != 0 && this.min > 0) {
      this.result = (Math.random() * (this.max - this.min)) + this.min;
    }
    else {
      this.result = new Error('Error Caught on "new Random()" object');
    }

    if(type == ROUND) {
      this.result = Math.round(this.result);
    }
    else if(type == FLOOR) {
      this.result = Math.floor(this.result);
    }
    else if(type == CEIL) {
      this.result = Math.ceil(this.result);
    }
    else if(type == undefined) {
      this.result = this.result;
    }
    return this.result;
  }
}
class K2Vector {
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
    else if(x instanceof K2Vector) {
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
    else if(x instanceof K2Vector) {
      subX = x.x;
      subY = x.y;
    }
    this.x -= subX;
    this.y -= subY;
  }
}
