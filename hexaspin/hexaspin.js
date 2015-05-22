// Recreation of this GIF: https://i.imgur.com/iQU8Suj.gif

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    var hexagons = [];
    // var colors = ['#81c640', '#00a496', '#1576bd', '#622f8e', '#c22286', '#ea235e', '#ed5b36', '#f7b532'];
    var colors = ['#dcdcd2', '#262626'];
    var centerX = 250;
    var centerY = 250;
    var numHex = 20;
    var minSize = 20;
    var distBetween = 20;

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    var easeInOutCirc = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    };

    // x, y are the center co-ordinates of the hexagon
    var drawHexagon = function(x, y, side, angle, color) {
        // How to draw a hexagon:
        // Find the point you start it, and move to it
        // To do this, you have to realize that a hexagon is basically 6 equilateral triangles
        // After that, it's trivial, using trig, and figuring the rest out is left
        // as an exercise to the reader.

        ctx.beginPath();
        ctx.moveTo(x + side * Math.cos(angle), y + side * Math.sin(angle));
        for (var i = 1; i < 7; i++) {
            ctx.lineTo(x + side * Math.cos(angle + Math.PI * i / 3), y + side * Math.sin(angle + Math.PI * i / 3));
        };
        ctx.closePath();

        ctx.fillStyle = color || 'green';
        ctx.fill();
    };

    var duration = 90 / 2;
    var createHex = function(x, y, side, color, tick) {
        var obj = {};
        obj.x = x;
        obj.y = y;
        obj.side = side;
        obj.angle = 0;
        obj.color = color;
        obj.ticks = tick;
        obj.time = 0;
        obj.draw = function() {
            obj.ticks++;
            obj.time++;
            drawHexagon(obj.x, obj.y, obj.side, obj.angle, obj.color);
            if (obj.spinning) {
                obj.angle = easeInOutCirc(obj.time, 0, Math.PI / 3, duration);
                if (obj.time > duration) {
                    obj.angle = 0;
                    obj.time = 0;
                    obj.spinning = false;
                }
            }
            else if (obj.ticks > 50) {
                // console.log('Spin!');
                obj.spinning = true;
                obj.ticks = 0;
                obj.time = 0;
            }
        };
        return obj;
    };

    var init = function() {
        for (var i = numHex - 1; i >= 0; i--) {
            hexagons.push(createHex(centerX, centerY, minSize + i * distBetween, colors[i % colors.length], -2 * i));
        };
    };

    var loop = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < hexagons.length; i++) {
            hexagons[i].draw();
        };
        requestAnimationFrame(loop);
    };

    init();
    loop();
})();