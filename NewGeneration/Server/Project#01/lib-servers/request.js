const express = require("express")
const router = express.Router()

const fs = require("fs")
const path = require("path")
__dirname = path.join(__dirname, "../")

router.get("/games", (req, res) => {
  let tree = fs.readdirSync(__dirname + "/games")
  let data = []
  tree = tree.filter(e => e !== "index")
  tree = tree.filter(e => !fs.existsSync(__dirname + `/games/${e}/.ignore`))
  tree = tree.filter(e => fs.lstatSync(__dirname + `/games/${e}`).isDirectory())
  for(let e of tree) {
    data.push(e.split("-").join(" "))
  }
  res.send(data)
})

module.exports = router