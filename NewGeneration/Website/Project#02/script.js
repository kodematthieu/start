window.onerror = (a,b,c) => alert(a + "\n" + b + "\n" + c)

let width = 1000
let height = 1000
let boids = []
let choosen

function setup() {
  createCanvas(width,height)
  // for(let i = 0; i < 10; i++) {
  //   x = Math.round(Math.random()*width)
  //   y = Math.round(Math.random()*height)
  //   boid = new Boid(x,y)
  //   boid.size = 25
  //   boid.vel(5)
  //   boid.angle = Math.round(Math.random()*360)
  //   boids.push(boid)
  // }
  // for(let i = 0; i < boids.length; i++) {
  //   boids[i].avoid = boids
  // }
  // choosen = boids[Math.round(Math.random()*boids.length)]
  choosen = new Boid(width/2,height/2)
  choosen.color = [255,100,50]
  choosen.angle = 90
  choosen.showView = true
  choosen.showRays = true
  choosen.showHitbox = true
}
function draw() {
  background(0)
  choosen.update()
  choosen.show()
  // for(let i = 0; i < boids.length; i++) {
  //   boids[i].contain(0,0,width,height)
  //   boids[i].update()
  //   boids[i].show()
  // }
}