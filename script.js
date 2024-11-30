import { sig, render, html, eff_on } from "./solid_monke/solid_monke.js";

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let img_width, img_height, images
let total = 7

let editor = document.getElementById('editor');


function load_images(len) {
	let images = [];
	for (let i = 1; i <= len; i++) {
		let img = new Image();
		img.src = `./another/img_${i}.jpg`;
		images.push(img);
	}
	console.log(images);
	return images;
}

function init() {
	document.body.appendChild(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	images = load_images(total);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


let timer = 0;
let speed = sig(250)
let inc_to = 30
let start
let index = 0;
let aspect = 2048 / 1529
let alpha = sig(.05);

let height = window.innerHeight;
let width = window.innerWidth;

let image_height = height * .90;
let image_width = image_height * aspect;

let option_1 = 'multiply';
let option_2 = 'difference';

function draw(timestamp) {
	requestAnimationFrame(draw);

	if (start === undefined) {
		start = timestamp
		timer = speed();
	};

	const elapsed = timestamp - start;

	if (timer < elapsed) {
		timer += speed();
		if (speed() > inc_to) { speed.set(speed() - 1) }

		ctx.globalAlpha = Math.sin(timer / 1000);
		ctx.globalAlpha = alpha()

		if (Math.random() > 0.5) {
			ctx.globalCompositeOperation = option_1;
		}
		else {
			ctx.globalCompositeOperation = option_2;
		}

		index = (index + 1) % total;
	}

	else {
		// ctx.drawImage(images[index], 0, 0, image_width, image_height);
		//
		// --> 
		// Gives sharp edges mapped to speed slider
		let x_offset = index * image_width / speed();
		// --> 
		// Using both will give corners
		let y_offset = index * image_height / speed();

		ctx.drawImage(images[index], x_offset, y_offset, image_width, image_height);
	}

}

requestAnimationFrame(draw);

init();

let inc_slider = () => html`
	div
		input [type=range min=30 max=500 step=1 oninput=${(e) => speed.set(parseFloat(e.target.value))} value=${speed}]
		span.label -- speed: ${speed}
	div
		input [type=range min=.01 max=1 step=.01 oninput=${(e) => alpha.set(parseFloat(e.target.value))} value=${alpha}]
		span.label -- alpha: ${alpha}

	button [onclick=${() => clear()}] -- clear
`

render(inc_slider, editor);

