import { humanPlayerFactory, computerPlayerFactory } from './player';
import { indexToCoordinates } from './coordinates';
import { on } from './observer';
import * as imageGenerator from './imageGenerator';
import './drag';

const ROWS = 10;

const board1 = document.getElementById('board1');
createGrid(ROWS * ROWS, board1);

function createGrid(numberOfCells, board) {
  board.cells = [];
  for (let i = 0; i < numberOfCells; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].style.gridArea = `${Math.floor(i / ROWS) + 1} / ${
      (i % ROWS) + 1
    } / span 1 / span 1`;
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

on('dragEvent', highlightHoveredCells);
on('dragEnd', handleRelease);

function highlightHoveredCells(positionData) {
  const { startX, endX, startY, endY } = positionData;

  board1.cells.forEach((cell) => {
    const bound = cell.getBoundingClientRect();
    const half = bound.width / 2;

    const maxLeft = bound.left + half;
    const minRight = bound.right - half;
    const maxTop = bound.top + half;
    const minBottom = bound.bottom - half;

    if (startX < maxLeft && endX > minRight && startY < maxTop && endY > minBottom) {
      cell.classList.add('highlight-hovered');
    } else {
      cell.classList.remove('highlight-hovered');
    }
  });
}

function handleRelease(element) {
  const validArea = board1.cells.reduce(
    (sum, cell) =>
      cell.classList.contains('highlight-hovered') && !cell.classList.contains('highlight-placed')
        ? sum + 1
        : sum,
    0
  );
  if (validArea === element.area) {
    placeImage(element);
    element.remove();
    updateHighlights();
  } else {
    resetDraggedImage(element);
    removeDraggedHighlights();
  }
}

function resetDraggedImage(element) {
  element.style.top = '';
  element.style.left = '';
}

function placeImage(element) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('placed-img-wrapper');
  const image = imageGenerator[element.type]();
  image.classList.add('placed-img');

  const startingCell = board1.cells.findIndex((cell) =>
    cell.classList.contains('highlight-hovered')
  );

  rotationAdjust(element, image, imageWrapper);

  imageWrapper.style.gridRow = `${Math.floor(startingCell / ROWS) + 1} / span ${element.spanY}`;
  imageWrapper.style.gridColumn = `${(startingCell % ROWS) + 1} / span ${element.spanX}`;

  imageWrapper.appendChild(image);
  board1.appendChild(imageWrapper);
}

function rotationAdjust(draggedImage, newImage, wrapper) {
  const rotation = Number(draggedImage.style.transform.match(/\d+(?=deg)/)) % 360;
  if (!rotation) return;
  switch (rotation) {
    case 90:
      newImage.style.transform = `translateX(${newImage.style.height}) rotate(${rotation}deg)`;
      break;
    case 180:
      newImage.style.transform = `translateY(100%) translateX(100%) rotate(${rotation}deg)`;
      break;
    case 270:
      newImage.style.transform = `translateY(${newImage.style.width}) rotate(${rotation}deg)`;
  }
  if (rotation !== 180) {
    wrapper.style.height = newImage.style.width;
    [draggedImage.spanY, draggedImage.spanX] = [draggedImage.spanX, draggedImage.spanY];
  }
}

function removeDraggedHighlights() {
  board1.cells.forEach((cell) => cell.classList.remove('highlight-hovered'));
}

function updateHighlights() {
  board1.cells.forEach((cell) => {
    if (cell.classList.contains('highlight-hovered')) {
      cell.classList.remove('highlight-hovered');
      cell.classList.add('highlight-placed');
    }
  });
}

function listenForAttack(board) {
  board.addEventListener('click', handleAttack);
}

function unListenForAttack(board) {
  board.removeEventListener('click', handleAttack);
}

function handleAttack(e) {
  const { index } = e.target.dataset;
  if (!index) return;
  console.log(indexToCoordinates(index));
}

listenForAttack(board1);
