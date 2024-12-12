/* eslint-disable no-param-reassign */
let windowEvents = [];

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
  image.spanX = width;
  image.spanY = height;
  image.area = width * height;
  image.type = type;
  setImageSize(image);
  const boundSetImageSize = setImageSize.bind(null, image);
  window.addEventListener('resize', boundSetImageSize);
  windowEvents.push(boundSetImageSize)
  image.removeResizeListener = () => window.removeEventListener('resize', boundSetImageSize);
  return image;
}

function setImageSize(image) {
  const cell = document.querySelector('.board:not(.hidden) > .cell');
  const squareWidth = cell.offsetWidth;
  image.style.width = `${squareWidth * image.spanX}px`;
  image.style.height = `${squareWidth * image.spanY}px`;
}

function removeWindowEvents() {
  windowEvents.forEach(event => {
    window.removeEventListener('resize', event)
  })
  windowEvents = [];
}

export { clarinet, flute, trombone, violin, bassoon, cello, horn, trumpet, piccolo, removeWindowEvents };
