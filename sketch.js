// Ripples in Silence - p5.js
let ripples = [];
let hueShift = 0;
let angle = 0; 
let radius = 0;  

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(1.5);
  radius = min(width, height) * 0.1;
  frameRate(40);
}

function draw() {
  background(260, 10, 25, 20);
  hueShift = (hueShift + 0.2) % 360;

  if (frameCount % 20 === 0) {
    let centerX = width / 2;
    let centerY = height / 2;

    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;

    ripples.push(new Ripple(x, y, hueShift));

    angle += radians(20);
    if (angle > TWO_PI) {
      angle -= TWO_PI;
    }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].done()) {
      ripples.splice(i, 1);
    }
  }

  push();
  stroke(hueShift, 40, 90);
  strokeWeight(0.3);
  textSize(32);
  text('John Eckert', 25, height - 25);
  pop();
}

function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
}

class Ripple {
  constructor(x, y, hueValue) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.hue = hueValue;
    this.alpha = 120;
  }
  
  update() {
    this.r += 1.5;
    this.alpha -= 0.1;
  }
  
  display() {
    stroke(this.hue, 40, 90, this.alpha);
    ellipse(this.x, this.y, this.r * 2);
  }
  
  done() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
