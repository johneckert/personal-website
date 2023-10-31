function random(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var tl = new TimelineMax();

for(var i = 0; i < 50; i++){

  var t = TweenMax.to(document.querySelector('#blob' + i), random(50, 300), {
    y: i % 2 === 0 ? -600 : 600,
    repeat:-1,
    repeatDelay:random(1, 3),
    yoyo:true,
    ease:Linear.easeNone
  })

  tl.add(t, (i+1)/0.6)
}

tl.seek(120);

tl.timeScale(2);