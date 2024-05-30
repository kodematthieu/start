const router = require("express").Router();
const path = require("path");
const fs = require("fs");

__dirname = path.join(process.env.PWD, "assets");

const send = (path, res, next) => {
  if(!fs.existsSync(path)) return next({code: 404, message: "File Not Found!"});
  res.sendFile(path);
};

router.get("/script/:fname", (req, res, next) => send(path.join(__dirname, "scripts", (req.query.q === "all" ? "" : req.device.type), `${req.params.fname}.js`), res, next));
router.get("/script/:path/:fname", (req, res, next) => {send(path.join(__dirname, "scripts", req.params.path, (req.query.q === "all" ? "" : req.device.type), `${req.params.fname}.js`), res, next)});
router.get("/style/:fname", (req, res, next) => send(path.join(__dirname, "styles", (req.query.q === "all" ? "" : req.device.type), `${req.params.fname}.css`), res, next));
router.get("/style/:path/:fname", (req, res, next) => send(path.join(__dirname, "styles", req.params.path, (req.query.q === "all" ? "" : req.device.type), `${req.params.fname}.css`), res, next));
router.get("/img/:dir/:fname", (req, res, next) => send(path.join(__dirname, "images", `${req.params.dir}/${req.params.fname}`), res, next));

module.exports = router;