class Syringe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.picked = false;
        this.pickUpAnim = false;

        this.spriteWidth = 32;
        this.spriteHeigth = 32;

        this.pickedUpFrame = 2;
        const pickedUpSprites = new Image();
        pickedUpSprites.src = "../images/explosions/pickUpSyringe.png";
        pickedUpSprites.onload = () => {
            this.pickedUpSprites = pickedUpSprites;
        }

        const image = new Image();
        image.src = "../images/syringe.png";
        image.onload = () => {
            this.image = image;
            this.width = image.width * imageMult;
            this.height = image.height * imageMult;
        } 
    }

    draw() {
        if(this.image) {
            ctx.drawImage(this.image, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        } 
    }

    isCollected() {
        if(isColliding(spaceship, this)) {
            this.pickedUpAnim = true;
        }
        return this.pickedUpAnim;
    }

    pickedUp() {
        if(!this.picked) {
            if(this.pickedUpSprites) {
                ctx.save(); // save context
                ctx.translate(this.x, this.y); // translate canvas to player
                ctx.rotate(this.angle);
                ctx.drawImage(this.pickedUpSprites, this.pickedUpFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeigth, -this.width/2, -this.height/2, this.width, this.height);
                ctx.restore(); //restore context
                if(this.pickedUpFrame > 0) {
                    this.pickedUpFrame--;
                }
                else {
                    this.picked = true;
                    this.pickedUpFrame = 2;
                }
            }
        } 
    }
}

var syringes = [];

function generateSyringes(level) {
    if(level == 1) {
        for(var i = 0; i < SYR_NUM; i++) {
            syringes.push( new Syringe(getRandomInteger(100, canvas.width - 100), getRandomInteger(100, canvas.height - 100)));
        }
    }
    else if(level == 2) {
        console.log("level 2");
    }
    else if(level == 3) {
        console.log("level 3");
    }
}