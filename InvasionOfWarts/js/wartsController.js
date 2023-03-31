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

// use window.localStorage to pass values between scripts, can't use imports
