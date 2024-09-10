const board = document.querySelector('.board');

const boardWidth = 500;
const squareWidth = boardWidth / 10; // 50

const targetWidth = 3; // number of squares flute should occupy
const targetHeight = 1; // number of squares flute should occupy

// flute width should be 150; height should be 50

function flute() {
  const image = new Image();
  image.src = './images/flute.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 3}px`;
  return image;
}

function trombone() {
  const image = new Image();
  image.src = './images/trombone.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 5}px`;
  return image;
}

function clarinet() {
  const image = new Image();
  image.src = './images/clarinet.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 3}px`;
  return image;
}

function violin() {
  const image = new Image();
  image.src = './images/violin.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 4}px`;
  return image;
}

export { clarinet, flute, trombone, violin };
