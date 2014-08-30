// Globals {{{
var can; // Canvas
var con; // 2D context

var loadCount = 0; // Load resources
var resBackground; // Game background

var lastFrame;
var startClock;
var nextSpawn;
var walkers; // Array of walkers
var mouseX = 300;
var mouseY = 200;
var playerSize = 16;

var backMargin = 16;

// }}}
// Classes {{{

function Walker() {
	this._size = 16;
	this._speed = 80.0;
	this._x = Math.random()*(can.width - this._size);
	this._y = Math.random()*(can.height - this._size);
	var angle = Math.random()*6.5;
	this._dx = Math.cos(angle)*this._speed;
	this._dy = Math.sin(angle)*this._speed;
}

Walker.prototype.frame = function(fr) {
	var tx = this._x + this._dx*fr;
	if (tx < 0.0) {
		this._dx = Math.abs(this._dx);
	} else if (tx + this._size > can.width) {
		this._dx = -Math.abs(this._dx);
	}
	this._x += this._dx*fr;

	var ty = this._y + this._dy*fr;
	if (ty < 0.0) {
		this._dy = Math.abs(this._dy);
	} else if (ty + this._size > can.height) {
		this._dy = -Math.abs(this._dy);
	}
	this._y += this._dy*fr;
}

Walker.prototype.render = function() {
	con.fillStyle = '#f00';
	var x = Math.round(this._x);
	var y = Math.round(this._y);
	con.fillRect(x, y, this._size, this._size);
}

Walker.prototype.hit = function(rect) {
	var x0 = this._x;
	var y0 = this._y;
	var x1 = this._x + this._size;
	var y1 = this._y + this._size;
	var inside =
		rect.x0 < x1 &&
		rect.x1 > x0 &&
		rect.y0 < y1 &&
		rect.y1 > y0;

	return inside;
}

// }}}
// Gameplay {{{

function init() {
	walkers = [];
	for (var i=0; i<20; i++) {
		var w = new Walker();
		walkers = walkers.concat(w);
	}

	startClock = Date.now();
	nextSpawn = startClock + 2000;
}

function playerHit() {
	var px0 = mouseX - (playerSize >> 1);
	var py0 = mouseY - (playerSize >> 1);
	var rect = {
		x0 : px0,
		y0 : py0,
		x1 : px0 + playerSize,
		y1 : py0 + playerSize,
	};
	for (var i=0; i<walkers.length; i++) {
		if (walkers[i].hit(rect)) return true;
	}
	return false;
}

function gameOverFrame() {
	var current = Date.now();

	con.fillStyle = 'rgba(0, 0, 0, 0.5)';
	con.fillRect(0, 0, can.width, can.height);
	con.fillStyle = '#fff';
	con.font = '16px Ariel';

	var score = Math.round((current - startClock)*0.01);
	con.fillText('Score: ' + score, 280, 210);
	con.fillText('Refresh page or click restart button', 170, 300);
}

function frame() {
	var current = Date.now();
	var fr = (current - lastFrame)*0.001;
	lastFrame = current;

	// Check spawn
	if (current > nextSpawn) {
		nextSpawn += 1000;
		walkers = walkers.concat(new Walker);
		walkers = walkers.concat(new Walker);
		walkers = walkers.concat(new Walker);
	}

	if (fr > 0.4) return; // Lag

	// Render
	con.drawImage(resBackground, 0, 0);

	con.fillStyle = '#0f0';
	con.fillRect(
			mouseX-(playerSize>>1),
			mouseY-(playerSize>>1),
			playerSize, playerSize);

	for (var i=0; i<walkers.length; i++) {
		walkers[i].frame(fr);
		walkers[i].render();
	}

	if (playerHit()) {
		requestAnimationFrame(gameOverFrame);
		return;
	}

	requestAnimationFrame(frame);
}

// }}}
// System {{{

function doneLoad() {
	loadCount--;
	if (loadCount > 0) {
		drawLoadscreen();
	} else {
		init();
		lastFrame = Date.now();
		requestAnimationFrame(frame);
	}
}

function downloadImage(src) {
	img = new Image();
	img.src = src;
	img.onload = doneLoad;
	return img;
}

function goFullScreen() {
	if (can.requestFullScreen)
		can.requestFullScreen();
	else if (can.webkitRequestFullScreen)
		can.webkitRequestFullScreen();
	else if(can.mozRequestFullScreen)
		can.mozRequestFullScreen();
}

function drawLoadscreen() {
	var count = loadCount;
	con.fillStyle = "#000";
	con.fillRect(0, 0, can.width, can.height);

	con.fillStyle = "#fff";
	con.font = '12px Ariel';
	con.fillText('Downloading ' + loadCount + ' files', 260, 220);
}

function mouseEvent(event) {
	var rect = can.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	if (mouseX < backMargin) mouseX = backMargin;
	if (mouseY < backMargin) mouseY = backMargin;
	if (mouseX > can.width  - backMargin) mouseX = can.width  - backMargin;
	if (mouseY > can.height - backMargin) mouseY = can.height - backMargin;
}

function gameStart() {
	requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.mozRequestAnimationFrame;

	can = document.getElementById("gamecanvas");
	con = can.getContext("2d");
	can.addEventListener('mousemove', mouseEvent, false);

	resBackground = downloadImage("background.jpg");
	drawLoadscreen();
}

//  }}}

