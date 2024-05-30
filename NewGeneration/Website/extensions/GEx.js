(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") module.exports = factory(global, true);
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var TEST_FIND = `
$ hello = True;
`;
  
  var Extract = new (function Extract(){})();
  
  var Cache = function Cache() {
    Object.defineProperty(this, "data", {value:[]});
    Object.defineProperty(this, "scope", {value:0,writable:true});
    this.push = function(variable, value, varType, scope = false) {
      if(!scope) scope = this.scope++;
      this.data.push({var: variable, value: value, type: varType, scope: Math.floor(scope).toString(36)});
      return scope;
    };
    this.search = function(value, key) {
      return this.data.find(function(e) {return e[key] === value});
    };
  };
  
  var Run = Extract.run = function run(data) {
    var cache = new Cache();
    var indents = {};
    var data = data.split("\n");
    for(var [i,line] of data.entries()) {
      if(line.match(/^\$\s+(.*?)(\s|\n|\r|=)/)) {
        var v = line.match(/^\$\s+(.*?)(\s|\n|\r|=)/)[1];
        if(!(/^[a-z_]/i).test(v)) throw new Error(`VariableError: Line: ${i}. Variable names can't start with ${v[0]}`);
        if(!(/^[a-z0-9_]+$/).test(v)) throw new Error(`VariableError: Line: ${i}. Variable names can only contain 0-9, a-z, A-Z, and '_'.`);
        var indent = cache.push(v, (/^\$\s+(.*?)\s+=\s+(.*)(\s|\n|\r)+/).test(line) ? line.match(/^\$\s+(.*?)\s+=\s+(.*?)(\s|\n|\r)+/)[2] : undefined, "constant");
        indents[(/^(\s+)(.*)/).test(line) ? line.match(/^(\s+)(.*)/)[1].length : 0] = indent;
        console.log(cache);
      }
    }
    console.log(data);
  };
  
  Extract.run(TEST_FIND);
  if(!noGlobal) window.GExtract = Extract;
  return Extract;
});