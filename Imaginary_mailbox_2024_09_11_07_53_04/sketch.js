function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(map(sin(frameCount / 10), -1, 1, 0, 255), map(cos(frameCount / 10), -1, 1, 0, 255), 255);
  // print(frameCount);
}
