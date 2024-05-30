const express = require("express")
const app = express()

app.use("/account", require("./account"))

module.exports = app