let blobs = [];
let svg, blobGradient;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  svg = SVG().addTo('#lava-lamp').size(window.innerWidth, window.innerHeight);
  
  blobGradient = svg.gradient('radial', function(add) {
    add.stop(0, '#FFFFFF')
    add.stop(0.1, '#c536F0')
    add.stop(0.4, '#a12bc4')
    add.stop(0.8, '#772091')
    add.stop(1, '#2b0a3d')
  });
  
  let group = makeFilter();

  for (let i = 0; i < Math.ceil(window.innerHeight / 20); i++) {
    blobs.push(new Goop(group));
  }
}
function makeFilter() {
  let filter = svg.element('filter').attr('id', 'goo');
  
  filter.add(svg.element('feGaussianBlur').attr({
    in: "SourceGraphic", 
    stdDeviation: 10,
    result: "background-blur",
  }));

  filter.add(svg.element('feColorMatrix').attr({
    in: "background-blur",
    type: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5",
    result: "goo",
  }));
  
  return svg.group().attr('filter', 'url(#goo)');
}

function draw() {
  for (let blob of blobs) blob.update();
}

class Goop {
  constructor(group) {
    this.position = createVector(random(width), floor(random(window.innerHeight)));
    this.velocity = createVector(0, 0);
    
    this.initialSize = random(50, 200);
    this.wobble = random(1000);
    
    this.element = svg
      .ellipse(this.initialSize, this.initialSize)
      .center(this.position.x, this.position.y)
      .fill(blobGradient);
    group.add(this.element);
  }
  
  update() {
    let scale = 0.2;
    let sizeX = (1 + sin(this.wobble) * scale) * this.initialSize;
    let sizeY = (1 + sin(this.wobble + PI) * scale) * this.initialSize;
    
    let acceleration = createVector(0, map(this.position.y, 0, window.innerHeight, 1, -1) * 0.1 / this.initialSize);
    this.velocity.add(acceleration);
    this.velocity.limit(0.5);
    this.position.add(this.velocity);
    
    // update wobble based on magnitude of velocity
    this.wobble += abs(this.velocity.mag()) * 0.05 + 0.005;
    
    this.element
      .size(sizeX, sizeY)
      .center(this.position.x, this.position.y);
  }
}





















