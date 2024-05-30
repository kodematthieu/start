"use strict";

const {deepMerge, isType, secret, error, defaultClass} = require("../util");

const elements = require("../elements");
const formula = require("../config").formula;
const blocks = require("../config").blocks;

const secure = secret("data");

const Atom = module.exports = class Atom {
  constructor(value, timestamp = Date.now()) {
    Object.defineProperty(this, "_data", {value: {}});
    if(isType(value, String)) {
      const lookfor = value.length > 2 ? "name" : "symbol";
      const found = elements.filter(e => e[lookfor] === value);
      if(found.length < 1) error("ELEMENT_NOT_FOUND",`Atom with a ${lookfor} of \`${value}\` was not found!`);
      deepMerge(this._data, found[0]);
    }
    else if(isType(value, Number)) {
      if(elements.filter(e => e.atomic_number === value).length < 1) error("ELEMENT_NOT_FOUND", `Atom with an atomic number of ${value} was not found!`);
      deepMerge(this._data, elements.filter(e => e.atomic_number === value)[0]);
    }
    else if(isType(value, Atom)) deepMerge(this._data, elements[value[secure.data].atomic_number-1]);
    else error("INVALID_ARGUMENT", "No argument provided!");
    for(let attr in formula) {
      this._data[attr] = eval(formula[attr].replace(/[a-z_]+/gi, (s) => "this._data."+s))
      if(attr.match(/^(neutron)+$/)) this._data[attr] = Math.round(this._data[attr]);
    }
    this._data.electron = this._data.proton;
    for(let whitelist of ["name", "symbol", "category"]) {
      if(!this._data[whitelist]) continue;
      this[whitelist] = this._data[whitelist];
      Object.defineProperty(this, whitelist, {});
      delete this._data[whitelist];
    }
  }
  electronConfig(raw) {
    const order = blocks.order;
    const max = blocks.max;
    let count = this._data.proton;
    const result = [];
    let i = 0;
    while(count > 0) {
      let value = 0;
      if(count >= max[order[i].block]) {
        value = max[order[i].block];
        count -= max[order[i].block];
      }
      else {
        value = count;
        count -= count;
      }
      result.push({"block": order[i].block, "lvl": order[i].lvl, "value": value});
      i += 1;
    }
    if(raw) return result;
    return result.map((e) => e.value + e.block + e.lvl).join(" ");
  }
  get valence() {
    const config = this.electronConfig(true);
    const max_lvl = config.map((e) => e.lvl).reduce((a, b) => Math.max(a, b));
    const flvls = config.filter(({lvl}) => lvl === max_lvl);  
    const result = [];
    result[0] = flvls.map((e) => e.value).reduce((a, b) => a+b);
    result[1] = flvls.map((e) => blocks.max[e.block]).reduce((a, b) => a+b);
    return result;
  }
  get proton() {return this._data.proton}
  get electron() {return this._data.electron}
  set electron(value) {
    if(!isType(value, Number) || Math.abs(value) !== value) return;
    if(this._data.proton < value) return;
    this._data.electron = value;
  }
  get neutron() {return this._data.neutron}
  set neutron(value) {
    if(!isType(value, Number) || Math.abs(value) !== value) return;
    this._data.neutron = value;
  }
  static equals(atom1, atom2) {
    return (
      atom1.symbol === atom2.symbol &&
      atom1.proton === atom2.proton &&
      atom1.neutron === atom2.neutron &&
      atom1.electron === atom2.electron
    )
  }
  static all() {
    const result = [];
    for(let i in elements) result.push(new Atom(Number(i)+1));
    return result;
  }
  static for(obj) {
    if(!isType(obj, Object)) error("INVALID_ARGUMENT", "Atom.for requires an object argument!");
    const search = {};
    let found = Atom.all();
    for(let whitelist of ["proton", "mass", "atomic_number"]) {
      if(!obj.hasOwnProperty(whitelist)) continue;
      found = found.filter((e) => e[secure.data][whitelist] === obj[whitelist]);
    }
    if(found.length < 1) error("ELEMENT_NOT_FOUND",`Atom with a data of ${JSON.stringify(search)} was not found!`);
    return new Atom(found[0]);
  }
};

defaultClass(Atom);