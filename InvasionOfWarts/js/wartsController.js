// use window.localStorage to pass values between scripts, can't use imports
const imageMult = 0.1;

class Wart {
    constructor(x, y, hp, xFocus, yFocus) {
        this.x = x;
        this.y = y;
        this.hp = hp;

        this.xFocus = xFocus;
        this.yFocus = yFocus;
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
            this.angle = Math.atan2(this.yFocus - this.y, this.xFocus - this.x) + 90 / 180 * Math.PI;
            this.draw();
        }
    }

    isHitted() {
        // needed declaration because this. doesn't work in forEach loop
        var wartX = this.x;
        var wartY = this.y;
        var wartWidth = this.width;
        var wartHeight = this.height;
        
        laserBullets.forEach(laser => {
            console.log(wartX + "," + wartY);
            if(laser.x + laser.width > wartX || laser.x < wartX + wartWidth || 
                laser.y + laser.height > wartY || laser.y < wartY + wartHeight) {
                return true;
            }
        });
        return false;
    }
}


var warts = [];

function generateWarts(level) {
    var wartsNum;
    if(level == 1) {
        wartsNum = getRandomInteger(2, 4);
        for(var i = 0; i < 1; i++) { // change 1 for wartsNum, currently testing
            spawnedWart = new Wart(0, 0, 3, canvas.width/2, canvas.height/2);
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

function getRandomInteger(min, max) { // function from Math.random documentation
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
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

// function for 
function isColliding() {

}