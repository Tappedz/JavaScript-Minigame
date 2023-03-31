const FPS = 30; // not really fps, used it before as fps with setInterval -> better use requestAnimationFrame
const ROT_SPEED = 45;
const ACC_SPEED = 0.5;
const LASER_SPEED = 150;
const DEC_MULT = 0.5;

var canvas, ctx, savedCanvas; 
var spaceship;
var laserFramesPaths = [
    "../images/spark/frames/spark-preview1.png",
    "../images/spark/frames/spark-preview2.png",
    "../images/spark/frames/spark-preview3.png",
    "../images/spark/frames/spark-preview4.png",
    "../images/spark/frames/spark-preview5.png"
];
var laserBullets = [];
const exitImage = new Image();
exitImage.src = "../images/Exit_BTN.png";

window.onload = function() {
    canvas = document.getElementById("cnv");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    spaceship = new Spaceship(canvas.width/2, canvas.height/2, 0.15, 0.15);

    animate();

    // key listeners
    document.addEventListener("keydown", controllerPressed);
    document.addEventListener("keyup", controllerReleased);
    document.addEventListener("click", function (e) {
        let x = e.clientX;
        let y = e.clientY; 
        //console.log("x: " + x + ", y: " + y);
        if(x > 15 && x < 15 + exitImage.width * 0.2){
            if(y > 15 && y < 15 + exitImage.height * 0.2){
                //console.log("in"); 
                window.location.href = "../html/mainMenu.html";
            } 
        }
    });
    // interval in which canvas is gonna be updated
    //setInterval(update, 1000 / FPS);
}

window.onresize = function() {
    resizeCanvas();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



function animate(){
    requestAnimationFrame(animate);

    ctx.putImageData(savedCanvas, 0, 0);
    
    // draw exit button
    if(exitImage){
        ctx.drawImage(exitImage, 15, 15, exitImage.width * 0.2, exitImage.height * 0.2);
    }
    //draw spaceship
    spaceship.update();
    laserBullets.forEach(laser => {
        // draw laser bullets shooted
        laser.update();
        if(laser.shooted) {
            laser.xSpeed = LASER_SPEED * Math.sin(laser.angle + 90 / 180 * Math.PI) / FPS;
            laser.ySpeed = -LASER_SPEED * Math.cos(laser.angle + 90 / 180 * Math.PI) / FPS;
        }
    });
    if(spaceship.accelerating) { // accelerate spaceship
        spaceship.xSpeed += ACC_SPEED * Math.sin(spaceship.angle) / FPS;
        spaceship.ySpeed -= ACC_SPEED * Math.cos(spaceship.angle) / FPS;
        //drawPropulsionFire();
    }
    else { // decelerate spaceship creating some kind of resistance (friction)
        spaceship.xSpeed -= DEC_MULT * spaceship.xSpeed / FPS;
        spaceship.ySpeed -= DEC_MULT * spaceship.ySpeed / FPS;

    }
    checkCanvasLimits();
}

class Spaceship {
    constructor(x, y, widthMult, heightMult) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.accelerating = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = 0; // angle to face spaceship up

        const image = new Image();
        image.src = "../images/x-wing.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * widthMult;
            this.height = image.height * heightMult;
        }  
    }

    draw() {
        ctx.save(); // save context
        ctx.translate(this.x, this.y); // translate canvas to player
        ctx.rotate(this.angle);
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

class LaserBullet {
    constructor(x, y, shooted, angle, laserFramesPaths) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = angle - 90 / 180 * Math.PI; // offset to match spaceship rotation
        this.shooted = shooted;
        this.images = [];
        this.imageIndex = 4;
        this.transitionTime = 0;
        for(var i = 0; i < laserFramesPaths.length; i++) {
            let img = new Image(); // dunno but let works and var dont
            img.src = laserFramesPaths[i];
            img.addEventListener("load", () => {
                this.images.push(img);
                this.width = img.width * 0.75;
                this.height = img.height * 0.75;
            });
        }
    }

    draw(img) {
        ctx.save(); // save context
        ctx.translate(this.x, this.y); // translate canvas to player
        ctx.rotate(this.angle);
        //console.log(img.src);
        // -this.width/2 and -this.height/2 required to correctly rotating the player with canvas
        ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore(); //restore context
    }

    update() {
        if(this.images[this.imageIndex]) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.draw(this.images[this.imageIndex]);
        }
        if(this.transitionTime > 5) {
            if(this.imageIndex > 0) {
                this.imageIndex--;
            }
            else {
                this.imageIndex = 4;
            }
            this.transitionTime = 0;
        }
        else{
            this.transitionTime++;
        }
    }
}

class Wart {
    constructor(x, y, hp, angle, speed) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.angle = angle;
        this.xSpeed = speed * Math.cos(this.angle);
        this.ySpeed = speed * Math.sin(this.angle);
    }

    draw() {

    }

    update() {

    }
}

class Syringe {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
}

function controllerPressed(/** @type {KeyboardEvent}*/ ev) { 
    if(ev.key === "ArrowUp") { // arrowup event (accelerate spaceship)
        spaceship.accelerating = true;
    }
    if(ev.key === "ArrowLeft") { // arrowleft event (rotate spaceship left)
        spaceship.rotation = -ROT_SPEED / 180 * Math.PI / FPS;
    }
    if(ev.key === "ArrowRight") { // arrowright event (rotate spaceship right)
        spaceship.rotation = ROT_SPEED / 180 * Math.PI / FPS;
    }
    if(ev.key === " ") { // shooting
        var xPos = 32 * Math.cos(spaceship.angle);
        var yPos = 32 * Math.sin(spaceship.angle);
        laserBullets.push(new LaserBullet(spaceship.x + xPos, spaceship.y + yPos, true, spaceship.angle, laserFramesPaths));
        laserBullets.push(new LaserBullet(spaceship.x - xPos, spaceship.y - yPos, true, spaceship.angle, laserFramesPaths));
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


function checkCanvasLimits() { // checks if spaceship goes off limits and set it on the other side of the canvas
    if(spaceship.x < 0 - spaceship.width) {
        spaceship.x = canvas.width + spaceship.width;
    }
    else if(spaceship.x > canvas.width + spaceship.width) {
        spaceship.x = 0 - spaceship.width;
    }
    if(spaceship.y < 0 - spaceship.height) {
        spaceship.y = canvas.height + spaceship.height;
    }
    else if(spaceship.y > canvas.height + spaceship.height) {
        spaceship.y = 0 - spaceship.height;
    }
}

function generateWarts(level) {
    var wartsNum;
    if(level == 1) {
        wartsNum = getRandomInteger(2, 4);
    }
    else if(level == 2) {
        wartsNum = getRandomInteger(4, 6);
    }
    else if(level == 3) {
        wartsNum = getRandomInteger(6, 8);
    }
}

function getRandomInteger(min, max) { // function from Math.random documentation
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
