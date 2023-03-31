const FPS = 30;
const SPACESHIP_SIZE = 20;
const ROT_SPEED = 180;
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

    draw() {
        // How to draw on canvas, drawing spaceship with triangles
        ctx.strokeStyle = "slategray";
        ctx.lineWidth = SPACESHIP_SIZE / 25;
        ctx.beginPath();
        ctx.moveTo( //front of a triangular spaceship
            spaceship.x + spaceship.radius * Math.cos(spaceship.angle),
            spaceship.y - spaceship.radius * Math.sin(spaceship.angle)
        );
        ctx.lineTo(
            spaceship.x - spaceship.radius * (Math.cos(spaceship.angle)/2 + Math.sin(spaceship.angle)),
            spaceship.y + spaceship.radius * (Math.sin(spaceship.angle)/2 - Math.cos(spaceship.angle))
        );
        ctx.lineTo(
            spaceship.x,
            spaceship.y
        );
    
        ctx.moveTo( //front of a triangular spaceship
            spaceship.x + spaceship.radius * Math.cos(spaceship.angle),
            spaceship.y - spaceship.radius * Math.sin(spaceship.angle)
        );
        ctx.lineTo(
            spaceship.x - spaceship.radius * (Math.cos(spaceship.angle)/2 - Math.sin(spaceship.angle)),
            spaceship.y + spaceship.radius * (Math.sin(spaceship.angle)/2 + Math.cos(spaceship.angle))
        );
        ctx.lineTo(
            spaceship.x,
            spaceship.y
        );
    
        ctx.stroke();
        ctx.fillStyle = "slategray";
        ctx.fill();
        this.drawHatch();
    }
    drawHatch() {
        ctx.beginPath();
        ctx.moveTo(
            spaceship.x + spaceship.radius/2 * Math.cos(spaceship.angle),
            spaceship.y - spaceship.radius/2 * Math.sin(spaceship.angle)
        );
        ctx.lineTo(
            spaceship.x - spaceship.radius/2 * (Math.cos(spaceship.angle)/2 + Math.sin(spaceship.angle)),
            spaceship.y + spaceship.radius/2 * (Math.sin(spaceship.angle)/2 - Math.cos(spaceship.angle))
        );
        ctx.lineTo(
            spaceship.x,
            spaceship.y
        );
    
        ctx.moveTo(
            spaceship.x + spaceship.radius/2 * Math.cos(spaceship.angle),
            spaceship.y - spaceship.radius/2 * Math.sin(spaceship.angle)
        );
        ctx.lineTo(
            spaceship.x - spaceship.radius/2 * (Math.cos(spaceship.angle)/2 - Math.sin(spaceship.angle)),
            spaceship.y + spaceship.radius/2 * (Math.sin(spaceship.angle)/2 + Math.cos(spaceship.angle))
        );
        ctx.lineTo(
            spaceship.x,
            spaceship.y
        );
    
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

class Syringe {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
}

class Wart {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
    }
}

var canvas, ctx, savedCanvas; 
var spaceship, spaceshipImage;
var warts;

window.onload = function() {
    canvas = document.getElementById("cnv");
    ctx = canvas.getContext("2d");
    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.svg";
    resizeCanvas();
    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    spaceship = new Spaceship(canvas.width/2, canvas.height/2, SPACESHIP_SIZE);
}

window.onresize = function() {
    resizeCanvas();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("resize");
}

warts = [];
generateWarts();

// key listeners
document.addEventListener("keydown", controllerPressed);
document.addEventListener("keyup", controllerReleased);

// interval in which canvas is gonna be updated
setInterval(update, 1000 / FPS);



function update() {
    //ctx.drawImage(image, spaceShip.x-SPACESHIP_SIZE/2, spaceShip.y, SPACESHIP_SIZE, SPACESHIP_SIZE);
    // draw backgroud
    ctx.putImageData(savedCanvas, 0, 0);
    // draw player's spaceship
    spaceship.draw();
    // spaceship controller
    controlSpaceship();
    // checks if spaceship runs off canvas
    checkWindowLimits();
}

function drawPropulsionFire() {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = SPACESHIP_SIZE / 5;
    ctx.beginPath();
    ctx.moveTo(
        spaceship.x - spaceship.radius*1.5 * Math.cos(spaceship.angle),
        spaceship.y + spaceship.radius*1.5 * Math.sin(spaceship.angle)
    );
    ctx.lineTo(
        spaceship.x - spaceship.radius/2 * (Math.cos(spaceship.angle)/2 + Math.sin(spaceship.angle)),
        spaceship.y + spaceship.radius/2 * (Math.sin(spaceship.angle)/2 - Math.cos(spaceship.angle))
    );
    ctx.lineTo(
        spaceship.x,
        spaceship.y
    );
    ctx.lineTo(
        spaceship.x - spaceship.radius/2 * (Math.cos(spaceship.angle)/2 - Math.sin(spaceship.angle)),
        spaceship.y + spaceship.radius/2 * (Math.sin(spaceship.angle)/2 + Math.cos(spaceship.angle))
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
}

function controlSpaceship() {
    if(spaceship.accelerating) { // accelerate spaceship
        spaceship.xSpeed += ACC_SPEED * Math.cos(spaceship.angle) / FPS;
        spaceship.ySpeed -= ACC_SPEED * Math.sin(spaceship.angle) / FPS;
        drawPropulsionFire();
    }
    else { // decelerate spaceship creating some kind of resistance (friction)
        spaceship.xSpeed -= DEC_MULT * spaceship.xSpeed / FPS;
        spaceship.ySpeed -= DEC_MULT * spaceship.ySpeed / FPS;

    }
    // rotate spaceship
    spaceship.angle += spaceship.rotation;

    // move spaceship
    spaceship.x += spaceship.xSpeed;
    spaceship.y += spaceship.ySpeed;
}

function controllerPressed(/** @type {KeyboardEvent}*/ ev) { 
    if(ev.key === "ArrowUp") { // arrowup event (accelerate spaceship)
        spaceship.accelerating = true;
    }
    if(ev.key === "ArrowLeft") { // arrowleft event (rotate spaceship left)
        spaceship.rotation = ROT_SPEED / 180 * Math.PI / FPS;
    }
    if(ev.key === "ArrowRight") { // arrowright event (rotate spaceship right)
        spaceship.rotation = -ROT_SPEED / 180 * Math.PI / FPS;
    }
}

function controllerReleased(/** @type {KeyboardEvent}*/ ev) {
    if(ev.key === "ArrowUp") { // arrowup event (stop spaceship acceleration)
        spaceship.accelerating = false;
    }
    if(ev.key === "ArrowLeft") { // arrowleft event (stop spaceship rotation)
        spaceship.rotation = 0;
    }
    if(ev.key === "ArrowRight") { // arrowright event (stop spaceship rotation)
        spaceship.rotation = 0;
    }
}

function checkWindowLimits() {
    if(spaceship.x < 0 - spaceship.radius) {
        spaceship.x = canvas.width + spaceship.radius;
    }
    else if(spaceship.x > canvas.width + spaceship.radius) {
        spaceship.x = 0 - spaceship.radius;
    }
    if(spaceship.y < 0 - spaceship.radius) {
        spaceship.y = canvas.height + spaceship.radius;
    }
    else if(spaceship.y > canvas.height + spaceship.radius) {
        spaceship.y = 0 - spaceship.radius;
    }
}

function generateWarts() {
    var wartsNum = Math.random()
}
