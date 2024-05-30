window.onerror = () => alert("Unknown Error Found. Please Fix it and Try Again!");

var game = MGame.Canvas();
var c = MGame.Circle(50, 50, 50);
var s = MGame.Square(100, 100, 100);
game.setResolution(3)
game.addObject(c)
game.addObject(s)
// alert(new Image())