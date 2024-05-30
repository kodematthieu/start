class Snake {
  constructor() {
    this.size = [width, height]
    this.box = 10
    this.isPause = false
    this.ondeath = () => {}
    this.reset()
  }
  pauseplay() {
    if(Math.abs(this.vel[0]+this.vel[1]) == 1) {
      this.prevVel = this.vel
      this.vel = [0,0]
      this.isPause = true
    }
    else {
      this.vel = this.prevVel
      this.isPause = false
    }
    return this.isPause
  }
  reset() {
    this.food = createVector(Math.floor(Math.random()*(width/this.box))*this.box, Math.floor(Math.random()*(height/this.box))*this.box)
    this.body = []
    this.body.push(createVector((this.box/2)*(this.size[0]/this.box), (this.box/2)*(this.size[1]/this.box)))
    this.body.push(createVector(((this.box/2)*(this.size[0]/this.box)-this.box), (this.box/2)*(this.size[1]/this.box)))
    this.body.push(createVector(((this.box/2)*(this.size[0]/this.box)-this.box*2), (this.box/2)*(this.size[1]/this.box)))
    this.body.push(createVector(((this.box/2)*(this.size[0]/this.box)-this.box*3), (this.box/2)*(this.size[1]/this.box)))
    this.vel = [1,0]
    this.score = 0
  }
  setKey(x, y) {
    if(!this.isPause) {
      this.vel = [x,y]
    }
  }
  update() {
    if(frameCount % 7 === 0) {
      let npos = createVector(this.body[0].x+(this.vel[0]*this.box), this.body[0].y+(this.vel[1]*this.box))
      let reset = false
      this.body.forEach((e,i) => {
        if(i != 0 && e.x == npos.x && e.y == npos.y) {
          this.ondeath(this.score)
          this.reset()
          this.pauseplay()
          reset = true
        }
      })
      if(!reset && ((npos.x >= width || npos.x < 0) || (npos.y >= height || npos.y < 0))) {
        this.ondeath(this.score)
        reset = true
        this.reset()
        this.pauseplay()
      }
      if(!reset && Math.abs(this.vel[0]+this.vel[1]) == 1) {
        if(npos.x == this.food.x && npos.y == this.food.y) {
          this.food = createVector(Math.floor(Math.random()*(width/this.box))*this.box, Math.floor(Math.random()*(height/this.box))*this.box)
          this.score += 1
        }
        else {
          this.body.pop()
        }
        this.body.unshift(npos)
      }
    }
  }
  show() {
    if(this.food) {
      stroke(0)
      strokeWeight(1)
      fill(255,0,0)
      rect(this.food.x,this.food.y,this.box,this.box)
    }
    this.body.forEach((e, i) => {
      noStroke()
      fill(i == 0 ? [0,0,255] : [0,255,0])
      if(i != 0) {
        strokeWeight(2)
        stroke(0)
      }
      rect(e.x,e.y,this.box,this.box)
    })
  }
}