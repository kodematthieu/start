const fs = require("fs");
module.exports = new (function Index(argument) {
  for(let e of fs.readdirSync(__dirname)) if(e !== "index.js") this[e.split(".").slice(0,e.split(".").length-1).join("-")] = require("./"+e);
})();