window.onerror = (a, b, c) => alert(`${a}\n${b}\n${c}`)

// const bestScore = new Score("jump-ball")

// const gyroscope = new Accelerometer({frequency: 8});

const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;
      
const engine = Engine.create();
const world = engine.world

let boxes = []

function setup() {
  window.canvas = createCanvas(400,400).canvas
  boxes.push(Bodies.rectangle(0, 200, 20, height, {isStatic: true}))
  World.add(world, Bodies.rectangle(0, 200, 20, height, {isStatic: true}))
  boxes.push(Bodies.rectangle(200, height, width, 20, {isStatic: true}))
  World.add(world, Bodies.rectangle(200, height, width, 20, {isStatic: true}))
  boxes.push(Bodies.rectangle(width, 200, 20, height, {isStatic: true}))
  World.add(world, Bodies.rectangle(width, 200, 20, height, {isStatic: true}))
  Engine.run(engine)
}

function mousePressed() {
  let Box = Bodies.circle(mouseX, mouseY, 20, {restitution: 1.4})
  boxes.push(Box)
  World.add(world, Box)
}

function draw() {
  background(200)
  for(let Box of boxes) {
    fill(0,0,255)
    noStroke()
    push()
    translate(Box.position.x, Box.position.y)
    rotate(Box.angle)
    beginShape()
    for(let Vertex of Box.vertices) {
      vertex(Vertex.x - Box.position.x, Vertex.y - Box.position.y)
    }
    endShape()
    pop()
  }
}