(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var centerX = 200;
    var centerY = 200;
    var colors = ['#81c640', '#00a496', '#1576bd', '#622f8e', '#c22286', '#ea235e', '#ed5b36', '#f7b532'];
    var WIDTH = 30;

    var drawArc = function(x, y, radius) {
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();
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
        obj.rotation = Math.random() * 2 * Math.PI;
    };

    var x = 0;
    var loop = function() {
        x += Math.PI / 180;
        drawPattern(0, x * Math.PI);

        setTimeout(loop, 100/6);
    };
    loop();
})();