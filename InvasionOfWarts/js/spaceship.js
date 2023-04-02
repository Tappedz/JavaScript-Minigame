class Spaceship {
    constructor(x, y, hp, widthMult, heightMult) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.accelerating = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.angle = 0; // angle to face spaceship up
        this.hp = hp;
        this.shooting = false;
        this.destroyed = false;
        this.damaged = false;

        this.engineFrame = 0;
        this.weaponFrame = 0;
        this.destructionFrame = 0;

        this.spriteWidth = 64;
        this.spriteHeigth = 64;
        const spaceshipImage = new Image();
        spaceshipImage.src = "../images/spaceship/Fighter-spaceship.png";
        spaceshipImage.onload = () => {
            this.spaceshipImage = spaceshipImage;
            this.width = spaceshipImage.width / 2 * widthMult; // fix collider visual
            this.height = spaceshipImage.height / 2 * heightMult;
        }  
        const engineSprites = new Image();
        engineSprites.src = "../images/spaceship/Fighter-engine.png";
        engineSprites.onload = () => {
            this.engineSprites = engineSprites;
        }
        const weaponsSprites = new Image();
        weaponsSprites.src = "../images/spaceship/Fighter-weapons.png";
        weaponsSprites.onload = () => {
            this.weaponsSprites = weaponsSprites;
        }
        const destructionSprites = new Image();
        destructionSprites.src = "../images/explosions/Fighter-destruction.png";
        destructionSprites.onload = () => {
            this.destructionSprites = destructionSprites;
        }

    }

    draw() {
        ctx.save(); // save context
        ctx.translate(this.x, this.y); // translate canvas to player
        ctx.rotate(this.angle);
        // -this.width/2 and -this.height/2 required to correctly rotating the player with canvas
        ctx.drawImage(this.spaceshipImage, -this.width, -this.height, this.width * 2, this.height * 2);
        ctx.restore(); //restore context
    }

    drawEngine() {
        if(this.engineSprites) {
            ctx.save(); // save context
            ctx.translate(this.x, this.y); // translate canvas to player
            ctx.rotate(this.angle);
            // iterate through png using drawImage()
            ctx.drawImage(this.engineSprites, this.engineFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, -this.width, -this.height, this.width * 2, this.height * 2);
            ctx.restore(); //restore context
            if(this.engineFrame < 9) {
                this.engineFrame++;
            }
            else {
                this.engineFrame = 0;
            }
        }
    }

    drawWeapons() {
        if(this.weaponsSprites) {
            ctx.save(); // save context
            ctx.translate(this.x, this.y); // translate canvas to player
            ctx.rotate(this.angle);
            ctx.drawImage(this.weaponsSprites, this.weaponFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, -this.width, -this.height, this.width * 2, this.height * 2);
            ctx.restore(); //restore context
            if(this.weaponFrame < 5) {
                this.weaponFrame++;
            }
            else {
                this.shooting = false;
                this.weaponFrame = 0;
            }
        }
    }

    drawAnimationHit() {
        if(this.destructionSprites) {
            ctx.save(); // save context
            ctx.translate(this.x, this.y); // translate canvas to player
            ctx.rotate(this.angle);
            ctx.drawImage(this.destructionSprites, this.destructionFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, -this.width, -this.height, this.width * 2, this.height * 2);
            ctx.restore(); //restore context
            if(this.destructionFrame < 2) {
                this.destructionFrame++;
            }
            else {
                this.damaged = false;
                this.destructionFrame = 0;
            }
        }
    }

    update() {
        if(this.spaceshipImage) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.angle += this.rotation;
            if(this.damaged) {
                this.drawAnimationHit();
            }
            else {
                this.draw();
            } 
            if(this.shooting) {
                this.drawWeapons();
            }
            if(this.accelerating) {
                spaceship.drawEngine();
            }
        }
    }

    isHitted() {
        // needed declaration because this. doesn't work in forEach loop
        var spaceship = this;
        var hitted = false;
        var wartsNum = 0;

        warts.forEach(wart => {
            if(isColliding(spaceship, wart) && !wart.destroying) {
                warts.splice(wartsNum, 1);
                this.damaged = true;
                hitted = true;
            }
            else{
                wartsNum++;
            }
        }); 
        return hitted; 
    }

    explode() {
        if(!this.destroyed) {
            if(this.destructionSprites) {
                ctx.save(); // save context
                ctx.translate(this.x, this.y); // translate canvas to player
                ctx.rotate(this.angle);
                ctx.drawImage(this.destructionSprites, this.destructionFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, -this.width, -this.height, this.width * 2, this.height * 2);
                ctx.restore(); //restore context
                if(this.destructionFrame < 9) {
                    this.destructionFrame++;
                }
                else {
                    this.destroyed = true;
                    this.destructionFrame = 0;
                }
            }
        } 
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
        if(this.laserIndex > 0) {
            this.laserIndex--;
        }
        else {
            this.laserIndex = 4;
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
        if(this.laserHitIndex < 5) {
            this.laserHitIndex++;
        }
        else {
            this.laserHitIndex = 0;
            this.destroyed = true;
        }

    }
}