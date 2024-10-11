let deliveryData; // To store the delivery workers data

function preload() {
  // Load the dataset (data.json)
  deliveryData = loadJSON('data.json');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container'); // Append the canvas to the container
  noLoop(); // Prevent continuous draw loop
}

function draw() {
  background(240);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(50);
  text('Real-Time Visualization of Delivery Workers in Shanghai', width / 2, 30);

  // Draw each worker as a circle
  deliveryData.workers.forEach(worker => {
    if (worker.company === 'Meituan') {
      fill(0, 0, 255); // Blue for Meituan
    } else if (worker.company === 'Ele.me') {
      fill(255, 255, 0); // Yellow for Ele.me
    }
    
    // Map the worker's coordinates (longitude and latitude) to x, y positions on canvas
    let x = map(worker.longitude, 121.0, 121.8, 50, width - 50);  // Example mapping
    let y = map(worker.latitude, 30.8, 31.4, height - 50, 100);    // Example mapping
    
    ellipse(x, y, 15, 15); // Draw the worker as a circle
  });
}
