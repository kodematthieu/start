if(process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const device = require("express-device");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const socket = require("socket.io");
const {Merror, MerrorMiddleware} = require("express-merror");
const Util = require("./util");

const app = express();
app.listen = app.listen(process.env.PORT || 5000, process.env.NODE_ENV !== "production" ? "127.0.0.1" : null, () => Util.print("Server Started!"));
app.io = socket(app.listen, {path: "/assets/socket.io"});
app.address = new Promise((res, rej) => app.listen.on("listening", () => res(`http://${app.listen.address().address === "::" ? "[::]" : app.listen.address().address}:${app.listen.address().port}`)));
app.io.on("connection", function() {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: true, secret: "shh... its a secret!"}));
app.use(device.capture());
app.use(require("cors")());

app.engine("html", require("ejs").renderFile);
app.set("views", __dirname + "/pages");

app.use(require("./express/.status")(app.io));

app.use(require("./express"));
app.use(MerrorMiddleware());

process.on("SIGTERM", () => Util.print("Server Ended!"));
module.exports = app;