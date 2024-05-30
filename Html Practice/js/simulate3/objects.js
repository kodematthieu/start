window.onerror = function(msg, url, line) {
  alert("Error: " + msg + "\n\t\t" + url + "\n\t\t" + line);
};
function index(x, y) {
  if(x < 0 || y < 0 || x > cols-1 || y > rows-1) {
    return -1;
  }
  return x + y * cols
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true,true,true,true];
    this.visited = false;
  }

  checkNearby() {
    var nearby = [];

    var top = grid[index(this.x, this.y - 1)];
    var right = grid[index(this.x + 1, this.y)];
    var bottom = grid[index(this.x, this.y + 1)];
    var left = grid[index(this.x - 1, this.y)];

    if(top && !top.visited) {
      nearby.push(top);
    }
    if(right && !right.visited) {
      nearby.push(right);
    }
    if(bottom && !bottom.visited) {
      nearby.push(bottom);
    }
    if(left && !left.visited) {
      nearby.push(left);
    }

    if(nearby.length > 0) {
      var r = floor(random(0, nearby.length));
      return nearby[r];
    }
    else {
      return undefined;
    }
  }

  highlight(scl) {
    var x = this.x * scl;
    var y = this.y * scl;
    noStroke();
    fill(255, 150, 0, 150);
    rect(x,y,scl,scl);
  }

  points(scl) {
    var x = this.x * scl;
    var y = this.y * scl;
    noStroke();
    fill(0, 150, 255, 150);
    rect(x,y,scl,scl);
  }

  show(scl) {
    var x = this.x * scl;
    var y = this.y * scl;
    stroke(255);
    strokeWeight(1);

    if(this.walls[0]) {
      line(x, y, x+scl, y);
    }
    if(this.walls[1]) {
      line(x+scl, y, x+scl, y+scl);
    }
    if(this.walls[2]) {
      line(x+scl, y+scl, x, y+scl);
    }
    if(this.walls[3]) {
      line(x, y+scl, x, y);
    }

    if(this.visited) {
      noStroke();
      fill(100);
      rect(x, y, scl, scl);
    }
  }
}
