alert(p5)
var hydrogen;
function setup() {
  createCanvas(600, 600);
  hydrogen = new Atom(width/2, height/2, 100);
}
function draw() {
  background(0);
  hydrogen.setProton(1);
  hydrogen.setElectron(1);
}
