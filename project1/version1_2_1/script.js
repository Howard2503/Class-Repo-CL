let deliveryData;  // To store delivery workers' data
let currentTime = 0;  // Current time in minutes
let maxTime = 1440;  // Total minutes in a day (24 hours * 60 minutes)
let playbackInterval;  // Variable to store the interval for automatic playback
let isPlaying = false;  // State to check if the slider is playing
let speed = 100;  // Playback speed in milliseconds (default is medium speed)
let speedLevels = { slow: 300, medium: 100, fast: 50 };  // Speed options
let currentSpeedLabel = "medium";  // Default speed label

function preload() {
  // Load the dataset (data.json)
  deliveryData = loadJSON('data.json');
}

function setup() {
  let canvas = createCanvas(1000, 800);
  canvas.parent('canvas-container');  // Attach canvas to the container
  noLoop();

  // Slider setup
  let slider = select('#time-slider');
  slider.input(updateTime);

  // Play button setup
  let playButton = select('#play-button');
  playButton.mousePressed(togglePlayback);

  // Speed button setup
  let speedButton = select('#speed-button');
  speedButton.mousePressed(changeSpeed);  // New button to change speed

  // Display initial time
  updateTime();
}

function draw() {
  background(240);

  
  // Main Roads (Yellow Roads)
  stroke(255, 204, 0);  // Yellow for major roads
  strokeWeight(8);
  line(100, 700, 900, 700);  // Horizontal main road (Zhonghuan Rd)
  
  // Secondary Roads (White Roads)
  stroke(255);  // White for secondary roads
  strokeWeight(5);
  line(200, 150, 800, 650);  // Diagonal white road
  
  // Drawing the Highway Interchange (Zhonghuan and South North Elevated Road)
  stroke(255, 204, 0);
  strokeWeight(10);
  noFill();
  ellipse(800, 650, 120, 120);  // Roundabout part of the interchange
  ellipse(780, 630, 50, 50);  // Smaller ramp circle
  
  // Detailed Metro Lines
  // Metro Line 6 (Blue)
  stroke(0, 0, 255);  // Blue for Metro Line 6
  strokeWeight(3);
  line(50, 400, 900, 550);  // Curved line for Metro Line 6
  
  // Metro Line 11 (Purple)
  stroke(138, 43, 226);  // Purple for Metro Line 11
  line(50, 300, 900, 500);  // Curved purple metro line
  
  // Metro Line 8 (Light Blue)
  stroke(135, 206, 250);  // Light blue for Metro Line 8
  line(50, 350, 900, 600);  // Light blue line for Metro Line 8
  
  // Water Bodies
  fill(173, 216, 230);  // Light blue color for water
  noStroke();
  beginShape();
  vertex(100, 100);
  vertex(200, 150);
  vertex(150, 250);
  vertex(50, 200);
  endShape(CLOSE);  // Irregular water body
  
  // Drawing the small river
  beginShape();
  vertex(300, 200);
  vertex(400, 230);
  vertex(370, 300);
  vertex(270, 270);
  endShape(CLOSE);  // Small water body
  
  // Parks (Green Areas)
  fill(144, 238, 144);  // Light green for parks
  rect(100, 50, 150, 150);  // Park area near McDonald's
  
  // Buildings and Landmarks
  fill(255, 0, 0);
  ellipse(200, 200, 20, 20);  // McDonald's
  fill(0);
  textSize(12);
  text('McDonald\'s', 230, 200);  // Label for McDonald's
  
  // Drawing other landmark buildings
  fill(100);
  rect(580, 280, 40, 40); 
  fill(0);
  textSize(12);
  text('Shopping Mall', 600, 300); // A square for the shopping mall
  
  fill(100);
  rect(380, 80, 40, 40);  
  fill(0);
  text('School', 400, 100);// Another square for a school
  
  // Additional Parks
  fill(144, 238, 144);  // Light green for more park areas
  rect(800, 100, 100, 100);  // Park on the east side of the map
  
  // Add more details for streets and intersections
  stroke(255);
  strokeWeight(3);
  line(300, 400, 700, 600);  // Another secondary road
  line(400, 500, 800, 700);  // Additional road
  
  // Additional Water Body
  fill(173, 216, 230);  // Light blue color for water
  noStroke();
  beginShape();
  vertex(700, 100);
  vertex(800, 150);
  vertex(750, 200);
  vertex(650, 170);
  endShape(CLOSE);  // Small water body on the right
  
  // Labels for the metro lines
  fill(0);
  textSize(12);
  text('Metro Line 6', 700, 450);
  text('Metro Line 11', 700, 500);
  text('Metro Line 8', 700, 550);

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
    }, speed);  // Use the current speed variable
    
    select('#play-button').html('Stop');
  } else {
    // Stop playback
    clearInterval(playbackInterval);
    isPlaying = false;
    select('#play-button').html('Play');
  }
}

// Function to change the playback speed
function changeSpeed() {
  // Cycle through speed levels
  if (currentSpeedLabel === "medium") {
    speed = speedLevels.slow;
    currentSpeedLabel = "slow";
    select('#speed-button').html('Speed: Slow');
  } else if (currentSpeedLabel === "slow") {
    speed = speedLevels.fast;
    currentSpeedLabel = "fast";
    select('#speed-button').html('Speed: Fast');
  } else {
    speed = speedLevels.medium;
    currentSpeedLabel = "medium";
    select('#speed-button').html('Speed: Medium');
  }

  // If playback is already running, restart it with the new speed
  if (isPlaying) {
    clearInterval(playbackInterval);
    togglePlayback();  // This will restart with the updated speed
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
