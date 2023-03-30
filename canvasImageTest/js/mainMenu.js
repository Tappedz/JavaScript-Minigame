var canvas, ctx, savedCanvas; 
var startGameButtonImage;
const gameImage = new Image();

window.onload = function() {
    canvas = document.getElementById("menu");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    startGameButtonImage = new Image();

    //startGameButtonImage.src = ;
    gameImage.src = "../images/x-wing.png";
    gameImage.onload = () => {
        ctx.drawImage(gameImage, canvas.width/2 - gameImage.width/2, canvas.height/2 - gameImage.height/2);
    }

    animate();
    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);

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
    //ctx.fillStyle = "white";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(savedCanvas, 0, 0);
    if(gameImage) {
        ctx.drawImage(gameImage, canvas.width/2 - gameImage.width/2, canvas.height/2 - gameImage.height/2);
    }

    checkCanvasLimits();
}