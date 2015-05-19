// Inspired by https://i.imgur.com/dQMXh6Z.gif

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var arcs = [];
    var colors = ['#1674bc', '#00a396', '#81c540', '#f5b52e', '#ee5b35', '#ea225e', '#c22286', '#612e8d'];
    var centerX, centerY;

    var drawArc = function(x, y, radius, color, angle) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.arc(x, y, radius, angle, angle + Math.PI, true);
        ctx.stroke();
        ctx.closePath();
    };

    var makeArc = function(radius, color, speed) {
        var obj = {};
        obj.radius = radius;
        obj.color = color;
        obj.speed = speed;
        obj.direction = 0;
        obj.angle = Math.PI / 4;
        obj.draw = function() {
            drawArc(centerX, centerY, obj.radius, obj.color, obj.angle);
            obj.direction += Math.PI / 180;
            obj.angle += Math.PI / 180 * Math.sin(obj.direction) * obj.speed;
        };

        return obj;
    };

    var init = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        for (var i = 0; i < colors.length; i++) {
            arcs.push(makeArc(30 + i * 20, colors[i], 5 + Math.random() * 10));
        }
    };

    var loop = function() {
        ctx.fillStyle = 'rgba(38, 38, 38, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < arcs.length; i++) {
            arcs[i].draw();
        }
        setTimeout(loop, 100/3);
    };
    init();
    loop();
})();