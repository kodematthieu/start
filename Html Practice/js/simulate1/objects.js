class Ball {
  constructor(x, y, m, e, col) {
    this.col = col || 51;
    this.pos = createVector(x, y);
    this.mass = m;
    this.r = this.mass * 5;
    this.weight = GRAVITY * this.mass;
    this.velY = sqrt(2 * GRAVITY * (this.pos.y / 20));
    this.velX = 0;
    this.accY = GRAVITY;
    this.bounce = e / 100;
  }
  update() {
    this.pos.add(this.velX, this.velY);
    this.pos.x = constrain(this.pos.x, 0 + (this.r/2), width - (this.r/2));
    this.pos.y = constrain(this.pos.y, 0 + (this.r/2), height - (this.r/2));
  }
  applySurface(sur) {
    this.surfaceF = sur.friction;
    this.sPos1 = sur.pos1;
    this.sPos2 = sur.pos2;
    this.surfaceY = (this.sPos1.y + this.sPos2.y) / 2;
    this.surfaceX = 0;

    //this.pos.x = constrain(this.pos.x, this.surfaceX + (this.r/2), width + (this.r/2));
    //this.pos.y = constrain(this.pos.y, 0 + (this.r/2), this.surfaceY + (this.r/2));
  }
  classical() {
    if(this.pos.y == height - this.r/2 || this.pos.y == 0 + this.r/2) {
      this.velY = -this.velY * this.bounce;
    }
    if(this.pos.x == width - this.r/2 || this.pos.x == 0 + this.r/2) {
      this.velX = -this.velX;
      this.velX *= this.surfaceF;
    }
    if(Math.abs(this.velY) === this.velY) {
      this.velY += this.accY;
    }
    else {
      this.velY -= this.accY;
    }
  }
  show() {
    fill(this.col);
    strokeWeight(1);
    stroke(0);
    circle(this.pos.x, this.pos.y, this.r);
  }
}
class Surface {
  constructor(x1, y1, x2, y2, f, col) {
    this.pos1 = createVector(x1, y1);
    this.pos2 = createVector(x2, y2);
    this.friction = f;
    this.col = col || 21;
  }
  show() {
    stroke(this.col);
    strokeWeight(5);
    line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
  }
}
