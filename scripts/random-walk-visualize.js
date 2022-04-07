var Queue;
var canvas;
var ctx;

var dependenciesLoaded = false;
var windowLoaded = false;

// Default values
var WIDTH = 480;
var HEIGHT = 270;

var prints = 0;

requirejs(["Queue"], function (util) {
    Queue = util;
    dependenciesLoaded = true;
    if (windowLoaded) {
        randomWalk()
    }
});

function onWindowLoad() {
    windowLoaded = true;
    canvas = document.getElementById("canvas");

    ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth - 4;
        canvas.height = window.innerHeight - 4;
        WIDTH = Math.floor(canvas.width / 4);
        HEIGHT = Math.floor(canvas.height / 4);
        drawn = make2DArr(WIDTH, HEIGHT)
    }
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas, false);
    if (dependenciesLoaded) {
        randomWalk()
    }
}

function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}

var delta = 5;
var minHue = randomInRange(0, 300);
var minLightness = randomInRange(20, 70);
var counter = minHue;

function get_random_color() {
    var h = counter;
    var s = randomInRange(30, 70);
    var l = randomInRange(minLightness, minLightness + 30);
    counter += delta;
    if (counter > minHue + 60 || counter < 0)
        counter = minHue;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function make2DArr(width, height) {
    return (new Array(width)).fill(false).map(function () {
        return new Array(height).fill(false);
    });
}


var delta = 1;
var minHue = randomInRange(0, 300);
var minLightness = randomInRange(20, 70);
var counter = minHue;

function get_random_color() {
    var h = counter;
    var s = randomInRange(30, 70);
    var l = randomInRange(minLightness, minLightness + 30);
    counter += delta;
    if (counter > minHue + 900 || counter < 0)
        counter = minHue;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}


var otherdelta = 1;
var otherminHue = randomInRange(0, 300);
var otherminLightness = randomInRange(20, 70);
var othercounter = minHue;

function get_other_random_color() {
    var h = othercounter;
    var s = randomInRange(30, 70);
    var l = randomInRange(otherminLightness, otherminLightness + 30);
    othercounter += otherdelta;
    if (othercounter > otherminHue + 900 || othercounter < 0)
    othercounter = otherminHue;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}


var steps = WIDTH * HEIGHT * 8;


var i = 1e6
var lookupTable=[]

const populateLookupTable = () => {
    i = 1e6
    for (; i--;) {
        lookupTable.push(Math.random());
    }
}
populateLookupTable()
function lookup() {
    if (i >= lookupTable.length-1) {
        populateLookupTable()
    }
    return ++i >= lookupTable.length ? lookupTable[i = 0] : lookupTable[i];
}



function randomWalk(grid = make2DArr(WIDTH, HEIGHT), stepsTaken = 0, x = 0, y = 0) {
    if (!dependenciesLoaded || !windowLoaded) {
        return;
    }

    if (stepsTaken === 0) {
        resetCanvas()
    }

    if (stepsTaken > steps) {
        pickSpotForLargestSpace(grid)
    } else {
        const toColor = []
        const perIterationSteps = 5000
        for (let i = 0; i < perIterationSteps; i++) {
            switch (Math.floor(lookup() * 4)) {
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
            x = Math.floor(Math.abs((x >= WIDTH) ? WIDTH - 1 : x));
            y = Math.floor(Math.abs((y >= HEIGHT) ? HEIGHT - 1 : y));
            const randomColor = get_random_color()
            toColor.push([x, y, randomColor])
            grid[x][y] = randomColor;
        }
        for (const elt of toColor) {
            const [xToColor, yToColor, color] = elt

            ctx.fillStyle = color
            ctx.fillRect(xToColor * 4, yToColor * 4, 4, 4);
        }
        setTimeout(() => randomWalk(grid, stepsTaken + perIterationSteps, x, y), 0)
    }
}

const drawCrossOn = (x, y) => {
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = 'hsl(0, 100%, 1%)';
        ctx.fillRect((x + i) * 4, y * 4, 4, 4);
        ctx.fillRect((x - i) * 4, y * 4, 4, 4);
        ctx.fillRect((x) * 4, (y - i) * 4, 4, 4);
        ctx.fillRect((x) * 4, (y + i) * 4, 4, 4);
    }
}

const redrawRandomWalkGrid = (grid) => {
    resetCanvas()
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (grid[x][y] && grid[x][y].startsWith('hsl')) {
                ctx.fillStyle = grid[x][y]
                ctx.fillRect(x * 4, y * 4, 4, 4)
            }
        }
    }
}

const pickSpotForLargestSpace = (grid, attempts = 0) => {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)
    drawCrossOn(x, y)

    // it's empty, bfs
    if (!!!grid[x][y]) {
        setTimeout(() => {
            redrawRandomWalkGrid(grid)
            bfs(grid, x, y)
        }, 1000)
    } else {
        if (attempts === 0) {
            setTimeout(() => {
                redrawRandomWalkGrid(grid)
                pickSpotForLargestSpace(grid, attempts = 1)
            }, 1000)
        } else {
            setTimeout(randomWalk, 1000)
        }
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

let drawn

const drawDrawn = () => {
    resetCanvas()
    ctx.globalAlpha = 0.5;

    for (let i = 0; i < WIDTH; i ++){
        for (let j =0; j < HEIGHT; j++) {
            if (!!drawn[i][j]) {
                for (const color of drawn[i][j]){
                    ctx.fillStyle=color
                    ctx.fillRect(i * 4, j * 4, 4, 4);                   
                }
            } 
        }
    }
    ctx.globalAlpha = 1;
}


const bfs = (grid, x, y, toVisit = [], size = 0, filled = make2DArr(WIDTH, HEIGHT), color = get_other_random_color(), stepsToTake = 100) => {
    toVisit.push({ x: x, y: y })

    let stepsTaken = 0
    let lastVisited
    while (toVisit.length !== 0) {
        stepsTaken++
        var loc = toVisit.shift();
        lastVisited = loc

        if (stepsTaken % 100 === 0) {
            shuffle(toVisit)
        }

        if (stepsTaken > stepsToTake) {
            const newSteps = stepsToTake > 10000 ? stepsToTake *1.2 : stepsToTake *2
            setTimeout(() => bfs(grid, loc.x, loc.y, toVisit, size, filled, color, newSteps), 0)
            return
        }

        if (!(loc.x >= WIDTH || loc.x < 0 || loc.y >= HEIGHT || loc.y < 0)) {
            var cell = grid[loc.x][loc.y];
            if (cell === false && filled[loc.x][loc.y] === false) {
                size++;
                filled[loc.x][loc.y] = color;

                toVisit.push({ x: loc.x + 1, y: loc.y })
                toVisit.push({ x: loc.x - 1, y: loc.y })
                toVisit.push({ x: loc.x, y: loc.y + 1 })
                toVisit.push({ x: loc.x, y: loc.y - 1 })

                ctx.globalAlpha = 0.5;
                ctx.fillStyle = color
                ctx.fillRect(loc.x * 4, loc.y * 4, 4, 4)
            }
        }
    }
    // toVisit is empty, we are done
    if (size > WIDTH * HEIGHT / 50) {
        for (let i = 0; i < WIDTH; i ++){
            for (let j =0; j < HEIGHT; j++) {
                if (!!filled[i][j]) {
                    if (!!drawn[i][j]) {
                        drawn[i][j].push(color)
                    } else {
                        drawn[i][j] = [color]
                    }
                }
            }
        }
        console.table(drawn)
        setTimeout(() => {
            drawDrawn()
            setTimeout(() => {
                randomWalk(grid = make2DArr(WIDTH, HEIGHT), stepsTaken = 0,x= lastVisited.x, y=lastVisited.y)    
            }, 1000)
        }, 0000)
    } else {
        setTimeout(() => {
            redrawRandomWalkGrid(grid)
            pickSpotForLargestSpace(grid, attempts = 1)
        }, 1000)
    }
}

function findLargestSpace(grid, randomWalkGrid) {
    var filled = [];
    var counter = 0;
    while (counter < 2) {
        counter++;
        filled = make2DArr(WIDTH, HEIGHT);
        var size = 0;
        var toVisit = new Queue();
        var x = Math.floor(Math.random() * WIDTH);
        var y = Math.floor(Math.random() * HEIGHT);

        drawCrossOn(x, y)

        toVisit.enqueue({ x: x, y: y });
        while (!toVisit.isEmpty()) {
            var loc = toVisit.dequeue();
            if (!(loc.x >= WIDTH || loc.x < 0 || loc.y >= HEIGHT || loc.y < 0)) {
                var cell = grid[loc.x][loc.y];
                if (cell === false && filled[loc.x][loc.y] === false) {
                    size++;
                    filled[loc.x][loc.y] = true;
                    toVisit.enqueue({ x: loc.x + 1, y: loc.y });
                    toVisit.enqueue({ x: loc.x - 1, y: loc.y });
                    toVisit.enqueue({ x: loc.x, y: loc.y + 1 });
                    toVisit.enqueue({ x: loc.x, y: loc.y - 1 });
                }
            }
        }
        if (size > WIDTH * HEIGHT / 50) {
            return filled;
        }
    }
    return null;
}

function drawToCanvas(grid) {
    ctx.fillStyle = get_random_color();
    ctx.globalAlpha = 0.5;
    grid.forEach(function (arr, x) {
        arr.forEach(function (val, y) {
            if (val)
                ctx.fillRect(x * 4, y * 4, 4, 4);
        });
    });
}

function resetCanvas() {
    prints = 0;
    minHue = randomInRange(0, 300);
    minLightness = randomInRange(20, 70);
    counter = minHue;
    ctx.globalAlpha=1
    ctx.clearRect(0, 0, WIDTH * 4, HEIGHT * 4);
}

if (pageIsLoaded) {
    onWindowLoad();
} else {
    window.addEventListener('load', onWindowLoad);
}

