import * as imageGenerator from './imageGenerator';
import { emit } from './observer';

const stagingArea = document.querySelector('.staging-area');
const previews = document.querySelectorAll('.img-preview');

const rotateButton = document.querySelector('.rotate');
const clearButton = document.querySelector('.clear');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
rotateButton.addEventListener('click', rotate);
clearButton.addEventListener('click', clearPlacedImages);

let cursorOffsetX;
let cursurOffsetY;
let staged;

function showStagedImage() {
  const image = imageGenerator[this.id]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', dragStart);
  if (stagingArea.firstChild) {
    stagingArea.removeChild(stagingArea.firstChild);
  }
  stagingArea.appendChild(image);
  staged = image;
}

function rotate() {
  if (!staged) return;
  const rotation = Number(staged.style.transform.match(/\d+(?=deg)/)) % 360;
  staged.style.transform = `rotate(${rotation + 90}deg)`;
}

function clearPlacedImages() {
  const children = Array.from(board1.children);
  for (const node of children) {
    if (node.classList.contains('placed-img-wrapper')) {
      node.remove();
    } else {
      node.classList.remove('highlight-placed');
    }
  }
}

function dragStart(e) {
  e.preventDefault();
  cursorOffsetX = e.clientX - this.offsetLeft;
  cursurOffsetY = e.clientY - this.offsetTop;
  this.classList.add('grabbing');

  const boundDragMove = dragMove.bind(this);
  document.addEventListener('mousemove', boundDragMove);
  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', boundDragMove);
      emit('dragEnd', this);
    },
    { once: true }
  );
}

function dragMove(e) {
  this.style.top = (e.clientY - cursurOffsetY).toString() + 'px';
  this.style.left = (e.clientX - cursorOffsetX).toString() + 'px';
  const bound = this.getBoundingClientRect();
  const positionData = {
    startX: bound.left,
    endX: bound.right,
    startY: bound.top,
    endY: bound.bottom,
  };

  emit('dragEvent', positionData);
}
