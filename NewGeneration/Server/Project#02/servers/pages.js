const express = require("express")
const router = express.Router()

const fs = require("fs")
const path = require("path")
__dirname = path.join(__dirname, "../")

const calculators = fs.readdirSync(__dirname + "/calculators")

router.get("/", (req, res) => res.redirect("/index"));
router.get("/:calculator", (req, res, next) => {
  let invalid = true
  for(let e of calculators) {if(e === req.params.calculator) invalid = false}
  if(!!invalid) next()
  else res.sendFile(__dirname + `/calculators/${req.params.calculator}/index.html`)
})
router.get("/:calculator/:file", (req, res) => res.sendFile(__dirname + `/calculators/${req.params.calculator}/${req.params.file}`))

module.exports = router