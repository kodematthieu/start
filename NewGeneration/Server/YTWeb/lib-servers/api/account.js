require("dotenv").config();
const router = require("express").Router();
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const DataStore = require("./datastore");
const path = require("path");
const fs = require("fs");
const passport = require("passport");

const email = require("./email");

__dirname = process.env.PWD;
const google_credentials = require(path.join(__dirname, process.env.GOOGLE_OAUTH)).web;
const facebook_credentials = require(path.join(__dirname, process.env.FACEBOOK_OAUTH)).web;
const db = new DataStore(require(path.join(__dirname, process.env.FAUNA_TOKEN)).master);

const TOKENS = ["8t1d09p1", "mfzyrfab","aho6zeaf", "shzz53xv","nyxpbm6k", "drk1nn5c","dr1lophg", "nap3j2cb","f7tmngr5", "xi509z24","xk8bqa9a", "b3a5cxzj","20gvw5rx", "8m00xbbg","fg1loker", "dj9sk05d"];

let FormType, prevLink = "/";
let OAuthOptions = {
  google: { scope: ["profile", "email"] },
  facebook: { scope: ["email"] }
};

const clientSecret = id => {
  id = id.toString();
  return "xxxxxxxxxxxx-0123-yyyyyyyy-4567-xxxxxxxxxxxx"
    .replace(/\d/g, _ => id[_])
    .replace(/x/g, _ => Math.floor(Math.random()*16).toString(16))
    .replace(/y+/g, _ => TOKENS[Math.round(Math.random()*TOKENS.length)]);
};

const uniqueID = _ => Date.now() + (Math.random()*100000).toFixed();

router.use(passport.initialize());
router.use(passport.session());

async function OAuth(aToken, rToken, profile, done) {
  let err, data = {
    id: profile.id,
    name: {
      first: profile.name.givenName,
      last: profile.name.familyName,
    },
    email: profile._json.email,
    picture: profile._json.picture || "",
    secret: clientSecret(profile.id),
    provider: profile.provider
  };
  if(profile.provider === "facebook") data.picture = profile.profileUrl;
  if(FormType === "signup") {
    let search = await db.search("Email-Provider", [data.email, data.provider]);
    if(!!search) err = {message: "Email was already used!"};
    if(!err) await db.push("Accounts", data).catch(error => err = error);
    if(err) data = false;
  }
  else if(FormType === "signin") {
    let search = await db.search("Email-Provider", [data.email, data.provider]);
    if(!search) err = {message: "Email was not registered!"};
    if(err) data = false;
    else data = search.data;
  }
  return done(null, data, err);
}

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Dev Mode
passport.use("google", new GoogleStrategy({
  clientID: google_credentials.client_id,
  clientSecret: google_credentials.client_secret,
  callbackURL: google_credentials.redirect_uris[0]
}, OAuth));
passport.use("facebook", new FacebookStrategy({
  clientID: facebook_credentials.client_id,
  clientSecret: facebook_credentials.client_secret,
  callbackURL: facebook_credentials.redirect_uris[0],
  profileFields: ["id", "name", "emails"]
}, OAuth));
passport.use("starrystar", new CustomStrategy(async ({query}, done) => {
  let err, data = query;
  data.provider = "starrystar";
  data.id = uniqueID();
  data.secret = clientSecret(data.id);
  if(FormType === "signup") {
    let search = await db.search("Email-Provider", [data.email, data.provider]);
    if(!!search) err = {message: "Email was already used!"};
    if(!err) await db.push("Accounts", data).catch(error => err = error);
    if(err) data = false;
  }
  else if(FormType === "signin") {
    let search = await db.search("Email-Provider", [data.email, data.provider]);
    if(!search) err = {message: "Email was not registered!"};
    if(!err && search.data.password !== data.password) err = {message: "Password was incorrect!"};
    if(err) data = false;
    else data = search.data;
  }
  return done(null, data, err);
}));

router.get("/oauth/:type/:provider", (req, res, next) => {
  if(
    ["signup", "signin"].filter(e => req.params.type === e).length < 1 ||
    ["google", "facebook", "starrystar"].filter(e => req.params.provider === e).length < 1 ||
    !!req.user
  ) return next();
  FormType = req.params.type;
  prevLink = req.headers.referer;
  passport.authenticate(req.params.provider, OAuthOptions[req.params.provider])(req,res,next);
});
router.get("/oauth/google/callback", passport.authenticate("google", { failureRedirect: "../../error" }), (req, res) => {
  res.redirect(prevLink || "/");
});
router.get("/oauth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "../../error" }), (req, res) => {
  res.redirect(prevLink || "/");
});
router.get("/oauth/starrystar/callback", passport.authenticate("starrystar", { failureRedirect: "../../error" }), (req, res) => {
  res.redirect(prevLink || "/");
});
router.get("/user-logged", (req, res) => res.send(req.user || null));
router.post("/login", (req, res) => req.login(req.query, () => res.sendStatus(200)));
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(req.headers.referer || "/");
});


module.exports = router;