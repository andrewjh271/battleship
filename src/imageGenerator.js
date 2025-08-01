/* eslint-disable no-param-reassign */
import { resetRotationAdjustment } from './rotatable';

let windowEvents = [];

function flute() {
  return newImage('flute', 1, 3);
}

function trombone() {
  const image = newImage('trombone', 1, 5);
  image.classList.add('stretch-trombone');
  return image;
}

function clarinet() {
  return newImage('clarinet', 1, 3);
}

function violin() {
  const image = newImage('violin', 1, 3);
  image.classList.add('stretch-violin');
  return image;
}

function bassoon() {
  return newImage('bassoon', 1, 4);
}

function cello() {
  const image = newImage('cello', 2, 5);
  image.classList.add('stretch-cello');
  return image;
}

function horn() {
  return newImage('horn', 2, 2);
}

function piccolo() {
  return newImage('piccolo', 1, 2);
}

function trumpet() {
  const image = newImage('trumpet', 1, 3);
  image.classList.add('stretch-trumpet');
  return image;
}

function bass() {
  return newImage('bass', 3, 6);
}
function bassdrum() {
  return newImage('bassdrum', 3, 4);
}
function cymbals() {
  return newImage('cymbals', 2, 2);
}
function glockenspiel() {
  return newImage('glockenspiel', 3, 2);
}
function harp() {
  return newImage('harp', 3, 6);
}
function oboe() {
  return newImage('oboe', 1, 3);
}
function snare() {
  return newImage('snare', 2, 2);
}
function cabasa() {
  return newImage('cabasa', 1, 2);
}
function viola() {
  const image = newImage('viola', 1, 3);
  image.classList.add('stretch-viola');
  return image;
}
function tuba() {
  return newImage('tuba', 2, 3);
}

function newImage(type, width, height) {
  const image = new Image();
  image.src = `images/${type}.png`;
  image.spanX = width;
  image.spanY = height;
  image.area = width * height;
  image.type = type;
  setImageSize(image);
  const boundResetImageSize = resetImageSize.bind(null, image);
  window.addEventListener('resize', boundResetImageSize);
  windowEvents.push(boundResetImageSize);
  image.removeResizeListener = () => window.removeEventListener('resize', boundResetImageSize);
  return image;
}

function setImageSize(image) {
  const cell = document.querySelector('.board:not(.hidden) > .cell');
  const squareWidth = cell.offsetWidth;
  image.style.width = `${squareWidth * image.spanX}px`;
  image.style.height = `${squareWidth * image.spanY}px`;
}

function resetImageSize(image) {
  setImageSize(image);
  resetRotationAdjustment(image);
}

function removeWindowEvents() {
  windowEvents.forEach((event) => {
    window.removeEventListener('resize', event);
  });
  windowEvents = [];
}

export {
  clarinet,
  flute,
  trombone,
  violin,
  bassoon,
  cello,
  horn,
  trumpet,
  piccolo,
  bass,
  bassdrum,
  cymbals,
  glockenspiel,
  cabasa,
  harp,
  oboe,
  snare,
  viola,
  tuba,
  removeWindowEvents,
};
