class Boid {
  constructor(x = 0, y = 0, color = [0,255,0]) {
    this.pos = createVector(x,y)
    this.size = 20
    this.hitboxSize = [this.size/2,this.size/1.25]
    this.hitbox = Hitbox.Rect()
    this.color = color
    this.angle = 0
    this.velocity = 0
    this.viewDist = this.size*5
    this.showView = false
    this.showRays = false
    this.showHitbox = false
    this.raycast = new Player(this.pos, {accuracy:0.5,range:this.viewDist,viewAngle:280,angleOffset:-95})
    this.avoid = []
  }
  vel(value) {
    this.velocity = [0, value]
  }
  contain(x1, y1, x2, y2) {
    if(Math.min(x1,x2) > this.pos.x) this.pos.x = Math.max(x1,x2)
    if(Math.max(x1,x2) < this.pos.x) this.pos.x = Math.min(x1,x2)
    if(Math.min(y1,y2) > this.pos.y) this.pos.y = Math.max(y1,y2)
    if(Math.max(y1,y2) < this.pos.y) this.pos.y = Math.min(y1,y2)
  }
  update() {
    this.hitbox = [this.size/2,this.size/1.25]
    for(let i = 0; i < this.avoid.length; i++) {
      if(this.avoid[i].pos.x != this.pos.x || this.avoid[i].pos.y != this.pos.y) {
        
      }
    }
    this.pos.x -= RotateToVector(this.velocity, this.angle)[0]
    this.pos.y -= RotateToVector(this.velocity, this.angle)[1]
  }
  show() {
    let line1 = [0-(this.size/2),0]
    let line2 = [0+(this.size/2),0,]
    if(this.showRays == true) {
      
    }
    push()
    angleMode("degrees")
    translate(this.pos.x,this.pos.y)
    rotate(this.angle)
    noStroke()
    if(this.showView == true) {
      fill(255,255,255,25)
      arc(0, 0, this.viewDist*2, this.viewDist*2, 220-90, 140-90);
    }
    fill(this.color)
    beginShape()
    vertex(line1[0]+(this.size/3), line1[1]+(this.size/3))
    vertex(0, (0-this.size/3))
    vertex(line2[0]-(this.size/3), line2[1]+(this.size/3))
    endShape()
    if(this.showHitbox == true) {
      rectMode("center")
      strokeWeight(1)
      stroke("red")
      noFill()
      rect(0,0,...this.hitboxSize)
    }
    pop()
  }
}
class RayCast {
  constructor(pos,angle) {
    this.pos = pos
    this.dir = p5.Vector.fromAngle(angle)
  }
  face(x,y) {
    this.dir.x = x - this.pos.x
    this.dir.y = y - this.pos.y
    this.dir.normalize()
  }
  cast(wall) {
    const x1 = wall.a ? wall.a.x : wall.pos.x-1
    const y1 = wall.a ? wall.a.y : wall.pos.y-1
    const x2 = wall.b ? wall.b.x : wall.pos.x+1
    const y2 = wall.b ? wall.b.y : wall.pos.y+1
    
    const x3 = this.pos.x
    const y3 = this.pos.y
    const x4 = this.pos.x + this.dir.x
    const y4 = this.pos.y + this.dir.y
    
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if(den == 0) return
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4))/den
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3))/den
    if(t > 0 && t < 1 && u > 0) return createVector(x1 + t*(x2-x1),y1 + t*(y2-y1))
    else return
  }
  show() {
    push()
    stroke(255)
    translate(this.pos.x,this.pos.y)
    line(0,0,this.dir.x,this.dir.y)
    pop()
  }
}
class Player {
  constructor(pos,opts) {
    this.pos = pos
    this.accuracy = opts.accuracy || 100
    this.range = opts.range || Infinity
    this.viewAngle = opts.viewAngle || 360
    this.angleOffset = opts.angleOffset || 0
    this.showCast = true
    this.raycast = []
    for(let i = 0; i < this.viewAngle; i+=360/(360*this.accuracy)) {
      this.raycast.push(new RayCast(this.pos,radians(i+this.angleOffset)))
    }
  }
  update(x,y) {
    this.pos.set(x,y)
  }
  scan(Walls,...hitbox) {
    let walls = Walls
    if(hitbox) {
      hitbox.forEach(e => {
        walls = [...walls,...e]
      })
    }
    this.raycast.forEach(e => {
      let closest = null
      let record = Infinity
      for(let wall of walls) {
        const pos = e.cast(wall)
        if(pos) {
          const dist = p5.Vector.dist(this.pos,pos)
          if(dist < record) {
            record = dist
            closest = pos
          }
        }
      }
      if(closest && record < this.range) {
        if(!!this.showCast) {
          stroke(255,100)
          line(this.pos.x,this.pos.y,closest.x,closest.y)
        }
        return closest
      }
    })
    
  }
  show() {
    fill(255)
    ellipse(this.pos.x,this.pos.y,4)
    this.raycast.forEach(e => {
      e.show()
    })
  }
}
class Hitbox {
  static Rect(pos, width, height) {
    const hitbox = []
    hitbox.push({a: createVector(pos.x      , pos.y       ), b: createVector(pos.x      , pos.y+height)})
    hitbox.push({a: createVector(pos.x      , pos.y+height), b: createVector(pos.x+width, pos.y+height)})
    hitbox.push({a: createVector(pos.x+width, pos.y+height), b: createVector(pos.x+width, pos.y       )})
    hitbox.push({a: createVector(pos.x+width, pos.y       ), b: createVector(pos.x      , pos.y       )})
    return hitbox
  }
  static Square(pos, size) {
    const hitbox = []
    hitbox.push({a: createVector(pos.x     , pos.y     ), b: createVector(pos.x     , pos.y+size)})
    hitbox.push({a: createVector(pos.x     , pos.y+size), b: createVector(pos.x+size, pos.y+size)})
    hitbox.push({a: createVector(pos.x+size, pos.y+size), b: createVector(pos.x+size, pos.y     )})
    hitbox.push({a: createVector(pos.x+size, pos.y     ), b: createVector(pos.x     , pos.y     )})
    return hitbox
  }
  static Circle(pos, r) {
    const hitbox = []
    let prev = createVector()
    prev.x = pos.x + Math.cos(0) * r
    prev.y = pos.y + Math.sin(0) * r
    for(let i = r/90; i < 360; i+=r/90) {
      let npos = createVector()
      let rad = (i/360)*(Math.PI*2)
      npos.x = pos.x + Math.cos(rad) * r
      npos.y = pos.y + Math.sin(rad) * r
      hitbox.push({a: prev, b: npos})
      prev = npos
    }
    return hitbox
  }
  static Ellipse(pos,rx,ry) {
    const hitbox = []
    let prev = createVector()
    prev.x = pos.x + Math.cos(0) * rx
    prev.y = pos.y + Math.sin(0) * ry
    for(let i = Math.max(rx,ry)/90; i < 360; i+=Math.max(rx,ry)/90) {
      let npos = createVector()
      let rad = (i/360)*(Math.PI*2)
      npos.x = pos.x + Math.cos(rad) * rx
      npos.y = pos.y + Math.sin(rad) * ry
      hitbox.push({a: prev, b: npos})
      prev = npos
    }
    return hitbox
  }
  static Custom(...argv) {
    const hitbox = []
    for(let i = 0; i < argv.length; i++) {
      if(argv[i+1]) {
        hitbox.push({a: createVector(argv[i][0],argv[i][1]), b: createVector(argv[i+1][0],argv[i+1][1])})
      }
    }
    return hitbox
  }
}
function RotateToVector(vector, angle) {
  x = vector[0]
  y = vector[1]
  angle = radians(angle)
  nx = Math.cos(angle)*x - Math.sin(angle)*y
  ny = Math.sin(angle)*x + Math.cos(angle)*y
  return [nx||0,ny||0]
}
function VectorToRotate(vector) {
  
}