const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// number of samples, use canvas width as a reasonable value
const numSamples = canvas.width;

// plot sine and cosine curves, can be other functions and domains as well
plotFunction(x => Math.sin(x), 0, 4 * Math.PI, "red");
plotFunction(x => Math.cos(x), 0, 4 * Math.PI, "blue");

// draw some labels
drawLabel("sin", 130, 50, "red");
drawLabel("cos", 80, 170, "blue");


// main plotter function, all others are helper functions
function plotFunction(fn, xMin, xMax, color = "black") {
    console.assert(xMax > xMin);

    let points = [],
        dx = (xMax - xMin) / numSamples,
        yMin = Infinity,
        yMax = -Infinity;

    // calculate the range of values (y) over the input domain (x)
    for (let x = xMin; x <= xMax; x += dx) {
        let y = fn(x);
        points.push([x, y]);

        yMin = Math.min(y, yMin);
        yMax = Math.max(y, yMax);
    }

    // transform into canvas coordinates
    let canvasPoints = points.map(([x, y]) => {
        return [
            transform(x, xMin, xMax, 0, canvas.width - 1),
            transform(y, yMin, yMax, canvas.height - 1, 1)
        ];
    });

    // join canvas points with lines
    drawLines(canvasPoints, color);

    // draw the X and Y axis
    drawXAxis(yMin, yMax);
    drawYAxis(xMin, xMax);
}


// joins canvas points with lines, to plot the curve
function drawLines(points, color) {
    for (let i = 0; i < points.length - 1; i++) {
        let crt = points[i],
            next = points[i + 1];

        line(...crt, ...next, color);
    }
}


// draws a line between two canvas points, with the given color and width
function line(x1, y1, x2, y2, color = "black", width = 1) {
    ctx.beginPath();

    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}


// transforms a value from one range, into a value from a different range
// for example x coordinates from function-domain to canvas, or y coordinates from function-range to canvas
function transform(val, min1, max1, min2, max2) {
    let p = (val - min1) / (max1 - min1);
    return min2 + p * (max2 - min2);
}


// draws the horizontal axis
function drawXAxis(yMin, yMax) {
    let y = transform(0, yMin, yMax, canvas.height - 1, 0);

    y = clamp(y, 0, canvas.height - 1);
    line(0, y, canvas.width - 1, y, "gray");
}


// draws the vertical axis
function drawYAxis(xMin, xMax) {
    let x = transform(0, xMin, xMax, 0, canvas.width - 1);

    x = clamp(x, 0, canvas.width - 1);
    line(x, 0, x, canvas.height - 1, "gray");
}


// draws a label
function drawLabel(txt, x, y, color = "black") {
    ctx.font = "15pt Calibri";
    ctx.fillStyle = color;
    ctx.fillText(txt, x, y);
}


// clamps a number between a lower and upper limit
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}