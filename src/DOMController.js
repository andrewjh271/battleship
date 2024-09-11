import { humanPlayerFactory, computerPlayerFactory } from './player';
import { indexToCoordinates } from './coordinates';
import { on } from './observer';
import * as imageGenerator from './imageGenerator';
import './drag';

function createGrid(numberOfCells, board) {
  board.cells = [];
  for (let i = 0; i < numberOfCells; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].style.gridArea = `${Math.floor(i / 10) + 1} / ${
      (i % 10) + 1
    } / span 1 / span 1`;
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

const board1 = document.querySelector('#board1');

on('dragEvent', checkHover);
on('dragEnd', handleRelease);

createGrid(100, board1);

function checkHover(positionData) {
  const { startX, endX, startY, endY } = positionData;

  board1.cells.forEach((cell) => {
    const bound = cell.getBoundingClientRect();
    const half = bound.width / 2;

    const maxLeft = bound.left + half;
    const minRight = bound.right - half;
    const maxTop = bound.top + half;
    const minBottom = bound.bottom - half;

    if (startX < maxLeft && endX > minRight && startY < maxTop && endY > minBottom) {
      cell.classList.add('highlight');
    } else {
      cell.classList.remove('highlight');
    }
  });
}

function handleRelease(element) {
  const area = board1.cells.reduce(
    (sum, cell) =>
      cell.classList.contains('highlight') && !cell.classList.contains('placed')
        ? sum + 1
        : sum,
    0
  );
  if (area === element.area) {
    placeImage(element);
  } else {
    element.style.top = '';
    element.style.left = '';
    removeHighlights();
  }
}

function placeImage(element) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('placed-img-wrapper');
  const image = imageGenerator[element.type]();
  image.classList.add('placed-img');

  const start = board1.cells.findIndex((cell) => cell.classList.contains('highlight'));

  const matchData = element.style.transform.match(/\d+/);
  if (matchData && Number(matchData) % 360 !== 0) {
    if (Number(matchData) % 180 !== 0) {
      imageWrapper.style.height = image.style.width;
      [element.spanY, element.spanX] = [element.spanX, element.spanY];
    }
    if (matchData == 90) {
      image.style.transform = `translateX(${image.style.height}) rotate(${matchData}deg)`;
    } else if (matchData == 270) {
      image.style.transform = `translateY(${image.style.width}) rotate(${matchData}deg)`;
    } else {
      image.style.transform = `translateY(100%) translateX(100%) rotate(${matchData}deg)`;
    }
  }

  imageWrapper.style.gridRow = `${Math.floor(start / 10) + 1} / span ${element.spanY}`;
  imageWrapper.style.gridColumn = `${(start % 10) + 1} / span ${element.spanX}`;

  element.remove();
  transformHighlights();
  imageWrapper.appendChild(image);
  board1.appendChild(imageWrapper);
}

function removeHighlights() {
  board1.cells.forEach((cell) => cell.classList.remove('highlight'));
}

function transformHighlights() {
  board1.cells.forEach((cell) => {
    if (cell.classList.contains('highlight')) {
      cell.classList.remove('highlight');
      cell.classList.add('placed');
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
