let canvas;
let airport;

window.onload = function() {
    canvas = document.getElementById("cnv");
    airport = new Airport();
    resizeCanvas();
}

window.onresize = function() {
    resizeCanvas();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}