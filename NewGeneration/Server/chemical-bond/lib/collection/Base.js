const util = require("../util");
module.exports = class Collection extends Set {
  constructor(...entries) {
    super(...entries.filter(e => (!e.constructor || !e.prototype) && (e && util.isType(e, Array))));
    Object.defineProperty(this, "_type", {writable: true});
    this.type = entries.find(e => (e.constructor && e.prototype) && !(e && util.isType(e, Array)));
  }
  get type() {return this._type}
  set type(value) {
    this._type = value || null;
    this.purify(this._type);
  }
  push(...entries) {
    for(const value of entries) {
      if((this.type && this.type.constructor && this.type.prototype) && !(value && util.isType(value, this.type))) continue;
      super.add(value);
    }
    return this;
  }
  pop(...entries) {
    for(const value of entries) {
      if(!this.has(value)) continue;
      super.delete(value);
    }
    return this;
  }
  get(index) {
    if(!index || !util.isType(index, Number)) index = this.size;
    return this.toArray()[index - 1];
  }
  index(value) {
    if(typeof value === "undefined") return NaN;
    return this.toArray().indexOf(value);
  }
  filter(fn, thisArg) {
    const result = new this.constructor[Symbol.species](this.toArray().filter(fn, thisArg || this));
    result.type = this.type;
    return result;
  }
  map(fn, thisArg) {
    const result = new this.constructor[Symbol.species](this.toArray().map(fn, thisArg || this));
    result.type = this.type;
    return result;
  }
  purify(cls) {return this.constructor.purify(this, cls)}
  remove(...indexes) {
    for(const index of indexes) {
      if(!util.isType(index, Number)) return;
      super.delete(this.get(index));
    }
    return this;
  }
  toArray() {return Array.from(this)}
  clear() {super.clear();return this}
  static purify(collection, cls) {
    if(!collection || !util.isType(collection, this)) return this.constructor();
    if(cls === null || !(cls.constructor && cls.prototype)) return collection;
    let copy = Array.from(collection).filter(e => e && util.isType(e, cls));
    collection.clear().push(...copy);
    return collection;
  }
};