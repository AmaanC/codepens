(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var centerX = 200;
    var centerY = 200;
    var colors = ['#81c640', '#00a496', '#1576bd', '#622f8e', '#c22286', '#ea235e', '#ed5b36', '#f7b532'];
    var WIDTH = 30;
    var LINE_WIDTH = 25;
    var NUM_CIRCLES = 5;
    var patterns = [];
    var pattern;

    var drawArc = function(x, y, radius) {
        ctx.beginPath();
        ctx.lineWidth = LINE_WIDTH;
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.clip();
    };

    var drawPattern = function(displacement, rotation) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation);
        var j;
        for (var i = 0; i < colors.length * 4; i++) {
            j = i % colors.length;
            ctx.fillStyle = colors[j];
            ctx.fillRect(-canvas.width + displacement + i * WIDTH, -canvas.height, WIDTH, canvas.height * 2);
        }
        ctx.restore();
    };

    // Creates an object with specific properties of displacement and rotation associated with it
    var createObj = function() {
        var obj = {};
        obj.displacement = Math.random() * 30;
        obj.rotation = 0;
        obj.theta = Math.random() * 1/2 * Math.PI;
        obj.step = function() {
            obj.displacement += Math.random() * 5 * Math.sin(obj.theta);
            obj.rotation = Math.sin(obj.theta);
            obj.theta += Math.PI / 180;
        };
        return obj;
    };

    var init = function() {
        for (var i = 0; i < NUM_CIRCLES; i++) {
            patterns.push(createObj());
        }
    };

    var loop = function() {
        for (var i = patterns.length - 1; i >= 0; i--) {
            ctx.save();
            pattern = patterns[i];
            drawArc(centerX, centerY, 50 + i * 2 * LINE_WIDTH);
            drawPattern(pattern.displacement, pattern.rotation);
            pattern.step();
            ctx.restore();
        }

        setTimeout(loop, 100/6);
    };
    init();
    loop();
})();