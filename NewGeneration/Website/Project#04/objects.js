

class JoyStick {
  constructor(x,y,size) {
    this.initPos = createVector(x,y)
    this.fpos = createVector(this.initPos.x, this.initPos.y)
    this.radius = size || 50
    // alert(Math.max(this.initPos,this.fpos))
  }
  update() {
    let mouse = createVector(mouseX,mouseY)
    let valid = p5.Vector.dist(mouse,this.fpos) <= this.radius/2.8
    if(valid && mouseIsPressed) {
      this.fpos = p5.Vector.dist(mouse,this.initPos) <= this.radius/2 ? mouse : mouse
    }
  }
  show() {
    push()
    translate(this.initPos.x,this.initPos.y)
    fill(255,50)
    stroke(255)
    strokeWeight(this.radius/20)
    ellipse(0,0,this.radius)
    pop()
    push()
    translate(this.fpos.x,this.fpos.y)
    fill(255)
    stroke(200)
    strokeWeight(this.radius/30)
    ellipse(0,0,this.radius/3)
    pop()
  }
}
