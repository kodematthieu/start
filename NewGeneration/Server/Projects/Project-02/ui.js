export class Hexagon extends PIXI.Polygon {
  constructor(x, y, radius) {
    if(!Util.isType(x, Number)) x = 0;
    if(!Util.isType(y, Number)) y = x;
    if(!Util.isType(radius, Number)) radius = 10;
    super();
    this.radius = radius;
    this.center = new PIXI.Point(x, y);
    this.width = radius*2;
    this.height = (radius*2)/(Math.sqrt(3)/2);
  }
  get center() {return this._center}
  set center(val) {
    if(!(val instanceof PIXI.Point)) return;
    this._center = val;
    let points = Array(6).fill().map((e,i) => hex_corner(this.center, this.radius, i)).map(e => [e.x, e.y]);
    this.points = points.flat();
    function hex_corner(center, size, i) {
      let angle = (60 * i) * (Math.PI / 180);
      let x = Math.cos(angle), y = Math.sin(angle);
      return new PIXI.Point(center.x + (size*x), center.y + (size*y));
    }
  }
  static ring(sample, radius) {
    let hexes = [];
    if(!(sample instanceof this)) return hexes;
    radius = Math.max(0, isNaN(Number(radius)) ? 0 : radius);
    if(radius == 1) return [new Hexagon(sample.center.x,sample.center.y, sample.radius)];
    radius = radius-1;
    for(let i = 0; i < 360; i+=60) hexes.push(...ring(radius, new Vector(-0.75,0).rotate(i+30)));
    return hexes.map(e => new this((e.x*sample.width)+sample.center.x, (e.y*sample.height)+sample.center.y, sample.radius));
    function ring(radius, start) {
      let prev = start.clone().mult(radius);
      let dir = start.clone().rotate(120);
      let outer = [];
      for(let i = 0; i < radius; i++) outer.push(dir.clone().mult(i));
      return outer.map(e => new Vector((e.x+prev.x)*1.15, e.y+prev.y));
    }
    function last(arr) {return arr[arr.length - 1]}
  }
  static grid(sample, radius) {
    let hexes = [];
    if(!(sample instanceof this)) return hexes;
    radius = Math.max(0, isNaN(Number(radius)) ? 0 : radius);
    for(let i = 1; i < radius; i++) hexes.push(...this.ring(sample, i));
    return hexes;
  }
  static line(sample, dir, length) {
    let hexes = [];
    if(!(sample instanceof this)) return hexes;
    dir = new Vector(dir).angle;
    length = Math.max(1, isNaN(Number(length)) ? 0 : length);
    hexes.push(new Vector(sample.center.x, sample.center.y));
  }
}
export class Button extends PIXI.Sprite {
  constructor(texture, size) {
    if((Util.isType(texture, Object) && (typeof texture.default !== "string" && !((texture.default) instanceof PIXI.Texture))) || (typeof texture === "undefined" || texture === null)) throw new TypeError("texture.default is not of type string or PIXI.Texture");
    else if(texture instanceof PIXI.Texture || typeof texture === "string") texture = {default: texture};
    else if(texture instanceof Array) texture = {default: texture[0], hover: texture[1], pressdown: texture[3], disabled: texture[3]};
    if(size instanceof Array) size = {width: size[0], height: size[1]};
    else size = typeof size === "object" ? size : {};
    size.width = typeof size.width === "number" ? size.width : 1;
    size.height = typeof size.height === "number" ? size.height : size.width;
    for(let e of ["default", "hover", "pressdown", "disabled"]) {
      if(!(texture[e] instanceof PIXI.Texture) && typeof texture[e] !== "string") texture[e] = null;
      if(typeof texture[e] === "string") texture[e] = PIXI.Texture.from(texture[e]);
    }
    super();
    this._textures = texture;
    this.texture = texture.default;
    this.anchor.set(0.5);
    this.interactive = true;
    if(texture.pressdown) {
      this.on("pointerdown", () => this.texture = texture.pressdown);
      this.on("pointerup", () => this.texture = texture.default);
    }
    if(texture.hover) {
      this.on("mouseover", () => this.texture = texture.hover);
      this.on("mouseout", () => this.texture = texture.default);
    }
  }
  get disabled() {return !this.interactive}
  set disabled(val) {this.interactive = !val;if(!this.interactive) this.texture = this._textures.disabled}
}

export class Plate extends Button {
  constructor(size) {
    if(typeof size !== "number") size = 100;
    super({
      default: PIXI.Texture.from("./assets/textures/hexagon.svg"),
      hover: PIXI.Texture.from("./assets/textures/hexagon-hover.svg"),
      pressdown: PIXI.Texture.from("./assets/textures/hexagon-pressed.svg"),
      disabled: PIXI.Texture.from("./assets/textures/hexagon-disabled.svg"),
    });
    this.size = size;
  }
  get size() {return Math.max(this.width, this.height)}
  set size(val) {
    if(typeof val !== "number") return;
    this.width = this.height = val;
    val = Math.max(this.width, this.height);
    this.hitArea = new Hexagon(0,0, 75);
  }
}