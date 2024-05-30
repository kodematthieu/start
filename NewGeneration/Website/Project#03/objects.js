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
  constructor(x,y,opts) {
    this.pos = createVector(x,y)
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
    let isValid = true
    // if(hitbox) hitbox.forEach(e => {if(!(e instanceof Hitbox)) isValid = false})
    if(!isValid) return
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
class Boundary{
  constructor(x1,y1,x2,y2) {
    this.a = createVector(x1,y1)
    this.b = createVector(x2,y2)
  }
  show() {
    stroke(255)
    line(this.a.x,this.a.y,this.b.x,this.b.y)
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
    return Hitbox.Rect(pos, size, size)
  }
  static Ellipse(pos,rx,ry) {
    const hitbox = []
    let prev = createVector()
    prev.x = pos.x + Math.cos(0) * rx
    prev.y = pos.y + Math.sin(0) * ry
    const orig = createVector()
    orig.set(prev.x,prev.y)
    for(let i = 0; i < 360; i+=45/Math.max(rx,ry)) {
      let npos = createVector()
      let rad = radians(i)
      npos.x = pos.x + Math.cos(rad) * rx
      npos.y = pos.y + Math.sin(rad) * ry
      hitbox.push({a: prev, b: npos})
      prev = npos
    }
    return hitbox
  }
  static Circle(pos, r) {
    return Hitbox.Ellipse(pos, r, r)
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