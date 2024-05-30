const Util = require("./Util");
const type = new WeakMap();
const namespace = new WeakMap();
const globals = new WeakMap();

class ExportError extends TypeError {constructor(){super(...arguments)}}
class ImportError extends TypeError {constructor(){super(...arguments)}}
class Module {
  constructor() {
    globals.set(this, {});
  }
  get globals() {return Object.freeze(Util.deepMerge({}, globals.get(this)))}
  get type() {return type.has(this) ? type.get(this) : null}
  set type(v) {type.set(this, v instanceof Object && v instanceof Function ? v : null)}
  get namespace() {return namespace.has(this) ? namespace.get(this) : null}
  set namespace(v) {v = v === null ? null : v.toString();namespace.set(this, (/^[a-z0-9]+$/).test(v) ? v : null)}
  export(value) {
    if(this.namespace === null) throw new ExportError("module.namespace is not defined");
    if(!(value instanceof this.type) && value.constructor.name !== this.type.name) throw new ExportError(`Expected to export of type ${this.type.name}, but received of type ${value.constructor.name} instead`);
    globals.get(this)[this.namespace] = value;
    this.namespace = null;
    return this;
  }
  import(namespace) {
    namespace = namespace.toString();
    if(!(namespace in globals.get(this))) throw new ImportError(`Module with a namespace of ${namespace} does not exist`);
    return globals.get(this)[namespace];
  }
}
exports = Module;