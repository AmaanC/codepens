// Made for #RainbowLinesWeekend on Codepen

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var LINE_WIDTH = 30;
    var numLines = Math.ceil(window.innerWidth / LINE_WIDTH);
    var colors = ['#81c640', '#00a496', '#1576bd', '#622f8e', '#c22286', '#ea235e', '#ed5b36', '#f7b532'];
    var lines = [];

    var easeFn = function(angle) {
        return Math.sin(angle);
    };

    var createLine = function(x, angle, color) {
        var obj = {};
        obj.x = x;
        obj.color = color;
        obj.height = 30;
        obj.angle = angle;
        obj.ticks = 0;
        obj.draw = function() {
            obj.ticks++;
            obj.height = canvas.height * easeFn(obj.angle);
            obj.angle += Math.PI / 180;
            obj.angle = obj.angle % Math.PI;
            if (obj.angle.toFixed(2) !== 0) {
                ctx.fillStyle = obj.color;
                ctx.fillRect(x, canvas.height - obj.height, LINE_WIDTH, obj.height);
            }

        };
        return obj;
    };

    var init = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        for (var i = 0; i < numLines; i++) {
            lines.push(createLine(i * LINE_WIDTH, Math.PI * i / numLines, colors[i % colors.length]));
        };
    };

    var loop = function() {
        ctx.fillStyle = 'rgba(155, 73, 195, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < lines.length; i++) {
            lines[i].draw();
        };
        requestAnimationFrame(loop);
    };

    init();
    loop();
})();