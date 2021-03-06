// Recreation of this GIF: https://i.imgur.com/iQU8Suj.gif

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var hexagons = [];
    var data = {}; // Used for dat.GUI
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    data.numHex = 30;
    data.minSize = 20;
    data.distBetween = 20;
    data.waitPeriod = 100; // How long it waits before spinning again. Measured in ticks

    // dat.GUI can't handle arrays, so we're just delimiting a list of colors with commas
    var colorList = {
       'Original': '#dcdcd2,#262626',
       'Blue Chocolate': '#30261C,#403831,#36544F,#1F5F61,#0B8185',
       'Earth Warrior': '#395A4F,#853C43,#FFA566',
       'I like your smile': '#B3CC57,#ECF081,#FFBE40',
       'Avilluk': '#23192D,#F57576,#FD0A54,#FEBF97,#F5ECB7',
       'Rhubarb Pie': '#BF496A,#B39C82,#B8C99D,#F0D399,#595151',
       'Rainbow': '#BF0C43,#F9BA15,#8EAC00,#127A97,#452B72'
    };

    var getRandomColor = function() {
        var script = document.createElement('script');
        script.src = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=assignRandom';
        document.body.appendChild(script);
    };

    window.assignRandom = function(response) {
        var hexArray = response[0].colors.map(function(elem) {
            return '#' + elem;
        });
        data.colors = hexArray.join();

        init();
        console.log('Got random colors: ', hexArray);
    };

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    // Taken from http://gizma.com/easing/
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
            else if (obj.ticks > data.waitPeriod) {
                // console.log('Spin!');
                obj.spinning = true;
                obj.ticks = 0;
                obj.time = 0;
            }
        };
        return obj;
    };

    var init = function() {
        hexagons = [];
        var colors = data.colors.split(',');
        for (var i = data.numHex - 1; i >= 0; i--) {
            hexagons.push(createHex(centerX, centerY, data.minSize + i * data.distBetween, colors[i % colors.length], -2 * i));
        };
    };

    var loop = function() {
        ctx.fillStyle = '#262626';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < hexagons.length; i++) {
            hexagons[i].draw();
        };
        requestAnimationFrame(loop);
    };

    data.colors = colorList['Original'];
    data.randomColor = getRandomColor;

    init();
    loop();


    window.onload = function() {
        var gui = new dat.GUI();
        var needsRefreshing = []; // The gui elements that need to re-init things
        needsRefreshing.push(gui.add(data, 'colors', colorList));
        needsRefreshing.push(gui.add(data, 'numHex'));
        needsRefreshing.push(gui.add(data, 'minSize'));
        needsRefreshing.push(gui.add(data, 'distBetween'));
        gui.add(data, 'waitPeriod');
        gui.add(data, 'randomColor');

        for (var i = 0; i < needsRefreshing.length; i++) {
            needsRefreshing[i].onChange(init);
        };
        document.querySelector('.c').children[0].focus();
    };

})();