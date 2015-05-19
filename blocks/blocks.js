// Recreating this GIF https://i.imgur.com/B5xX6X4.gif
// Warning: I made this challenging for myself by limiting myself to certain data structures like only 1-dimensional arrays
// As a result of that, the code may be too convoluted.

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var blockSize = 50;
    var smallestSize = 30;
    var lightBlocks = [];
    var darkBlocks = [];
    var lightColor = '#dcdcd2';
    var darkColor = '#262626';
    var blur = 0.3;
    var alpha = 1 / blur;
    var shrinkMs = 300; // In ms, how long each square stays shrunken

    var lightMode = true;
    var justFlipped = true;
    var shouldPulse = false;

    var rows = 8;
    var columns = 8;

    var triggerSum = 0;
    var ticks = 0;

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
        obj.shrinking = 1; // Changed to -1 when it's growing
        obj.pulsing = false;
        obj.trigger = function() {
            obj.shrinking = 1;
            obj.done = false;
            obj.pulsing = true;
        }
        obj.pulsate = function() {
            // console.log('Pulsating', obj.size, obj.shrinking);
            obj.pulsing = true;
            obj.size -= obj.shrinking * 2;
            if (obj.size < smallestSize) {
                // console.log('At smallest');
                obj.shrinking = 0;
                setTimeout(function() {
                    obj.shrinking = -1;
                }, shrinkMs);
            }
            else if (obj.size > blockSize) {
                // console.log('Done', obj.shrinking, obj.size);
                obj.done = true;
                obj.size = blockSize;
                obj.pulsing = false;
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

    var resetBlocks = function() {
        for (var i = 0; i < lightBlocks.length; i++) {
            lightBlocks[i].done = false;
            darkBlocks[i].done = false;
        }
    };

    var loop = function() {
        // Steps:
        // Fill white background
        // Draw black squares
        // Pulsate black squares
        // Repeat with the colors reversed

        ticks++;

        ctx.fillStyle = lightMode ? 'rgba(220, 220, 210, ' + alpha + ')' : 'rgba(38, 38, 38, ' + alpha + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var elem;

        for (var i = 0; i < lightBlocks.length; i++) {
            elem = lightMode ? darkBlocks[i] : lightBlocks[i];
            elem.draw();
            if (elem.pulsing === false && elem.done !== true && shouldPulse === true && elem.centerX + elem.centerY <= triggerSum) {
                elem.trigger();
            }
        }

        if (shouldPulse === true && ticks >= 10) {
            ticks = 0;
            triggerSum += blockSize * rows / 2;
        }

        // Stop triggering once you've triggered all blocks in the array
        if (elem.pulsing === true) {
            shouldPulse = false;
        }

        // If the last block in the array is not pulsing, and it hasn't already pulsed, make them pulse
        if (elem.pulsing === false && justFlipped === true) {
            shouldPulse = true;
            justFlipped = false;
        }
        else if (elem.pulsing === false && elem.done === true && shouldPulse === false && justFlipped === false) {
            justFlipped = true;
            setTimeout(function() {
                // console.log('Flipped', elem.shrinking);
                ticks = 0;
                lightMode = !lightMode;
                triggerSum = 0;
                resetBlocks(); // Make elem.done false so they can pulse again later
            }, 200);
        }

        setTimeout(loop, 100/6);
    };
    init();
    loop();
})();