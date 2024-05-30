$.fn.switch = function(isVertical) {
  $(this).each((_, e) => {
    const checkbox = $("<input type=\"checkbox\"/>")
    const title = $(`<p>${$(e).data("title")}</p>`)
    const before = $(`<p>${$(e).data("text-before")}</p>`)
    const after = $(`<p>${$(e).data("text-after")}</p>`)
    e = $(e)
    e.css("height", "62.55%")
    e.css("width", parseFloat(e.css("height"))*2+parseFloat(e.css("height"))/2)
    e.css("background", "#555")
    e.css("box-shadow", "0 0 5px cyan")
    title.css("font-family", "courier")
    title.css("width", "90%")
    title.css("height", "33%")
    title.css("color", "gold")
    title.css("text-align", "center")
    title.css("border-bottom", "1px solid #0ff5")
    title.css("margin", "0 auto")
    title.css("position", "relative")
    title.css("text-shadow", "0 0 5px gold")
    before.css("box-shadow", "0 0 2px gold")
    before.css("position", "absolute")
    checkbox.css("display", "none")
    before.css("bottom", "5px")
    before.css("left", "7.5px")
    before.css("width", "40%")
    before.css("height", "45%")
    before.css("padding", "auto")
    before.css("font-family", "courier")
    before.css("font-weight", "bold")
    before.css("text-align", "center")
    before.css("line-height", "22.5px")
    before.css("color", "#fff")
    before.css("background", "linear-gradient(326deg, #bd4f6c 0%, #d7816a 74%)")
    after[0].style.cssText = before[0].style.cssText
    after.css("left", "")
    after.css("right", "7.5px")
    before.css("background", "linear-gradient(315deg, #00b712 0%, #5aff15 74%)")
    before.on("click", () => checkbox.prop("checked", false).trigger('change'))
    after.on("click", () => checkbox.prop("checked", true).trigger('change'))
    checkbox.on("change.style", () => {
      if(!!checkbox.prop("checked")) {
        after.css("background", "linear-gradient(315deg, #00b712 0%, #5aff15 74%)")
        before.css("background", "linear-gradient(326deg, #bd4f6c 0%, #d7816a 74%)")
      }
      else {
        before.css("background", "linear-gradient(315deg, #00b712 0%, #5aff15 74%)")
        after.css("background", "linear-gradient(326deg, #bd4f6c 0%, #d7816a 74%)")
      }
    })
    e[0].checkbox = checkbox
    setInterval(() => {
      if(!!e.data("disabled")) {
        e.css("filter", "brightness(50%)")
        e.css("pointer-events", "none")
      }
      else {
        e.css("filter", "brightness(100%)")
        e.css("pointer-events", "all")
      }
    }, 1000/60)
    e.append(title)
    e.append(before)
    e.append(after)
    e.append(checkbox)
  })
  return $(this)
}