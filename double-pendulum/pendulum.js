// References:
// http://www.physicsandbox.com/projects/double-pendulum.html
// http://www.myphysicslab.com/dbl_pendulum.html
// https://en.wikipedia.org/wiki/Double_pendulum#Lagrangian
// https://www.youtube.com/watch?v=fZKrUgm9R1o&list=PLUl4u3cNGP62esZEwffjMAsEMW_YArxYC

(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.translate(250, 250); // Translating to the center of the canvas

    var loop = function() {
        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        pendulums.logic();
        requestAnimationFrame(loop);
    };

    var drawCircle = function(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.mass, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    };
    var drawLine = function(from, to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.closePath();
    };

    var center = {x: 0, y: 0}; // Center after translating the ctx
    var System = function() {
        this.m1 = 5;
        this.m2 = 5;
        this.l1 = 50;
        this.l2 = 30;
        this.theta1 = 120;
        this.theta2 = 180;
        var dTheta1 = 0;
        var dTheta2 = 0;
        var d2Theta1 = 0;
        var d2Theta2 = 0;

        var G = this.gravity = 9.8;
        var time = 0.075;

        var pen1 = window.pen1 = {};
        var pen2 = window.pen2 = {};


        var sin = Math.sin;
        var cos = Math.cos;


        this.reset = function() {
            this.m1 = 5;
            this.m2 = 5;
            this.l1 = 30;
            this.l2 = 40;
            this.theta1 = 0;
            this.theta2 = Math.PI / 2;
            dTheta1 = 0;
            dTheta2 = 0;
            d2Theta1 = 0;
            d2Theta2 = 0;
            theta1 = 0;
            theta2 = 0;
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
            dTheta1 += d2Theta1 * time;
            dTheta2 += d2Theta2 * time;
            theta1 += dTheta1 * time;
            theta2 += dTheta2 * time;

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
            drawCircle(pen1);
            drawCircle(pen2);
            drawLine(center, pen1);
            drawLine(pen1, pen2);
        };
    };

    var pendulums = new System();
    window.onload = function() {
        var gui = new dat.GUI();
        gui.add(pendulums, 'm1', 1, 20).listen();
        gui.add(pendulums, 'm2', 1, 20).listen();
        gui.add(pendulums, 'l1', 10, 100).listen();
        gui.add(pendulums, 'l2', 10, 100).listen();
        gui.add(pendulums, 'theta1', 0, 360).listen();
        gui.add(pendulums, 'theta2', 0, 360).listen();
        gui.add(pendulums, 'reset');
    };


    loop();
})();