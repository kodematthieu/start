const express = require("express")
const router = express.Router()

const pages = require("./page-config")
__dirname = process.env.PWD;

router.get("/*", (req, res, next) => {
  const data = pages.filter(e => e.route === req.url)[0]
  if(typeof data !== "object") return next()
  res.render(req.device.type+".html", data)
})

module.exports = router