(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var loop = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        requestAnimationFrame(loop);
    };
    loop();
})();