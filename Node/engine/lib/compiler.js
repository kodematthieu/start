const fs = require("fs");
const path = require("path");
const Interpret = require("./interpreter");
const engines = require("./engines");
class Compiler {
  constructor(type, filepath) {
    filepath = path.resolve(process.env.PWD, filepath);
    this.code = fs.readFileSync(filepath).toString();
    this.code = new Interpret(this.code, {Engine: engines[type]});
  }
  execute(global) {
    global.type = this.code.variable("Engine");
    this.code.variable("module", global);
    return this.code.execute();
  }
}
exports = Compiler;