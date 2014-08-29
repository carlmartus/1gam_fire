// Globals {{{
var can; // Canvas
var con; // 2D context

var loadCount = 0; // Load resources
var resBackground; // Game background

var lastFrame;
var walkers;

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

// }}}
// Gameplay {{{

function init() {
	walkers = [];
	for (var i=0; i<20; i++) {
		var w = new Walker();
		walkers = walkers.concat(w);
	}
}

function frame() {
	var current = Date.now();
	var fr = (current - lastFrame)*0.001;
	lastFrame = current;

	if (fr > 0.4) return; // Lag

	con.drawImage(resBackground, 0, 0);

	for (var i=0; i<walkers.length; i++) {
		walkers[i].frame(fr);
		walkers[i].render();
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

function gameStart() {
	requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.mozRequestAnimationFrame;

	can = document.getElementById("gamecanvas");
	con = can.getContext("2d");

	resBackground = downloadImage("background.jpg");
	drawLoadscreen();
}

//  }}}

