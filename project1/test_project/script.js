let cities = [];  // Will hold the city data
let filteredCities = [];
let sliderValue = 25; // Default slider value

// Load the dataset (JSON file)
function preload() {
    loadJSON('data.json', function(data) {
        cities = data;
        filteredCities = cities.filter(city => city.temperature <= sliderValue);
    });
}

// Create the p5.js canvas and elements
function setup() {
    const canvas = createCanvas(600, 400);
    canvas.parent('sketch-container');
    noLoop();
    drawCities();
}

// Draw the cities based on temperature
function drawCities() {
    background(220);
    textAlign(CENTER);
    textSize(16);

    // Loop through filtered cities
    for (let i = 0; i < filteredCities.length; i++) {
        let city = filteredCities[i];

        // Map temperature to circle size
        let circleSize = map(city.temperature, 0, 50, 20, 100);
        let x = (i + 1) * (width / (filteredCities.length + 1));
        let y = height / 2;

        // Draw the circle
        fill(0, 102, 153);
        ellipse(x, y, circleSize, circleSize);

        // Display city name and temperature
        fill(0);
        text(city.city, x, y - (circleSize / 2) - 10);
        text(city.temperature + "°C", x, y + (circleSize / 2) + 20);
    }
}

// Update the sketch when the slider changes
function updateSlider(value) {
    sliderValue = value;
    document.getElementById('tempValue').innerText = value;

    // Filter cities based on the new slider value
    filteredCities = cities.filter(city => city.temperature <= sliderValue);

    // Redraw the canvas with the filtered data
    redraw();
}