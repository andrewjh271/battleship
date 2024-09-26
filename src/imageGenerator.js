import { rowLength } from "./boardSize";

const board = document.querySelector('.board');
const boardWidth = board.offsetWidth;
const squareWidth = boardWidth / rowLength(); // number of cells in row

function flute() {
  return newImage('flute', 1, 3);
}

function trombone() {
  const image = newImage('trombone', 1, 5);
  image.classList.add('stretch');
  return image;
}

function clarinet() {
  return newImage('clarinet', 1, 3);
}

function violin() {
  return newImage('violin', 1, 3);
}

function bassoon() {
  return newImage('bassoon', 1, 4);
}

function cello() {
  return newImage('cello', 2, 5);
}

function horn() {
  return newImage('horn', 2, 2);
}

function piccolo() {
  return newImage('piccolo', 1, 2);
}

function trumpet() {
  return newImage('trumpet', 1, 3);
}

function newImage(type, width, height) {
  const image = new Image();
  image.src = `./images/${type}.png`;
  image.style.width = `${squareWidth * width}px`;
  image.style.height = `${squareWidth * height}px`;
  image.spanX = width;
  image.spanY = height;
  image.area = width * height;
  image.type = type;
  return image;
}

export { clarinet, flute, trombone, violin, bassoon, cello, horn, trumpet, piccolo };
