const express = require("express")
const router = express.Router()

const path = require("path")
const fs = require("fs")
__dirname = path.join(__dirname, "../")

const games = fs.readdirSync(__dirname + "/games")

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/games/index/index.html")
})

router.get("/:game/", (req, res, next) => {
  let invalid = true
  for(let e of games) {if(e === req.params.game) invalid = false}
  if(!!invalid) {
    next()
  }
  else {
    res.sendFile(__dirname + `/games/${req.params.game}/index.html`)
  }
})

router.get("/:game/:file", (req, res) => {
  res.sendFile(__dirname + `/games/${req.params.game}/${req.params.file}`)
})

module.exports = router