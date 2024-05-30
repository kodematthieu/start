window.onerror = () => alert(arguments.join("\n"))

sessionStorage.output = typeof sessionStorage.output !== "undefined" ? sessionStorage.output : ""
sessionStorage.history = typeof sessionStorage.history !== "undefined" ? sessionStorage.history : ""

Math.cot = x => 1/Math.tan(x)
Math.acot = x => (Math.PI / 2) - Math.atan(x)

var summ = function(n) {
  let ans = [1]
  for(let i = 1; i < n; i++) {
    ans.push(i*(ans.reduce((a,b) => a+b) || 1))
  }
  return ans.reduce((a,b) => a+b)
}

$(() => {
  const section = $("section")
  const btns = {}
  $("section > #output > input.result")[0].value = sessionStorage.output
  $("section > #output > input.result").on("click.ui", function() {
    if(parseFloat($(this).parent().css("height")) === 60) {
      $(this).parent().animate({"height": parseFloat(section.css("height")) - 20}, 300)
      let history = sessionStorage.history.split("|")
      for(let i of Object.keys(history)) {
        if(i > 0) {
          $("section > #output > #history").prepend($(`<input type="button" value="${history[i]}"/>`))
        }
      }
      $("section > #output > #history > input").on("click.calc", function() {
        sessionStorage.output += $(this)[0].value.split(" = ")[1]
        $("section > #output > input.result")[0].value = sessionStorage.output
      })
    }
    else if(parseFloat($(this).parent().css("height")) === parseFloat(section.css("height")) - 20) {
      $(this).parent().animate({"height": 60}, 300, () => {
        $("section > #output > #history").html("")
      })
    }
  })
  $("section > #output > input.clearhistory").on("click.ui", function() {
    $("section > #output > input.result")[0].click()
    sessionStorage.history = ""
  })
  for(let elem of $("section > div:not(#output) > input:not(.ignore)").toArray()) btns[elem.className] = elem
  $(Object.values(btns)).on("click.ui", function() {$(this).animate({opacity: 0.5}, 150, () => $(this).animate({opacity:1}, 150))})
  $(Object.values(btns).filter(x => x.value !== "Del" && x.value !== "AC" && x.value !== "=")).on("click.calc", function() {
    sessionStorage.output += $(this)[0].className
    $("section > #output > input.result")[0].value = sessionStorage.output
  })
  $(btns["="]).on("click.calc", function() {
    let final = sessionStorage.output
    final = final.replace(/÷/g, "/")
                 .replace(/×/g, "*").replace(/∞/g, "Infinity")
                 .replace(/\^/g, "**").replace(/\d*\!/g, ($1) => `summ(${$1.match(/\d*/)[0]})`)
                 .replace(/√\d*/g, ($1) => `Math.sqrt(${$1.match(/\d+/)})`)
                 .replace(/π/g, "Math.PI")
                 .replace(/(\d+)(\()/g, "$1*$2")
                 .replace(/(sin|cos|tan|cot|asin|acos|atan|acot)/g, "Math.$1")
                 .replace(/(\))(\d+)/g, "$1*$2")
                 .replace(/(\d+)(Math)/g, "$1*$2")
    let output = sessionStorage.output
    $("section > #output > input.result")[0].value = "Syntax Error"
    sessionStorage.output = ""
    switch(eval(final)) {
      case Infinity:
        sessionStorage.output = "∞"
        $("section > #output > input.result")[0].value = sessionStorage.output
        break;
      default:
        if(isNaN(eval(final))) {
          sessionStorage.output = ""
          $("section > #output > input.result")[0].value = NaN
        }
        else {
          sessionStorage.output = eval(final)
          $("section > #output > input.result")[0].value = sessionStorage.output
        }
    }
    if(!isNaN(eval(final))) {
      sessionStorage.history += "|" + output + " = " + (eval(final) === Infinity ? "∞" : eval(final))
    }
  })
  $(btns["AC"]).on("click.calc", function() {
    sessionStorage.output = ""
    $("section > #output > input.result")[0].value = sessionStorage.output
  })
  $(btns["Del"]).on("click.calc", function() {
    if(!String(sessionStorage.output).match(/[a-z]+\($/)) {
      let final = sessionStorage.output.split("")
      final.splice(final.length-1,1)
      sessionStorage.output = final.join("")
      $("section > #output > input.result")[0].value = sessionStorage.output
    }
    else {
      let final = sessionStorage.output.replace(/[a-z]+\($/g, "")
      sessionStorage.output = final
      $("section > #output > input.result")[0].value = sessionStorage.output
      
    }
  })
  $("section > #btns").on("dblclick", function() {
    $("section > #advanced").animate({top: 70}, 300)
  })
  $("section > #advanced").on("click", function() {
    $("section > #advanced").animate({top: "99%"}, 300)
  })
})