let blobs = []

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSL)
  
  svg = SVG().addTo('#lava-lamp').size(window.innerWidth, window.innerHeight)
  
  blobGradient = svg.gradient('linear', function(add) {
    add.stop(0, '#c536F0')
    add.stop(0.8, '#48154B')
  }).from(0.5, 1).to(0, 0)
  
  let group = makeFilter()

  for (let i = 0; i < Math.ceil(window.innerHeight / 20); i++) {
    blobs.push(new Lava(group))
  }
  
  group.fill('#ff9f60')
}

function makeFilter() {
  let filter = svg.element('filter').attr('id', 'goo')
  
  filter.add(svg.element('feGaussianBlur').attr({
    in: "SourceGraphic", 
    stdDeviation: 10,
    result: "blur",
  }))
  
  filter.add(svg.element('feColorMatrix').attr({
    in: "blur",
    type: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9",
    result: "goo",
  }))
  
  filter.add(svg.element('feComposite').attr({
    in: "SourceGraphic",
    in2: "goo",
    operator: "atop",
  }))
  
  return svg.group().attr('filter', 'url(#goo)')
}

function draw() {
  for (let blob of blobs) blob.update()
}

class Lava {
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
    let scale = 0.2
    let sizeX = (1 + sin(this.wobble) * scale) * this.initialSize
    let sizeY = (1 + sin(this.wobble + PI) * scale) * this.initialSize
    
    let acceleration = createVector(0, map(this.position.y, 0, window.innerHeight, 1, -1) * 0.1 / this.initialSize)
    this.velocity.add(acceleration)
    this.velocity.limit(0.5)
    this.position.add(this.velocity)
    
    // update wobble based on magnitude of velocity
    this.wobble += abs(this.velocity.mag()) * 0.05 + 0.005
    
    this.element
      .size(sizeX, sizeY)
      .center(this.position.x, this.position.y)
  }
}





















