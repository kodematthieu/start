(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, true);
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var AsyncFunction = (async function(){}).constructor;
  var GeneratorFunction = (function*(){}).constructor;
  
  var fns = {};
  var Define = function(name, value, opts = {}) {
    if(typeof value === "function") {
      if(fns) fns[name] = value;
      value = value.bind(this);
      Object.defineProperty(value, "name", {value: name});
    }
    Object.defineProperty(this, name, Object.assign({enumerable: true, writable: true, configurable: true}, opts, {value}));
    return value;
  };
  
  var Util = new (function Util() {if(window.Util) throw new Error("Util constructor cannot be initiated!");Object.setPrototypeOf(this.constructor, Object.create(null))})()
  var define = Define.bind(Util);
  
  define("hideErrors", false, {enumerable: false});
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
      try {
        fn = new fnType(fn + "");
        return fn(...(fns.isType(args, Array) ? args : [args]));
      }
      catch(e) {
        if(!Util.hideErrors) console.warn(e);
        return e;
      }
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
  define("load", function load(path, events = {}) {
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
  define("redirect", function(url, oncomplete) {
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
  
  if(!noGlobal) window.Util = Util;
  return Util;
});