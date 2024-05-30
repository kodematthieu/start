const express = require("express")
const router = express.Router()

const path = require("path")
__dirname = path.join(__dirname, "../assets")


router.get("/lib/:file", (req, res) => {
  res.sendFile(__dirname + `/lib/${req.params.file}.js`)
})

router.get("/font/:file", (req, res) => {
  res.sendFile(__dirname + `/font/${req.params.file}`)
})

router.get("/audio/:game/:file", (req, res) => {
  res.sendFile(__dirname + `/audio/${req.params.game}/${req.params.file}`)
})

router.get("/image/:game/:file", (req, res) => {
  res.sendFile(__dirname + `/image/${req.params.game}/${req.params.file}`)
})

module.exports = router