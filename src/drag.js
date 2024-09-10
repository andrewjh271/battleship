import * as draggedImages from './imageGenerator';
import { emit } from './observer';

const stagingArea = document.querySelector('.staging-area');
const previews = document.querySelectorAll('.img-preview');

const rotateButton = document.querySelector('.rotate');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
rotateButton.addEventListener('click', rotate);

let cursorOffsetX;
let cursurOffsetY;
let staged;

function showStagedImage(e) {
  const image = draggedImages[this.id]();
  image.addEventListener('mousedown', dragStart);
  stagingArea.appendChild(image);
  staged = image;
}

function rotate() {
  if (!staged) return;
  const matchData = staged.style.transform.match(/\d+/);
  const deg = matchData ? Number(matchData[0]) + 90 : 90;
  staged.style.transform = `rotate(${deg}deg)`;
}

function dragStart(e) {
  e.preventDefault();
  cursorOffsetX = e.clientX - this.offsetLeft;
  cursurOffsetY = e.clientY - this.offsetTop;

  const boundDragMove = dragMove.bind(this);
  document.addEventListener('mousemove', boundDragMove);
  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', boundDragMove);
    },
    { once: true }
  );
}

function dragMove(e) {
  console.log(this);
  this.style.top = (e.clientY - cursurOffsetY).toString() + 'px';
  this.style.left = (e.clientX - cursorOffsetX).toString() + 'px';
  const positionData = {
    top: this.offsetTop,
    left: this.offsetLeft,
    width: this.offsetWidth,
    height: this.offsetHeight,
  };

  emit('dragEvent', positionData);
}

function dragEnd(e) {
  document.removeEventListener('mousemove', dragMove.bind(this));
  document.removeEventListener('mouseup', dragEnd);
}
