// use window.localStorage to pass values between scripts, can't use imports
class Wart {
    constructor(x, y, hp, speed, xFocus, yFocus) {
        this.x = x;
        this.y = y;
        this.hp = hp;

        this.xFocus = xFocus;
        this.yFocus = yFocus;
        this.angle = Math.atan2(this.yFocus - this.y, this.xFocus - this.x) + 90 / 180 * Math.PI;
        this.xSpeed = speed * Math.cos(this.angle);
        this.ySpeed = speed * Math.sin(this.angle);

        const image = new Image();
        image.src = "../images/wart.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * 0.1;
            this.height = image.height * 0.1;
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
            this.angle = Math.atan2(this.yFocus - this.y, this.xFocus - this.x) + 90 / 180 * Math.PI;
            this.draw();
        }
    }
}


var warts = [];

function generateWarts(level) {
    var wartsNum;
    if(level == 1) {
        wartsNum = getRandomInteger(2, 4);
        for(var i = 0; i < wartsNum; i++) {
            warts.push(new Wart(getRandomInteger(0, canvas.width),getRandomInteger(0, canvas.height), 3, 90, canvas.width/2, canvas.height/2));
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
    val = Math.floor(Math.random() * (max - min + 1) + min);
    return val;
}