let blobs = []

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSL)
  
  svg = SVG().addTo('#lava-lamp').size(window.innerWidth, window.innerHeight)
  
  gradientFire = svg.gradient('linear', function(add) {
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
    this.pos = createVector(random(width), floor(random(window.innerHeight)))
    this.vel = createVector(0, 0)
    this.temp = 1
    
    this.size = random(50, 200)
    this.sizeTime = random(1000)
    
    this.el = svg
      .ellipse(this.size, this.size)
      .center(this.pos.x, this.pos.y)
      .fill(gradientFire)
    group.add(this.el)
  }
  
  update() {
    let a = this.sizeTime, as = 0.2
    let sizeX = (1 + sin(a) * as) * this.size
    let sizeY = (1 + sin(a + PI) * as) * this.size
    
    let acc = createVector(0, map(this.pos.y, 0, 400, 1, -1) * 0.1 / this.size)
    this.vel.add(acc)
    this.vel.limit(0.5)
    this.pos.add(this.vel)
    
    this.sizeTime += abs(this.vel.mag()) * 0.05 + 0.005
    
    this.el
      .size(sizeX, sizeY)
      .center(this.pos.x, this.pos.y)
  }
}





















