if(process.env.NODE_ENV !== "production") require("dotenv").config();
const CustomStrategy = require("passport-custom").Strategy;
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const router = require("express").Router();
const Util = require("../util");
const {DataStore, Schema} = require("../database");
const namespace = process.env.npm_package_name.replace("-","");

__dirname = process.env.PWD;
const db = new DataStore(require(path.join(__dirname, process.env.FAUNA_TOKEN)).master);
db.schema("Account", {
  email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^.{8,32}$/,
  name: "typeof value === 'object' && (typeof value.first === 'string' && typeof value.last === 'string' && (typeof value.middle === 'string' || value.middle === null))",
  id: /^=([a-z0-9]{8})-([a-z0-9]{8})=$/i,
  plan: "value === null || typeof value === 'string'",
  profile: "value === null || (/^(https?|chrome):\\/\\/[^\\s$.?#].[^\\s]*$/).test(value)",
  settings: Object,
  verified: Boolean
});

// db.push("Account", {
//   email: "mickreys249@gmail.com",
//   password: "kmatthieu15",
//   name: {first: "Karel Matthieu", last: "Logro", middle: null},
//   id: "testrun1-yesatest",
//   plan: "Admin",
//   profile: null,
//   settings: {},
//   verified: true
// }).then(console.log).catch(console.warn);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

passport.use(namespace, new CustomStrategy(async (req, done) => {
  let data = req.method === "GET" ? Object.assign({}, req.query) : req.method === "POST" ? req.body : {};
  let method = req.params.method;
  if(req.method === "GET") delete data.redirect;
  data.id = "=xxxxxxxx-xxxxxxxx=".replace(/x/g, () => Math.floor(Math.random()*36).toString(36)).replace(/[a-z0-9]/gi, e => Math.round(Math.random()) === 1 ? e.toUpperCase() : e);
  data.verified = false;
  data.settings = {};
  data.plan = "free";
  data.profile = null;
  if(method === "signup") {
    let search = await db.pull("Email", [data.email]);
    if(!!search) err = {message: "Email was already used!"};
    if(!err) await db.push("Account", data).catch(error => err = error);
    if(err) data = false;
  }
  if(method === "signin") {
    let search = await db.pull("Email", [data.email]);
    if(!search) err = {message: "Email was not registered!"};
    if(!err && search.data.password !== data.password) err = {message: "Password was incorrect!"};
    if(err) data = false;
    else data = search.data;
  }
  return done(null, data, err);
}));

router.all("/auth/:method(signin|signup)", passport.authenticate(namespace));
router.get("/auth/callback", passport.authenticate(namespace, {failureRedirect: "../../error"}), (req, res) => res.redirect(req.query.redirect));

router.post("/auth/login", (req, res) => req.login(req.query, () => res.sendStatus(200)));
router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(req.headers.referer || "/");
});

module.exports = router;