let controller

setTimeout(function() {alert("after")}, 1000);
alert("before")

function setup() {
  createCanvas(400,400)
  controller = new JoyStick(width/2,height/2,100)
}
function draw() {
  background(100)
  controller.update()
  controller.show()
}