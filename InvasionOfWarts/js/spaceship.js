class Spaceship {
    constructor(x, y, widthMult, heightMult) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.accelerating = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = 0; // angle to face spaceship up
        this.hp = 5;

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
        for(var i = 0; i < this.hp; i++) {
            ctx.drawImage(this.image, canvas.width - (((this.width * 0.5) + 15) * (i+1)), 15, this.width * 0.5, this.height * 0.5);
        }
    }

    update() {
        if(this.image) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.angle += this.rotation;
            this.draw();
        }
    }

    isHitted() {
        // needed declaration because this. doesn't work in forEach loop
        var spaceship = this;
        var hitted = false;
        var wartsNum = 0;

        warts.forEach(wart => {
            if(isColliding(spaceship, wart)) {
                warts.splice(wartsNum, 1);
                hitted = true;
            }
            else{
                wartsNum++;
            }
        }); 
        return hitted; 
    }
}

class LaserBullet {
    constructor(x, y, shooted, angle, laserFramesPaths, laserHitFramesPaths) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = angle - 90 / 180 * Math.PI; // offset to match spaceship rotation
        this.shooted = shooted;
        this.laserImages = [];
        this.laserHitImages = [];
        this.laserIndex = 4;
        this.laserHitIndex = 0;
        this.transitionTime = 0;
        this.hasHitted = false;
        this.destroyed = false;

        for(var i = 0; i < laserFramesPaths.length; i++) {
            let img = new Image(); // dunno but let works and var dont
            img.src = laserFramesPaths[i];
            img.addEventListener("load", () => {
                this.laserImages.push(img);
                this.width = img.width * 0.75;
                this.height = img.height * 0.75;
            });
        }
        for(var i = 0; i < laserHitFramesPaths.length; i++) {
            let img = new Image();
            img.src = laserHitFramesPaths[i];
            img.addEventListener("load", () => {
                this.laserHitImages.push(img);
                //this.width = img.width * 0.75;
                //this.height = img.height * 0.75;
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
        if(this.laserImages[this.laserIndex]) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.draw(this.laserImages[this.laserIndex]);
        }
        if(this.transitionTime > 5) {
            if(this.laserIndex > 0) {
                this.laserIndex--;
            }
            else {
                this.laserIndex = 4;
            }
            this.transitionTime = 0;
        }
        else{
            this.transitionTime++;
        }
    }

    isOutOfBounds() {
        if(this.x > canvas.width || this.x < 0) {
            return true;
        }
        else if(this.y > canvas.height || this.y < 0) {
            return true;
        }
        return false;
    }

    hits() {
        if(this.laserHitImages[this.laserHitIndex]) {
            this.draw(this.laserHitImages[this.laserHitIndex]);
        }
        if(this.transitionTime > 5) {
            if(this.laserHitIndex < 5) {
                this.laserHitIndex++;
            }
            else {
                this.laserHitIndex = 0;
                this.destroyed = true;
            }
            this.transitionTime = 0;
        }
        else{
            this.transitionTime++;
        }
    }
}