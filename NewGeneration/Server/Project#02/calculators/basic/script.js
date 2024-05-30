$(() => {
  const section = $("section")
  const btns = {}
  for(let elem of $("section > #btns > input").toArray()) btns[elem.className] = elem
  $(Object.values(btns)).on("click.ui", function() {$(this).animate({opacity: 0.5}, 150, () => $(this).animate({opacity:1}, 150))})
  $(Object.values(btns).filter(x => x.value !== "Del" && x.value !== "AC" && x.value !== "=")).on("click.calc", function() {
    $("section > #output")[0].value += $(this)[0].value
  })
  $(btns["="]).on("click.calc", function() {
    let final = $("section > #output")[0].value
    final = final.replace(/÷/g, "/").replace(/×/g, "*").split("")
    if(final.join("").match(/\(/)) {
      for(let i of Object.keys(final)) {
        if(i > 0 && (final[i] === "(" && !final[i-1].match(/(\+|\/|\-|\*)/))) {
          final.splice(i,0,"*")
        }
      }
    }
    if(final.join("").match(/\)/)) {
      for(let i of Object.keys(final)) {
        if(i < final.length && (final[i-1] === ")" && !final[i].match(/(\+|\/|\-|\*)/))) {
          final.splice(i,0,"*")
        }
      }
    }
    $("section > #output")[0].value = eval(final.join(""))
  })
  $(btns["AC"]).on("click.calc", function() {
    $("section > #output")[0].value = ""
  })
  $(btns["Del"]).on("click.calc", function() {
    let final = $("section > #output")[0].value.split("")
    final.splice(final.length-1,1)
    $("section > #output")[0].value = final.join("")
  })
})