window.onerror = (a,b,c) => alert(`${a}\n${b}\n${c}`) 

if(!!localStorage.user && localStorage.user !== "undefined") {
  $("header > #acc-div > .user").css("display", "block")
  $("header > #acc-div > .user")[0].value = JSON.parse(localStorage.user).name
}
else {
  $("header > #acc-div > .noUser").css("display", "block")
}

// Device verification process
$(() => {
  const test = window.matchMedia("(max-width: 400px)")
  if(!test.matches) {
    alert("I'm sorry but this site is currently only available on smartphones.")
    window.history.back()
  }
})

// Account System
$(() => {
  const main_button = document.querySelector("header > #acc-icon")
  const main_dropdown = document.querySelector("header > #acc-div")
  main_button.addEventListener("click", () => {
    if($(main_dropdown).css("display") === "none") {
      $(main_dropdown).fadeIn(400)
    }
    else {
      $(main_dropdown).fadeOut(400)
    }
  })
  $(main_dropdown).children(".noUser").eq(0).click(function() {
    const parent = $("header > #acc-setup")
    if(parent.css("display") === "none") {
      const user = addinput("text", "Username")
      const pwd = addinput("password", "Password")
      const cancel = $(parent).children(".cancel")
      const confirm = $(parent).children(".confirm")
      parent.fadeIn("fast")
      cancel.click(() => {
        parent.fadeOut("fast", () => parent.children("div").remove())
      })
      confirm.click(() => {
        let valid = true
        if(emptyVerification(user)) valid = false
        if(emptyVerification(pwd)) valid = false
        if(!valid) return
        $.get("/api/database/account/search?" + $.param({username: user.value, password: pwd.value}), (data) => {
          if(data.length === 0) {
            user.error.innerText = "Username must be incorrect"
            pwd.error.innerText = "Password must be incorrect"
            return
          }
          localStorage.user = JSON.stringify(data[0])
          window.location = window.location
        })
      })
    }
    main_button.click()
  })
  $(main_dropdown).children(".noUser").eq(1).click(function() {
    const parent = $("header > #acc-setup")
    if(parent.css("display") === "none") {
      const name = addinput("text", "Nickname")
      const user = addinput("text", "Username")
      const pwd1 = addinput("password", "Password")
      const pwd2 = addinput("password", "Confirm Password")
      const cancel = $(parent).children(".cancel")
      const confirm = $(parent).children(".confirm")
      parent.fadeIn("fast")
      cancel.click(() => {
        parent.fadeOut("fast", () => parent.children("div").remove())
      })
      confirm.click(() => {
        let valid = true
        if(emptyVerification(name)) valid = false
        if(lengthVerification(name, 6, 32)) valid = false
        if(emptyVerification(user)) valid = false
        if(lengthVerification(user, 8, 16)) valid = false
        if(emptyVerification(pwd1)) valid = false
        if(lengthVerification(pwd1, 8, 16)) valid = false
        if(pwd1.value !== pwd2.value) {
          valid = false
          pwd2.error.innerText = "Password does not match"
        }
        if(!valid) return
        $.post("/api/database/account/create?" + $.param({name: name.value, username: user.value, password: pwd1.value}), (data) => {
          if(data !== "OK") {
            user.error.innerText = data
          }
          else {
            cancel[0].click()
            $(main_dropdown).children(".noUser").eq(0)[0].click()
          }
        })
      })
    }
    main_button.click()
  })
  $(main_dropdown).children(".user").eq(2).click(function() {
    if(window.confirm("Are you sure to log out?")) {
      delete localStorage.user
      window.location = window.location
    }
  })
  function emptyVerification(elem) {
    if(elem.value.length == 0) {
      elem.error.innerText = "This field is empty"
      return true
    }
    return false
  }
  function lengthVerification(elem, min = 2, max = Infinity) {
    let length = elem.value.length
    if(length < min) {
      elem.error.innerText = `Value should be at least ${min} characters`
      return true
    }
    else if(length > max) {
      elem.error.innerText = `Value should not exceed ${max} characters`
      return true
    }
    return false
  }
  function addinput(type, prompt = "") {
    const container = document.querySelector("header > #acc-setup")
    const input = document.createElement("input")
    const label = document.createElement("label")
    const error = document.createElement("label")
    const div = document.createElement("div")
    
    input.id = prompt.split(" ").join("-")
    input.type = type
    input.required = true
    input.error = error
    label.for = input.id
    label.innerText = prompt
    error.className = "error"
    
    input.addEventListener("input", () => {
      error.innerText = ""
    })
    input.addEventListener("keypress", (event) => {
      if(event.keyCode === 13) {
        event.preventDefault()
        if(!!$(input).parent().next("div")[0]) {
          $(input).parent().next("div").children("input")[0].focus()
        }
        else {
          $(input).parent().siblings(".confirm")[0].click()
        }
      }
    })
    
    div.appendChild(input)
    div.appendChild(label)
    div.appendChild(error)
    container.insertBefore(div, document.querySelector('header > #acc-setup > input[type = "button"]'))
    return input
  }
})

// DOM Styling
$(() => {
  const section = document.querySelector("section")
  document.body.style.background = 0xFF0000
  fetch("/request/games").then(res => res.json()).then(res => {
    for(let i = 0; i < res.length; i++) {
      const article = document.createElement("article")
      const title = document.createElement("h3")
      const icon = new Image()
      let e = res[i]
      let col = () => [Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255)]
      
      article.style.background = `linear-gradient(${Math.round(Math.random()*360)}deg, rgb(${col().join(",")}), rgb(${col().join(",")}))`
      
      icon.src = `/${e.split(" ").join("-")}/icon.png`
      icon.oncontextmenu = () => false
      title.innerText = Capital(e)
      
      article.appendChild(icon)
      article.appendChild(title)
      section.appendChild(article)
      
      article.addEventListener("click", () => {
        window.location = `/${e.split(" ").join("-")}`
      })
    }
    const articles = section.querySelectorAll("article")
    articles.forEach((article, i) => {
      setTimeout(() => {
        $(article).animate({opacity: 1}, {
          easing: "linear",
          step: function(now, fx) {
            $(article).css("transform", `scale(${now})`)
          }
        })
      }, i*500)
    })
  })
})