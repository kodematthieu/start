"use strict";

module.exports = {
  isType: isType,
  secret: secret,
  deepMerge: deepMerge,
  error: error,
  defaultClass: defaultClass
};

function isType(obj, expect, deep = true) {
  return deep ? obj.constructor.name === expect.name : typeof obj === expect.name.toLowerCase();
}
function secret() {
  const result = {};
  for(let e of arguments) result[e] = Symbol(e);
  return result;
}
function deepMerge() {
  const final = Array.from(arguments).splice(0, 1)[0] || {};
  for(const obj of Array.from(arguments).splice(1, Infinity)) {
    if(!obj || Object.prototype.toString.call(obj) !== "[object Object]") continue;
    for(let key of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) {
      if(!obj.hasOwnProperty(key)) continue;
      if(Object.prototype.toString.call(obj[key]) === "[object Object]") {
        final[key] = deepMerge(final[key], obj[key]);
        continue;
      }
      final[key] = obj[key];
    }
  }
  return final;
}
function error(name, message) {
  const err = new Error(message);
  err.name = name;
  throw err;
}
function defaultClass(cls) {
  const proto = cls.prototype;
  proto[Symbol.toStringTag] = cls.name;
  proto[Symbol.toPrimitive] = cls;
  return cls;
}