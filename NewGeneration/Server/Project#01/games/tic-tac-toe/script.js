''
window.onerror = (a, b, c) => alert(`${a}\n${b}\n${c}`)
// const bestScore = new Score("jump-ball")

const turnElem = $("#turn")[0]
const gameElem = $("#game-status")[0]
const gameSettings = $("#game-settings")

const isPvP = gameSettings.children("#gamemode").switch()
const yourTurn = gameSettings.children("#your-turn").switch()


let pvp = false
let ai = !pvp ? (!yourTurn[0].checkbox.prop("checked") ? 1 : -1) : (Math.round(Math.random()) === 0 ? -1 : 1)
let you = ai === -1 ? 1 : -1
let player2 = true

isPvP[0].checkbox.on("change", () => {
  pvp = isPvP[0].checkbox[0].checked
  yourTurn.data("disabled", pvp)
  ai = !pvp ? (!yourTurn[0].checkbox[0].checked ? 1 : -1) : (Math.round(Math.random()) === 0 ? -1 : 1)
  you = ai === -1 ? 1 : -1
})

let game
let status
let multiplayer = new Server()

function setup() {
  window.canvas = createCanvas(400,400).canvas
  document.body.appendChild(turnElem)
  game = new Board()
  game.status = 0
  gameElem.children[0].onclick = gameElem.children[1].onclick = () => {
    gameElem.children[0].onclick = null
    game.reset()
    ai = Math.round(Math.random()) === 0 ? -1 : 1
    you = ai === -1 ? 1 : -1

    if((game.status === ai && ai === -1) && !pvp) {
      let nextTurn = [Math.round(Math.random()*2),Math.round(Math.random()*2)]
      while(game.grid[nextTurn[1]][nextTurn[0]] !== 0) nextTurn = [Math.round(Math.random()*2),Math.round(Math.random()*2)]
      status = game.turn(...nextTurn)
    }
    if(pvp) {
      game.status = 0
      $(gameElem.children[1]).fadeOut()
      $(gameSettings.children(0)).data("disabled", true)
      gameElem.children[0].innerText = "Searching..."
      $(window.canvas).css("pointer-events", "none")
      multiplayer.room((_, connected) => {
        alert()
        $(window.canvas).css("pointer-events", "all")
        $(gameElem).fadeOut()
        $(gameSettings).fadeOut()
        $(gameSettings.children(0)).data("disabled", false)
        $(gameElem.children[1]).fadeIn()
        game.reset()
        player2 = Math.round(Math.random()) === 1 ? true : false
        multiplayer.receive(({x,y}) => {
          status = game.turn(x,y)
          player2 = true
        })
      })
    }
    else {
      $(gameElem).fadeOut()
      $(gameSettings).fadeOut()
    }
  }
  window.onresize = () => {
    if(document.fullscreenElement === document.body) {
      $(window.canvas).css("margin-top", window.screen.height/2 - height/2)
      $(gameElem).css("top", window.screen.height/2)
      $(gameSettings).css("top", window.screen.height/2)
    }
    else {
      $(window.canvas).css("margin-top", 0)
      $(gameElem).css("top", height/2)
      $(gameSettings).css("top", height/2)
    }
  }
  document.body.addEventListener("click", () => {
    if(document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    }
    else if(document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    }
    else if(document.body.msRequestFullscreen) {
      document.body.msRequestFullscreen();
    }
    else {
      document.body.requestFullscreen();
    }
    screen.orientation.lock("portrait")
  })
}
function mousePressed() {
  let box = width/3
  if(game.status === you || (!!pvp && player2)) {
    for(let y = 0; y < game.grid.length; y++) {
      for(let x = 0; x < game.grid[y].length; x++) {
        if((mouseX < box*(x+1) && mouseX > box*x) && (mouseY < box*(y+1) && mouseY > box*y)) {
          status = game.turn(x,y)
          player2 = false
          multiplayer.send({x,y})
        }
      }
    }
  }
  if(game.status === ai && !pvp) {
    let nextTurn = [Math.round(Math.random()*2),Math.round(Math.random()*2)]
    while(game.grid[nextTurn[1]][nextTurn[0]] !== 0) nextTurn = [Math.round(Math.random()*2),Math.round(Math.random()*2)]
    status = game.turn(...nextTurn)
  }
  if(status === 1) {
    $(gameElem).fadeIn()
    $(gameElem.children[1]).fadeIn()
    $(gameSettings).fadeIn()
    gameElem.children[0].innerText = "O Won"
  }
  if(status === 0) {
    $(gameElem).fadeIn()
    $(gameElem.children[1]).fadeIn()
    $(gameSettings).fadeIn()
    gameElem.children[0].innerText = "Draw"
  }
  if(status === -1) {
    $(gameElem).fadeIn()
    $(gameElem.children[1]).fadeIn()
    $(gameSettings).fadeIn()
    gameElem.children[0].innerText = "X Won"
  }
}
function draw() {
  background(200)
  game.draw()
  if(game.status === 1) {
    turnElem.style.color = "blue"
    turnElem.innerText = "Its O's turn"
  }
  if(game.status === -1) {
    turnElem.style.color = "red"
    turnElem.innerText = "Its X's turn"
  }
}