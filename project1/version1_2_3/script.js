let deliveryData;  // To store delivery workers' data
let currentTime = 0;  // Current time in minutes
let maxTime = 1440;  // Total minutes in a day (24 hours * 60 minutes)

function preload() {
  // Load the dataset (data.json)
  deliveryData = loadJSON('data.json');
}

function setup() {
  let canvas = createCanvas(1000, 800);
  canvas.parent('canvas-container');  // Attach canvas to the container

  // Slider setup
  let slider = select('#time-slider');
  slider.input(updateTime);

  // Display initial time
  updateTime();
}

function draw() {
  // Set dynamic background color based on time of day
  setDynamicBackground(currentTime);

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

// Function to calculate worker's position at a specific time
function getWorkerPosition(worker, time) {
  let route = worker.route;
  
  // Complex movement: If worker reaches the end of their route, they start a random walk
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

// Function to set dynamic background color based on time of day
function setDynamicBackground(time) {
  let morningColor = color(135, 206, 250);  // Light blue (morning)
  let noonColor = color(173, 216, 230);     // Bright blue (daytime)
  let afternoonColor = color(255, 223, 186);  // Pale yellow (afternoon)
  let eveningColor = color(255, 140, 0);    // Orange (sunset)
  let nightColor = color(25, 25, 112);      // Dark blue (night)

  let bgColor;

  if (time >= 0 && time < 360) {  // Early morning (00:00 - 06:00)
    bgColor = lerpColor(nightColor, morningColor, map(time, 0, 360, 0, 1));
  } else if (time >= 360 && time < 720) {  // Morning (06:00 - 12:00)
    bgColor = lerpColor(morningColor, noonColor, map(time, 360, 720, 0, 1));
  } else if (time >= 720 && time < 1020) {  // Afternoon (12:00 - 17:00)
    bgColor = lerpColor(noonColor, afternoonColor, map(time, 720, 1020, 0, 1));
  } else if (time >= 1020 && time < 1200) {  // Evening (17:00 - 20:00)
    bgColor = lerpColor(afternoonColor, eveningColor, map(time, 1020, 1200, 0, 1));
  } else {  // Night (20:00 - 00:00)
    bgColor = lerpColor(eveningColor, nightColor, map(time, 1200, 1440, 0, 1));
  }

  background(bgColor);
}
