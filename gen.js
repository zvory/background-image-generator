var canvas;
var ctx;

//code.stephenmorley.org
function Queue(){var a=[],b=0;this.getLength=function(){return a.length-b};this.isEmpty=function(){return 0==a.length};this.enqueue=function(b){a.push(b)};this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};this.peek=function(){return 0<a.length?a[b]:void 0}};
//end stephemorley code

var WIDTH = 400;
var HEIGHT = 400;

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.globalAlpha=0.5;
    setInterval(drawWalk, 50);
};
function rand(min, max) {
        return min + Math.random() * (max - min);
}
function get_random_color() {
    //var h = 200+ rand(1, 90); 
    //var s = rand(0, 100);
    //var l = rand(30, 100);
    var h = 220;
    var s = 100;
    var l = rand(10, 80);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}
function drawWalk () {
    var x;
    var y;
    if (Math.round(Math.random())){
        x = Math.floor(Math.random() * WIDTH);
        y = (Math.round(Math.random())) ? HEIGHT: 0;
    }
    else {
        y = Math.round(Math.random() * WIDTH);
        x = (Math.round(Math.random())) ? HEIGHT: 0;
    }


    var grid = (new Array(WIDTH)).fill(1).map(function () {
        return new Array(HEIGHT).fill(false);
    });

    for (var steps =0; steps < 50000; steps ++){
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
    ctx.fillStyle =get_random_color();
    drawToCanvas(findLargestSpace(grid));
}

function findLargestSpace (grid) {
    var filled = [];
    var counter = 0;
    while (counter < 1) {
        counter ++;
        filled = (new Array(WIDTH)).fill(1).map(function () {
            return new Array(HEIGHT).fill(false);
        });
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
        if (size > 5000)
            break;
    }
    return filled;
}

function drawToCanvas(grid) {
    grid.forEach(function (arr , x) {
        arr.forEach(function (val, y) {
            if (val)
                ctx.fillRect(x, y, 1, 1);
        });
    });
}
