// use window.localStorage to pass values between scripts, can't use imports
const imageMult = 0.1;

class Wart {
    constructor(x, y, hp) {
        this.x = x;
        this.y = y;
        this.hp = hp;

        this.xFocus = 0;
        this.yFocus = 0;
        this.angle = Math.atan2(this.yFocus - this.y, this.xFocus - this.x) + 90 / 180 * Math.PI;
        this.xSpeed = 0;
        this.ySpeed = 0;

        const image = new Image();
        image.src = "../images/wart.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * imageMult;
            this.height = image.height * imageMult;
        } 
    }

    draw() {
        ctx.save(); // save context
        ctx.translate(this.x, this.y); // translate canvas to player
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore(); //restore context
    }

    update() {
        if(this.image) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.angle = Math.atan2(this.yFocus - this.y, this.xFocus - this.x) + 90 / 180 * Math.PI; // calculates angle between spaceship and wart
            this.draw();
        }
    }

    isHitted() {
        var wart = this;
        var hitted = false;

        laserBullets.forEach(laser => {
            if(isColliding(wart, laser) && !laser.hasHitted) {
                laser.transitionTime = 0;
                laser.hasHitted = true;
                hitted = true;
            }
        }); 
        return hitted; 
    }
}


var warts = [];

function generateWarts(level) {
    var wartsNum;
    if(level == 1) {
        wartsNum = getRandomInteger(2, 4);
        for(var i = 0; i < wartsNum; i++) {
            spawnedWart = new Wart(0, 0, 3);
            wartSpawnPoint = getWartSpawnInCanvasBorder();
            spawnedWart.x = wartSpawnPoint.x;
            spawnedWart.y = wartSpawnPoint.y;

            warts.push(spawnedWart);
        }
    }
    else if(level == 2) {
        wartsNum = getRandomInteger(4, 6);
    }
    else if(level == 3) {
        wartsNum = getRandomInteger(6, 8);
    }
}

function getWartSpawnInCanvasBorder() {
    side = getRandomInteger(1, 4);

    if(side == 1) {
        x = getRandomInteger(0, canvas.width);
        y = 0;
    }
    else if(side == 2) {
        x = canvas.width;
        y = getRandomInteger(0, canvas.height); 
    }
    else if(side == 3) {
        x = getRandomInteger(0, canvas.width);
        y = canvas.height; 
    }
    else {
        x = 0;
        y = getRandomInteger(0, canvas.height); 
    }
    return {x, y};
}

// checks if two rectangles are colliding
function isColliding(rect1, rect2) {
    var wartX = rect1.x;
    var wartY = rect1.y;
    var wartWidth = rect1.width;
    var wartHeight = rect1.height;
    var hitted = false;

    if(rect2.x + rect2.width/2 >= wartX - wartWidth/2 && rect2.x - rect2.width/2 <= wartX + wartWidth/2 && 
    rect2.y + rect2.height/2 >= wartY - wartHeight/2 && rect2.y - rect2.height/2 <= wartY + wartHeight/2) {
        hitted = true;
    }
    return hitted;
}