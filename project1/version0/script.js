let mapWidth = 800;
let mapHeight = 600;
let workerData = [];

// Load the delivery worker data from the dataset
function preload() {
    loadJSON('data.json', (data) => {
        workerData = data;
    });
}

// Setup the canvas using p5.js
function setup() {
    let canvas = createCanvas(mapWidth, mapHeight);
    canvas.parent('map-canvas');  // Changed from 'map' to 'map-canvas'
    background(200);
}

// Draw the workers on the canvas
function draw() {
    // Map background
    background(50, 50, 100);

    // Add a grid to represent Shanghai
    stroke(255);
    for (let i = 0; i < width; i += 100) {
        line(i, 0, i, height);
    }
    for (let j = 0; j < height; j += 100) {
        line(0, j, width, j);
    }

    // Plot the delivery workers
    workerData.forEach(worker => {
        fill(0, 255, 0);  // Color for workers
        ellipse(worker.x, worker.y, 10, 10);  // Draw worker as a circle
    });
}

// Refresh button event listener
document.getElementById('refresh-btn').addEventListener('click', () => {
    console.log('Map refreshed');
    draw();
});
