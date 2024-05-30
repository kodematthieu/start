const {deepMerge, isType, secret, error, defaultClass} = require("../util");
const AtomCollection = require("../collection/AtomCollection");
const Atom = require("./Atom");

const secure = secret("elements");

const Bond = module.exports = class Bond {
  constructor() {
    Object.defineProperty(this, "_atoms", {writable: true, value: new AtomCollection()});
    let args = Array.from(arguments);
    for(let i in args) {
      if(isType(args[i], Array)) {
        for(const arg of args[i]) args.push(arg);
        args = args.filter(e => e !== args[i]);
      }
    }
    args = args.filter((value,index,self) => self.indexOf(value)===index);
    this.add(...args);
  }
  bonds(raw) {
    if(this._atoms.size < 1) return;
    const elems = this._atoms;
    const valences = {};
    for(let elem of elems) valences[elem.symbol] = {symbol: elem.symbol, value: elem.valence, weight: elem.valence[0]/elem.valence[1]};
    switch(this._atoms.size) {
      case 1:
      case 2:
      case 3:
        const elems = this._atoms.toArray();
        const configs = Object.values(valences);
        const Etotal = {};
        for(const elem of elems) Etotal[elem.symbol] = 1;
        let max = configs.map(e => e.value[1]).reduce((a, b) => Math.max(a,b));
        let total = configs.map(e => e.value[0]).reduce((a, b) => a+b);
        while(total % max !== 0) {
          let additinal;
          // if(total % 3 === 0) {
            if(Math.round(total/max) === Math.floor(total/max)) additinal = elems.find(elem => elems.map(e => e.valence[0]).reduce((a,b) => Math.max(a,b)) === elem.valence[0]);
            else if(Math.round(total/max) === Math.ceil(total/max)) additinal = elems.find(elem => elems.map(e => e.valence[0]).reduce((a,b) => Math.min(a,b)) === elem.valence[0]);
            else additinal = elems[Math.floor(elems.length - 1)];
          // }
          // else {
          //   if(Math.round(total/max) === Math.ceil(total/max)) additinal = elems.find(elem => elems.map(e => e.valence[0]).reduce((a,b) => Math.max(a,b)) === elem.valence[0]);
          //   else if(Math.round(total/max) === Math.floor(total/max)) additinal = elems.find(elem => elems.map(e => e.valence[0]).reduce((a,b) => Math.min(a,b)) === elem.valence[0]);
          //   else additinal = elems[Math.ceil(elems.length - 1)];
          // }
          total += additinal.valence[0];
          Etotal[additinal.symbol]++;
        }
        let result = [];
        for(let [k,v] of Object.entries(Etotal)) {
          result.push(k + v);
        }
        console.log(result);
        break;
      default:
    }
    return valences;
  }
  has(value) {
    if(isType(value, Atom)) return this._atoms.has(value);
    else if(isType(value, Object)) return this._atoms.has(Atom.for(value));
    return this._atoms.has(new Atom(value));
  }
  add(...entries) {
    for(let elem of entries) {
      if(isType(elem, Atom)) this._atoms.push(elem);
      else if(isType(elem, Object)) this._atoms.push(Atom.for(elem));
      else this._atoms.push(new Atom(elem));
      entries = entries.filter(e => e !== elem);
    }
    return this;
  }
};
defaultClass(Bond);