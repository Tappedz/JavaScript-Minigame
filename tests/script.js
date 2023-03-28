const FPS = 30;
const WARTS_NUM = 5; // starting number of warts
const WARTS_SPD = 50; // speed for warts
const WARTS_SIZE = 80; // size for warts

var canvas, airport;
var ctx = canvas.getContext("2d");

setInterval(update, 1000/ FPS);

window.onload = function() {
    canvas = document.getElementById("cnv");
    resizeCanvas();
    drawAirport();
}

window.onresize = function() {
    resizeCanvas();
    drawAirport();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawAirport() {
    var width = 225;
    var height = 200;
    var xpos = canvas.width/2 - width/2;
    var ypos = canvas.height/2 - height/2;
    var airportImage = new Image();
    airportImage.src = "images/airportFromTop.png";
    airportImage.onload = function() {
        ctx.drawImage(this, xpos, ypos, width, height);
    }
}

function update() {
    //draw 
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    for(var i = 0; i < warts.length; i++) {
        
    }
}

//set up warts
var warts = []
createWarts();

function createWarts() {
    warts = [];
    var x, y;
    for(var i = 0; i < WARTS_NUM; i++) {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
        warts.push(newWart(x, y));
    }
}

function newWart(x, y) {
    var wart = {
        x: x,
        y: y,
        xVector: Math.random() * WARTS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        yVector: Math.random() * WARTS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        radius: WARTS_SIZE /2,
        angle: Math.random() * Math.PI * 2 //radians
    }
}

