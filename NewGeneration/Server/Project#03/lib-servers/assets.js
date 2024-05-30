const express = require("express")
const router = express.Router()

const fs = require("fs")
__dirname = process.env.PWD+"/assets";

router.get("/image/:fname", (req, res, next) => {
  if(!fs.existsSync(__dirname+"/images/" + req.params.fname)) return next()
  res.sendFile(__dirname+"/images/" + req.params.fname)
})
router.get("/style/:fname", (req, res, next) => {
  if(!fs.existsSync(`${__dirname}/styles/${req.query.device.toLowerCase()}/${req.params.fname}.css`)) return next()
  res.sendFile(`${__dirname}/styles/${req.query.device.toLowerCase()}/${req.params.fname}.css`)
})
router.get("/style/:fname", (req, res, next) => {
  if(!fs.existsSync(`${__dirname}/styles/${req.query.device.toLowerCase()}/${req.params.fname}.css`)) return next()
  res.sendFile(`${__dirname}/styles/${req.query.device.toLowerCase()}/${req.params.fname}.css`)
})
router.get("/script/:fname", (req, res, next) => {
  if(!fs.existsSync(`${__dirname}/scripts/${req.query.device.toLowerCase()}/${req.params.fname}.js`)) return next()
  res.sendFile(`${__dirname}/scripts/${req.query.device.toLowerCase()}/${req.params.fname}.js`)
})
router.get("/lib/:fname", (req, res, next) => {
  if(!fs.existsSync(`${__dirname}/lib/${req.params.fname}.js`)) return next()
  res.sendFile(`${__dirname}/lib/${req.params.fname}.js`)
})

module.exports = router