// References:
// http://www.physicsandbox.com/projects/double-pendulum.html
// http://www.myphysicslab.com/dbl_pendulum.html
// https://en.wikipedia.org/wiki/Double_pendulum#Lagrangian
// https://www.youtube.com/watch?v=fZKrUgm9R1o&list=PLUl4u3cNGP62esZEwffjMAsEMW_YArxYC
// https://www.youtube.com/watch?v=q87L9R9v274
// https://en.wikipedia.org/wiki/Euler_method

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2); // Translating to the center of the canvas
    var extraSystems = []; // An array of pendulum systems that aren't controlled by dat.gui

    var loop = function() {
        ctx.fillStyle = 'black';
        ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        pendulums.logic();
        for (var i = 0; i < extraSystems.length; i++) {
            extraSystems[i].logic();
        }
        requestAnimationFrame(loop);
    };

    var drawCircle = function(circle, color) {
        // If you're drawing the controlled pendulum, draw it a different color
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.mass, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    };
    var drawLine = function(from, to, color) {
        // If you're drawing the controlled pendulum's line, draw it a different color
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    };
    var drawTrace = function(trace, pen, color, show) {
        trace.lineTo(pen.x, pen.y);
        ctx.strokeStyle = color;
        if (show) {
            ctx.stroke(trace);
        }
    };

    var range = function(from, to) {
        // Return a random value between the given range
        return from + Math.random() * (to - from);
    };

    var center = {x: 0, y: 0}; // Center after translating the ctx

    var tempTime;
    var controls = {
        time: 0.075,
        reset: function() {
            pendulums.reset();
            extraSystems = [];
            controls.time = 0.075;
        },
        toggle: function() {
            if (controls.time === 0) {
                controls.time = tempTime;
            }
            else {
                tempTime = controls.time;
                controls.time = 0;
            }
        },
        addSystem: function() {
            extraSystems.push(new System());
        },
        showSystem: true,
        showTrace: true
    };

    var System = function(controlled) {
        var prev = {};
        this.controlled = controlled;

        this.color = 'rgb(' + ~~range(0, 255) + ',' + ~~range(0, 255) + ',' + ~~range(0, 255) + ')';
        console.log(this.color);

        this.m1 = range(1, 20);
        this.m2 = range(1, 20);
        this.l1 = range(10, 100);
        this.l2 = range(10, 100);
        this.theta1 = range(0, 360);
        this.theta2 = range(0, 360);
        var dTheta1 = 0;
        var dTheta2 = 0;
        var d2Theta1 = 0;
        var d2Theta2 = 0;

        var G = this.gravity = 9.8;

        var pen1 = window.pen1 = {};
        var pen2 = window.pen2 = {};


        var sin = Math.sin;
        var cos = Math.cos;

        var theta1 = this.theta1 * Math.PI / 180;
        var theta2 = this.theta2 * Math.PI / 180;

        pen1.x = this.l1 * sin(theta1);
        pen1.y = this.l1 * cos(theta1);

        pen2.x = pen1.x + this.l2 * sin(theta2);
        pen2.y = pen1.y + this.l2 * cos(theta2);

        this.trace = new Path2D();
        this.trace.moveTo(pen2.x, pen2.y);

        this.reset = function() {
            this.m1 = range(1, 20);
            this.m2 = range(1, 20);
            this.l1 = range(10, 100);
            this.l2 = range(10, 100);
            this.theta1 = range(0, 360);
            this.theta2 = range(0, 360);
            dTheta1 = 0;
            dTheta2 = 0;
            d2Theta1 = 0;
            d2Theta2 = 0;
            this.trace = new Path2D();
            this.color = 'rgb(' + ~~range(0, 255) + ',' + ~~range(0, 255) + ',' + ~~range(0, 255) + ')';
        };

        this.logic = function() {
            // Aliasing properties
            var m1 = this.m1;
            var m2 = this.m2;
            var l1 = this.l1;
            var l2 = this.l2;
            var theta1 = this.theta1 * Math.PI / 180;
            var theta2 = this.theta2 * Math.PI / 180;

            var mu = 1 + m1 / m2;

            d2Theta1 = (G * (sin(theta2) * cos(theta1 - theta2) - mu * sin(theta1)) - (l2 * dTheta2 * dTheta2 + l1 * dTheta1 * dTheta1 * cos(theta1 - theta2)) * sin(theta1 - theta2)) / (l1 * (mu - cos(theta1 - theta2) * cos(theta1 - theta2)));
            d2Theta2 = (G * mu * (sin(theta1) * cos(theta1 - theta2) - sin(theta2)) + (mu * l1 * dTheta1 * dTheta1 + l2 * dTheta2 * dTheta2 * cos(theta1 - theta2)) * sin(theta1 - theta2)) / (l2 * (mu - cos(theta1 - theta2) * cos(theta1 - theta2)));
            dTheta1 += d2Theta1 * controls.time;
            dTheta2 += d2Theta2 * controls.time;
            theta1 += dTheta1 * controls.time;
            theta2 += dTheta2 * controls.time;

            theta1 %= 2 * Math.PI;
            theta2 %= 2 * Math.PI;
            dTheta1 %= 2 * Math.PI;
            dTheta2 %= 2 * Math.PI;

            this.theta1 = theta1 * 180 / Math.PI;
            this.theta2 = theta2 * 180 / Math.PI;

            this.theta1 %= 360;
            this.theta2 %= 360;
            if (this.theta1 < -5) {
                this.theta1 = 360 + this.theta1;
            }
            if (this.theta2 < -5) {
                this.theta2 = 360 + this.theta2;
            }

            // Update the pendulum's position now
            pen1.x = l1 * sin(theta1);
            pen1.y = l1 * cos(theta1);
            pen1.mass = m1;

            pen2.x = pen1.x + l2 * sin(theta2);
            pen2.y = pen1.y + l2 * cos(theta2);
            pen2.mass = m2;

            // Draw ALL THE THINGS!
            if (controls.showSystem) {
                drawCircle(pen1, this.color);
                drawCircle(pen2, this.color);
                drawLine(center, pen1, this.color);
                drawLine(pen1, pen2, this.color);
            }

            drawTrace(this.trace, pen2, this.color, controls.showTrace); // Got to continue tracing it, but just not actually draw it

        };
    };

    var pendulums = new System(true);
    window.onload = function() {
        var gui = new dat.GUI();
        var penGui = gui.addFolder('Main pendulum');
        var genControls = gui.addFolder('General controls');
        penGui.add(pendulums, 'm1', 1, 20).listen();
        penGui.add(pendulums, 'm2', 1, 20).listen();
        penGui.add(pendulums, 'l1', 10, 100).listen();
        penGui.add(pendulums, 'l2', 10, 100).listen();
        penGui.add(pendulums, 'theta1', 0, 360).listen();
        penGui.add(pendulums, 'theta2', 0, 360).listen();
        penGui.addColor(pendulums, 'color');
        genControls.add(controls, 'showSystem');
        genControls.add(controls, 'showTrace');
        genControls.add(controls, 'time', 0.001, 0.5).listen();
        genControls.add(controls, 'toggle');
        genControls.add(controls, 'reset');
        genControls.add(controls, 'addSystem');

        penGui.open();
        genControls.open();
    };


    loop();
})();