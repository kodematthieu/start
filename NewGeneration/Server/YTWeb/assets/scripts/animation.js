$.fn.ripple = function(speed, opts={}, callback=()=>{}) {
  const ripple = $("<span></span>");
  $(this).css("position", $(this).css("position") === "absolute" ? "absolute" : ($(this).css("position") === "fixed" ? "fixed" : "relative"));
  $(this).css("overflow", "hidden");
  let css, pos = {
    x: opts.x || 0,
    y: opts.y || 0
  };
  let size = Math.max(parseFloat($(this).css("width")),parseFloat($(this).css("height"))) * 1.1;
  ripple.css({
    width: 0,
    height: 0,
    position: "absolute",
    left: pos.x - parseFloat($(this).offset().left),
    top: pos.y - parseFloat($(this).offset().top),
    background: "rgba(" + (opts.color instanceof Array ? opts.color.toString() : [255,255,255]) + ",0.5)",
    "border-radius": size*10 + "px",
    opacity: 1,
    transform: "translate(-50%, -50%)",
    display: "block"
  });
  $(this).append(ripple);
  ripple.animate({
    width: size*2,
    height: size*2,
    opacity: 0
  }, speed || 1000, () => {
    ripple.remove();
    callback.call(this);
  });
  return this;
};

$.loading = function(x, y, size, bg) {
  const self = $("<img src=\"/assets/img/owned/loading.svg\" alt=\"loading...\"/>");
  if(typeof bg === "string") self.css("background-color", bg || "transparent");
  $("body").append(self.css({
    "position": "absolute",
    "top": x,
    "left": y,
    "width": size,
    "height": size,
    "transform": `translate(-50%, -50%)`,
    "border-radius": size/8
  }));
  return {
    stop() {
      self.remove();
    }
  };
};