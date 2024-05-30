const app = require("express")();

app.use("/music-maker", require("./music-maker"));

module.exports = app;