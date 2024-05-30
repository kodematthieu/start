const express = require("express")
const router = express.Router()

const path = require("path")
__dirname = path.join(__dirname, "../")

router.get("/image/:filename", (req, res) => {
  res.sendFile(__dirname + `/assets/images/${req.params.filename}.png`)
})
router.get("/lib/:filename", (req, res) => {
  res.sendFile(__dirname + `/assets/lib/${req.params.filename}.js`)
})
router.get("/font/:filename", (req, res) => {
  res.sendFile(__dirname + `/assets/font/${req.params.filename}`)
})


module.exports = router