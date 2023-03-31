var canvas, ctx, savedCanvas; 

const startGameButtonImage = new Image();
const gameImage = new Image();

window.onload = function() {
    canvas = document.getElementById("menu");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    startGameButtonImage.src = "../images/Start_BTN.png";
    startGameButtonImage.onload = () => {
        ctx.drawImage(startGameButtonImage, canvas.width/2 - startGameButtonImage.width * 0.2/2, (canvas.height/2 - startGameButtonImage.height * 0.2/2) + 25, startGameButtonImage.width * 0.2, startGameButtonImage.height * 0.2);

    };
    // canvas doesnt detect anything, add document listner and check
    // if click inside image dimensions :)))
    /*
    startGameButtonImage.onclick = () => {
        console.log("aaa");
        window.location.href("../html/invasionOfWarts.html");
    };
    */
    gameImage.src = "../images/x-wing.png";
    gameImage.onload = () => {
        ctx.drawImage(gameImage, canvas.width/2 - gameImage.width * 0.15/2, (canvas.height/2 - gameImage.height * 0.15/2) - 50, gameImage.width * 0.15, gameImage.height * .15);
    }

    document.addEventListener("click", function (e) {
        startGame(canvas, e);
    });
    //save background before drawing
    savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);

    animate();
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
        ctx.drawImage(gameImage, canvas.width/2 - gameImage.width * 0.15/2, (canvas.height/2 - gameImage.height * 0.15/2) - 50, gameImage.width * 0.15, gameImage.height * 0.15);
    }
    if(startGameButtonImage) {
        ctx.drawImage(startGameButtonImage, canvas.width/2 - startGameButtonImage.width * 0.2/2, (canvas.height/2 - startGameButtonImage.height * 0.2/2) + 25, startGameButtonImage.width * 0.2, startGameButtonImage.height * 0.2);
    }
}

function startGame(canvas, event){
    let x = event.clientX;
    let y = event.clientY; 
    //console.log("x: " + x + ", y: " + y);
    if(x > canvas.width/2 - startGameButtonImage.width * 0.2/2 && x < canvas.width/2 + startGameButtonImage.width * 0.2/2){
        if(y > ((canvas.height/2 - startGameButtonImage.height * 0.2/2) + 25) && y < ((canvas.height/2 + 25) + startGameButtonImage.height* 0.2/2)){
            //console.log("in"); 
            window.location.href = "../html/invasionOfWarts.html";
        } 
    }
}