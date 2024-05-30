(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, true);
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var privateKey = Symbol("private");
  var ext = function(path) {
    return path.match(/\.([a-z]+)$/i) ? path.match(/\.([a-z]+)$/i)[0] : false;
  };
  var isType = function(value, cls) {
    if(typeof value === "undefined" || value === null) return false;
    if(cls.constructor.name === "Array") return cls.some(function(e) {return isType(value, e)});
    if(!cls.constructor || !cls.prototype) return false;
    return value.constructor.name === cls.name;
  };
  
  var require = function require(path, sync = true) {
    window.module = new (function Module(){if(arguments[0] !== privateKey) throw new Error("`module` object already defined. Can't redefine!");Object.setPrototypeOf(this.constructor, Object.create(null));this.exports = {}})(privateKey);
    Object.defineProperty(window, "exports", {configurable:true,writable:true});
    Object.defineProperty(window, "exports", {get: function() {return module.exports}, set: function(value) {module.exports = value}});
    var ajax = new XMLHttpRequest();
    ajax.open("GET", path, !sync);
    try {
      ajax.send(null);
      var result = ajax.responseText;
      var parseType = ajax.getResponseHeader("Content-Type").match(/^[a-z]+\/[a-z+]+/i)[0].replace(";","").split("/");
      if((/^(application|text)$/).test(parseType[0])) {
        if((/javascript/).test(parseType[1])) result = new Function(result)();
        else if((/json/).test(parseType[1])) exports = JSON.parse(result);
        else if((/css/).test(parseType[1])) {exports = document.createElement("style");exports.innerText = result}
        else if((/(xml|html)/).test(parseType[1])) exports = (new DOMParser()).parseFromString(result, ajax.getResponseHeader("Content-Type").split(";")[0]);
        else exports = result;
      }
      else if((/^(image)$/).test(parseType[0])) {
        if((/svg/).test(parseType[1])) exports = (new DOMParser()).parseFromString(result, ajax.getResponseHeader("Content-Type").split(";")[0]);
        else {exports = new Image();exports.src = URL.createObjectURL(new Blob([result], {type: parseType.join("/")}))}
      }
      if(isType(exports, Object) && Object.assign(exports, {}) !== exports) result = exports;
      else if(typeof exports !== "undefined") result = exports;
      else result = null;
      delete window.module;
      delete window.exports;
      return result;
    }
    catch(e) {console.warn(`Failed to load \`${path}\`. Please reload the webpage to have a good experience!`);return null}
  };
  
  if(!noGlobal) window.require = require;
  return require;
});