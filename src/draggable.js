/* eslint-disable no-param-reassign */
import { emit } from './observer';

let cursorOffsetX;
let cursurOffsetY;

function dragStart(e) {
  e.preventDefault();
  cursorOffsetX = (e.clientX || e.touches[0].screenX) - this.offsetLeft;
  cursurOffsetY = (e.clientY || e.touches[0].screenY) - this.offsetTop;
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

  document.addEventListener('touchmove', boundDragMove);
  document.addEventListener(
    'touchend',
    () => {
      document.removeEventListener('touchmove', boundDragMove);
      emit('dragEnd', this);
    },
    { once: true }
  );
}

function dragMove(e) {
  this.style.top = ((e.clientY || e.touches[0].screenY) - cursurOffsetY).toString() + 'px';
  this.style.left = ((e.clientX || e.touches[0].screenX) - cursorOffsetX).toString() + 'px';
  const bound = this.getBoundingClientRect();
  const positionData = {
    startX: bound.left,
    endX: bound.right,
    startY: bound.top,
    endY: bound.bottom,
    area: this.area,
  };

  emit('dragEvent', positionData);
}

function resetDraggedImage(element) {
  element.style.top = '';
  element.style.left = '';
}

export { dragStart, resetDraggedImage };
