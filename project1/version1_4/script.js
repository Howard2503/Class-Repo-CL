let deliveryData;  // To store delivery workers' data
let currentTime = 0;  // Current time in minutes
let maxTime = 1440;  // Total minutes in a day (24 hours * 60 minutes)
let tooltip;  // To store the tooltip element
let popup;  // To store the popup element
let workerInfo;  // To store the worker information text

function preload() {
  // Load the dataset (data.json)
  deliveryData = loadJSON('data.json');
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');  // Attach canvas to the container
  noLoop();

  // Slider setup
  let slider = select('#time-slider');
  slider.input(updateTime);

  // Tooltip setup
  tooltip = select('#tooltip');
  
  // Popup setup
  popup = select('#popup');
  workerInfo = select('#worker-info');
  const closePopup = select('#close-popup');
  closePopup.mousePressed(() => {
    popup.style('display', 'none'); // Close the popup
  });

  // Display initial time
  updateTime();
}

function draw() {
  background(240);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(50);
  text('Real-Time Visualization of Delivery Workers in Shanghai', width / 2, 30);

  // Loop through each worker and draw their path
  deliveryData.workers.forEach(worker => {
    let position = getWorkerPosition(worker, currentTime);
    let x = map(position.longitude, 121.0, 121.8, 50, width - 50);
    let y = map(position.latitude, 30.8, 31.4, height - 50, 100);

    if (worker.company === 'Meituan') {
      fill(0, 0, 255);  // Blue for Meituan
    } else if (worker.company === 'Ele.me') {
      fill(255, 255, 0);  // Yellow for Ele.me
    }

    // Draw the worker
    ellipse(x, y, 15, 15);

    // Draw dynamic path
    drawPath(worker);

    // Check if the mouse is hovering over the worker
    if (dist(mouseX, mouseY, x, y) < 10) {
      showTooltip(worker, x, y);
      if (mouseIsPressed) {
        showPopup(worker);
      }
    }
  });
}

// Function to update time from slider input
function updateTime() {
  let slider = select('#time-slider');
  currentTime = slider.value();
  
  // Update the time display
  let hours = Math.floor(currentTime / 60);
  let minutes = currentTime % 60;
  let formattedTime = nf(hours, 2) + ':' + nf(minutes, 2);
  select('#time-display').html(formattedTime);

  // Redraw the canvas with updated time
  redraw();
}

// Function to draw the delivery worker's path
function drawPath(worker) {
  strokeWeight(2);
  
  for (let i = 0; i < worker.route.length - 1; i++) {
    let start = worker.route[i];
    let end = worker.route[i + 1];

    // Calculate speed based on distance and time
    let distance = dist(start.longitude, start.latitude, end.longitude, end.latitude);
    let timeDiff = end.time - start.time;
    let speed = (timeDiff > 0) ? distance / timeDiff : 0;

    // Color coding based on speed
    let color;
    if (speed < 0.001) {  // Slow speed
      color = color(0, 255, 0); // Green
    } else if (speed >= 0.001 && speed < 0.002) { // Medium speed
      color = color(255, 255, 0); // Yellow
    } else {  // Fast speed
      color = color(255, 0, 0); // Red
    }

    stroke(color);
    let startX = map(start.longitude, 121.0, 121.8, 50, width - 50);
    let startY = map(start.latitude, 30.8, 31.4, height - 50, 100);
    let endX = map(end.longitude, 121.0, 121.8, 50, width - 50);
    let endY = map(end.latitude, 30.8, 31.4, height - 50, 100);

    line(startX, startY, endX, endY);
  }
}

// Function to calculate worker's position at a specific time
function getWorkerPosition(worker, time) {
  let route = worker.route;

  // If worker has completed their route, simulate a random walk
  if (time > route[route.length - 1].time) {
    return randomWalk(route[route.length - 1]);
  }

  // Find the two points in the route surrounding the given time
  for (let i = 0; i < route.length - 1; i++) {
    if (time >= route[i].time && time <= route[i + 1].time) {
      let t = (time - route[i].time) / (route[i + 1].time - route[i].time);  // Time interpolation
      return {
        longitude: lerp(route[i].longitude, route[i + 1].longitude, t),
        latitude: lerp(route[i].latitude, route[i + 1].latitude, t)
      };
    }
  }

  return route[route.length - 1];
}

// Function to show the tooltip with package information
function showTooltip(worker, x, y) {
  tooltip.html(`Worker ${worker.id} - Packages: ${worker.packages}`);
  tooltip.style('left', `${mouseX + 10}px`);
  tooltip.style('top', `${mouseY - 10}px`);
  tooltip.style('display', 'block');
}

// Function to show the popup with worker details
function showPopup(worker) {
  let deliveries = worker.deliveryHistory.map(d => `${d.orderId}: ${d.status}`).join('<br>');
  workerInfo.html(`Worker ID: ${worker.id}<br>Packages: ${worker.packages}<br>Estimated Arrival: ${worker.estimatedArrival}<br>Delivery History:<br>${deliveries}`);
  popup.style('display', 'block'); // Show the popup
}

// Function to simulate random walk after the worker completes their route
function randomWalk(lastPosition) {
  let newLongitude = lastPosition.longitude + random(-0.01, 0.01);
  let newLatitude = lastPosition.latitude + random(-0.01, 0.01);

  return {
    longitude: constrain(newLongitude, 121.0, 121.8),
    latitude: constrain(newLatitude, 30.8, 31.4)
  };
}
