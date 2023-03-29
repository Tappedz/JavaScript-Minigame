const FPS = 30;
const SPACESHIP_SIZE = 20;
const ROT_SPEED = 180;
const ACC_SPEED = 2;
const DEC_MULT = 0.5;

var canvas, ctx, savedCanvas; 
var warts, spaceship;

window.onload = function() {
    canvas = document.getElementById("cnv");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    spaceship = new Spaceship(canvas.width/2, canvas.height/2, 0.05, 0.05);
    
    animate();

    
    // key listeners
    document.addEventListener("keydown", controllerPressed);
    document.addEventListener("keyup", controllerReleased);
    
    // interval in which canvas is gonna be updated
    //setInterval(update, 1000 / FPS);
    
    function animate(){
        requestAnimationFrame(animate);
        //ctx.fillStyle = "white";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(savedCanvas, 0, 0);
        spaceship.update();
        if(spaceship.accelerating) { // accelerate spaceship
            spaceship.xSpeed += ACC_SPEED * Math.cos(spaceship.angle) / FPS;
            spaceship.ySpeed -= ACC_SPEED * Math.sin(spaceship.angle) / FPS;
            //drawPropulsionFire();
        }
        else { // decelerate spaceship creating some kind of resistance (friction)
            spaceship.xSpeed -= DEC_MULT * spaceship.xSpeed / FPS;
            spaceship.ySpeed -= DEC_MULT * spaceship.ySpeed / FPS;
    
        }
        checkCanvasLimits();
    }
}

window.onresize = function() {
    resizeCanvas();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Spaceship {
    constructor(x, y, widthMult, heightMult) {
        this.rotation = 0;
        this.accelerating = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = 90 / 180 * Math.PI; // angle to face spaceship up

        const image = new Image();
        image.src = "images/spaceship.svg";
        image.onload = () => {
            this.image = image;
            this.width = image.width * widthMult;
            this.height = image.height * heightMult;
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
        }  
    }

    draw() {
        ctx.save(); // save context
        ctx.translate(this.x, this.y); // translate canvas to player
        ctx.rotate(-this.angle + 90 / 180 * Math.PI); // solved offset of 90 degrees when rotating
        // -this.width/2 and -this.height/2 required to correctly rotating the player with canvas
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore(); //restore context
    }

    update() {
        if(this.image) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            spaceship.angle += spaceship.rotation;
            this.draw();
        }
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



/*

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
*/
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


function checkCanvasLimits() {
    if(spaceship.x < 0 - spaceship.width) {
        spaceship.x = canvas.width + spaceship.x;
    }
    else if(spaceship.x > canvas.width + spaceship.width) {
        spaceship.x = 0 - spaceship.x;
    }
    if(spaceship.y < 0 - spaceship.height) {
        spaceship.y = canvas.height + spaceship.height;
    }
    else if(spaceship.y > canvas.height + spaceship.height) {
        spaceship.y = 0 - spaceship.height;
    }
}

/*
function generateWarts() {
    var wartsNum = Math.random()
}
*/
