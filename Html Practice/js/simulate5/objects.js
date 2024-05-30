class Atom {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size || 5;
    this.vel = this.size * (0.1 / this.size);
    this.rad = 0;
    this.electronPos = createVector(0, 0);
  }
  setProton(value) {
    this.proton = value;
    fill(0, 100, 255);
    circle(this.pos.x, this.pos.y, this.size/16);
  }
  setElectron(value) {
    this.electron = value;
    this.rad += this.vel;
    if(this.electron == 1) {
      this.electronPos.x = this.pos.x + Math.cos(this.rad) * this.size;
      this.electronPos.y = this.pos.y + Math.sin(this.rad) * this.size;
      fill(0, 255, 100);
      circle(this.electronPos.x, this.electronPos.y, this.size/24);
    }
  }
}
