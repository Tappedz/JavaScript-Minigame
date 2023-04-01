class Syringe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.picked = false;

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
            this.picked = true;
        }
        return this.picked;
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