
sketches['CHROMATIC_BLOOM'] = function (p) {

  let numSym = 20;
  let baseRadius;
  let noiseScale = 0.005;
  let t = 0;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    baseRadius = p.max(p.width, p.height);
    p.noFill();
    p.strokeWeight(2);
    p.background(10, 15, 20);
  }

  p.draw = function () {
    p.push();
    let time = p.millis() * 0.0004;
    let hueShift = (time * 300) % 360;
    let breath = p.sin(time * 2) * 0.3 + 1;
    p.noStroke();

    p.translate(p.width / 2, p.height / 2);
    p.rotate(time * 0.15);

    for (let i = 0; i < numSym; i++) {
      p.push();
      p.rotate((p.TWO_PI / numSym) * i);
      drawSlice(hueShift, breath, time, 1);
      p.scale(-1, 1);
      drawSlice(hueShift, breath, time, -1);
      p.pop();
    }
    p.pop();

    t += 0.002;

    p.push();
    p.stroke(10, 15, 20);
    p.strokeWeight(0.3);
    p.textSize(32);
    p.text('John Eckert', 25, p.height - 25);
    p.pop();
  }

  function drawSlice(hueShift, breath, time, dir) {
    p.beginShape();
    p.vertex(0, 0);
    for (let r = 20; r < baseRadius; r += 6) {
      let localAngle = -time * 0.25 * (1 - r / baseRadius);
      let angleOffset = p.noise(r * noiseScale, t) * p.TWO_PI * 0.6 + localAngle;

      let x = p.cos(angleOffset * dir) * r * breath;
      let y = p.sin(angleOffset * dir) * r * breath;

      let hue = (hueShift + r * 0.4) % 360;
      p.stroke(hue, 40, 90, 60);
      p.vertex(x, y);
    }
    p.endShape();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    baseRadius = p.max(p.width, p.height);
  }
}
