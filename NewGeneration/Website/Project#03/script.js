let width = 400
let height = 400
let walls = []
let You

let Xoff = 0
let Yoff = 1000

function setup() {
  createCanvas(width,height)
  // for(let i = 0; i < 5; i++) {
  //   const x1 = random(width)
  //   const x2 = random(width)
  //   const y1 = random(height)
  //   const y2 = random(height)
  //   walls.push(new Boundary(x1,y1,x2,y2))
  // }
  walls.push(new Boundary(0,0,width,0))
  walls.push(new Boundary(width,0,width,height))
  walls.push(new Boundary(width,height,0,height))
  walls.push(new Boundary(0,height,0,0))
  You = new Player(100,200,{accuracy: 1,viewAngle:360})
}
function draw() {
  background(0)
  for(let wall of walls) {
    wall.show()
  }
  You.show()
  You.scan(walls,Hitbox.Ellipse(createVector(width/2,height/2),width/4,height/2))
  // You.update(noise(Xoff)*width,noise(Yoff)*height)
  You.update(mouseX || width/2,mouseY || height/2)
  
  stroke(255)
  noFill()
  // ellipse(100,100,100,100)
  // rect(300,300,100,100)
  
  Xoff += 0.01
  Yoff += 0.01
}