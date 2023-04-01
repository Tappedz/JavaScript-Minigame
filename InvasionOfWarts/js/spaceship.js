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
            this.angle += this.rotation;
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

    isOutOfBounds() {
        if(this.x > canvas.width || this.x < 0) {
            return true;
        }
        else if(this.y > canvas.height || this.y < 0) {
            return true;
        }
        return false;
    }
}