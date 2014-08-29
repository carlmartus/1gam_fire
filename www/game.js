// Globals {{{
var can; // Canvas
var con; // 2D context

var loadCount = 0; // Load resources
var resBackground; // Game background

// }}}
// Download {{{

function doneLoad() {
	loadCount--;
	if (loadCount > 0) {
		drawLoadscreen();
	}
}

function downloadImage(src) {
	img = new Image();
	img.src = src;
	img.onload = doneLoad;
	return img;
}

// }}}
// System {{{

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
	can = document.getElementById("gamecanvas");
	con = can.getContext("2d");

	resBackground = downloadImage("background.jpg");
	drawLoadscreen();
}

//  }}}

