import * as imageGenerator from './imageGenerator';
import * as statsPopulator from './statsPopulator';
import * as audioSamples from './audioSamples';
import { on, emit } from './observer';
import { dragStart, resetDraggedImage } from './draggable';
import { setStagedImage, adjustForRotation } from './rotatable';
import { getEnsemble } from './ensemble';
import { showSetup } from './DOMController';
import { getMode } from './mode';

const stagingArea = document.querySelector('.staging-area');
const previewContainer = document.querySelector('.preview-container');
const previews = document.querySelectorAll('.img-preview');
const setBoardButton = document.querySelector('.set-board');
const clearButton = document.querySelector('.clear');
const autoSetupButtonSimple = document.querySelector('.random');
const autoSetupButton = document.querySelector('.random-enhanced');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
previews.forEach((preview) => preview.addEventListener('click', activateStatsPanel));
previews.forEach((preview) => preview.addEventListener('click', activateAudioButton));
clearButton.addEventListener('click', clearPlacedImages);
autoSetupButton.addEventListener('click', removeStagedImage);
autoSetupButtonSimple.addEventListener('click', removeStagedImage);
autoSetupButton.addEventListener('click', statsPopulator.resetStatsPanel);
autoSetupButtonSimple.addEventListener('click', statsPopulator.resetStatsPanel);
autoSetupButton.addEventListener('click', audioSamples.disableAudioButton);
autoSetupButtonSimple.addEventListener('click', audioSamples.disableAudioButton);

let remainingInstruments;
let currentBoard;
function setupDOMBoard(board) {
  setBoardButton.disabled = true;
  remainingInstruments = Object.keys(getEnsemble());
  enablePreviewImages();
  currentBoard = board;
  showSetup(currentBoard);
  setBoardButton.addEventListener('click', () => emit('setPosition', currentBoard), { once: true });
  on('dragEvent', highlightHoveredCells);
  on('dragEnd', handleRelease);
}

function activateStatsPanel() {
  statsPopulator.enableStatsButton();
  statsPopulator[this.dataset.inst]();
}

function activateAudioButton() {
  audioSamples.enableAudioButton();
  audioSamples.setAudio(this.dataset.inst);
}

function showStagedImage() {
  const image = imageGenerator[this.dataset.inst]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', dragStart);
  image.addEventListener('touchstart', dragStart);
  removeStagedImage();
  stagingArea.appendChild(image);
  setStagedImage(image); // for rotation
}

function removeStagedImage() {
  if (stagingArea.firstChild) {
    stagingArea.firstChild.removeResizeListener();
    stagingArea.removeChild(stagingArea.firstChild);
  }
}

function clearPlacedImages() {
  const children = Array.from(currentBoard.children);
  children.forEach((element) => {
    if (element.classList.contains('placed-img-wrapper')) {
      element.firstChild.removeResizeListener();
      element.remove();
    } else {
      element.classList.remove('highlight-placed');
    }
  });
  previews.forEach((preview) => preview.classList.remove('disabled'));
  removeStagedImage();
  statsPopulator.resetStatsPanel();
  audioSamples.disableAudioButton();
  remainingInstruments = Object.keys(getEnsemble());
  setBoardButton.disabled = true;
  emit('clearPosition');
}

let cellsToHighlight = [];
let cellsToUnhighlight = [];

function highlightHoveredCells(positionData) {
  const { startX, endX, startY, endY, area } = positionData;

  currentBoard.cells.forEach((cell) => {
    const bound = cell.getBoundingClientRect();
    const errorTolerance = isWithinBoard(startX, endX, startY, endY) ? 1 : -0.3;
    const half = bound.width / 2 + errorTolerance;
    // errorTolerance provides some leeway to pass comparisons (rounding errors, etc.);
    // however, if the image is not fully within the board, comparisons need to be stricter to avoid
    // highlighting a set of cells with the wrong dimensions (the check in commitValidHighlights
    // is not helpful in this case because the size of the set could still be within the limit)

    const maxLeft = bound.left + half;
    const minRight = bound.right - half;
    const maxTop = bound.top + half;
    const minBottom = bound.bottom - half;

    if (startX < maxLeft && endX > minRight && startY < maxTop && endY > minBottom) {
      cellsToHighlight.push(cell);
    } else {
      cellsToUnhighlight.push(cell);
    }
  });
  commitValidHighlights(area);
  cellsToHighlight = [];
  cellsToUnhighlight = [];
}

function commitValidHighlights(targetArea) {
  // if too many cells are in cellsToHighlight because the image is straddling a border, do nothing.
  // perform this check before filtering; otherwise a set of cells with the wrong dimensions could
  // be incorrectly highlighted
  if (cellsToHighlight.length > targetArea) {
    return;
  }
  cellsToHighlight = cellsToHighlight.filter((cell) => !cell.classList.contains('highlight-placed'));
  // if cellsToHighlight.length is less than targetArea, image is partially off board or partially over
  // an already-placed image
  if (cellsToHighlight.length < targetArea) {
    cellsToHighlight.forEach((cell) => cell.classList.add('highlight-hovered-invalid'));
    cellsToUnhighlight.forEach((cell) => cell.classList.remove('highlight-hovered-invalid'));
    currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered'));
  } else if (cellsToHighlight.length === targetArea) {
    cellsToHighlight.forEach((cell) => cell.classList.add('highlight-hovered'));
    cellsToUnhighlight.forEach((cell) => cell.classList.remove('highlight-hovered'));
    currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered-invalid'));
  }
}

function isWithinBoard(startX, endX, startY, endY) {
  const bound = currentBoard.getBoundingClientRect();
  return bound.left <= startX && bound.right >= endX && bound.top <= startY && bound.bottom >= endY;
}

function handleRelease(element) {
  const validArea = currentBoard.cells.filter(
    (cell) =>
      cell.classList.contains('highlight-hovered') && !cell.classList.contains('highlight-placed')
  ).length;
  if (validArea === element.area) {
    placeImage(element);
    statsPopulator.resetStatsPanel();
    audioSamples.disableAudioButton();
    element.removeResizeListener();
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
  imageWrapper.style.gridColumn = `${(startingCell % currentBoard.numRows) + 1} / span ${element.spanX}`;

  imageWrapper.appendChild(image);
  currentBoard.appendChild(imageWrapper);
  disablePreviewImage(element.type);
  updateRemainingInstruments(element.type);
}

function updateRemainingInstruments(instrument) {
  const index = remainingInstruments.indexOf(instrument);
  if (index > -1) {
    remainingInstruments.splice(index, 1);
  }
  if (remainingInstruments.length === 0) {
    setBoardButton.disabled = false;
  }
}

function disablePreviewImage(instrument) {
  previewContainer.querySelector(`.${instrument}`).classList.add('disabled');
}

function disableAllPreviewImages() {
  previews.forEach((preview) => preview.classList.add('disabled'));
  setBoardButton.disabled = false;
}

function enablePreviewImages() {
  previews.forEach((preview) => preview.classList.remove('disabled'));
}

function newTemplateImage(type) {
  const image = imageGenerator[type]();
  image.classList.add('placed-img');
  return image;
}

function newTemplateWrapper() {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('placed-img-wrapper');
  if (getMode() === 'stealth') {
    imageWrapper.classList.add('stealth');
  }
  return imageWrapper;
}

function removeDraggedHighlights() {
  currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered'));
  currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered-invalid'));
}

function updateHighlights() {
  currentBoard.cells.forEach((cell) => {
    if (cell.classList.contains('highlight-hovered')) {
      cell.classList.remove('highlight-hovered');
      cell.classList.add('highlight-placed');
    }
  });
}

export { setupDOMBoard, newTemplateImage, newTemplateWrapper, disableAllPreviewImages };
