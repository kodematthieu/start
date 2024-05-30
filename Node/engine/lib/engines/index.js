const fs = require("fs"); 
for(let e of fs.readdirSync(__dirname + "/")) if(!(/index.js/).test(e)) exports[e.split(".")[0]] = require("./" + e);