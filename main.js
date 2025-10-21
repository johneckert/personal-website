const sketches = {};
let currentSketch;

function switchSketch(name) {
  if (currentSketch) currentSketch.remove();
  currentSketch = new p5(sketches[name]);
}

let hideButtons;
let buttonContainer = document.querySelector('.button-container');

window.addEventListener('mousemove', () => {
  clearTimeout(hideButtons);
  hideButtons = setTimeout(() => {
    buttonContainer.classList.remove('show');
  }, 1000);
  buttonContainer.classList.add('show');
});

window.addEventListener('touchstart', () => {
  buttonContainer.classList.add('show');
});

window.addEventListener('touchend', () => {
  buttonContainer.classList.remove('show');
});


// Start with ripples after window load
window.onload = function() {
  switchSketch('CONCENTRIC_DRIFT');
};