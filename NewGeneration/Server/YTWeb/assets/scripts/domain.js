(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function(w) {
        if(!w.document) throw new Error("Music.js requires a window with a document");
        return factory(w);
      };
  } 
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  if(!("customElements" in window)) throw new Error("window.customElements does not exist therefor we can't operate.");
  
  var document = window.document;
  var customElements = window.customElements;
  
  var isType = function(value, cls) {return value && (value.constructor.name === cls.name)};
  var argsCheck = function(cls, args, amount) {if(args.length < amount) throw new Error(`Failed to construct '${cls.constructor.name}'`, `${amount} argument${amount > 1 ? "s" : ""} required, but only ${args.length} present.`)};
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
  
  var Domain = new (class Domain {})();

  var Registry = Domain.Registry = class Registry {
    constructor(name, cls, constructor) {
      argsCheck(this, arguments, 2);
      if(!isType(name, String)) throw new TypeError(this.constructor.name.toUpperCase(), "First argument should be a string.");
      if(!(cls.constructor && cls.prototype && isType(cls.DOCUMENT_NODE, Number))) throw new TypeError(this.constructor.name.toUpperCase(), "Second argument should be an HTML class (eg. HTMLElement).");
      var self = this;
      Object.defineProperty(this, "_name", {value: name, writable: true});
      Object.defineProperty(this, "_props", {value: {constructor}});
      Object.defineProperty(this, "_class", {
        writable: true,
        value: class DomainElement extends cls {
          constructor() {
            super(...arguments);
            if(isType(self._props.constructor, Function)) self._props.constructor.bind(this)(...arguments);
          }
        }
      });
      this.name = name;
    }
    setProto(key, value) {
      if(!isType(key, String)) return this;
      this._props[key] = value;
      if(key !== "constructor") this._class.prototype[key] = value;
      return this;
    }
    getProto(key) {
      if(!isType(key, String)) return this;
      return this._props[key];
    }
    get name() {
      return this._name;
    }
    set name(value) {
      if((value.toLowerCase() !== value) || !value.match(/-/)) throw new Error(this.constructor.name.toUpperCase(), "Invalid custom element name!");
      this._name = value;
    }
    register() {
      if(!customElements.get(this.name)) customElements.define(this.name, this._class);
      else customElements.upgrade(this.name, this._class);
      return customElements.get(this.name);
    }
  };
  
  if(!noGlobal) window.Domain = Domain;
  return Domain;
});