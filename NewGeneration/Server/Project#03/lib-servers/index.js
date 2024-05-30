const PORT = process.env.PORT || 8002

const express = require("express")
const device = require("express-device")
const app = express()

const fs = require("fs")
const favicon = require("serve-favicon")
__dirname = process.env.PWD;

app.use(device.capture())
app.use(favicon(__dirname + "/assets/images/logo.ico"))

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", __dirname)

app.use(require("./pages"))
app.use("/assets", require("./assets"))

app.listen(PORT, () => {
  console.log("Successfully established your server");
  console.log("Listening at 'http://localhost:%s'", PORT);
})