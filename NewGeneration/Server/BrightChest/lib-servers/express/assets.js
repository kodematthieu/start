const path = require("path");
const fs = require("fs");
const router = require("express").Router();

router.get(/^\/assets\/(script|js|style|css|image|img)\/([a-z]+-[a-z]+|main)\/([a-z\-]+)\/([a-z.\-]+)$/i, (req, res, next) => {
  let filetype = req.params[0],
      section = req.params[1],
      area = req.params[2],
      filename = req.params[3];
  switch(filetype) {
    case "script":
    case "js":
      filename += ".js";
      break;
    case "style":
    case "css":
      filename += ".css";
      break;
    case "json":
      filename += ".json";
      break;
    default: break;
  }
  let url = path.join(process.env.PWD, "pages", section, area, filename);
  if(!fs.existsSync(url)) return next();
  res.sendFile(url);
});
router.get(/^\/assets\/(img|image)\/([a-z\-]+)$/i, (req, res, next) => {
  let url = path.join(process.env.PWD, "images", req.params[1]);
  let final = {};
  if(!fs.existsSync(url)) return next();
  res.json(fs.readdirSync(url));
});
router.get(/^\/assets\/(img|image)\/([a-z\-]+)\/([a-z\-.0-9]+)$/i, (req, res, next) => {
  let url = path.join(process.env.PWD, "images", req.params[1], req.params[2]);
  let final = {};
  if(!fs.existsSync(url)) return next();
  res.sendFile(url);
});

module.exports = router;