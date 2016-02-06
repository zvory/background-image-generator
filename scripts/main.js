var Queue;
var canvas;
var ctx;

var dependenciesLoaded = false;
var windowLoaded= false;

// Default values
var WIDTH = 480;
var HEIGHT = 270;

requirejs(["Queue"], function(util) {
    Queue = util;
    dependenciesLoaded=true;
    if (windowLoaded){
        setInterval(randomWalk, 10);
        setInterval(reset, 5000);
    }
});

function begin () {
    windowLoaded=true;
    canvas = document.getElementById("canvas");

    ctx = canvas.getContext("2d");

    function resizeCanvas() {
            canvas.width = window.innerWidth - 4;
            canvas.height = window.innerHeight -4;
            WIDTH = Math.floor(canvas.width/4);
            HEIGHT= Math.floor(canvas.height/4);
    }
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas, false);
    if (dependenciesLoaded){
        setInterval(randomWalk, 10);
        setInterval(reset, 5000);
    }
}

function randomInRange(min, max) {
        return min + Math.random() * (max - min);
}

var delta = 5;
var minHue= randomInRange(0,300);
var minLightness = randomInRange(20, 70);
var counter=minHue;

function get_random_color() {
    var h = counter;
    var s = randomInRange(30, 70);
    var l = randomInRange(minLightness, minLightness+30);
    counter +=delta; 
    if (counter > minHue+60|| counter < 0)
        counter =minHue;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

var x=0;
var y=0;

function setStartPosition(){
    if (Math.round(Math.random())){
        x = Math.floor(Math.random() * WIDTH);
        y = (Math.round(Math.random())) ? HEIGHT: 0;
    }
    else {
        y = Math.round(Math.random() * WIDTH);
        x = (Math.round(Math.random())) ? HEIGHT: 0;
    }

}

function make2DArr (width, height) {
        return (new Array(width)).fill(false).map(function () {
            return new Array(height).fill(false);
        });
}

function randomWalk () {
    if (!dependenciesLoaded || !windowLoaded){
        return;
    }

    var grid = make2DArr(WIDTH, HEIGHT);

    var steps = WIDTH * HEIGHT * 8;
    for (var i=0; i< steps; i++){
        switch(Math.floor (Math.random() * 4)) {
            case 0:
                x++;
                break;
            case 1:
                x--;
                break;
            case 2:
                y++;
                break;
            case 3:
                y--;
                break;
        }
        x = Math.floor(Math.abs((x>=WIDTH) ? WIDTH -1: x));
        y = Math.floor(Math.abs((y>=HEIGHT) ? HEIGHT-1: y));
        grid[x][y] = true;
    }

    var toDraw = findLargestSpace(grid);
    if (toDraw !== null)
        drawToCanvas(toDraw);
}

function findLargestSpace (grid) {
    var filled = [];
    var counter = 0;
    var start = new Date().getTime();
    while (counter < 8 && (new Date().getTime() - start) < 40 ) {
        counter ++;
        filled = make2DArr(WIDTH, HEIGHT);
        var size = 0;
        var toVisit= new Queue();
        var x = Math.floor(Math.random() * WIDTH);
        var y = Math.floor(Math.random() * HEIGHT);
        toVisit.enqueue({x:x, y:y});
        while(!toVisit.isEmpty()){
            var loc = toVisit.dequeue();
            if (!(loc.x >= WIDTH || loc.x <0 || loc.y >= HEIGHT|| loc.y < 0)){
                var cell = grid[loc.x][loc.y];
                if (cell === false && filled[loc.x][loc.y] === false){
                    size ++;
                    filled[loc.x][loc.y] = true;
                    toVisit.enqueue({x:loc.x+1, y:loc.y});
                    toVisit.enqueue({x:loc.x-1, y:loc.y});
                    toVisit.enqueue({x:loc.x, y:loc.y+1});
                    toVisit.enqueue({x:loc.x, y:loc.y-1});
                }
            }
        }
        if (size > 1000){
            return filled;
        }
    }
    console.log(new Date().getTime() - start);
    return null;
}

function drawToCanvas(grid) {
    ctx.fillStyle = get_random_color();
    ctx.globalAlpha=0.5;
    grid.forEach(function (arr , x) {
        arr.forEach(function (val, y) {
            if (val)
                ctx.fillRect(x*4, y*4, 4, 4);
        });
    });
}

if (pageIsLoaded) {
    begin();
} else {
    window.addEventListener('load',begin);
}

function reset () {
    minHue= randomInRange(0,300);
    minLightness = randomInRange(20, 70);
    counter=minHue;
    ctx.clearRect(0, 0, WIDTH*4, HEIGHT*4);
}
