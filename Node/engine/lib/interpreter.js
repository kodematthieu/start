const variable = new WeakMap();
class Interpret {
  code = "";
  constructor(code = "", args = {}) {
    this.code = code;
    this.variable();
    for(let e in args) this.variable(e, args[e]);
  }
  variable(name, value) {
    if(arguments.length < 1) {
      variable.set(this, {});
      return this;
    }
    if(arguments.length == 1) return variable.get(this)[name];
    if(variable.get(this)[name].name === "Object" && value.name === "Object") value = Util.deepMerge({}, variable.get(this)[name], value);
    variable.get(this)[name] = value;
    return this;
  }
  execute() {
    let code = ("var global = undefined;" + this.code).split(";").filter(e => !(/(;|\s)return\s/).test(e));
    let func = new Function(...Object.keys(variable.get(this)), code);
    try {
      func.bind(this)(engines[this.type.replace(/^([a-z])/i, s => s.toUpperCase())], ...Object.values(variable.get(this)));
      return true;
    }
    catch(e) {
      if(e.name !== "ReferenceError" || !(/(is not defined)$/).test(e.message)) return e;
      return true;
    }
  }
}
exports = Interpret;