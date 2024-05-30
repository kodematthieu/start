window.onerror = (a,b,c) => alert(`${a}\n${b}\n${c}`) 

let board
function setup() {
  window.canvas = createCanvas(400,400).canvas
  board = new UniChess.Board(width, height)
  let piece = new UniChess.Queen(true)
  board.setup()
  board.render(canvas, true)
}
function mousePressed() {
  // board.get("c3").getMoves().forEach(e => {
  //   let pos = UniChess.MOVETOLOCATION(e)
  //   board[pos.y][pos.x].highlight = true
  // })
  // board.move("a8", "h5")
}
function draw() {
  // background(200)
}