class MGame {
  static Canvas(w = window.innerWidth, h = window.innerHeight) {
    this.canvas = {};
    this.canvas.main = document.createElement("canvas");
    this.canvas.ctx = this.canvas.main.getContext("2d");
    this.canvas.size = [w,h];
    this.canvas.resolution = 1;
    this.canvas.objects = [];
    document.body.appendChild(this.canvas.main);
    
    let $this = this;
    const result = { main: this.canvas.main, context: this.canvas.ctx };
    result.setResolution = (num = 1) => {
      if((typeof num !== "number") || (num === 0)) return;
      this.canvas.resolution = num;
      $this = this;
    }
    result.setSize = (W = 0, H = 0) => {
      this.canvas.size = [W,H];
      $this = this;
    }
    result.addObject = (obj) => {
      if(!obj) return;
      this.canvas.objects.push(obj);
      $this = this;
    }
    result.removeObject = (obj) => {
      if(!obj) return;
      let id = obj.id;
      let target;
      this.canvas.objects.forEach((e,i) => {
        if(e.id === obj.id) target = i;
      });
      this.canvas.objects.splice(target,1);
      $this = this;
    }
    function $init() {
      requestAnimationFrame($init);
      $this.canvas.main.width = $this.canvas.size[0] *$this.canvas.resolution;
      $this.canvas.main.height = $this.canvas.size[1]*$this.canvas.resolution;
      $this.canvas.main.style.width = $this.canvas.size[0] + "px";
      $this.canvas.main.style.height = $this.canvas.size[1] + "px";
      $this.canvas.objects.forEach((e, i) => {
        let x, y, s1, s2;
        x = e.pos[0]*$this.canvas.resolution;
        y = e.pos[1]*$this.canvas.resolution;
        s1 = e.size[0]*$this.canvas.resolution;
        s2 = e.size[1]*$this.canvas.resolution;
        switch(e.type) {
          case 'ellipse':
            $this.canvas.ctx.beginPath();
            $this.canvas.ctx.fillStyle = e.color;
            $this.canvas.ctx.strokeStyle = e.stroke;
            $this.canvas.ctx.lineWidth = e.strokeWidth;
            $this.canvas.ctx.ellipse(x, y, s1, s2, 0, 0, Math.PI*2);
            $this.canvas.ctx.stroke();
            $this.canvas.ctx.fill();
            $this.canvas.ctx.closePath();
            break;
          case 'rectangle':
            $this.canvas.ctx.beginPath();
            $this.canvas.ctx.fillStyle = e.color;
            $this.canvas.ctx.strokeStyle = e.stroke;
            $this.canvas.ctx.lineWidth = e.strokeWidth;
            $this.canvas.ctx.rect(x, y, s1, s2);
            $this.canvas.ctx.stroke();
            $this.canvas.ctx.fill();
            $this.canvas.ctx.closePath();
            break;
          default:
            // code
        }
      });
    }
    $init()
    return result;
  }
  static Circle(cx, cy, r) {
    this.object = {
      id: Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16),
      type: "ellipse",
      pos: [ cx, cy ],
      size: [ r, r ],
      color: "white",
      strokeWidth: 1,
      stroke: "black",
      toString: () => "[object Circle]"
    };
    return this.object;
  }
  static Ellipse(cx, cy, rx, ry) {
    this.object = {
      id: Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16),
      type: "ellipse",
      pos: [ cx, cy ],
      size: [ rx, ry ],
      color: "white",
      strokeWidth: 1,
      stroke: "black",
      toString: () => "[object Ellipse]"
    };
    return this.object;
  }
  static Square(x, y, size) {
    this.object = {
      id: Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16),
      type: "rectangle",
      pos: [ x-(size/2), y-(size/2) ],
      size: [ size, size ],
      color: "white",
      strokeWidth: 1,
      stroke: "black",
      toString: () => "[object Square]"
    };
    return this.object;
  }
  static Rectangle(x, y, w, h) {
    this.object = {
      id: Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16),
      type: "rectangle",
      pos: [ x-(size/2), y-(size/2) ],
      size: [ w, h ],
      color: "white",
      strokeWidth: 1,
      stroke: "black",
      toString: () => "[object Rectangle]"
    };
    return this.object;
  }
  static Texture(i, x, y, w, h) {
    if(!(i instanceof HTMLImageElement)) return;
    this.object = {
      id: Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16)+Math.round(Math.random()*15).toString(16),
      type: "image",
      image: i,
      pos: [ x-(size/2), y-(size/2) ],
      size: [ w, h ],
      toString: () => "[object Texture]"
    };
    return this.object;
  }
}