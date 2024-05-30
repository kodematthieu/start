const {Atom, Bond} = require("./index");
const mo = require("molecular-formula");
const test = new Bond("H", "O");
// test.set(5, new Atom(100))
console.log(test.bonds());
// console.log();