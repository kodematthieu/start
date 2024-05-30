Math.add = function(...args) {
  args = args.filter(x => Number(x) === x)
  return args.reduce((x,y) => x+y)
}

const Board = function() {
  this.status = 0
  this.grid = [ [0,0,0], [0,0,0], [0,0,0] ]
  this.turn = function(x,y) {
    if(this.status == 0) return checkWinner.bind(this)()
    if(this.grid[y][x] !== 0) return false
    this.grid[y][x] = this.status
    this.status = this.status === -1 ? 1 : -1
    return checkWinner.bind(this)()
  }
  this.draw = function() {
    stroke(0)
    strokeWeight(5)
    noFill()
    push()
    translate(width/3, 0)
    line(0,0+50,0,height-50)
    line(width/3,0+50,width/3,height-50)
    pop()
    push()
    translate(0, height/3)
    line(0+50,0,width-50,0)
    line(0+50,height/3,width-50,height/3)
    pop()
    for(let y = 0; y < this.grid.length; y++) {
      for(let x = 0; x < this.grid[y].length; x++) {
        let posX = (width/6)+(width/3)*x
        let posY = (height/6)+(height/3)*y
        if(this.grid[y][x] === -1) {
          stroke(255,0,0)
          push()
          translate(posX, posY)
          beginShape()
          vertex(-37.5,-37.5)
          vertex(37.5,37.5)
          endShape()
          beginShape()
          vertex(-37.5,37.5)
          vertex(37.5,-37.5)
          endShape()
          pop()
        }
        if(this.grid[y][x] === 1) {
          stroke(0,0,255)
          push()
          translate(posX, posY)
          ellipse(0,0,75)
          pop()
        }
      }
    }
  }
  this.reset = function() {
    this.grid = [ [0,0,0], [0,0,0], [0,0,0] ]
    this.status = -1
  }
  function checkWinner() {
    let win = Infinity
    // Checking if draw
    let copy = []
    for(let y = 0; y < this.grid.length; y++) {
      for(let x = 0; x < this.grid[0].length; x++) {
        if(this.grid[y][x] !== 0) {
          copy.push(this.grid[y][x])
        }
      }
    }
    if(copy.length == 9) {
      win = 0
    }
    // Checking Horizontally
    for(let y = 0; y < this.grid.length; y++) {
      if(Math.abs(Math.add(...this.grid[y])) === 3) {
        win = Math.abs(Math.add(...this.grid[y]))/Math.add(...this.grid[y])
      }
    }
    // Checking Vertically
    for(let y = 0; y < this.grid.length; y++) {
      let add = []
      for(let x = 0; x < this.grid[y].length; x++) {
        add.push(this.grid[x][y])
      }
      if(Math.abs(Math.add(...add)) === 3) {
        win = Math.abs(Math.add(...add))/Math.add(...add)
      }
    }
    // Checking Diagonally'
    let add = []
    for(let y = 0; y < this.grid.length; y++) {
      for(let x = 0; x < this.grid[y].length; x++) {
        if((x+y*3) % 4 === 0) {
          add.push(this.grid[y][x])
        }
      }
    }
    if(Math.abs(Math.add(...add)) === 3) {
      win = Math.abs(Math.add(...add))/Math.add(...add)
    }
    add = []
    for(let y = 0; y < this.grid.length; y++) {
      this.grid[y] = this.grid[y].reverse()
      for(let x = 0; x < this.grid[y].length; x++) {
        if((x+y*3) % 4 === 0) {
          add.push(this.grid[y][x])
        }
      }
      this.grid[y] = this.grid[y].reverse()
    }
    if(Math.abs(Math.add(...add)) === 3) {
      win = Math.abs(Math.add(...add))/Math.add(...add)
    }
    if(win !== Infinity) this.status = 0
    return win
  }
}