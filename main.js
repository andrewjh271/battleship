/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/1DSetFinder.js":
/*!****************************!*\
  !*** ./src/1DSetFinder.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   find1DSets: () => (/* binding */ find1DSets)
/* harmony export */ });
function find1DSets(board, length) {
  if (length === 1) return board.emptySquares();
  let sets = [];
  for (let i = 0; i < board.size; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push([j, i]);
      vertical.push([i, j]);
    }
    sets = [
      ...sets,
      ...findSetsFromRow(horizontal, length, board),
      ...findSetsFromRow(vertical, length, board),
    ];
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function findSetsFromRow(row, length, board) {
  let lft = 0;
  let rt = 1;
  const sets = [];

  while (rt < row.length) {
    if (board.isOccupied([[row[lft][0], row[lft][1]]])) {
      lft = rt;
      rt += 1;
    } else if (board.isOccupied([[row[rt][0], row[rt][1]]])) {
      lft = rt + 1;
      rt += 2;
    } else if (rt - lft + 1 === length) {
      const set = [];
      for (let j = lft; j <= rt; j++) {
        set.push(row[j]);
      }
      sets.push(set);
      lft++;
      rt++;
    } else {
      rt++;
    }
  }
  return sets;
}




/***/ }),

/***/ "./src/2DSetFinder.js":
/*!****************************!*\
  !*** ./src/2DSetFinder.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   find2DSets: () => (/* binding */ find2DSets)
/* harmony export */ });
function find2DSets(board, width, height) {
  let sets = [];
  for (let i = 0; i <= board.size - width; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push(createXComponent(j, i, width));
      if (width !== height) vertical.push(createYComponent(j, i, width));
    }
    const rotated = width === height ? [] : findSetsFrom2DRow(vertical, height, board);
    sets = [...sets, ...findSetsFrom2DRow(horizontal, height, board), ...rotated];
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function createXComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([fixed, variable + idx]);
  }
  return component;
}

function createYComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([variable + idx, fixed]);
  }
  return component;
}

function findSetsFrom2DRow(row, length, board) {
  const sets = [];
  for (let i = 0; i <= row.length - length; i++) {
    const candidateSet = row.slice(i, i + length).flat();
    if (!board.isOccupied(candidateSet)) {
      sets.push(candidateSet);
    }
  }
  return sets;
}




/***/ }),

/***/ "./src/DOMAdapter.js":
/*!***************************!*\
  !*** ./src/DOMAdapter.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShipData: () => (/* binding */ getShipData)
/* harmony export */ });
function getShipData(DOMboard) {
  return Array.from(DOMboard.children)
    .filter((element) => element.classList.contains('placed-img-wrapper'))
    .map((element) => {
      const [rowStart, colStart, rowSpan, colSpan] = element.style.gridArea
        .match(/\d+/g)
        .map(Number);
      const yStart = rowStart - 1;
      const yEnd = yStart + rowSpan - 1;
      const xStart = colStart - 1;
      const xEnd = xStart + colSpan - 1;
      const name = element.firstChild.type;
      const object = {};
      object[name] = getCoordinates(xStart, xEnd, yStart, yEnd);
      return object;
    })
    .reduce((object, entry) => ({ ...object, ...entry }), {}); // converts array of objects into 1 object
}

function getCoordinates(xStart, xEnd, yStart, yEnd) {
  const set = [];
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      set.push([x, y]);
    }
  }
  return set;
}




/***/ }),

/***/ "./src/DOMBoard.js":
/*!*************************!*\
  !*** ./src/DOMBoard.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMBoardFactory: () => (/* binding */ DOMBoardFactory)
/* harmony export */ });
/* harmony import */ var _DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMInitializeBoard */ "./src/DOMInitializeBoard.js");
/* harmony import */ var _DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMSetupBoard */ "./src/DOMSetupBoard.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");
/* eslint-disable no-param-reassign */






function DOMBoardFactory(id, ROWS) {
  const board = (0,_DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_0__.initializeDOMBoard)(id, ROWS);

  (0,_observer__WEBPACK_IMPORTED_MODULE_2__.on)('boardChange', updateBoard);

  function listenForAttack() {
    board.addEventListener('click', receiveAttack);
  }

  function unlistenForAttack() {
    board.removeEventListener('click', receiveAttack);
  }

  function setOffense() {
    board.classList.remove('defense');
    board.classList.add('offense');
  }

  function setDefense() {
    board.classList.remove('offense');
    board.classList.add('defense');
  }

  function disable() {
    board.classList.add('disabled');
  }

  function enable() {
    board.classList.remove('disabled');
  }

  function setGameOver() {
    board.classList.add('disabled');
    board.classList.add('game-over');
  }

  function receiveAttack(e) {
    const { index } = e.target.dataset;
    if (!index) return;
    (0,_observer__WEBPACK_IMPORTED_MODULE_2__.emit)('attack', { coords: (0,_coordinates__WEBPACK_IMPORTED_MODULE_3__.indexToCoordinates)(index), id });
  }

  function updateBoard(boardData) {
    if (boardData.id !== id) return;

    boardData.squares.forEach((row, i) => {
      row.forEach((square, j) => {
        const index = i + j * (0,_boardSize__WEBPACK_IMPORTED_MODULE_4__.rowLength)();
        if (square.ship?.isSunk()) {
          const img = board.querySelector(`img[src*=${square.ship.name}].placed-img`);
          img.parentElement.classList.add('sunk');
          board.cells[index].classList.add('sunk');
        }
        if (square.attacked) {
          board.cells[index].classList.add('attacked');
        }
      });
    });
  }

  function setupBoard() {
    (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.setupDOMBoard)(board);
  }

  function placeSetImages(dataBoard) {
    // places on DOMboard (board variable) all images from board object argument
    dataBoard.placedShips.forEach((ship) => {
      const image = (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.newTemplateImage)(ship.name);
      const imageWrapper = (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.newTemplateWrapper)();
      setPosition(image, imageWrapper, ship.coords);
      addPlacedClass(ship.coords);
      imageWrapper.appendChild(image);
      board.appendChild(imageWrapper);
    });
  }

  function setPosition(image, wrapper, set) {
    const rowStart = set.reduce((min, coord) => (coord[1] < min ? coord[1] : min), 100) + 1;
    const rowSpan = set.reduce((max, coord) => (coord[1] > max ? coord[1] : max), -100) + 2 - rowStart;
    const colStart = set.reduce((min, coord) => (coord[0] < min ? coord[0] : min), 100) + 1;
    const colSpan = set.reduce((max, coord) => (coord[0] > max ? coord[0] : max), -100) + 2 - colStart;

    if (colSpan > rowSpan) {
      image.style.transform = `translateX(${image.style.height}) rotate(90deg)`;
    }
    wrapper.style.gridRow = `${rowStart} / span ${rowSpan}`;
    wrapper.style.gridColumn = `${colStart} / span ${colSpan}`;
  }

  function addPlacedClass(set) {
    set.forEach((coords) => {
      board.cells[(0,_coordinates__WEBPACK_IMPORTED_MODULE_3__.coordinatesToIndex)(coords)].classList.add('highlight-placed');
    });
  }

  return {
    setOffense,
    setDefense,
    setupBoard,
    placeSetImages,
    listenForAttack,
    unlistenForAttack,
    disable,
    enable,
    setGameOver,
  };
}


/***/ }),

/***/ "./src/DOMController.js":
/*!******************************!*\
  !*** ./src/DOMController.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   coverBoards: () => (/* binding */ coverBoards),
/* harmony export */   coverFleets: () => (/* binding */ coverFleets),
/* harmony export */   resetDOM: () => (/* binding */ resetDOM),
/* harmony export */   setBoardSizes: () => (/* binding */ setBoardSizes),
/* harmony export */   setGamePanelView: () => (/* binding */ setGamePanelView),
/* harmony export */   setPlayRoundView: () => (/* binding */ setPlayRoundView),
/* harmony export */   setSetupPanelView: () => (/* binding */ setSetupPanelView),
/* harmony export */   showBoards: () => (/* binding */ showBoards),
/* harmony export */   showInfoButtons: () => (/* binding */ showInfoButtons),
/* harmony export */   showSetup: () => (/* binding */ showSetup),
/* harmony export */   uncoverFleets: () => (/* binding */ uncoverFleets),
/* harmony export */   updateFleet: () => (/* binding */ updateFleet)
/* harmony export */ });
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* eslint-disable no-param-reassign */



const controlPanel = document.querySelector('.control-panel');
const startRoundButton = document.querySelector('.start-round');

const setupContainer = document.querySelector('.board-setup-container');
const stagingArea = document.querySelector('.staging-area');

const board1 = document.querySelector('#board1');
const board2 = document.querySelector('#board2');
const fleetContainers = document.querySelectorAll('.remaining-fleet');
const fleet = document.querySelectorAll('.fleet');
const attackDirection = document.querySelector('.attack-direction');
const gameState = document.querySelector('.game-state');

const switchButton = document.querySelector('.switch-turns');
const curtains = document.querySelectorAll('.curtain');
const infoButtons = document.querySelectorAll('.info');
const intro = document.querySelector('.intro-text');

const moveTrackers = document.querySelectorAll('.moves');

function setWindowHeight() {
  document.body.style.height = `${window.innerHeight}px`;
}

setWindowHeight();
window.addEventListener('resize', setWindowHeight);

function resetDOM() {
  board1.classList.add('hidden');
  board2.classList.add('hidden');
  board1.classList.remove('defense');
  board2.classList.remove('defense');
  board1.classList.remove('offense');
  board2.classList.remove('offense');
  board1.classList.remove('game-over');
  board2.classList.remove('game-over');
  setupContainer.classList.add('hidden');
  controlPanel.classList.remove('setup');
  controlPanel.classList.remove('in-game');
  controlPanel.classList.remove('two-player');
  controlPanel.classList.add('preferences');
  curtains.forEach((curtain) => curtain.classList.add('invisible'));
  fleetContainers.forEach((container) => {
    container.classList.add('invisible');
    container.classList.add('opaque');
    container.classList.remove('active');
  });
  fleet.forEach((instrument) => instrument.classList.remove('sunk'));
  attackDirection.classList.add('invisible');
  attackDirection.classList.remove('player2');
  gameState.textContent = 'Attack!';
  moveTrackers.forEach((tracker) => tracker.classList.add('hidden'));
  infoButtons.forEach((button) => {
    button.classList.add('hidden');
    button.textContent = 'info';
  });
  stagingArea.innerHTML = '';
}

function showSetup(board) {
  setupContainer.classList.remove('hidden');
  board.classList.remove('hidden');
  if (board1 === board) {
    board2.classList.add('hidden');
  } else {
    board1.classList.add('hidden');
  }
  const previews = document.querySelectorAll('.img-preview');
  const whiteList = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)());
  previews.forEach((preview) => {
    if (whiteList.includes(preview.dataset.inst)) {
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  });
}

function setBoardSizes() {
  const rowLength = Number(document.querySelector('.size-select').value) || 10;
  (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.setRowLength)(rowLength);
  board1.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  board1.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`;
  board2.style.gridTemplateColumns = `repeat(${rowLength}, 1fr)`;
  board2.style.gridTemplateRows = `repeat(${rowLength}, 1fr)`;
}

function showBoards() {
  setupContainer.classList.add('hidden');
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setTimeout(() => fleetContainers.forEach((container) => container.classList.remove('invisible')), 50);
  const whiteList = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)());
  fleet.forEach((instrument) => {
    if (whiteList.includes(instrument.dataset.inst)) {
      instrument.classList.remove('hidden');
    } else {
      instrument.classList.add('hidden');
    }
  });
}

function setPlayRoundView() {
  curtains.forEach((curtain) => curtain.classList.add('invisible'));
  uncoverFleets();
  attackDirection.classList.remove('invisible');
  attackDirection.classList.remove('opaque');
  switchButton.disabled = true;
  startRoundButton.disabled = true;
}

function updateFleet(data) {
  const targetContainer = data.id === 'board1' ? board1 : board2;
  const target = targetContainer.querySelector(`.${data.inst}`);
  target.classList.add('sunk');
}

function coverBoards() {
  curtains.forEach((curtain) => curtain.classList.remove('invisible'));
  setTimeout(() => {
    startRoundButton.disabled = false;
  }, 2000);
  switchButton.disabled = true;
  moveTrackers.forEach((tracker) => tracker.classList.add('hidden'));
  fleetContainers.forEach((container) => container.classList.remove('active'));
  infoButtons.forEach((button) => {
    button.textContent = 'info';
  });
}

function coverFleets() {
  fleetContainers.forEach((container) => container.classList.add('opaque'));
}

function uncoverFleets() {
  fleetContainers.forEach((container) => container.classList.remove('opaque'));
}

function setSetupPanelView() {
  intro.classList.add('hidden');
  controlPanel.classList.remove('preferences');
  controlPanel.classList.add('setup');
}

function setGamePanelView() {
  controlPanel.classList.remove('setup');
  controlPanel.classList.add('in-game');
}

function showInfoButtons() {
  infoButtons.forEach((button) => button.classList.remove('hidden'));
}

infoButtons.forEach((button) =>
  button.addEventListener('click', () => {
    const currentIcon = button.textContent;
    button.textContent = currentIcon === 'info' ? 'cancel' : 'info';

    const targetBoard = button.dataset.board === '1' ? board1 : board2;
    const targetFleetContainer = targetBoard.querySelector('.remaining-fleet');
    targetFleetContainer.classList.toggle('active');
  })
);




/***/ }),

/***/ "./src/DOMInitializeBoard.js":
/*!***********************************!*\
  !*** ./src/DOMInitializeBoard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeDOMBoard: () => (/* binding */ initializeDOMBoard)
/* harmony export */ });
/* eslint-disable no-param-reassign */
function createGrid(rows, board) {
  // HTML element remains after a reset; revert back to initial state
  const children = Array.from(board.children);
  children.forEach((node) => {
    if (node.classList.contains('permanent')) {
      return;
    }
    node.remove();
  });

  board.cells = [];
  for (let i = 0; i < rows * rows; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].style.gridArea = `${Math.floor(i / rows) + 1} / ${(i % rows) + 1} / span 1 / span 1`;
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

function initializeDOMBoard(id, rows) {
  const board = document.getElementById(id);
  board.numRows = rows;
  createGrid(rows, board);
  return board;
}




/***/ }),

/***/ "./src/DOMSetupBoard.js":
/*!******************************!*\
  !*** ./src/DOMSetupBoard.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   newTemplateImage: () => (/* binding */ newTemplateImage),
/* harmony export */   newTemplateWrapper: () => (/* binding */ newTemplateWrapper),
/* harmony export */   setupDOMBoard: () => (/* binding */ setupDOMBoard)
/* harmony export */ });
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _draggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./draggable */ "./src/draggable.js");
/* harmony import */ var _rotatable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rotatable */ "./src/rotatable.js");
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");







const stagingArea = document.querySelector('.staging-area');
const previewContainer = document.querySelector('.preview-container');
const previews = document.querySelectorAll('.img-preview');
const setBoardButton = document.querySelector('.set-board');
const clearButton = document.querySelector('.clear');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
clearButton.addEventListener('click', clearPlacedImages);

let remainingInstruments;
let currentBoard;
function setupDOMBoard(board) {
  setBoardButton.disabled = true;
  remainingInstruments = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_4__.getEnsemble)());
  enablePreviewImages();
  currentBoard = board;
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_5__.showSetup)(currentBoard);
  setBoardButton.addEventListener('click', () => (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('setPosition', currentBoard), { once: true });
  (0,_observer__WEBPACK_IMPORTED_MODULE_1__.on)('dragEvent', highlightHoveredCells);
  (0,_observer__WEBPACK_IMPORTED_MODULE_1__.on)('dragEnd', handleRelease);
}

function showStagedImage() {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[this.dataset.inst]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', _draggable__WEBPACK_IMPORTED_MODULE_2__.dragStart);
  image.addEventListener('touchstart', _draggable__WEBPACK_IMPORTED_MODULE_2__.dragStart);
  if (stagingArea.firstChild) {
    stagingArea.firstChild.removeResizeListener();
    stagingArea.removeChild(stagingArea.firstChild);
  }
  stagingArea.appendChild(image);
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_3__.setStagedImage)(image); // for rotation
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
}

let cellsToHighlight = [];
let cellsToUnhighlight = [];

function highlightHoveredCells(positionData) {
  const { startX, endX, startY, endY, area } = positionData;

  currentBoard.cells.forEach((cell) => {
    const bound = cell.getBoundingClientRect();
    const errorTolerance = isWithinBoard(startX, endX, startY, endY) ? 1 : -0.3;
    const half = bound.width / 2 + errorTolerance;
    // errorTolerance provides some leeway to pass comparisons (rounding errors, etc.)
    // however, if image is not within board, comparisons need to be stricter to avoid
    // highlighting a set of cells with the wrong dimensions (the check in commitValidHighlights
    // is not helpful in this case, because the size of the set could still be within the limit)

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
  cellsToHighlight = cellsToHighlight.filter((cell) => !cell.classList.contains('highlight-placed'))
  commitValidHighlights(area);
}

function commitValidHighlights(targetArea) {
  // if too many cells are in cellsToHighlight because image is straddling a border, do nothing
  // if cellsToHighlight.length is less than targetArea, image is partially off board
  if (cellsToHighlight.length < targetArea) {
    cellsToHighlight.forEach((cell) => cell.classList.add('highlight-hovered-invalid'));
    cellsToUnhighlight.forEach((cell) => cell.classList.remove('highlight-hovered-invalid'));
    currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered'));
  } else if (cellsToHighlight.length === targetArea) {
    cellsToHighlight.forEach((cell) => cell.classList.add('highlight-hovered'));
    cellsToUnhighlight.forEach((cell) => cell.classList.remove('highlight-hovered'));
    currentBoard.cells.forEach((cell) => cell.classList.remove('highlight-hovered-invalid'));
  }

  cellsToHighlight = [];
  cellsToUnhighlight = [];
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
    element.removeResizeListener();
    element.remove();
    updateHighlights();
  } else {
    (0,_draggable__WEBPACK_IMPORTED_MODULE_2__.resetDraggedImage)(element);
    removeDraggedHighlights();
  }
}

function placeImage(element) {
  const image = newTemplateImage(element.type);
  const imageWrapper = newTemplateWrapper();
  const startingCell = currentBoard.cells.findIndex((cell) =>
    cell.classList.contains('highlight-hovered')
  );

  (0,_rotatable__WEBPACK_IMPORTED_MODULE_3__.adjustForRotation)(element, image);
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

function enablePreviewImages() {
  previews.forEach((preview) => preview.classList.remove('disabled'));
}

function newTemplateImage(type) {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[type]();
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




/***/ }),

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ boardFactory)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _1DSetFinder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./1DSetFinder */ "./src/1DSetFinder.js");
/* harmony import */ var _2DSetFinder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./2DSetFinder */ "./src/2DSetFinder.js");
/* harmony import */ var _DOMAdapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOMAdapter */ "./src/DOMAdapter.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");







function boardFactory(id) {
  let totalShips = 0;
  let shipsSunk = 0;
  const placedShips = [];
  const squares = [];
  for (let i = 0; i < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); i++) {
    squares[i] = [];
    for (let j = 0; j < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); j++) {
      squares[i][j] = {};
    }
  }

  let boundSetPosition;
  function listenForPosition() {
    boundSetPosition = setPosition.bind(this);
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('setPosition', boundSetPosition);
  }

  function setPosition(DOMBoard) {
    const ships = (0,_DOMAdapter__WEBPACK_IMPORTED_MODULE_3__.getShipData)(DOMBoard);
    Object.entries(ships).forEach((ship) => {
      this.placeShip(ship[1], ship[0]);
    });
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.off)('setPosition', boundSetPosition);
  }

  const isOccupied = (coords) => {
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i];
      if (squares[coord[0]][coord[1]].ship) return true;
    }
    return false;
  };

  const outOfRange = (coords) => coords.flat().some((coord) => coord < 0 || coord > (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)() - 1);

  const placeShip = (coords, name) => {
    if (outOfRange(coords)) throw new Error('Ships cannot be placed off the board');
    if (isOccupied(coords)) throw new Error('Ships cannot be on top of ships');

    const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(coords.length, name, coords);
    coords.forEach((coord) => {
      squares[coord[0]][coord[1]].ship = newShip;
    });
    totalShips++;
    placedShips.push(newShip);
  };

  (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('attack', receiveAttack);

  function receiveAttack(attackData) {
    if (attackData.id !== id) return;

    const { coords } = attackData;
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    if (square.ship) {
      square.ship.hit();
      if (square.ship.isSunk()) {
        shipsSunk++;
        (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('sunk', { id, inst: square.ship.name });
      }
    }
    square.attacked = true;
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('boardChange', { squares, id });
  }

  function allShipsSunk() {
    return totalShips === shipsSunk;
  }

  // find1DSets is a faster algorithm for finding sets with width or length equal to 1
  function findSets(x, y = 1) {
    if (x === 1 || y === 1) {
      const length = x === 1 ? y : x;
      return (0,_1DSetFinder__WEBPACK_IMPORTED_MODULE_1__.find1DSets)(this, length);
    }
    return (0,_2DSetFinder__WEBPACK_IMPORTED_MODULE_2__.find2DSets)(this, x, y);
  }

  function emptySquares() {
    const set = [];
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares.length; j++) {
        if (!squares[i][j].ship) {
          set.push([i, j]);
        }
      }
    }
    return set;
  }

  return {
    findSets,
    isOccupied,
    placeShip,
    receiveAttack,
    allShipsSunk,
    emptySquares,
    listenForPosition,
    placedShips,
    squares,
    id,
    get size() {
      return squares.length;
    },
  };
}


/***/ }),

/***/ "./src/boardSize.js":
/*!**************************!*\
  !*** ./src/boardSize.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rowLength: () => (/* binding */ rowLength),
/* harmony export */   setRowLength: () => (/* binding */ setRowLength)
/* harmony export */ });
let rows = 10;

function rowLength() {
  return rows;
}

function setRowLength(x) {
  rows = x;
}




/***/ }),

/***/ "./src/coordinates.js":
/*!****************************!*\
  !*** ./src/coordinates.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   coordinatesToIndex: () => (/* binding */ coordinatesToIndex),
/* harmony export */   indexToCoordinates: () => (/* binding */ indexToCoordinates)
/* harmony export */ });
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");


function indexToCoordinates(index) {
  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  const x = index % size;
  const y = Math.floor(index / size);
  return [x, y];
}

function coordinatesToIndex(coords) {
  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  return coords[1] * size + coords[0];
}




/***/ }),

/***/ "./src/draggable.js":
/*!**************************!*\
  !*** ./src/draggable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dragStart: () => (/* binding */ dragStart),
/* harmony export */   resetDraggedImage: () => (/* binding */ resetDraggedImage)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* eslint-disable no-param-reassign */


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
      (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEnd', this);
    },
    { once: true }
  );

  document.addEventListener('touchmove', boundDragMove);
  document.addEventListener(
    'touchend',
    () => {
      document.removeEventListener('touchmove', boundDragMove);
      (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEnd', this);
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

  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEvent', positionData);
}

function resetDraggedImage(element) {
  element.style.top = '';
  element.style.left = '';
}




/***/ }),

/***/ "./src/ensemble.js":
/*!*************************!*\
  !*** ./src/ensemble.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEnsemble: () => (/* binding */ getEnsemble),
/* harmony export */   setEnsemble: () => (/* binding */ setEnsemble)
/* harmony export */ });
let ensemble = {
  cello: [2, 5],
  trombone: [1, 5],
  bassoon: [1, 4],
  horn: [2, 2],
  flute: [1, 3],
  clarinet: [1, 3],
  violin: [1, 3],
  trumpet: [1, 3],
  piccolo: [1, 2],
};

function setEnsemble() {
  const ensembleInput = document.querySelector('.ensemble-select');
  const selection = ensembleInput.value;

  switch (selection) {
    case 'chamber':
      ensemble = {
        // cello: [2, 5],
        // horn: [2, 2],
        violin: [1, 3],
        // clarinet: [1, 3],
        // flute: [1, 3],
      };
      break;
    case 'brass':
      ensemble = {
        trombone: [1, 5],
        horn: [2, 2],
        trumpet: [1, 3],
      };
      break;
    case 'woodwinds':
      ensemble = {
        bassoon: [1, 4],
        flute: [1, 3],
        clarinet: [1, 3],
        piccolo: [1, 2],
      };
      break;
    default:
      ensemble = {
        cello: [2, 5],
        trombone: [1, 5],
        bassoon: [1, 4],
        horn: [2, 2],
        flute: [1, 3],
        clarinet: [1, 3],
        violin: [1, 3],
        trumpet: [1, 3],
        piccolo: [1, 2],
      };
  }
}

function getEnsemble() {
  return ensemble;
}




/***/ }),

/***/ "./src/gameflow.js":
/*!*************************!*\
  !*** ./src/gameflow.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _DOMBoard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOMBoard */ "./src/DOMBoard.js");
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _moveTracker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./moveTracker */ "./src/moveTracker.js");










const controlPanel = document.querySelector('.control-panel');
const startButton = document.querySelector('.start-game');
const setBoardButton = document.querySelector('.set-board');
const switchButton = document.querySelector('.switch-turns');
const startRoundButton = document.querySelector('.start-round');
const attackDirection = document.querySelector('.attack-direction');
const gameState = document.querySelector('.game-state');

const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', reset);

startButton.addEventListener('click', beginSetup);
switchButton.addEventListener('click', _DOMController__WEBPACK_IMPORTED_MODULE_3__.coverBoards);
switchButton.addEventListener('click', _DOMController__WEBPACK_IMPORTED_MODULE_3__.coverFleets);
startRoundButton.addEventListener('click', playRound);

const moveTracker1 = (0,_moveTracker__WEBPACK_IMPORTED_MODULE_8__.moveTrackerFactory)('moves1');
const moveTracker2 = (0,_moveTracker__WEBPACK_IMPORTED_MODULE_8__.moveTrackerFactory)('moves2');

let player1;
let player2;
let currentPlayer;

let DOMBoard1;
let DOMBoard2;

let attackCount = 0;
let attackMax = 3;
const computerMoveTime = 700;

function beginSetup() {
  (0,_ensemble__WEBPACK_IMPORTED_MODULE_7__.setEnsemble)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setSetupPanelView)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setBoardSizes)();
  attackMax = Number(document.getElementById('move-select').value);
  const board1 = (0,_board__WEBPACK_IMPORTED_MODULE_0__["default"])('board1');
  const board2 = (0,_board__WEBPACK_IMPORTED_MODULE_0__["default"])('board2');
  DOMBoard1 = (0,_DOMBoard__WEBPACK_IMPORTED_MODULE_2__.DOMBoardFactory)('board1', (0,_boardSize__WEBPACK_IMPORTED_MODULE_4__.rowLength)());
  DOMBoard2 = (0,_DOMBoard__WEBPACK_IMPORTED_MODULE_2__.DOMBoardFactory)('board2', (0,_boardSize__WEBPACK_IMPORTED_MODULE_4__.rowLength)());
  player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__.humanPlayerFactory)(board1, board2, DOMBoard1, DOMBoard2, moveTracker1);
  player2 =
    document.getElementById('opponent-select').value === 'computer'
      ? (0,_player__WEBPACK_IMPORTED_MODULE_1__.computerPlayerFactory)(board2, board1, DOMBoard2, moveTracker2)
      : (player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__.humanPlayerFactory)(board2, board1, DOMBoard2, DOMBoard1, moveTracker2));
  player1.setup();
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    controlPanel.classList.add('two-player');
    setBoardButton.addEventListener('click', startGame, { once: true });
  }
}

function startGame() {
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setGamePanelView)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showInfoButtons)();
  moveTracker1.reset(attackMax);
  moveTracker2.reset(attackMax);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('sunk', _DOMController__WEBPACK_IMPORTED_MODULE_3__.updateFleet);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('attack', postAttackContinuation); // must be after 'attack' subscription from board.js; (computer attack does not emit this event)
  DOMBoard1.listenForAttack();
  DOMBoard2.listenForAttack();
  currentPlayer = player1;
  moveTracker1.show();
  if (player2.isComputer()) {
    playRound();
    (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showBoards)();
  } else {
    (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.coverBoards)();
    setTimeout( () => {
      (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showBoards)();
      currentPlayer.setTurn();
    }, 2000 ) // wait for curtain to fully cover boards before changing setup-board to board1
  }
}

function playRound() {
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setPlayRoundView)();
  currentPlayer.setTurn();
  if (currentPlayer.isComputer()) {
    resetButton.disabled = true;
    setTimeout(() => {
      resetButton.disabled = false;
    }, attackMax * computerMoveTime + 1500);
    setTimeout(switchMoveTracker, 500);
    setTimeout(computerAttacks, 1000);
  } else {
    switchMoveTracker();
  }
}

function postAttackContinuation() {
  // only runs after a player's attack, not the computer's
  currentPlayer.incrementMoveCounter();
  if (currentPlayer.sunkAllShips()) {
    gameOver();
    return;
  }
  attackCount++;
  if (attackCount >= attackMax) {
    attackCount = 0;
    if (!player2.isComputer()) {
      attackDirection.classList.add('opaque');
    }
    switchTurns();
    finishRound();
  }
}

function finishRound() {
  if (player2.isComputer()) {
    playRound();
  } else {
    DOMBoard1.disable();
    DOMBoard2.disable();
    switchButton.disabled = false;
  }
}

function computerAttacks(i = 0) {
  if (i >= attackMax) {
    switchTurns();
    setTimeout(() => playRound(), computerMoveTime);
    return;
  }

  setTimeout(() => {
    currentPlayer.attack();
    if (currentPlayer.sunkAllShips()) {
      gameOver();
      return;
    }
    computerAttacks(i + 1);
  }, computerMoveTime);
}

function switchTurns() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

function switchMoveTracker() {
  if (currentPlayer === player1) {
    moveTracker1.show();
    moveTracker2.hide();
    attackDirection.classList.remove('player2');
    if (player2.isComputer()) {
      attackDirection.classList.remove('computer');
    }
  } else {
    moveTracker1.hide();
    moveTracker2.show();
    attackDirection.classList.add('player2');
    if (player2.isComputer()) {
      attackDirection.classList.add('computer');
    }
  }
}

function gameOver() {
  gameState.textContent = 'Wins!';
  DOMBoard1.setGameOver();
  DOMBoard2.setGameOver();
}

function reset() {
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.resetDOM)();
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.removeAllEvents)();
  (0,_imageGenerator__WEBPACK_IMPORTED_MODULE_6__.removeWindowEvents)();
  attackCount = 0;
  DOMBoard1.unlistenForAttack();
  DOMBoard2.unlistenForAttack();
  setBoardButton.removeEventListener('click', finishSetup, { once: true });
  setBoardButton.removeEventListener('click', startGame, { once: true });
}


/***/ }),

/***/ "./src/imageGenerator.js":
/*!*******************************!*\
  !*** ./src/imageGenerator.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bassoon: () => (/* binding */ bassoon),
/* harmony export */   cello: () => (/* binding */ cello),
/* harmony export */   clarinet: () => (/* binding */ clarinet),
/* harmony export */   flute: () => (/* binding */ flute),
/* harmony export */   horn: () => (/* binding */ horn),
/* harmony export */   piccolo: () => (/* binding */ piccolo),
/* harmony export */   removeWindowEvents: () => (/* binding */ removeWindowEvents),
/* harmony export */   trombone: () => (/* binding */ trombone),
/* harmony export */   trumpet: () => (/* binding */ trumpet),
/* harmony export */   violin: () => (/* binding */ violin)
/* harmony export */ });
/* harmony import */ var _rotatable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rotatable */ "./src/rotatable.js");
/* eslint-disable no-param-reassign */


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
  const boundResetImageSize = resetImageSize.bind(null, image);
  window.addEventListener('resize', boundResetImageSize);
  windowEvents.push(boundResetImageSize)
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
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_0__.resetRotationAdjustment)(image);
}

function removeWindowEvents() {
  windowEvents.forEach(event => {
    window.removeEventListener('resize', event)
  })
  windowEvents = [];
}




/***/ }),

/***/ "./src/moveTracker.js":
/*!****************************!*\
  !*** ./src/moveTracker.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   moveTrackerFactory: () => (/* binding */ moveTrackerFactory)
/* harmony export */ });
function moveTrackerFactory(id) {
  const tracker = document.getElementById(id);
  tracker.moves = [];

  let current = 0;

  function hide() {
    tracker.classList.add('hidden');
  }

  function show() {
    tracker.classList.remove('hidden');
    tracker.moves.forEach((move) => {
      move.classList.remove('moved');
    });
    current = 0;
  }

  function reset(n) {
    current = 0;
    tracker.innerHTML = '';
    tracker.moves = [];
    for (let i = 0; i < n; i++) {
      const move = document.createElement('span');
      move.classList.add('move');
      tracker.moves[i] = move;
      tracker.appendChild(move);
    }
  }

  function increment() {
    tracker.moves[current].classList.add('moved');
    current++;
  }

  return {
    hide,
    show,
    reset,
    increment,
  };
}


/***/ }),

/***/ "./src/observer.js":
/*!*************************!*\
  !*** ./src/observer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   emit: () => (/* binding */ emit),
/* harmony export */   off: () => (/* binding */ off),
/* harmony export */   on: () => (/* binding */ on),
/* harmony export */   removeAllEvents: () => (/* binding */ removeAllEvents)
/* harmony export */ });
let events = {};

function on(eventName, fn) {
  events[eventName] ||= [];
  events[eventName].push(fn);
}

function off(eventName, fn) {
  if (!events[eventName]) return;

  for (let i = 0; i < events[eventName].length; i++) {
    if (events[eventName][i] === fn) {
      events[eventName].splice(i, 1);
      break;
    }
  }
}

function emit(eventName, data) {
  if (!events[eventName]) return;

  events[eventName].forEach((fn) => fn(data));
}

function removeAllEvents() {
  events = {};
}




/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerPlayerFactory: () => (/* binding */ computerPlayerFactory),
/* harmony export */   humanPlayerFactory: () => (/* binding */ humanPlayerFactory)
/* harmony export */ });
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");



function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard, moveCounter) {
  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function isComputer() {
    return false;
  }

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
  }

  function incrementMoveCounter() {
    moveCounter.increment();
  }

  return { isComputer, setup, setTurn, sunkAllShips, incrementMoveCounter };
}

function computerPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, moveCounter) {
  const ships = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)();
  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  const possibleMoves = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      possibleMoves.push([i, j]);
    }
  }

  function isComputer() {
    return true;
  }

  function attack() {
    if (possibleMoves.length === 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = possibleMoves[possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack({ id: opponentBoard.id, coords: move });
    moveCounter.increment();
  }

  function setup() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function setTurn() {
    homeDOMBoard.disable();
  }

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
  }

  return { attack, setup, isComputer, setTurn, sunkAllShips };
}




/***/ }),

/***/ "./src/rotatable.js":
/*!**************************!*\
  !*** ./src/rotatable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustForRotation: () => (/* binding */ adjustForRotation),
/* harmony export */   resetRotationAdjustment: () => (/* binding */ resetRotationAdjustment),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   setStagedImage: () => (/* binding */ setStagedImage)
/* harmony export */ });
/* eslint-disable no-param-reassign */
const rotateButton = document.querySelector('.rotate');
rotateButton.addEventListener('click', rotate);

let currentStagedImage;

function rotate() {
  if (!currentStagedImage) return;
  const rotation = Number(currentStagedImage.style.transform.match(/\d+(?=deg)/)) % 360;
  currentStagedImage.style.transform = `rotate(${rotation + 90}deg)`;
}

function setStagedImage(current) {
  currentStagedImage = current;
}

function adjustForRotation(draggedImage, newImage) {
  const rotation = Number(draggedImage.style.transform.match(/\d+(?=deg)/)) % 360;
  if (!rotation) return;
  switch (rotation) {
    case 90:
      newImage.style.transform = `translateX(${newImage.style.height}) rotate(${rotation}deg)`;
      break;
    case 180:
      newImage.style.transform = `translateY(100%) translateX(100%) rotate(${rotation}deg)`;
      break;
    default: // 270
      newImage.style.transform = `translateY(${newImage.style.width}) rotate(${rotation}deg)`;
  }
  if (rotation !== 180) {
    [draggedImage.spanY, draggedImage.spanX] = [draggedImage.spanX, draggedImage.spanY];
  }
}

function resetRotationAdjustment(image) {
  const rotation = Number(image.style.transform.match(/\d+(?=deg)/));
  const { height, width } = image.style;
  if (rotation === 90) {
    image.style.transform = image.style.transform.replace(/\d+px/, height); // replace translateX value
  } else if (rotation === 270) {
    image.style.transform = image.style.transform.replace(/\d+px/, width); // replace translateY value
  }
}




/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shipFactory)
/* harmony export */ });
function shipFactory(length, name, coordinateSet) {
  let hits = 0;
  const coords = coordinateSet;
  const hit = () => {
    if (hits < length) {
      hits++;
    } else {
      throw new Error('You already sank this ship!');
    }
  };
  const isSunk = () => hits === length;
  return { hit, isSunk, name, coords };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameflow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameflow */ "./src/gameflow.js");


/******/ })()
;
//# sourceMappingURL=main.js.map