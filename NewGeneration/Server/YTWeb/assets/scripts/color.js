(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, true);
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var regex = {
    rgb: /^\s*(rgba?)\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(,\s*([0-9.]+)\s*)?\)\s*$/i,
    hsl: /^\s*(hsla?)\(\s*([0-9.]+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%\s*(,\s*([0-9.]+)\s*)?\)\s*$/i,
    hex: /^\s*#([a-f0-9]{3}|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{1,2})?)\s*$/i
  };
  window.hex = regex.hex;
  var Define = function(name, value, opts = {}) {
    if(typeof value === "function") {
      value = value.bind(this);
      Object.defineProperty(value, "name", {value: name});
    }
    Object.defineProperty(this, name, Object.assign({enumerable: true, writable: true, configurable: true}, opts, {value}));
    return value;
  };
  var isType = function(value, cls) {
    if(typeof value === "undefined" || value === null) return false;
    if(cls.constructor.name === "Array") return cls.some(function(e) {return isType(value, e)});
    if(!cls.constructor || !cls.prototype) return false;
    return value.constructor.name === cls.name;
  };
  var deepMerge = function() {
    var final = Array.from(arguments).splice(0, 1)[0] || {};
    for(var obj of Array.from(arguments).splice(1, Infinity)) {
      if(!obj || Object.prototype.toString.call(obj) !== "[object Object]") continue;
      for(var key in obj) {
        if(!obj.hasOwnProperty(key)) continue;
        if(Object.prototype.toString.call(obj[key]) === "[object Object]") {
          final[key] = deepMerge(final[key], obj[key]);
          continue;
        }
        final[key] = obj[key];
      }
    }
    return final;
  };
  
  var Color = new (function Color() {if(window.Color) throw new Error("Color constructor cannot be initiated!");Object.setPrototypeOf(this.constructor, Object.create(null))})()
  var color_extend = Define.bind(Color);
  
  var Rgba = Color.Rgba = function Rgba(r, g, b, a = 1) {
    if(!(this instanceof Rgba)) return new Rgba(...arguments);
    Object.defineProperty(this, "_data", {value: {}});
    Object.defineProperty(this, "hex", {get: this.toHEX});
    Object.defineProperty(this, "css", {get: this.toCSS});
    Object.defineProperty(this, "hsla", {get: this.toHSLA});
    Object.defineProperty(this, "json", {get: this.toJSON});
    if(isType(r, Object)) {
      a = r.a || a;
      b = r.b || 0;
      g = r.g || 0;
      r = r.r || 0;
    }
    else if(isType(r, Array)) {
      a = r[3] || a;
      b = r[2] || 0;
      g = r[1] || 0;
      r = r[0] || 0;
    }
    else if(isType(r, String) && regex.rgb.test(r)) {
      r = r.match(regex.rgb);
      r.splice(0,1);
      r.splice(4,1);
      a = (/a$/).test(r[0]) ? r[4] : a;
      b = parseFloat(r[3]) || 0;
      g = parseFloat(r[2]) || 0;
      r = parseFloat(r[1]) || 0;
    }
    else if(isType(r, String) && regex.hsl.test(r)) {
      r = new Hsla(r).toRGBA();
      a = r.a || a;
      b = r.b || 0;
      g = r.g || 0;
      r = r.r || 0;
    }
    else if(isType(r, String) && regex.hex.test(r)) {
      r = new Hex(r);
      a = r._data.a || a;
      b = r._data.b || 0;
      g = r._data.g || 0;
      r = r._data.r || 0;
    }
    else if(isType(r, [Hex, Rgba])) {
      a = r._data.a || a;
      b = r._data.b || 0;
      g = r._data.g || 0;
      r = r._data.r || 0;
    }
    else if(isType(r, Number) && !isType(g, Number) && !isType(b, Number)) {
      b = r;
      g = r;
    }
    this._data.r = isType(r, Number) ? (r > 255 ? 255 : r) : 0;
    this._data.g = isType(g, Number) ? (g > 255 ? 255 : g) : 0;
    this._data.b = isType(b, Number) ? (b > 255 ? 255 : b) : 0;
    this._data.a = isType(a, Number) ? (a > 1 ? 1 : a) : 1;
  };
  deepMerge(Rgba.prototype, {
    toCSS: function toCSS() {return `rgba(${this._data.r}, ${this._data.g}, ${this._data.b}, ${this._data.a})`},
    toJSON: function toJSON() {return this._data},
    toHSLA: function toHSLA() {
      var r = this._data.r/255;
      var g = this._data.g/255;
      var b = this._data.b/255;
      var a = this._data.a;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if(max == min) h = s = 0;
      else {
        var d = max - min;
        s = l > 0.5 ? d/(2 - max - min) : d/(max + min);
        switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      h *= 360;
      s *= 100;
      l *= 100;
      return new Hsla(h, s, l, a);
    },
    toHEX: function() {return new Hex(this)},
  });
  
  var Hsla = Color.Hsla = function Hsla(h, s, l, a = 1) {
    if(!(this instanceof Hsla)) return new Hsla(...arguments);
    Object.defineProperty(this, "_data", {value: {}});
    Object.defineProperty(this, "hex", {get: this.toHEX});
    Object.defineProperty(this, "css", {get: this.toCSS});
    Object.defineProperty(this, "rgba", {get: this.toRGBA});
    Object.defineProperty(this, "json", {get: this.toJSON});
    if(isType(h, Object)) {
      a = h.a || a;
      l = h.l || 0;
      s = h.s || 0;
      h = h.h || 0;
    }
    else if(isType(h, Array)) {
      a = h[3] || a;
      l = h[2] || 0;
      s = h[1] || 0;
      h = h[0] || 0;
    }
    else if(isType(h, String) && regex.hsl.test(h)) {
      h = h.match(regex.hsl);
      h.splice(0,1);
      h.splice(4,1);
      a = (/a$/).test(h[0]) ? h[4] : a;
      l = parseFloat(h[3]) || 0;
      s = parseFloat(h[2]) || 0;
      h = parseFloat(h[1]) || 0;
    }
    else if(isType(h, String) && regex.rgb.test(h)) {
      h = new Rgba(h).toHSLA();
      a = h.a || a;
      l = h.l || 0;
      s = h.s || 0;
      h = h.h || 0;
    }
    else if(isType(h, String) && regex.hex.test(h)) {
      h = new Hsla(new Hex(h));
      a = h._data.a || a;
      l = h._data.l || 0;
      s = h._data.s || 0;
      h = h._data.h || 0;
    }
    else if(isType(h, [Hex, Rgba])) {
      h = h.toHSLA();
      a = h._data.a || a;
      l = h._data.l || 0;
      s = h._data.s || 0;
      h = h._data.h || 0;
    }
    this._data.h = isType(h, Number) ? (h % 360 == 0 && h != 0 ? 360 : (h % 360)) : 0;
    this._data.s = isType(s, Number) ? (s > 100 ? 100 : s) : 0;
    this._data.l = isType(l, Number) ? (l > 100 ? 100 : l) : 0;
    this._data.a = isType(a, Number) ? (a > 1 ? 1 : a) : 1;
  };
  deepMerge(Hsla.prototype, {
    toCSS: function toCSS() {return `hsla(${this._data.h}, ${this._data.s}%, ${this._data.l}%, ${this._data.a})`},
    toJSON: function toJSON() {return this._data},
    toRGBA: function toRGBA() {
      var h = this._data.h/360,
          s = this._data.s/100,
          l = this._data.l/100,
          a = this._data.a;
      var r, g, b;
      if(s == 0) r = g = b = l;
      else {
        function hue2rgb(p, q, t) {
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
    
      return new Rgba(r * 255, g * 255, b * 255, a);
    },
    toHEX: function toHEX() {return new Hex(this)},
  });
  
  var Hex = Color.Hex = function Hex(value) {
    if(!(this instanceof Hex)) return new Hex(...arguments);
    Object.defineProperty(this, "_data", {value: {}});
    Object.defineProperty(this, "css", {get: this.toCSS});
    Object.defineProperty(this, "hsla", {get: this.toHSLA});
    Object.defineProperty(this, "rgba", {get: this.toRGBA});
    Object.defineProperty(this, "json", {get: this.toJSON});
    var r, g, b, a = 1;
    if(isType(value, String) && regex.hex.test(value)) {
      value = value.match(regex.hex).splice(2, Infinity).map(e => parseInt(e, 16));
      r = value[0] || 0;
      g = value[1] || 0;
      b = value[2] || 0;
      a = value[3] ? value[3]/255 : a;
    }
    else if(isType(value, [Rgba, Hex])) {
      r = value._data.r;
      g = value._data.g;
      b = value._data.b;
      a = value._data.a;
    }
    else if(isType(value, Hsla)) {
      value = value.toRGBA();
      r = value._data.r;
      g = value._data.g;
      b = value._data.b;
      a = value._data.a;
    }
    this._data.r = r || 0;
    this._data.g = g || 0;
    this._data.b = b || 0;
    this._data.a = a || 1;
  };
  deepMerge(Hex.prototype, {
    toCSS: function toCSS() {
      var r = Math.round(this._data.r),
          g = Math.round(this._data.g),
          b = Math.round(this._data.b),
          a = Math.round(this._data.a)*255;
      return `#${(r > 15 ? "" : "0")+r.toString(16)}${(g > 15 ? "" : "0")+g.toString(16)}${(b > 15 ? "" : "0")+b.toString(16)}${(a > 15 ? "" : "0")+a.toString(16)}`;
    },
    toJSON: function() {return this._data},
    toRGBA: function() {return new Rgba(this)},
    toHSLA: Rgba.prototype.toHSLA,
  });
  
  color_extend("rgba2hsla", function(...args) {return new Color.Rgba(...args).toHSLA()});
  color_extend("hsla2rgba", function(...args) {return new Color.Hsla(...args).toRGBA()});
  
  if(!noGlobal) window.Color = Color;
  return Color;
});