const express = require("express")
const router = express.Router()

const path = require("path")
const fs = require("fs")
const md5 = require("md5")
const Datastore = require("nedb")
__dirname = path.join(__dirname, "../", "../")

const db = new Datastore({filename: __dirname + "/.data/account.json", autoload: true})

db.ensureIndex({fieldName: "token", unique: true})

router.post("/create", (req, res) => {
  db.find({username: req.query.username}, (err, docs) => {
    if(docs.length != 0) res.send("Username is already taken")
    else {
      db.insert({name: req.query.name, username: req.query.username, password: md5(req.query.password), token: Token()})
      res.sendStatus(200)
    }
  })
})

router.get("/search", (req, res) => {
  let data = {}
  if(!!req.query.name) data["name"] = req.query.name
  if(!!req.query.username) data["username"] = req.query.username
  if(!!req.query.password) data["password"] = md5(req.query.password)
  if(!!req.query.token) data["token"] = req.query.token
  db.find(data, (err, docs) => {
    res.send(docs)
  })
})

router.post("/update", (req, res) => {
  let search = req.query.search
  let update = req.query.update
  db.update(search, {$set: update}, {}, (err) => {
    db.find(search, (err, docs) => {
      res.send(docs)
    })
  })
})

router.get("/clear", (req, res) => {
  db.remove({$not: {token: "P947YpDntltcgD6WR8ava10mHg2IH99g2P"}}, {multi: true})
  res.sendStatus(200)
})

router.get("/:token", (req, res, next) => {
  db.find({username: "kmatthieu14"}, (err, docs) => {
    if(req.params.token === docs[0].token) {
      res.sendFile(__dirname + "/.data/account.json")
    }
    else next()
  })
})

function Token() {
  let token = []
  for(let i = 0; i <= 32; i++) {
    let chr = Math.round(Math.random()*37).toString(36)
    token.push(Math.round(Math.random()) === 1 ? chr.toUpperCase() : chr.toLowerCase())
  }
  return token.join("")
}

module.exports = router