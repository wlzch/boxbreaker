$(function(){
    var randomColor = function() {
        var colors = ['#909BDE', '#232F7A', '#397A23', '#7A6023', '#7A2336', '#78237A', '#70E0CE'];

        return colors[Math.floor(Math.random() * colors.length)];
    }

    var BRICK_COUNTS = 20, BRICK_WIDTH = 105, BRICK_HEIGHT = 35;
    var STAGE_WIDTH = 1000, STAGE_HEIGHT = 600;
    var PADDLE_WIDTH = 200, PADDLE_HEIGHT = 20;
    var BALL_RADIUS = 15;
    var columnPerRow = Math.floor(BRICK_COUNTS / 3), row, column;

    // ball orientation
    var RIGHT_UP_ORI = 1;
    var RIGHT_DOWN_ORI = 2;
    var LEFT_UP_ORI = 3;
    var LEFT_DOWN_ORI = 4;
    var orientation = RIGHT_UP_ORI;
    var degree = 32;

    var clickToPlay = $('#click-to-play');

    var stage = new Kinetic.Stage({
        container: 'boxbreaker',
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT
    });
    var layer = new Kinetic.Layer();

    // setting up the bricks
    for (var row = 1; row <= 3; row++) {
        for (var column = 1; column <= columnPerRow; column++) {
            layer.add(new Kinetic.Rect({
                x: (column * (BRICK_WIDTH + 20)),
                y: 20 + (row * (BRICK_HEIGHT + 10)),
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                fill: randomColor(),
                cornerRadius: 5,
                strokeWidth: 4,
                name: 'brick'
            }));
        }
    }
    var paddle = new Kinetic.Rect({
        x: (STAGE_WIDTH / 2) - (PADDLE_WIDTH / 2),
        y: (STAGE_HEIGHT - PADDLE_HEIGHT - 20),
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        fill: '#C9E334',
        cornerRadius: 5,
        strokeWidth: 5
    });
    var ball = new Kinetic.Circle({
        x: (STAGE_WIDTH / 2) - (PADDLE_WIDTH / 2) + (PADDLE_WIDTH / 2),
        y: (STAGE_HEIGHT - PADDLE_HEIGHT - 20) - PADDLE_HEIGHT,
        radius: BALL_RADIUS,
        fill: '#FFF',
        strokeWidth: 4
    });
    ball.vx = 6;
    ball.vy = -6;
    layer.add(ball);
    layer.add(paddle);
    stage.add(layer);

    clickToPlay.click(function(){
        $(this).remove(); 
        startGame();

        return false;
    });

    var startGame = function(){
        $(window).keydown(function(e) {
            if (e.which == 37) {
                if (paddle.getX() > 0) {
                    paddle.setX(paddle.getX() - 30);
                    layer.draw();
                }
            } else if (e.which == 39) {
                if (paddle.getX() < (STAGE_WIDTH - PADDLE_WIDTH)) {
                    paddle.setX(paddle.getX() + 30);
                    layer.draw();
                }
            }
        });
        bounce = function() {
            ball.setX(ball.getX() + ball.vx);
            ball.setY(ball.getY() + ball.vy);
            //Check collision with wall

            var changeX = function() {
                ball.vx = -ball.vx;
            }
            var changeY = function() {
                ball.vy = -ball.vy;
            }
            if (ball.getX() > STAGE_WIDTH || ball.getX() < 0) {
                changeX();
            }

            if (ball.getY() > STAGE_HEIGHT || ball.getY() < 0) {
                changeY();
            }

            // Check collision with brick
            var stopIter = false;
            for (var i = 0, bricks = stage.get('.brick'), len = bricks.length; i < len && !stopIter; i++) {
                (function(){
                    var brick = bricks[i];
                    var radius = ball.getRadius();
                    var ballX = ball.getX();
                    var ballY = ball.getY();
                    var brickWidth = brick.getWidth();
                    var brickHeight = brick.getHeight();
                    var brickX = brick.getX();
                    var brickY = brick.getY();
                    if ((ballX + radius >= brickX) && (ballX - radius <= brickX + brickWidth)) {
                        if ((ballY + radius >= brickY) && (ballY - radius <= brickY + brickHeight)) {
                            changeY();
                            stopIter = true;
                            brick.remove();
                        }
                    }
                    // If ball is on the right side of left side of brick
                    if ((ballX + radius == brickX && ((ballY + radius >= brickY) && (ballY - radius <= brickY + brickHeight))) ||
                        ((ballX - radius == brickX + brickHeight) && ((ballY + radius >= brickY) && (ballY - radius <= brickY + brickHeight)))
                       ) {
                        changeX();
                        changeY();
                        brick.remove();
                    }
                })();
            }
            if ((ball.getX() + ball.getRadius() >= paddle.getX() && ball.getX() - ball.getRadius() <= paddle.getX() + paddle.getWidth()) &&
                (ball.getY() + ball.getRadius() >= paddle.getY()) && (ball.getY() - ball.getRadius() <= paddle.getY() + paddle.getHeight())
               ) {
                changeY();
               }
            layer.draw();
        }
        setInterval(bounce, 1);
    }
});
