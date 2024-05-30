(function(global, factory) {
  "use strict";
  
  var version = "1.0.2";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, version, true);
  else factory(global, version);
  
})(typeof window !== "undefined" ? window : this, function(window, version, noGlobal) {
  "use strict";
  
  var AsyncFunction = (async function(){}).constructor;
  var GeneratorFunction = (function*(){}).constructor;
  
  var regex = {
    number: /^\s*\d*(\.){0,1}\d{1,}\s*$/,
    float: /^\s*\d*(\.){1}\d{1,}\s*$/,
    int: /^\s*\d+\s*$/,
  };

  var defFns = new Map();
  var Define = function(name, value, opts = {}) {
    opts = Object.assign({enumerable: true, configurable: true}, opts);
    if(typeof value === 'function') {
      var decor = function() {return value.apply(this, arguments)};
      if(typeof name === 'string') {
        if((/^([a-zA-Z0-9_]+)\.self$/).test(name)) {
          name = name.match(/^([a-zA-Z0-9_]+)\.self$/)[1];
          decor = function() {
            value.call(this, ...arguments);
            return this;
          };
        }
        else if((/^([a-zA-Z0-9_]+)\.(set|get)$/).test(name)) {
          var method = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[2];
          name = name.match(/^([a-zA-Z0-9_]+)\.(set|get)$/)[1];
          Object.defineProperty(this, name, opts);
          Object.defineProperty(this, name, {[method]: value});
          return value;
        }
        Object.defineProperty(decor, 'name', {value: name, writable: true, configurable: true});
      }
      Object.defineProperty(this, name, Object.assign({value: decor, writable: true}, opts));
      return decor;
    }
    Object.defineProperty(this, name, Object.assign({value, writable: true}, opts));
    return value;
  };
  var browser = function(fn) {
    if(!noGlobal) return fn;
    return function() {
      var err = new Error("This function/accessor is only supported on browsers.");
      err.name = "Platform";
      throw err;
    };
  };
  
  var Util = function Util() {
    if(!(this instanceof Util)) throw new TypeError("Invalid constructor");
    Object.setPrototypeOf(this.constructor, Object.create(null));
    return this;
  };
  var define = Define.bind(Util.prototype);
  
  define("__version__", version, {writable: false});
  define("defaults", {colored: Boolean(noGlobal)}, {enumerable: false, writable: false});
  define("define", function(thisArg = window) {return Define.bind(thisArg)});
  define("capital", function(str) {return str.replace(/\b(\w)/g, c => c.toUpperCase())});
  define("isType", function(value, cls) {
    var valcons = typeof value === "undefined" || value === null ? value : value.constructor;
    cls = cls instanceof Array && cls.length > 0 ? [...cls] : [cls];
    for(let i = 0; i < cls.length; i++) {
      if(cls[i] instanceof Function) continue;
      cls[i] = cls[i].constructor;
    }
    return cls.some(function(e) {return e === valcons});
  });
  define("run", function(fn, args = [], fnType = Function) {
    if(this.isType(fn, [AsyncFunction, Function, GeneratorFunction])) return fn(...(this.isType(args, Array) ? args : [args]));
    else if(this.isType(fn, String)) {
      if(!this.isType(fnType.prototype, [AsyncFunction, Function, GeneratorFunction]) && this.isType(fnType, [AsyncFunction, Function, GeneratorFunction])) fnType = fnType.constructor;
      fn = new fnType(fn + "");
      return fn(...(this.isType(args, Array) ? args : [args]));
    }
    else return fn;
  });
  define("deepMerge", function deepMerge() {
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
  });
  define("equals", function(...arr) {
    for(var e1 of arr) for(var e2 of arr) if(e1 !== e2) return false;
    return true;
  });
  define("print", function(...text) {
    var isColored = typeof text[text.length - 1] === "boolean" ? text.splice(text.length - 1, 1) : undefined;
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var time = [hour > 9 ? hour : "0" + hour, minute > 9 ? minute : "0" + minute, second > 9 ? second : "0" + second];
    isColored = typeof isColored === "undefined" ? this.defaults.colored : isColored;
    text = text.map(function(e) {return "\x1b[0m" + e});
    if(noGlobal) return console.info(`\x1b[36m[${time.map(function(e) {return "\x1b[32m"+String(e)}).join("\x1b[36m:")}\x1b[36m] \x1b[33m>\x1b[0m`, ...text);
    return console.info(`[${time.join(":")}] > `, ...text);
  });
  define("def", function(name, fnOrArgs) {
    var mode = "define";
    if(!this.isType(fnOrArgs, [AsyncFunction, Function])) mode = "excute";
    if(mode === "define") defFns.set(name, fnOrArgs.bind(this));
    else if(mode === "excute") return defFns.get(name)(...(!this.isType(fnOrArgs, Array) ? [fnOrArgs] : fnOrArgs));
  });
  define("typeOf", function(obj) {
    if(typeof obj === "undefined") return undefined;
    if(obj === null) return null;
    return obj.constructor;
  });
  define("inArray", function(arr, cls, some = false) {
    if(!(arr instanceof Array)) return false;
    some = Boolean(some);
    var _this = this;
    if(some) return arr.some(function(e) {return _this.isType(e, cls)});
    return arr.every(function(e) {_this.isType(e, cls)});
  });
  define("range", function(a, b) {
    if(typeof a !== "number") a = 0;
    if(typeof b !== "number") b = 0;
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    var result = [];
    for(var i = min; i < max; i++) result.push(i);
    return result;
  });
  define("random", function(a, b, c = null) {
    c = this.isType(b, Boolean) ? b : c;
    if(typeof a !== "number" && !regex.number.test(a)) a = 0;
    if(typeof b !== "number" && !regex.number.test(b)) b = 0;
    if(typeof a === "string") a = parseFloat(a);
    if(typeof b === "string") b = parseFloat(b);
    if(c === null && (!Number.isInteger(a) || !Number.isInteger(b))) c = true;
    if(c === null) c = false;
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    var random = (Math.random()*(max-min)) + min;
    return !c ? Math.round(random) : random;
  });
  define("floor", function(a, b) {
    if(typeof a !== "number") a = 0;
    if(typeof b !== "number") b = 0;
    b = 10**b;
    var round = Math.floor(a * b) / b;
    return round;
  });
  define("round", function(a, b) {
    if(typeof a !== "number") a = 0;
    if(typeof b !== "number") b = 0;
    b = 10**b;
    var round = Math.round(a * b) / b;
    return round;
  });
  define("ceil", function(a, b) {
    if(typeof a !== "number") a = 0;
    if(typeof b !== "number") b = 0;
    b = 10**b;
    var round = Math.ceil(a * b) / b;
    return round;
  });
  define("isMax", function(val, ...arr) {
    return Math.max(...arr.flat()) === val;
  });
  define("isMin", function(val, ...arr) {
    return Math.min(...arr.flat()) === val;
  });
  define("average", function(...num) {
    num = num.flat().map(Number);
    return num.reduce(function(a, b) {return a + b}) / num.length;
  });
  define("try", function(...args) {
    try {return this.run(...args)}
    catch(e) {return e}
  });
  define("online.get", browser(function() {return window.navigator.onLine}));
  define("load", browser(function(path, events = {}) {
    if(!this.isType(path, String)) path = path.toString();
    var _this = this;
    var ffn = function(value, defaultfn) {return _this.isType(value, [AsyncFunction, Function]) ? value : defaultfn};
    if(!this.isType(events, Object)) events = {};
    for(var evt of ["start", "progress", "finish", "fail", "timeout"]) events[evt] = ffn(events[evt], function(){});
    var ajax = new XMLHttpRequest();
    for(var evt in events) events[evt] = events[evt].bind(ajax);
    ajax.open("GET", path);
    ajax.onloadstart = function() {events.start(ajax)};
    ajax.onprogress = function(e) {events.progress(e.lengthComputable ? {loaded: e.loaded, total: e.total} : null)};
    ajax.onloadend = function() {events.finish(ajax)};
    ajax.onerror = function(err) {events.fail(err, ajax)};
    ajax.ontimeout = function() {events.timeout(ajax)};
    ajax.send(null);
  }));
  define("redirect", browser(function(url, oncomplete) {
    var loader = document.createElement("iframe");
    loader.style.display = "none";
    loader.src = url;
    loader.onload = function(e) {
      var defaulton = true;
      e.preventDefault = function() {defaulton = false};
      if(this.isType(oncomplete, [Function, AsyncFunction])) oncomplete(e);
      if(defaulton) window.location = url;
    };
    document.body.appendChild(loader);
  }));
  define("clipboard", browser(async function(value) {
    if(arguments.length > 0) {
      if(!(value instanceof ClipboardItem)) {
        if(this.isType(value, Object) && (typeof value.type === "string" && typeof value.value === "string")) value = new Blob([value.value], {type: value.type});
        if(!(value instanceof Blob)) {
          if(typeof value === "object") value = JSON.stringify(value);
          value = new Blob([String(value)], {type: "text/plain"});
        }
        value = new ClipboardItem({[value.type]: value});
      }
      return await window.navigator.clipboard.write([value]);
    }
    return await window.navigator.clipboard.readText();
  }));
  if(!noGlobal) window.Util = new Util();
  return new Util();
});