const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	transparent: true
});

let ground;
let bg;

function init() {
	const bgTexture = [
		new PIXI.Texture.from("../assets/flappy_bird/sprites/background-day.png"),
	  new PIXI.Texture.from("../assets/flappy_bird/sprites/background-night.png")
	];
	const pipe = [
		new PIXI.Texture.from("../assets/flappy_bird/sprites/pipe-green.png"),
	  new PIXI.Texture.from("../assets/flappy_bird/sprites/pipe-red.png")
	];
	const groundTexture = new PIXI.Texture.from("../assets/flappy_bird/sprites/base.png");
	bg = new PIXI.Sprite(bgTexture[Math.round(Math.random())]);
	ground = new PIXI.Sprite(groundTexture);
	bg.width = app.view.width;
	bg.height = app.view.height;
	ground.width = app.view.width;
	ground.anchor.y = 1;
	ground.y = window.innerHeight;
	ground.hitArea = new PIXI.Rectangle(0, 0, ground.width, ground.height);
	app.stage.addChild(bg);
	app.stage.addChild(ground);
}
function start() {
	init();
	const startBtn = new PIXI.Sprite.from("../assets/flappy_bird/sprites/message.png");
	const sfx = new Audio("../assets/flappy_bird/audio/swoosh.wav")
	app.stage.addChild(startBtn);
	startBtn.width = app.view.width - 100;
	startBtn.height = app.view.height - 100;
	startBtn.x = 50;
	startBtn.y = 50;
	startBtn.interactive = true;
	startBtn.buttonMode = true;
	startBtn.on("tap", () => {
		startBtn.parent.removeChild(startBtn);
		sfx.play();
		init();
		startGame();
	});
}
function startGame() {
	const random = Math.round((Math.random()*2)-1)+1;
	const randomBird = ["blue","red","yellow"];
	const bird = {
		blue: [
		  new PIXI.Texture.from("../assets/flappy_bird/sprites/bluebird-downflap.png"),
			new PIXI.Texture.from("../assets/flappy_bird/sprites/bluebird-midflap.png"),
			new PIXI.Texture.from("../assets/flappy_bird/sprites/bluebird-upflap.png")
		],
		red: [
			new PIXI.Texture.from("../assets/flappy_bird/sprites/redbird-downflap.png"),
		  new PIXI.Texture.from("../assets/flappy_bird/sprites/redbird-midflap.png"),
			new PIXI.Texture.from("../assets/flappy_bird/sprites/redbird-upflap.png")
		],
		yellow: [
			new PIXI.Texture.from("../assets/flappy_bird/sprites/yellowbird-downflap.png"),
			new PIXI.Texture.from("../assets/flappy_bird/sprites/yellowbird-midflap.png"),
			new PIXI.Texture.from("../assets/flappy_bird/sprites/yellowbird-upflap.png")
		]
	};
	const birdAnim = new PIXI.AnimatedSprite(bird[randomBird[random]]);
	birdAnim.y = (app.view.height - ground.height) / 2;
	birdAnim.x = 75;
	birdAnim.animationSpeed = 0.15;
	birdAnim.anchor.set(0.5);
	app.stage.addChild(birdAnim);
	birdAnim.play()
}

document.body.appendChild(app.view);
start()
//alert("Working Fine!");
