(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var centerX = 250;
    var centerY = 250;
    var colors = ['#81c640', '#00a496', '#1576bd', '#622f8e', '#c22286', '#ea235e', '#ed5b36', '#f7b532'];
    var revColors = colors.reverse();
    var WIDTH = 30;
    var LINE_WIDTH = 25;
    var NUM_CIRCLES = 8;
    var patterns = [];
    var pattern;
    var data = {};
    data.mode = 0;
    var fns = [
        function(x) { return 0; },
        function(x) { return x / 5; },
        Math.tan,
        Math.floor,
        Math.atan
    ];

    var drawArc = function(x, y, radius) {
        ctx.beginPath();
        ctx.lineWidth = LINE_WIDTH;
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.clip();
    };

    var drawPattern = function(displacement, rotation, type) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation);
        var j;
        for (var i = 0; i < colors.length * 4; i++) {
            j = i % colors.length;
            ctx.fillStyle = type === 0 ? colors[j] : revColors[j];
            ctx.fillRect(-canvas.width + displacement + i * WIDTH, -canvas.height, WIDTH, canvas.height * 2);
        }
        ctx.restore();
    };

    // Used in obj.step to create more "modes"
    var g = function(x) {
        return (fns[data.mode])(x);
    };

    // Creates an object with specific properties of displacement and rotation associated with it
    var createObj = function(type) {
        var obj = {};
        obj.displacement = 0;
        obj.rotation = 0;
        obj.theta = Math.random() * 0.5 * Math.PI;
        obj.disFactor = Math.random() * 2;
        obj.rotFactor = Math.random() * 2;
        obj.type = type;
        obj.step = function() {
            obj.displacement += obj.disFactor * Math.sin(obj.theta);
            obj.rotation = obj.rotFactor * g(Math.sin(obj.theta));
            obj.theta += Math.PI / 180;
        };
        return obj;
    };

    var init = function() {
        for (var i = 0; i < NUM_CIRCLES; i++) {
            patterns.push(createObj(i % 2));
        }
    };

    var loop = function() {
        for (var i = patterns.length - 1; i >= 0; i--) {
            ctx.save();
            pattern = patterns[i];
            drawArc(centerX, centerY, 50 + i * 2 * LINE_WIDTH);
            drawPattern(pattern.displacement, pattern.rotation, pattern.type);
            pattern.step();
            ctx.restore();
        }

        setTimeout(loop, 100/6);
    };

    window.onload = function() {
        var gui = new dat.GUI();
        gui.add(data, 'mode', Object.keys(fns));
        document.querySelector('.c').children[0].focus();
    };

    init();
    loop();
})();