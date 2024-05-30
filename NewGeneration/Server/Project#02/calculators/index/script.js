window.onerror = () => alert(arguments.join('\n'))

function Capital(str) {
  str = str.split(" ")
  for(let i = 0; i < str.length; i++) {
    let chr = str[i].split("")
    chr[0] = chr[0].toUpperCase()
    str[i] = chr.join("")
  }
  return str.join(" ")
}

$(() => {
  const test = window.matchMedia("(max-width: 400px)")
  if(!test.matches) {
    alert("I'm sorry but this site is currently only available on smartphones.")
    window.history.back()
  }
})

$(() => {
  const section = $("section")
  $.get("/queryAll", (data) => {
    for(let e of data) {
      const article = $("<article>")
      const title = $("<h3>")
      const icon = new Image()
      
      icon.oncontextmenu = () => false
      let col = () => [Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255)]
      
      article.css("background", `linear-gradient(${Math.round(Math.random()*360)}deg, rgb(${col().join(",")}), rgb(${col().join(",")}))`)
      
      icon.src = `/${e.split(" ").join("-")}/icon.png`
      icon.oncontextmenu = () => false
      title.text(Capital(e) + " Calculator")
      
      article.append($(icon))
      article.append(title)
      section.append(article)
      
      article.on("click", () => {
        window.location = `/${e.split(" ").join("-")}`
      })
    }
  })
})

$(() => {
  const search_btn = $("header > #search-btn > img");
  const search = search_btn.next();
  search.css("display", "none")
  search_btn.on("click", () => {
    if(search.css("display") === "none") {
      search.fadeIn(100)
      search.animate({"top": 60}, 300, () => search.animate({"width":window.innerWidth*0.85}))
    }
    else {
      search.animate({"width": 30}, 300, () => search.fadeOut(100).animate({"top": 10}))
    }
  })
  $.get("/queryAll", (data) => {
    for(let e of data) search.next().append($(`<option value="${e}"></option>`))
  })
});
