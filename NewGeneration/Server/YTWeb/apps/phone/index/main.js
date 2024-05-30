Util.run(function Apps($) {
  const search = $("#search");
  const box = search.children(".box");
  const btn = search.children(".fas");
  const apps = $("#apps");
  
  let AllApps = JSON.parse($.ajax({url: "/apps/manifest", type: "GET", async: false}).responseText).map(e => {e.link = "/apps" + e.link;return e});
  
  box.trigger("focus");
  btn.on("pointerdown", () => {
    btn.css({
      "box-shadow": "none",
      "background-color": "var(--primary-color2)"
    });
  });
  btn.on("pointerup", () => {
    btn.css({
      "box-shadow": "-1px 0 2px #111",
      "background-color": "var(--primary-color1)"
    });
  });
  box.on("keypress", evt => {if(evt.keyCode === 13) btn.trigger("click")});
  btn.on("click", () => {
    if(box.val() === "") return box.trigger("focus");
    
  });
  for(let e of AllApps) apps.append(app(e));
  function app({link, icon, name, description, category, permission}) {
    const article = $("<article></article>");
    const img = $(`<img src="${icon}" class="icon"/>`);
    const div = $("<div class=\"container\"></div>");
    const title = $(`<h3 class="title">${name}</h3>`);
    const desc = $(`<span class="description">${description || " "}</span>`);
    
    const drag = {Xoff: 0, Xnow: 0, active: false};
    
    article.css({
      "width": "100%",
      "height": "75px",
      "background-color": "var(--tertary-color)",
      "background-image": "linear-gradient(135deg, var(--tertary-color1), var(--tertary-color2))",
      "border-radius": "5px",
      "margin-top": "10px",
      "display": "flex",
      "user-select": "none"
    }).on("touchstart", function(event) {
      drag.Xinit = event.touches[0].clientX - drag.Xoff;
      drag.Xoff = 0;
      drag.active = true;
    }).on("touchend", function(event) {
      drag.Xinit = 0;
      $(this).animate({now: drag.Xoff}, {
        duration: 200,
        step: (now, fx) => $(this).css("transform", `translate3d(${drag.Xoff-now}px, 0, 0)`),
        complete: () => {
          drag.Xoff = 0;
          $(this).animate({now: drag.Xoff}, 0);
        }
      });
      drag.active = false;
    }).on("touchmove", function(event) {
      if(!drag.active) return;
      event.preventDefault();
      drag.Xnow = event.touches[event.touches.length-1].clientX - drag.Xinit;
      drag.Xoff = drag.Xnow;
      $(this).css("transform", `translate3d(${drag.Xnow}px, 0, 0)`);
    }).on("click", function(event) {
      $(this).ripple(500, {x:event.clientX,y:event.clientY}, () => {
        if(permission.includes("signed") && (!localStorage.getItem("UserLogin") || localStorage.getItem("UserLogin") === "")) {
          Toast({message: "That app requires you to be signed in order to use it!"});
          $(this).stop();
          $(this).css("pointerEvents", "none");
          $(this).animate({now: -25}, {
            duration: 100,
            step: now => $(this).css("transform", `translateX(${now}px)`),
            complete: _ => {
              $(this).animate({now: 25}, {
                duration: 100,
                step: now => $(this).css("transform", `translateX(${now}px)`),
                complete: _ => {
                  $(this).animate({now: 0}, {
                    duration: 100,
                    step: now => $(this).css("transform", `translateX(${now}px)`),
                    complete: _ => $(this).css("pointerEvents", "all")
                  });
                }
              });
            }
          });
          return;
        }
        window.location = link;
      });
    });
    img.css({
      "height": "65px",
      "width": "auto",
      "padding": "5px",
      "background-color": "var(--primary-color1)",
      "border-radius": "5px 0 0 5px",
      "z-index": "2",
      "box-shadow": "1px 0 2px #555",
      "transition": "all 0.2s ease"
    }).on("pointerdown", function() {
      $(this).css({
        "background-color": "transparent",
        "box-shadow": "none"
      });
    }).on("pointerup", function() {
      $(this).css({
        "background-color": "var(--primary-color1)",
        "box-shadow": "1px 0 2px #555"
      });
    }).on("contextmenu", _ => _.preventDefault());
    div.css({
      "width": "310px",
      "height": "65px",
      "padding-top": "5px",
      "padding-left": "10px",
      "padding-bottom": "5px",
      "display": "flex",
      "flex-direction": "column"
    });
    title.css({
      "font-weight": "550",
      "font-family": "\"Montserrat\", sans-serif"
    });
    desc.css({
      "font-family": "\"Montserrat\", sans-serif",
      "font-size": "16px",
    });
    article.append(img, div.append(title, desc));
    return article;
  }
}, [$ || jQuery]);