window.onerror = (...args) => alert(args.join("\n"));

window.io = require("/socket.io/socket.io.js");
window.Hashes = require("https://cdnjs.cloudflare.com/ajax/libs/jshashes/1.0.8/hashes.min.js");
window.jQuery = require("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js");
window.Util = require("/assets/script/util?q=all");
window.$ = jQuery;
require("/assets/script/animation?q=all");
require("/assets/script/element?q=all");
require("/assets/script/socket?q=all");
require("https://kit.fontawesome.com/106b6da9c3.js");
require("/assets/script/form");

if(Hashes !== null) {
  window.MD5 = new Hashes.MD5();
  window.SHA1 = new Hashes.SHA1();
  window.SHA256 = new Hashes.SHA256();
  window.SHA512 = new Hashes.SHA512();
  window.RMD160 = new Hashes.RMD160();
}
  
window.Snackbar = $("#snackbar");

window.Toast = opts => {
  const snackbar = Snackbar;
  snackbar.css({"opacity": 0, "transform": "scale(0)"}).stop();
  if(snackbar.timeOut) clearTimeout(snackbar.timeOut);
  opts = Object.assign({message: " ", action: [], timeOut: 5000}, typeof opts === "object" ? opts : {});
  snackbar.children(".label").text(opts.message);
  snackbar.animate({opacity: 1}, {
    duration: 200,
    step: now => snackbar.css("transform", `scale(${now})`)
  });
  snackbar.close = () => {
    snackbar.animate({opacity: 0}, {
      duration: 200,
      step: now => snackbar.css("transform", `scale(${now})`)
    });
  };
  if(opts.action.length > 0) snackbar.children(".action").text(opts.action[0]);
  if(opts.action.length > 0) snackbar.children(".action").on("click", () => (opts.action.length > 1 ? opts.action[1] : actionDefalt).call(snackbar));
  if(opts.timeOut !== Infinity) snackbar.timeOut = setTimeout(() => snackbar.close(), typeof opts.timeOut === "number" ? opts.timeOut : 500);
  function actionDefalt() {this.close()}
  return snackbar;
};

Util.run((function Setup(w) {
  const {String, Object} = w;
  const STRING_DEFINE_PROTO = Util.define(String.prototype);
  const OBJECT_DEFINE = Util.define(Object);
  if(!("copy" in Object)) OBJECT_DEFINE("copy", function copy(obj, deep = true) {
    if(deep) return Util.deepMerge({}, obj);
    return this.assign({}, obj);
  });
  if(!("capitalize" in String.prototype)) STRING_DEFINE_PROTO("capitalize", function capitalize(count = Infinity) {
    let result = this;
    for(let [i,e] of Object.entries(result.split(" "))) {
      e = Util.capital(e);
      if(i > count) break;
      result = result.replace(RegExp(e.toLowerCase()), e);
    }
    return result;
  });
  
  const ANCHORS = Array.from($("a"));
  ANCHORS.forEach(e => {
    Util.load(e.href);
    e.onclick = () => Util.redirect(e.href);
  });
}).bind({}), window);

Util.run((async function Header($) {
  const header = $("header");
  const navbtn = $("header > #nav-btn");
  const nav = $("#nav");
  const links = $("#nav > nav > span");
  const socialLinks = $("footer > .social-links > span");
  let navbtnMarginTop = parseFloat(navbtn.css("margin-top"));
  let navlinks = {};
  for(let key of ["HOME", "APPS", "ABOUT", "STATUS"]) navlinks[key] = self => {self = self.children("a")[0];if(self.href === window.location.href) return; self.click()};
  navlinks["SIGN IN"] = self => {navbtn.trigger("click");Account(self.text())};
  navlinks["SIGN UP"] = self => {navbtn.trigger("click");Account(self.text())};
  navbtn.on("pointerdown", () => {
    navbtn.css({
      "box-shadow": "0 0 0 #0005",
      "margin-top": navbtnMarginTop+2,
      "margin-left": "2px"
    });
  });
  navbtn.on("pointerup", () => {
    navbtn.css({
      "box-shadow": "1px 1px 0 #0005, 2px 2px 0 #0005",
      "margin-top": navbtnMarginTop,
      "margin-left": "0"
    });
  });
  if(!localStorage.getItem("UserLogin") || localStorage.getItem("UserLogin") === "") {
    let account = await $.get("/api/account/user-logged");
    if(!!account) localStorage.setItem("UserLogin", JSON.stringify(account));
  }
  if(!!localStorage.getItem("UserLogin") && localStorage.getItem("UserLogin") !== "") {
    let account = JSON.parse(localStorage.getItem("UserLogin"));
    let search = await $.get("/api/account/user-logged");
    if(account !== search) await $.post("/api/account/login?" + $.param(account));
    navbtn.attr("src", account.picture);
    links.filter((i,e) => $(e).text() === "SIGN IN").text("ACCOUNT").attr("id", "/account/settings");
    links.filter((i,e) => $(e).text() === "SIGN UP").text("LOG OUT").attr("id", "/api/account/logout");
  }
  navbtn.on("click", () => nav.toggleClass("active"));
  links.each((i, e) => $(e).on("click", (event) => $(e).ripple(500, {x:event.clientX,y:event.clientY}, () => navlinks[$(e).text()]($(e)))));
  links.on("pointerdown", function() {
    $(this).css({
      "transform": "translate(2px, 2px)",
      "box-shadow": "0 0 0 #333"
    });
  });
  links.on("pointerup", function() {
    $(this).css({
      "transform": "translate(0, 0)",
      "box-shadow": "2px 2px 2px #333"
    });
  });
  socialLinks.each((i,e) => {
    $(e).on("click", event => {
      if($(e).attr("id") === "") return;
      window.location = $(e).attr("id");
    });
  });
  window.addEventListener("resize", () => nav.css("height", "calc(100vh - 55px)"));
  function Account(type) {
    type = type.replace(" ", "").toLowerCase();
    $("body > #form").addClass("active");
    $("body > #form > #" + type).css("display", "block");
  }
}).bind({}), [window.$ || window.jQuery]);
Util.run(function Background($, isLight = false) {
  const id = "bg";
  const color = isLight ? "#121212" : "#ffffff";
  const particleNum = 80;
  const particleDense = 600;
  $(id, {
    "particles": {
      "number": { "value": particleNum, "density": { "enable": true, "value_area": particleDense } },
      "color": { "value": color },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5 },
      "size": { "value": 3, "random": true },
      "line_linked": {
        "enable": true,
        "distance": 100,
        "color": color,
        "opacity": 0.4,
        "width": 1
      },
      "move": { "enable": true, "speed": 6, "direction": "none", "out_mode": "out" }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": { "resize": true, "onclick": { "enable": false }, "onhover": { "enable": false } }
    },
    "retina_detect": true
  });
}, [particlesJS, !window.matchMedia("(prefers-color-scheme: dark)").matches]);