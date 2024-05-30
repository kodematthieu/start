(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, true);
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var AsyncFunction = (async function(){}).constructor;
  var GeneratorFunction = (function*(){}).constructor;
  
  var regex = {
    number: /^\s*\d*(\.){0,1}\d{1,}\s*$/,
    float: /^\s*\d*(\.){1}\d{1,}\s*$/,
    int: /^\s*\d+\s*$/,
  };

  var fns = {};
  var defFns = {};
  var Define = function(name, value, opts = {}) {
    if(this.constructor === Util) fns[name] = value;
    if(typeof value === "function") {
      value = value.bind(this);
      Object.defineProperty(value, "name", {value: name});
    }
    if(name.split(".").length == 2 && (name.split(".")[1] === "get" || name.split(".")[1] === "set")) {
      var type = name.split(".")[1];
      name = name.split(".")[0];
      delete opts.value;
      Object.defineProperty(this, name, Object.assign({enumerable: true, configurable: true}, opts, {[type]: value}));
    }
    else Object.defineProperty(this, name, Object.assign({enumerable: true, writable: true, configurable: true}, opts, {value}));
    return value;
  };
  
  var Util = function Util() {
    if(!(this instanceof Util)) throw new TypeError("Invalid constructor");
    Object.setPrototypeOf(this.constructor, Object.create(null));
    return this;
  };
  var define = Define.bind(Util.prototype);
  
  define("default", {colored: Boolean(noGlobal)}, {enumerable: false, writable: false});
  define("define", function(thisArg = window) {return Define.bind(thisArg)});
  define("capital", function(str) {return str.replace(/\b(\w)/g, c => c.toUpperCase())});
  define("isType", function(value, cls) {
    if(typeof value === "undefined" || value === null) return false;
    if(cls.constructor.name === "Array") return cls.some(function(e) {return fns.isType(value, e)});
    if(!cls.constructor || !cls.prototype) return false;
    return value.constructor.name === cls.name;
  });
  define("run", function(fn, args = [], fnType = Function) {
    if(fns.isType(fn, [AsyncFunction, Function, GeneratorFunction])) return fn(...(fns.isType(args, Array) ? args : [args]));
    else if(fns.isType(fn, String)) {
      if(!fns.isType(fnType.prototype, [AsyncFunction, Function, GeneratorFunction]) && fns.isType(fnType, [AsyncFunction, Function, GeneratorFunction])) fnType = fnType.constructor;
      fn = new fnType(fn + "");
      return fn(...(fns.isType(args, Array) ? args : [args]));
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
  define("print", function(text, isColored = fns.default.colored) {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var time = [hour > 9 ? hour : "0" + hour, minute > 9 ? minute : "0" + minute, second > 9 ? second : "0" + second];
    if(!isColored) return console.info(`[${time.join(":")}] > ${text}`);
    if(noGlobal) {
      var colors = require("colors");
      console.info(`${"[".cyan}${time.map(function(e) {return String(e).green}).join(":".cyan)}${"]".cyan} ${">".yellow}`, text);
    }
  });
  define("def", function(name, fnOrArgs) {
    var mode = "define";
    if(!fns.isType(name, String)) path = path.toString();
    if(!fns.isType(fnOrArgs, [AsyncFunction, Function])) mode = "excute";
    if(mode === "define") defFns[name] = fnOrArgs.bind(this);
    else if(mode === "excute") return defFns[name](...(!fns.isType(fnOrArgs, Array) ? [fnOrArgs] : fnOrArgs));
  });
  define("typeOf", function(obj) {
    if(typeof obj === "undefined") return undefined;
    if(obj === null) return null;
    return obj.constructor;
  });
  define("inArray", function(arr, cls, some = false) {
    if(!(arr instanceof Array)) return false;
    some = Boolean(some);
    if(some) return arr.some(function(e) {return fns.isType(e, cls)});
    return arr.every(function(e) {fns.isType(e, cls)});
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
    c = fns.isType(b, Boolean) ? b : c;
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
  define("round", function(a, b) {
    if(typeof a !== "number") a = 0;
    if(typeof b !== "number") b = 0;
    b += 1;
    b = Number(Array.from(Array(b)).map(function(e, i) {return i === 0 ? "1" : "0"}).join(""));
    var round = Math.round(a * b) / b;
    return round;
  });
  define("try", function(...args) {
    try {return fns.run(...args)}
    catch(e) {return e}
  });
  var isBrowser = fns.equals(window, window.window, window.self, window.top);
  if(isBrowser) define("online.get", function() {return window.navigator.onLine});
  if(isBrowser) define("load", function load(path, events = {}) {
    if(!fns.isType(path, String)) path = path.toString();
    var ffn = function(value, defaultfn) {return fns.isType(value, [AsyncFunction, Function]) ? value : defaultfn};
    if(!fns.isType(events, Object)) events = {};
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
  });
  if(isBrowser) define("redirect", function(url, oncomplete) {
    var loader = document.createElement("iframe");
    loader.style.display = "none";
    loader.src = url;
    loader.onload = function(e) {
      var defaulton = true;
      e.preventDefault = function() {defaulton = false};
      if(fns.isType(oncomplete, [Function, AsyncFunction])) oncomplete(e);
      if(defaulton) window.location = url;
    };
    document.body.appendChild(loader);
  });
  if(isBrowser) define("clipboard", async function(value) {
    if(typeof value !== "undefined") {
      if(!(value instanceof ClipboardItem)) {
        if(fns.isType(value, Object) && (typeof value.type === "string" && typeof value.value === "string")) value = new Blob([value.value], {type: value.type});
        if(!(value instanceof Blob)) {
          if(typeof value === "object") value = JSON.stringify(value);
          value = new Blob([String(value)], {type: "text/plain"});
        }
        value = new ClipboardItem({[value.type]: value});
      }
      return await window.navigator.clipboard.write([value]);
    }
    return await window.navigator.clipboard.readText();
  });
  if(!noGlobal) window.Util = new Util();
  return new Util();
});