const FPS = 30;
const SPACESHIP_SIZE = 20;
const ROT_SPEED = 360;
const ACC_SPEED = 4;
const DEC_MULT = 0.5;

class Spaceship {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 90 / 180 * Math.PI
        this.rotation = 0;
        this.accelerating = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
}

var canvas, ctx, image, savedCanvas; 
var spaceShip;

window.onload = function() {
    canvas = document.getElementById("cnv");
    ctx = canvas.getContext("2d");
    image = new Image();
    image.src = "images/spaceship.svg";
    resizeCanvas();
    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    spaceShip = new Spaceship(canvas.width/2, canvas.height/2, SPACESHIP_SIZE);
}

window.onresize = function() {
    resizeCanvas();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("resize");
}

document.addEventListener("keydown", controllerPressed);
document.addEventListener("keyup", controllerReleased);

setInterval(update, 1000 / FPS);



function update() {
    //ctx.drawImage(image, spaceShip.x-SPACESHIP_SIZE/2, spaceShip.y, SPACESHIP_SIZE, SPACESHIP_SIZE);
    //draw background
    ctx.putImageData(savedCanvas, 0, 0);

    if(spaceShip.accelerating) {
        spaceShip.xSpeed += ACC_SPEED * Math.cos(spaceShip.angle) / FPS;
        spaceShip.ySpeed -= ACC_SPEED * Math.sin(spaceShip.angle) / FPS;
    }
    else {
        spaceShip.xSpeed -= DEC_MULT * spaceShip.xSpeed / FPS;
        spaceShip.ySpeed -= DEC_MULT * spaceShip.ySpeed / FPS;

    }

    // How to draw on canvas, drawing spaceship
    ctx.strokeStyle = "white";
    ctx.lineWidth = SPACESHIP_SIZE / 25;
    ctx.beginPath();
    ctx.moveTo( //front of a triangular spaceship
        spaceShip.x + spaceShip.radius * Math.cos(spaceShip.angle),
        spaceShip.y - spaceShip.radius * Math.sin(spaceShip.angle)
    );
    ctx.lineTo( //left side of triangular spaceship
        spaceShip.x - spaceShip.radius * (Math.cos(spaceShip.angle)/2 + Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius * (Math.sin(spaceShip.angle)/2 - Math.cos(spaceShip.angle))
    );
    ctx.lineTo(
        spaceShip.x,
        spaceShip.y
    );

    ctx.moveTo( //front of a triangular spaceship
        spaceShip.x + spaceShip.radius * Math.cos(spaceShip.angle),
        spaceShip.y - spaceShip.radius * Math.sin(spaceShip.angle)
    );
    ctx.lineTo( //right side of triangular spaceship
        spaceShip.x - spaceShip.radius * (Math.cos(spaceShip.angle)/2 - Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius * (Math.sin(spaceShip.angle)/2 + Math.cos(spaceShip.angle))
    );
    ctx.lineTo(
        spaceShip.x,
        spaceShip.y
    );

    ctx.stroke();
    ctx.fillStyle = "slategray";
    ctx.fill();
    drawHatch();

    // rotate spaceship
    spaceShip.angle += spaceShip.rotation;

    // move spaceship
    spaceShip.x += spaceShip.xSpeed;
    spaceShip.y += spaceShip.ySpeed;

    checkWindowLimits();
}



function drawHatch() {
    ctx.beginPath();
    ctx.moveTo( //front of a triangular spaceship
        spaceShip.x + spaceShip.radius/2 * Math.cos(spaceShip.angle),
        spaceShip.y - spaceShip.radius/2 * Math.sin(spaceShip.angle)
    );
    ctx.lineTo( //left side of triangular spaceship
        spaceShip.x - spaceShip.radius/2 * (Math.cos(spaceShip.angle)/2 + Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius/2 * (Math.sin(spaceShip.angle)/2 - Math.cos(spaceShip.angle))
    );
    ctx.lineTo(
        spaceShip.x,
        spaceShip.y
    );

    ctx.moveTo( //front of a triangular spaceship
        spaceShip.x + spaceShip.radius/2 * Math.cos(spaceShip.angle),
        spaceShip.y - spaceShip.radius/2 * Math.sin(spaceShip.angle)
    );
    ctx.lineTo( //right side of triangular spaceship
        spaceShip.x - spaceShip.radius/2 * (Math.cos(spaceShip.angle)/2 - Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius/2 * (Math.sin(spaceShip.angle)/2 + Math.cos(spaceShip.angle))
    );
    ctx.lineTo(
        spaceShip.x,
        spaceShip.y
    );

    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
}

function drawPropulsionFire() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = SPACESHIP_SIZE / 30;
    ctx.beginPath();
    ctx.moveTo( //front of a triangular spaceship
        spaceShip.x + spaceShip.radius * Math.cos(spaceShip.angle),
        spaceShip.y - spaceShip.radius * Math.sin(spaceShip.angle)
    );
    ctx.lineTo( //left side of triangular spaceship
        spaceShip.x - spaceShip.radius * (Math.cos(spaceShip.angle) + Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius * (Math.sin(spaceShip.angle) - Math.cos(spaceShip.angle))
    );
    ctx.lineTo( //right side of triangular spaceship
        spaceShip.x - spaceShip.radius * (Math.cos(spaceShip.angle) - Math.sin(spaceShip.angle)),
        spaceShip.y + spaceShip.radius * (Math.sin(spaceShip.angle) + Math.cos(spaceShip.angle))
    );
    ctx.closePath();
    ctx.stroke();
}

function controllerPressed(/** @type {KeyboardEvent}*/ ev) { 
    if(ev.key === "ArrowUp") { //arrowup event (accelerate spaceship)
        spaceShip.accelerating = true;
    }
    if(ev.key === "ArrowLeft") { //arrowleft event (rotate spaceship left)
        spaceShip.rotation = ROT_SPEED / 180 * Math.PI / FPS;
    }
    if(ev.key === "ArrowRight") { //arrowright event (rotate spaceship right)
        spaceShip.rotation = -ROT_SPEED / 180 * Math.PI / FPS;
    }
}

function controllerReleased(/** @type {KeyboardEvent}*/ ev) {
    if(ev.key === "ArrowUp") { //arrowup event (stop spaceship acceleration)
        spaceShip.accelerating = false;
    }
    if(ev.key === "ArrowLeft") { //arrowleft event (stop spaceship rotation)
        spaceShip.rotation = 0;
    }
    if(ev.key === "ArrowRight") { //arrowright event (stop spaceship rotation)
        spaceShip.rotation = 0;
    }
}

function checkWindowLimits() {
    if(spaceShip.x < 0 - spaceShip.radius) {
        spaceShip.x = canvas.width + spaceShip.radius;
    }
    else if(spaceShip.x > canvas.width + spaceShip.radius) {
        spaceShip.x = 0 - spaceShip.radius;
    }
    if(spaceShip.y < 0 - spaceShip.radius) {
        spaceShip.y = canvas.height + spaceShip.radius;
    }
    else if(spaceShip.y > canvas.height + spaceShip.radius) {
        spaceShip.y = 0 - spaceShip.radius;
    }
}
