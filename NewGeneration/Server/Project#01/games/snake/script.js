window.onerror = (a, b, c) => alert(`${a}\n${b}\n${c}`)

const bestScore = new Score("snake")

const control = document.querySelector("#control")
const settings = document.querySelector("#settings")
const scores = document.querySelector("#scores")
let pause = []
let snake
let prevScore = bestScore.scores


function setup() {
  window.canvas = createCanvas(400,400).canvas
  snake = new Snake()
  // document.body.appendChild(settings);
  document.body.appendChild(control);
  
  window.canvas.addEventListener("click", () => {
    if(document.body.webkitRequestFullScreen) {
      document.body.webkitRequestFullScreen();
    }
    else {
      document.body.mozRequestFullScreen();
    }
    screen.orientation.lock("portrait")
  })
  control.children[4].addEventListener("click", () => {
    if(snake.pauseplay()) {
      control.children[4].style.background = "#FF0000"
    }
    else {
      control.children[4].style.background = "#00FF00"
    }
  })
  snake.ondeath = (score) => {
    if(!!window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
    if(score > prevScore) {
      bestScore.score = score
      prevScore = score
    }
  }
}
function draw() {
  background(0)
  snake.update()
  snake.show()
  scores.innerHTML = `BEST: ${prevScore}\nSCORE: ${snake.score}`
  
  stroke(255)
  noFill()
  strokeWeight(2)
  beginShape()
  vertex(0    , 0     )
  vertex(width, 0     )
  vertex(width, height)
  vertex(0    , height)
  vertex(0    , 0     )
  endShape()
  
  if(snake.isPause) {
    for(let i = 0; i < 4; i++) {
      e = control.children[i]
      if(!e.disabled) {
        pause.push(e)
        e.disabled = true
      }
    }
  }
  else {
    for(let e of pause) {
      e.disabled = false
    }
    pause = []
  }
  
  if(snake.vel[0] != 0 && snake.vel[1] == 0) {
    control.children[0].disabled = true
    control.children[1].disabled = false
    control.children[2].disabled = true
    control.children[3].disabled = false
  }
  if(snake.vel[0] == 0 && snake.vel[1] != 0) {
    control.children[0].disabled = false
    control.children[1].disabled = true
    control.children[2].disabled = false
    control.children[3].disabled = true
  }
}

control.children[0].addEventListener("click", () => {
  snake.setKey(-1,0)
})
control.children[1].addEventListener("click", () => {
  snake.setKey(0,-1)
})
control.children[2].addEventListener("click", () => {
  snake.setKey(1,0)
})
control.children[3].addEventListener("click", () => {
  snake.setKey(0,1)
})