const app = require("express")();

app.use("/account", require("./account"));
app.use("/weather", require("./weather"));
app.use("/apps", require("./apps"));

module.exports = app;