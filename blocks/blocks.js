// Recreating this GIF https://i.imgur.com/B5xX6X4.gif

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var blockSize = 30;
    var smallestSize = 10;
    var step = 5;
    var lightBlocks = [];
    var darkBlocks = [];
    var lightColor = '#dcdcd2';
    var darkColor = '#262626';

    var lightMode = true;
    var justFlipped = true;
    var shouldPulse = false;

    var rows = 2;
    var columns = 2;

    var drawBlock = function(centerX, centerY, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
    };

    var createBlock = function(centerX, centerY, color) {
        var obj = {};
        obj.centerX = centerX;
        obj.centerY = centerY;
        obj.size = blockSize; // This value will be changed in the pulsate function
        obj.color = color;
        obj.pulse = 0; // Used in the pulsate function
        obj.shrinking = 1; // Changed to -1 when it's growing
        obj.pulsing = false;
        obj.trigger = function() {
            obj.pulsing = true;
        }
        obj.pulsate = function() {
            obj.pulsing = true;
            obj.size -= obj.shrinking * step * Math.sin(obj.pulse);
            obj.pulse += Math.PI / 180;
            if (obj.size < smallestSize) {
                obj.shrinking = -1;
            }
            else if (obj.size >  blockSize) {
                obj.size = blockSize;
                obj.pulsing = false;
                obj.pulse = 0;
                obj.shrinking = 1;
            }
        };
        obj.draw = function() {
            drawBlock(obj.centerX, obj.centerY, obj.size, obj.color);
            if (obj.pulsing) {
                obj.pulsate();
            }
        };
        return obj;
    };

    var init = function() {
        var light;
        var dark;
        var centerX;
        var centerY;
        // Creating the grid pattern of blocks, i being the number of rows, j being columns
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j += 2) {
                centerX = blockSize / 2 + blockSize * j;
                centerY = blockSize / 2 + blockSize * i + blockSize * (j % 2);
                light = createBlock(centerX + blockSize * (i % 2), centerY, lightColor);
                dark = createBlock(centerX + blockSize * !(i % 2), centerY, darkColor);
                lightBlocks.push(light);
                darkBlocks.push(dark);
            }
        }
    };

    var loop = function() {
        // Steps:
        // Fill white background
        // Draw black squares
        // Pulsate black squares
        // Repeat with the colors reversed

        ctx.fillStyle = lightMode ? lightColor : darkColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var elem;

        for (var i = 0; i < lightBlocks.length; i++) {
            elem = lightMode ? darkBlocks[i] : lightBlocks[i];
            elem.draw();
            if (shouldPulse === true) {
                elem.trigger();
            }
        }

        // Stop triggering once you've triggered it once
        if (shouldPulse === true) {
            shouldPulse = false;
        }

        // If the last block in the array is not pulsing, and it hasn't just finished pulsing, make it pulse
        if (elem.pulsing === false && justFlipped === true) {
            shouldPulse = true;
            justFlipped = false;
        }
        else if (elem.pulsing === false && justFlipped === false) {
            lightMode = !lightMode;
            justFlipped = true;
        }

        setTimeout(loop, 100/6);
    };
    init();
    loop();
})();