var cols, rows;
var w = 10;
var grid = [];
var current;
var stack = [];

function setup() {
  createCanvas(400, 400);
  cols = floor(width/w);
  rows = floor(height/w);

  for(var y = 0; y < rows; y++) {
    for(var x = 0; x < cols; x++) {
      var cell = new Cell(x, y);
      grid.push(cell);
    }
  }
  current = grid[0];
}
function draw() {
  background(255);

  for(var i = 0; i < grid.length; i++) {
    grid[i].show(w);
  }

  grid[0].points(w);
  grid[grid.length - 1].points(w);

  current.visited = true;
  var next = current.checkNearby();

  if(next) {
    next.visited = true;

    stack.push(current);

    removeWalls(current, next);

    current = next;
  }
  else if(stack.length > 0) {
    current = stack.pop();
  }
  if(current != grid[0] && stack.length > 0 && next) {
    current.highlight(w);
  }
}

function removeWalls(a, b) {
  var x = a.x - b.x;
  if(x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  }
  else if(x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.y - b.y;
  if(y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  }
  else if(y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
