const path = require("path");
const fs = require("fs");
const Util = require("./Util");
const Module = require("./module");
const Compiler = require("./compiler");

const modules = new Module();

const __config__ = fs.existsSync(process.env.PWD + "/engine.config.json") ? JSON.parse(fs.readFileSync(process.env.PWD + "/engine.config.json")) : {};

Util.run(function config($) {
  if(!("version" in $)) throw new Error("Version was not defined");
  if(!Util.isType($.name, String)) $.name = "Unknown";
  if(!Util.isType($.version, Array) || $.version.length != 3 || !$.version.every(e => Number.isSafeInteger(e))) throw new SyntaxError("Invalid version format");
  if(!Util.isType($.modules, Array) || !Util.inArray($.modules, Object)) $.modules = [];
  if(!Util.isType($.buttons, Array)) $.buttons = [];
  $.modules.forEach((e, i, a) => {if(!["screen", "custom", "panel", "button"].includes(e.type)) e.type = "custom";if(typeof e.path !== "string") e.path = ""});
  $.buttons = $.buttons.filter(e => (/^[a-z.0-9]+$/).test(e));
}, [__config__]);

const __modules__ = Util.run(function compile($) {
  return $.modules.map(module => {
    const compiler = new Compiler(module.type, module.path);
    const prevs = Object.keys(modules.globals);
    compiler.execute(modules);
    return modules.import(Object.keys(modules.globals).filter(e => !prevs.includes(e)));
  });
}, [__config__]);