require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const device = require("express-device");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const fs = require("fs");
const app = express();
const listener = app.listen(PORT, () => {console.log("Successfully established your server");console.log("Listening at 'http://localhost:%s'", PORT)});

__dirname = process.env.PWD;

app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({resave: false, saveUninitialized: true, secret: "shh... its a secret!"}));
app.use(device.capture());
app.use(require("cors")());

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", __dirname + "/pages");

app.use(require("./status")(listener));

app.use(require("./discord"));
app.use("/assets", require("./assets"));
app.use("/api", require("./api"));
app.use(require("./pages"));

app.use(require("./error"));