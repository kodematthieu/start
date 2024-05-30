const express = require("express")
const app = express()

const fs = require("fs")
const favicon = require("serve-favicon")
const path = require("path")
__dirname = path.join(__dirname, "../")

app.use(favicon(__dirname + "/assets/images/logo.ico"))

app.get("/queryAll", (req, res) => {
  let tree = fs.readdirSync(__dirname + "/calculators")
  let data = []
  tree = tree.filter(e => e !== "index")
  tree = tree.filter(e => !fs.existsSync(__dirname + `/calculators/${e}/.ignore`))
  tree = tree.filter(e => fs.lstatSync(__dirname + `/calculators/${e}`).isDirectory())
  for(let e of tree) data.push(e.split("-").join(" "))
  res.send(data)
})

app.use(require("./pages"))
app.use("/assets", require("./assets"))


app.listen(8001, () => {
  console.log("Successfully established your server");
  console.log("Listening at 'http://localhost:%s'", 8001);
})