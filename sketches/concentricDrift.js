sketches['CONCENTRIC_DRIFT'] = function (p) {
  let ripples = [];
  let hueShift = 0;
  let angle = 0; 
  let radius = 0;  

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    p.strokeWeight(1.5);
    radius = p.min(p.width, p.height) * 0.1;
    p.frameRate(40);
  }

  p.draw = function () {
    p.background(260, 10, 25, 20);
    hueShift = (hueShift + 0.2) % 360;

    if (p.frameCount % 20 === 0) {
      let centerX = p.width / 2;
      let centerY = p.height / 2;

      let x = centerX + p.cos(angle) * radius;
      let y = centerY + p.sin(angle) * radius;

      ripples.push(new Ripple(x, y, hueShift));

      angle += p.radians(20);
      if (angle > p.TWO_PI) {
        angle -= p.TWO_PI;
      }
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].display();
      if (ripples[i].done()) {
        ripples.splice(i, 1);
      }
    }

    p.push();
    p.stroke(hueShift, 40, 90);
    p.strokeWeight(0.3);
    p.textSize(32);
    p.text('John Eckert', 25, p.height - 25);
    p.pop();
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
      p.stroke(this.hue, 40, 90, this.alpha);
      p.ellipse(this.x, this.y, this.r * 2);
    }
    
    done() {
      return this.alpha <= 0;
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}