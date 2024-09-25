import * as imageGenerator from './imageGenerator';
import { on, emit } from './observer';
import { dragStart, resetDraggedImage } from './draggable';
import { setStagedImage, adjustForRotation } from './rotatable';
// import function showSetup() from DOMController that shows/hides correct elements

const stagingArea = document.querySelector('.staging-area');
const previews = document.querySelectorAll('.img-preview');
const setBoardButton = document.querySelector('.set-board');
const clearButton = document.querySelector('.clear');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
clearButton.addEventListener('click', clearPlacedImages);

let currentBoard;
function setupDOMBoard(board) {
  // call showSetup(board)
  currentBoard = board;
  setBoardButton.addEventListener('click', () => emit('setPosition', currentBoard), { once: true });
}

function showStagedImage() {
  const image = imageGenerator[this.id]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', dragStart);
  if (stagingArea.firstChild) {
    stagingArea.removeChild(stagingArea.firstChild);
  }
  stagingArea.appendChild(image);
  setStagedImage(image); // for rotation
}

function clearPlacedImages() {
  const children = Array.from(currentBoard.children);
  children.forEach((element) => {
    if (element.classList.contains('placed-img-wrapper')) {
      element.remove();
    } else {
      element.classList.remove('highlight-placed');
    }
  });
}

on('dragEvent', highlightHoveredCells);
on('dragEnd', handleRelease);

function highlightHoveredCells(positionData) {
  const { startX, endX, startY, endY } = positionData;

  currentBoard.cells.forEach((cell) => {
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
  const validArea = currentBoard.cells.filter(
    (cell) =>
      cell.classList.contains('highlight-hovered') && !cell.classList.contains('highlight-placed')
  ).length;
  if (validArea === element.area) {
    placeImage(element);
    element.remove();
    updateHighlights();
  } else {
    resetDraggedImage(element);
    removeDraggedHighlights();
  }
}

function placeImage(element) {
  const image = newTemplateImage(element.type);
  const imageWrapper = newTemplateWrapper();
  const startingCell = currentBoard.cells.findIndex((cell) =>
    cell.classList.contains('highlight-hovered')
  );

  adjustForRotation(element, image);
  imageWrapper.style.gridRow = `${Math.floor(startingCell / currentBoard.numRows) + 1} / span ${
    element.spanY
  }`;
  imageWrapper.style.gridColumn = `${(startingCell % currentBoard.numRows) + 1} / span ${
    element.spanX
  }`;

  imageWrapper.appendChild(image);
  currentBoard.appendChild(imageWrapper);
}

function newTemplateImage(type) {
  const image = imageGenerator[type]();
  image.classList.add('placed-img');
  return image;
}

function newTemplateWrapper() {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('placed-img-wrapper');
  return imageWrapper;
}

function removeDraggedHighlights() {
  currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered'));
}

function updateHighlights() {
  currentBoard.cells.forEach((cell) => {
    if (cell.classList.contains('highlight-hovered')) {
      cell.classList.remove('highlight-hovered');
      cell.classList.add('highlight-placed');
    }
  });
}

export { setupDOMBoard, newTemplateImage, newTemplateWrapper };
