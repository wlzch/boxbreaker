$(function(){
    var randomColor = function() {
        var colors = ['#909BDE', '#232F7A', '#397A23', '#7A6023', '#7A2336', '#78237A', '#70E0CE'];

        return colors[Math.floor(Math.random() * colors.length)];
    }

    var BRICK_COUNTS = 20, BRICK_WIDTH = 105, BRICK_HEIGHT = 35;
    var STAGE_WIDTH = 1000, STAGE_HEIGHT = 600;
    var BAT_WIDTH = 200, BAT_HEIGHT = 20;
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
                strokeWidth: 4
            }));
        }
    }
    var bat = new Kinetic.Rect({
        x: (STAGE_WIDTH / 2) - (BAT_WIDTH / 2),
        y: (STAGE_HEIGHT - BAT_HEIGHT - 20),
        width: BAT_WIDTH,
        height: BAT_HEIGHT,
        fill: '#C9E334',
        cornerRadius: 5,
        strokeWidth: 5
    });
    var ball = new Kinetic.Circle({
        x: (STAGE_WIDTH / 2) - (BAT_WIDTH / 2) + (BAT_WIDTH / 2),
        y: (STAGE_HEIGHT - BAT_HEIGHT - 20) - BAT_HEIGHT,
        radius: BALL_RADIUS,
        fill: '#FFF',
        strokeWidth: 4
    });
    layer.add(ball);
    layer.add(bat);
    stage.add(layer);

    clickToPlay.click(function(){
        $(this).remove(); 
        startGame();

        return false;
    });

    var startGame = function(){
        $(window).keydown(function(e) {
            if (e.which == 37) {
                if (bat.getX() > 0) {
                    bat.setX(bat.getX() - 10);
                    layer.draw();
                }
            } else if (e.which == 39) {
                if (bat.getX() < (STAGE_WIDTH - BAT_WIDTH)) {
                    bat.setX(bat.getX() + 10);
                    layer.draw();
                }
            }
        });
        var bounce = function() {
            var xEnd, yEnd;
            if (orientation === RIGHT_UP_ORI) {
                xEnd = STAGE_WIDTH - BALL_RADIUS;
                yEnd = ball.getY() * Math.cos(degree);
                orientation = LEFT_UP_ORI;
            } else if (orientation === LEFT_UP_ORI) {
                xEnd = ball.getX() * Math.cos(degree);
                yEnd = 0;
                orientation = LEFT_DOWN_ORI;
            } else if (orientation === LEFT_DOWN_ORI) {
                xEnd = 0;
                yEnd = STAGE_HEIGHT * Math.cos(degree);
                orientation = RIGHT_DOWN_ORI;
            } else if (orientation === RIGHT_DOWN_ORI) {
                xEnd = STAGE_WIDTH * Math.cos(degree);
                yEnd = STAGE_HEIGHT - BALL_RADIUS;
                orientation = RIGHT_UP_ORI;
            }
            console.log('called');
            ball.transitionTo({
                x: xEnd,
                y: yEnd,
                duration: 1,
                callback: function(){
                    bounce();
                }
            });
        }
        bounce();
    }

});
