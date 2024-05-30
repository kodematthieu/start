let languages = ['C++', 'Python', 'Java', 'C#', 'Go'];

let placeholders = languages.map((language) => '(?)').join(',');
alert(placeholders)
let canvas, ctx, preview;

const setup = (w, h) => {
	const size = {
		width: w || window.innerWidth - 24,
		height: h || window.innerWidth - 24
	};
	canvas = document.querySelector("#context");
	canvas.style.width = size.width * 3;
	canvas.style.height = size.height * 3;
	canvas.width = size.width;
	canvas.height = size.height;
	ctx = canvas.getContext("2d");
	preview = document.querySelector(".preview");
	preview.width = size.width;
	preview.height = size.height;
	
}
const parseFile = (img) => {
	ctx.drawImage(img, 0, 0);
}

setup();