let blobs = [];
let width, height;

let isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isMobile || isSafari) {
  width = window.screen.width;
  height = window.screen.height;
} else {
  width = window.innerWidth;
  height = window.innerHeight;
}

function setup() {
  pixelDensity(1);
  createCanvas(width, height);
  frameRate(32);

  for (let i = 0; i < Math.ceil(height / 20); i++) { /*Math.ceil(height / 20)*/
    blobs.push(new Blob());
  }
}

function draw() {
  background(50, 89, 100);
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
    this.gravityCenter = createVector(this.position.x, this.position.y * -1); // Center of gravity

    this.updateGradient();
  }

  updateGradient() {
    this.gradient = drawingContext.createRadialGradient(this.position.x -20, this.position.y - 20, 0, this.position.x, this.position.y, this.diameter);
    this.gradient.addColorStop(0, color('#FFFFFF'))
    this.gradient.addColorStop(0.1, color('#c536F0'))
    this.gradient.addColorStop(0.2, color('#a12bc4'))
    this.gradient.addColorStop(0.4, color('#772091'))
    this.gradient.addColorStop(0.6, color('#2b0a3d'))
    drawingContext.filter = 'blur(10px) matrix(1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5)';
  }



  // Newton's 2nd law: F = M * A
  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }
  // Reverse direction of acceleration if blob hits the edge of the canvas
  bounce() {
    if (this.position.y > height - this.mass * 8) {
      this.gravityCenter = createVector(this.position.x, 0);
    }

    if (this.position.y < this.mass * 8) {
      this.gravityCenter = createVector(this.position.x, height);
    }
  };

  wibble() {
    // this.diameter += sin(this.wobble);
    this.diameterX *= (1 + sin(this.wobble) * 0.005);
    this.diameterY *= (1 + sin(this.wobble + PI) * 0.005);
    this.wobble += abs(this.velocity.mag()) * 0.05 + 0.005;
  }

  move() {
    this.gravityForce = p5.Vector.sub(this.gravityCenter, this.position);
    this.acceleration.add(this.gravityForce);
    this.velocity.add(this.acceleration); // Velocity changes according to acceleration
    this.velocity.limit(1);
    this.position.add(this.velocity);

    // We must clear acceleration each frame
    this.acceleration.mult(0);
  }

  display() {
    strokeWeight(0);
    drawingContext.fillStyle = this.gradient;
    this.updateGradient();
    ellipse(this.position.x, this.position.y, this.diameterX, this.diameterY);
  }
}