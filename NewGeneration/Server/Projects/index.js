const express = require("express");
const socket = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
app.listen = app.listen(process.env.PORT || 5815, () => console.log("Server Started!"));
app.address = new Promise((res, rej) => app.listen.on("listening", () => res(`http://${app.listen.address().address === "::" ? "[::]" : app.listen.address().address}:${app.listen.address().port}`)));
app.socket = socket(app.listen);

for(const dir of fs.readdirSync(__dirname)) {
  let route = dir;
  if((/^Project-\d+$/).test(dir)) {
    route = dir.match(/\d+$/)[0];
    app.post(`/${route}/datastore/save`, (req, res) => {
      let {filename, data, force} = req.body;
      let dirname = path.join(filename).split("/");
      filename = dirname.splice(dirname.length-1, 1);
      data = data + "";
      force = !!force;
      try{fs.mkdirSync(path.join(__dirname, dir, "._.datastore._."))}catch(e){}
      let url = path.join(__dirname, dir, "._.datastore._.", ...dirname);
      if(!force && !fs.existsSync(url)) return res.send(404);
      try{fs.mkdirSync(url, {recursive: true})}catch(e){}
      fs.writeFileSync(path.join(__dirname, dir, "._.datastore._.", ...dirname, filename), data);
      return res.send(200);
    });
    app.get(`/${route}/datastore/load`, (req, res) => {
      let {filename} = req.query;
      let dirname = path.join(filename).split("/");
      filename = dirname.splice(dirname.length-1, 1);
      try{fs.mkdirSync(path.join(__dirname, dir, "._.datastore._."))}catch(e){}
      let url = path.join(__dirname, dir, "._.datastore._.", ...dirname, filename);
      if(!fs.existsSync(url)) return res.send(404);
      return res.send(fs.readFileSync(url).toString());
    });
    app.use(`/${route}`, (req,res,next) => {
      if((/^\/server\//).test(req.url)) return res.send(403);
      return next();
    });
    if(fs.existsSync(path.join(__dirname, dir, "server"))) if(typeof require(`./${dir}/server`) === "function") require(`./${dir}/server`)({app: app, server: app.listen, socket: app.socket});
  }
  if(!(["scripts"].includes(dir) || (/^Project-\d+$/).test(dir))) continue;
  app.use(`/${route}`, express.static(__dirname + "/" + dir));
}
