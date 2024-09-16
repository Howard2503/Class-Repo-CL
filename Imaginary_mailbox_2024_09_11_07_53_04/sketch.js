function setup() {
  createCanvas(windowWidth/2, windowHeight/2);
}

function draw() {
  background(map(sin(frameCount / 10), -1, 1, 0, 255), map(cos(frameCount / 10), -1, 1, 0, 255), 255);
  // print(frameCount);
}
