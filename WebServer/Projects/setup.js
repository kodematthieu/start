const fs = require("fs");

let data = fs.readFileSync("./words.txt").toString().split("\r\n");
data = data.join("\r");

fs.writeFileSync("./words.json", data);