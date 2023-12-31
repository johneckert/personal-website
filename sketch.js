let blobs = [];
let width, height;
let backgroundGradient;

let isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isMobile || isSafari) {
  width = window.screen.width;
  height = window.screen.height;
} else {
  width = window.innerWidth;
  height = window.innerHeight;
}

let numberOfBlobs = Math.ceil(isMobile ? height / 40 : height / 20);

function setup() {
  pixelDensity(1);
  createCanvas(width, height);
  frameRate(32);
  describe('purple blobs floatin in space against a blue background', LABEL);
  backgroundGradient = drawingContext.createLinearGradient(0, 0, width, height);
  backgroundGradient.addColorStop(0.3, color(55, 213, 214))
  backgroundGradient.addColorStop(0.8, color(0,151,151))

  for (let i = 0; i < numberOfBlobs; i++) {
    blobs.push(new Blob());
  }
}

function draw() {
  background(50, 89, 100);
  drawingContext.fillStyle = backgroundGradient;
  drawingContext.fillRect(0, 0, width, height);
  // drawingContext.filter = 'blur(0.5px)';
  // drawingContext.filter = 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.2))'

  for (let i = 0; i < blobs.length; i++) {
    let gravity = createVector(0, 0.1 * blobs[i].mass);
    blobs[i].applyForce(gravity);
    blobs[i].move();
    blobs[i].display();
    blobs[i].bounce();
    blobs[i].wibble();
    blobs[i].updateGradient();
  }
}

class Blob {
  constructor() {
    this.diameterX = random(50, 200);
    this.diameterY = this.diameterX;
    this.diameter = (this.diameterX + this.diameterY) / 2;
    this.wobble = random(1);

    this.mass = this.diameter * 0.1;
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.centerOfGravity = createVector(this.position.x, this.position.y * -1);

    this.updateGradient();
  }

  updateGradient() {
    this.gradient = drawingContext.createRadialGradient(this.position.x - 30, this.position.y - 20, 0, this.position.x, this.position.y, this.diameter);
    this.gradient.addColorStop(0, color('#c536F0'))
    this.gradient.addColorStop(0.2, color('#a12bc4'))
    this.gradient.addColorStop(0.4, color('#772091'))
    this.gradient.addColorStop(0.9, color('#2b0a3d'))
  }
  applyForce(force) {
    // Newton's 2nd law: F = M * A
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }
  bounce() {
    // Reverse direction of acceleration if blob hits the edge of the canvas
    if (this.position.y > height - this.mass * 8) {
      this.centerOfGravity = createVector(this.position.x, 0);
    }

    if (this.position.y < this.mass * 8) {
      this.centerOfGravity = createVector(this.position.x, height);
    }
  };

  wibble() {
    this.diameterX *= (1 + sin(this.wobble) * 0.005);
    this.diameterY *= (1 + sin(this.wobble + PI) * 0.005);
    this.wobble += abs(this.velocity.mag()) * 0.05 + 0.005;
  }

  move() {
    this.gravityForce = p5.Vector.sub(this.centerOfGravity, this.position);
    this.acceleration.add(this.gravityForce);
    this.velocity.add(this.acceleration); // Velocity changes according to acceleration
    this.velocity.limit(0.5);
    this.position.add(this.velocity);

    // clear acceleration each frame
    this.acceleration.mult(0);
  }

  display() {
    strokeWeight(0);
    drawingContext.fillStyle = this.gradient;
    this.updateGradient();
    ellipse(this.position.x, this.position.y, this.diameterX, this.diameterY);
  }
}