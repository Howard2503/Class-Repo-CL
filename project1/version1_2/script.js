let deliveryData;  // To store delivery workers' data
let currentTime = 0;  // Current time in minutes
let maxTime = 1440;  // Total minutes in a day (24 hours * 60 minutes)
let playbackInterval;  // Variable to store the interval for automatic playback
let isPlaying = false;  // State to check if the slider is playing

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

  // Play button setup
  let playButton = select('#play-button');
  playButton.mousePressed(togglePlayback);

  // Display initial time
  updateTime();
}

function draw() {
  background(240);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(50);
  text('Real-Time Visualization of Delivery Workers in Shanghai', width / 2, 30);

  // Draw each worker at their current position based on the selected time
  deliveryData.workers.forEach(worker => {
    let position = getWorkerPosition(worker, currentTime);

    if (worker.company === 'Meituan') {
      fill(0, 0, 255);  // Blue for Meituan
    } else if (worker.company === 'Ele.me') {
      fill(255, 255, 0);  // Yellow for Ele.me
    }

    // Map worker's coordinates (longitude and latitude) to canvas coordinates
    let x = map(position.longitude, 121.0, 121.8, 50, width - 50);
    let y = map(position.latitude, 30.8, 31.4, height - 50, 100);
    
    ellipse(x, y, 15, 15);  // Draw the worker as a circle
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

// Toggle playback function
function togglePlayback() {
  let slider = select('#time-slider');
  
  if (!isPlaying) {
    // Start playback
    isPlaying = true;
    playbackInterval = setInterval(() => {
      currentTime++;
      if (currentTime > maxTime) {
        currentTime = 0; // Reset to start
      }
      slider.value(currentTime); // Update slider
      updateTime(); // Update display
    }, 100); // Change the interval for speed (100ms for 1 minute)
    
    select('#play-button').html('Stop');
  } else {
    // Stop playback
    clearInterval(playbackInterval);
    isPlaying = false;
    select('#play-button').html('Play');
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

  // If time is out of route range, return the last point
  return route[route.length - 1];
}

// Function to simulate random walk after the worker completes their route
function randomWalk(lastPosition) {
  let newLongitude = lastPosition.longitude + random(-0.01, 0.01);  // Small random changes
  let newLatitude = lastPosition.latitude + random(-0.01, 0.01);

  return {
    longitude: constrain(newLongitude, 121.0, 121.8),  // Keep within bounds
    latitude: constrain(newLatitude, 30.8, 31.4)
  };
}
