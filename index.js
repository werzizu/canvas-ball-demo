window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var x = canvas.width/2;
    var y = canvas.height - 30;

    var dx = -getRandomArbitary(-2,2);
    var dy = -2;

    function getRandomArbitary(min, max)
    {
        return Math.random() * (max - min) + min;
    }


    var score = 0;

    var ballRadius = 20;

    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth)/2; //begin positionX of paddle



    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.strokeStyle = "#0095DD";
        ctx.stroke();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 2, Math.PI*2, false);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawBricks();
        drawPaddle();
        drawBall();
        collisionDetection();
        drawScore();
        drawLives();

        x += dx;
        y += dy;

        if(rightPressed && paddleX < canvas.width - paddleWidth){
            paddleX +=7;
        } else if(leftPressed && paddleX > 0){
            paddleX -=7;
        }

        if(x + dx < (ballRadius - 5) || x + dx > canvas.width + 5 - ballRadius){
            dx = -dx;
        }

        if(y + dy < ballRadius - 5){
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if(x > paddleX - 10 && x < paddleX + paddleWidth + 10){
                dy = -dy;
                if((x - paddleX) > (paddleWidth/2)){ //right part
                    dx = -(paddleWidth/2 - (x - paddleX)) / (paddleWidth / 2) * Math.abs(dy*0.7);
                } else { //left part
                    dx = -(paddleWidth/2 - (x - paddleX)) / (paddleWidth / 2) * Math.abs(dy*0.7);
                }
                // }
            } else {
                lives--;
                if(!lives) {
                    alert("ПОТРАЧЕНО");
                    document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }
        requestAnimationFrame(draw);
    }

    draw();


    var rightPressed = false;
    var leftPressed = false;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        } else if( e.keyCode == 37){
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        } else if( e.keyCode == 37){
            leftPressed = false;
        }

    }

    function mouseMoveHandler(e) {
        console.log("e.clientX", e.clientX);
        console.log("canvas.offsetLeft", canvas.offsetLeft);
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }


    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;


    var bricks = [];

    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++){
            for (var r = 0; r < brickRowCount; r++){
                if(bricks[c][r].status == 1){
                    var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1){
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = dy > 0 ? -(dy + 1) : -(dy - 1);
                        score++;
                        b.status = 0;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    }

    var lives = 3;

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: "+lives, canvas.width-65, 20);
    }



};
