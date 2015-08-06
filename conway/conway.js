// From Wikipedia, here are the four rules:
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

(function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var BLOCK_SIZE = 15;
    var ROWS = 10;
    var COLUMNS = 10;

    // Using the convention B3/S23, which means birth if 3 neighbours, stay if 2 or 3 neighbours, kill otherwise
    var BORN_PARAMS = [3];
    var STAY_PARAMS = [2, 3];

    var ALIVE_COLOR = '#4E8EE4';
    var DEAD_COLOR = '#CCCCCC';

    var MAX_TICKS = 10; // Number of ticks to wait between steps
    var ticks = 0;
    
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    var playing = false;
    var mouseDown = false;

    // Multi-dimensional array. 0 indicates dead, 1 indicates alive
    var grid = [];

    // Holds the changes to be applied in the next step (because all changes have to be applied simultaneously)
    var changes = {};

    var init = function() {
        for (var i = 0; i < ROWS; i++) {
            grid[i] = [];
            for (var j = 0; j < COLUMNS; j++) {
                grid[i][j] = 0;
            }
        }
    };

    var getNeighbours = function(row, column) {
        // Given a certain position, it returns all 8 neighbours (or less for edges/corners)
        var neighbours = [];
        var currentRow;
        var currentColumn;
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = column - 1; j <= column + 1; j++) {
                // We want to loop around the board
                currentRow = i % ROWS;
                currentColumn = j % COLUMNS;
                if (currentRow < 0) {
                    currentRow = ROWS + currentRow;
                }
                if (currentColumn < 0) {
                    currentColumn = COLUMNS + currentColumn;
                }

                if (currentRow in grid && currentColumn in grid[currentRow] && !(currentRow == row && currentColumn == column)) {
                    console.log('a');
                    neighbours.push(grid[currentRow][currentColumn]);
                }
            }
        }
        return neighbours.reduce(function(prev, next) {
            return prev + next;
        });
    };

    var birth = function(row, column, neighbours) {
        if (BORN_PARAMS.indexOf(neighbours) != -1) {
            changes[row + ',' + column] = 1;
        }
    };

    var kill = function(row, column, neighbours) {
        if (STAY_PARAMS.indexOf(neighbours) == -1) {
            changes[row + ',' + column] = 0;
        }
    };

    var step = function() {
        // What happens at each step in time. This function evaluates all 4 rules
        var neighbours;
        var row;
        var column;

        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < COLUMNS; j++) {
                neighbours = getNeighbours(i, j);

                birth(i, j, neighbours);
                kill(i, j, neighbours);
            }
        }

        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                nums = key.split(',');
                row = nums[0];
                column = nums[1];

                grid[row][column] = changes[key];
            }
        }
        changes = {};
    };

    var drawAll = function() {
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < COLUMNS; j++) {
                if (grid[i][j] === 0) {
                    ctx.fillStyle = DEAD_COLOR;
                }
                else {
                    ctx.fillStyle = ALIVE_COLOR;
                }
                ctx.fillRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1);
            }
        }
    };

    var handleClick = function(e) {
        if (mouseDown === false) {
            return;
        }
        var row = Math.floor(e.pageX / BLOCK_SIZE);
        var column = Math.floor(e.pageY / BLOCK_SIZE);
        if (row < ROWS && column < COLUMNS) {
            grid[row][column] = 1;
        }

    };

    var handleKey = function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 32) {
            playing = !playing;
        }
    };

    var loop = function() {
        ticks++;
        drawAll();

        if (playing && ticks > MAX_TICKS) {
            step();
            ticks = 0;
        }
        requestAnimationFrame(loop);
    };

    canvas.addEventListener('mousedown', function(e) {
        mouseDown = true;
        handleClick(e);
    }, false);
    canvas.addEventListener('mousemove', handleClick, false);
    canvas.addEventListener('mouseup', function(e) {
        mouseDown = false;
    }, false);
    document.body.addEventListener('keydown', handleKey, false);
    init();
    loop();

})();