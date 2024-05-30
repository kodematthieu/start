window.onerror = (...err) => alert(err.join("\n"))

const Util = require("/assets/script/main/index/util");
const Anime = require("/assets/script/main/index/anime");
const Socket = require("/assets/socket.io/socket.io.js")(window.location.origin);
const Markdown = new (require("/assets/script/main/index/showdown")).Converter();

jQuery.ajaxSetup({async: false});

Util.run(async function() {
  alert(await Util.clipboard())
}).catch(alert);

Util.run(function Header($) {
  const header = $("header");
  const navbtn = header.children(".nav-btn");
  const nav = $("aside#nav");
  const navlist = $("aside#nav > .group > #item");
  navbtn.on("click", () => {
    navbtn.toggleClass("active");
    NavActivate(navbtn.hasClass("active"));
    $.bbq.pushState({"nav.open": navbtn.hasClass("active")});
  });
  function NavActivate(bol) {
    if(Util.isType(bol, Boolean)) bol = Boolean(bol);
    if(bol) {
      $("body").animate({now: parseFloat($("aside").css("width"))}, {step: (now, fx) => $("body").css("transform", `translateX(-${now}px)`)});
      $("header").animate({"border-bottom-right-radius": "0px"});
      $("aside").animate({now: 100}, {step: (now, fx) => $("aside").css("box-shadow", `-${now/100}px 0 ${now/20}px #aaa`)});
    }
    else {
      $("body").animate({now: 0}, {step: (now, fx) => $("body").css("transform", `translateX(-${now}px)`)});
      $("header").animate({"border-bottom-right-radius": "10px"});
      $("aside").animate({now: 0}, {step: (now, fx) => $("aside").css("box-shadow", `-${now/100} 0 ${now/20}px #aaa`)});
    }
  }
}, [$ || jQuery]);

Util.run(function Aside($, main) {
  const cover = $("<img/>").attr("src", $.get("/assets/image/freepik").responseJSON["main-cover.jpg"]);
  cover.css({
    "width": "100%",
    "position": "relative",
    "z-index": "52"
  });
  // main.prepend(cover);
}, [$ || jQuery, ($ || jQuery)("aside")]);

Util.run(function Url($) {
  if($.bbq.getState("nav.open") === "true") $("header > .nav-btn").trigger("click");
}, [$ || jQuery]);

Util.run(function General($, md) {
  const markdown = $(".markdown");
  markdown.html(md.makeHtml(markdown.html()));
}, [$ || jQuery, Markdown]);