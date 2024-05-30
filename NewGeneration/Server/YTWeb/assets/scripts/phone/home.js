Util.run(function Head($) {
  let timeOut;
  try {timeOut = setInterval(noscroll, 1000/60)}
  catch(e) {if(!!timeOut) clearInterval(timeOut)}
  function noscroll() {
    if(Math.floor($(window).scrollTop()) > 0 || $("#nav").hasClass("active")) { 
      $("header").removeClass("noscroll");
      $("#nav").removeClass("noscroll");
    }
    else {
      $("header").addClass("noscroll"); 
      $("#nav").addClass("noscroll");
    }
  }
}, [$ || jQuery]);