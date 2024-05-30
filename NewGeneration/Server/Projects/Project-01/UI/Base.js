import "../jquery.js";
import "../util.js";
import {schema} from "./Util.js";

class Base {
  constructor(selector) {
    if(typeof selector === "function" || Util.isType(selector, Array)) throw new TypeError("Invalid selector");
    Object.defineProperty(this, "__elem__", {value: $(selector)});
    Util.deepMerge(this, this.__elem__);
  }
}
for(let each of Object.getOwnPropertyNames(jQuery.fn)) {
  if(typeof jQuery.fn[each] !== "function") continue;
  Base.prototype[each] = function() {
    const result = this.__elem__[each](...arguments);
    return result === this.__elem__ ? this : result;
  };
}

export default Base;