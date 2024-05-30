const util = require("../util");
const Atom = require("../structure/Atom");
const Collection = require("./Base");
module.exports = class AtomCollection extends Collection {
  constructor(...entries) {
    super(Atom, entries);
  }
  has(elem) {
    for(let v of this) {
      if(Atom.equals(elem, v)) return true;
    }
    return false;
  }
};