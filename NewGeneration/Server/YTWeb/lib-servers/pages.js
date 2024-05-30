const router = require("express").Router();
const path = require("path");
const fs = require("fs");

__dirname = process.env.PWD;

function render(req, res, next, datas, dir = "") {
  const root = ("/" + req._parsedUrl.pathname.split("/")[req._parsedUrl.pathname.split("/").length > 1 ? 1 : 0]);
  let data = datas.filter(e => e.route === req._parsedUrl.pathname)[0];
  if(!data) data = datas.filter(e => e.route === root && e.type === "collection")[0];
  if(!data) return next({code: 404, message: "Page Not Found!"});
  if(data.type === "collection") {
    data.content.map(e => {
      e.route = root + e.route;
      return e;
    });
    return render(req, res, next, data.content, data.dir);
  }
  data = Object.assign({pre_scripts: [], scripts: [], styles: []}, data);
  data.scripts = data.scripts.map(e => {if(typeof e !== "object") e = {name: e, defer: false, async: false};e.name = path.join("/assets/script", dir, e.name);return e});
  data.pre_scripts = data.pre_scripts.map(e => {if(typeof e !== "object") e = {name: e, async: false};e.name = path.join("/assets/script", dir, e.name);return e});
  data.styles = data.styles.map(e => {if(typeof e !== "object") e = {name: e, media: "all"};e.name = path.join("/assets/style", dir, e.name);return e});
  data.content = path.join(dir, data.content);
  if(req.device.type === "bot") return res.render("bot.html");
  res.render(req.device.type+"/index.html", data);
}
function sector(name, device, sub = "index") {
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, name, device, sub, "data.meta.json")).toString());
  const data = {};
  data.pre_scripts = (meta.pre_scripts || []).map(e => {if(typeof e !== "object") e = {name: e, async: false, defer: false};e.name = "/" + path.join(name, sub, e.name);return e});
  data.scripts = meta.scripts.map(e => {if(typeof e !== "object") e = {name: e, async: false, defer: true};e.name = "/" + path.join(name, sub, "script", e.name);return e});
  data.styles = meta.styles.map(e => {if(typeof e !== "object") e = {name: e, media: "all"};e.name = "/" + path.join(name, sub, "style", e.name);return e});
  data.content = `${__dirname}/${name}/${device}/${sub}/index`;
  data.title = meta.title;
  return data;
}

router.get("/:section", (req, res, next) => {
  const sections = fs.readdirSync(__dirname).filter(e => fs.existsSync(path.join(__dirname, e, "manifest.json")));
  if(!sections.includes(req.params.section)) return next();
  const section = path.join(__dirname, req.params.section, req.device.type);
  res.render(req.device.type+"/index.html", sector(req.params.section, req.device.type));
});
router.get("/:section/manifest", (req, res, next) => {
  const fpath = path.join(__dirname, req.params.section, "manifest.json");
  if(!fs.existsSync(fpath)) return next({code: 404, message: "Manifest Not Found!"});
  res.json(JSON.parse(fs.readFileSync(fpath)));
});
router.get("/:section/:sub", (req, res, next) => {
  const sections = fs.readdirSync(__dirname).filter(e => fs.existsSync(path.join(__dirname, e, "manifest.json")));
  if(!sections.includes(req.params.section)) return next();
  if(!fs.readdirSync(path.join(__dirname, req.params.section, req.device.type)).filter(e => fs.existsSync(path.join(__dirname, req.params.section, req.device.type, e, "data.meta.json"))).includes(req.params.sub)) return next({code: 404, message: "Page not found!"});
  res.render(req.device.type+"/index.html", sector(req.params.section, req.device.type, req.params.sub));
});
router.get("/:section/:sub/:ftype/:filename", (req, res, next) => {
  const sections = fs.readdirSync(__dirname).filter(e => fs.existsSync(path.join(__dirname, e, "manifest.json")));
  const mime = {"script": "js", "style": "css"};
  if(!sections.includes(req.params.section)) return next();
  if(!fs.readdirSync(path.join(__dirname, req.params.section, req.device.type)).filter(e => fs.existsSync(path.join(__dirname, req.params.section, req.device.type, e, "data.meta.json"))).includes(req.params.sub)) return next({code: 404, message: "Page not found!"});
  let file = path.join(__dirname, req.params.section, req.device.type, req.params.sub, req.params.filename + "." + (mime[req.params.ftype] || req.params.ftype));
  if(!fs.existsSync(file)) return next({code: 404, message: "File not found!"});
  res.sendFile(file);
});

router.get("/*", (req, res, next) => render(req, res, next, JSON.parse(fs.readFileSync(__dirname + "/pages/index.json"))));

module.exports = router;