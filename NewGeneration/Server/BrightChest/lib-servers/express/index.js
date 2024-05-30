const fs = require("fs");
const router = require("express").Router();
const render = require("./.renderer.js");
const antibot = require("./.antibot.js");

router.get("/", antibot, (req, res, next) => {
  const result = render("index", "home", req.device.type, next);
  if(!result) return;
  res.render(result.main, result.data);
});

for(const url of fs.readdirSync(__dirname)) if(!(/^index.js$/).test(url) && !(/^\./i).test(url)) router.use(require("./"+url));

module.exports = router;