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
function find1DSets(board, length, exclusionCondition) {
  if (length === 1) return board.emptySquares();
  const sets = [];
  for (let i = 0; i < board.size; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push([j, i]);
      vertical.push([i, j]);
    }
    sets.push(
      ...findSetsFromLine(horizontal, length, exclusionCondition),
      ...findSetsFromLine(vertical, length, exclusionCondition),
    );
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function findSetsFromLine(line, length, exclusionCondition) {
  let lft = 0;
  let rt = 1;
  const sets = [];

  while (rt < line.length) {
    if (exclusionCondition([line[lft]])) {
      lft = rt;
      rt += 1;
    } else if (exclusionCondition([line[rt]])) {
      lft = rt + 1;
      rt += 2;
    } else if (rt - lft + 1 === length) {
      const set = [];
      for (let j = lft; j <= rt; j++) {
        set.push(line[j]);
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
function find2DSets(board, width, height, exclusionCondition) {
  const sets = [];
  for (let i = 0; i <= board.size - width; i++) {
    const rows = [];
    const columns = [];
    for (let j = 0; j < board.size; j++) {
      rows.push(createXComponent(j, i, width));
      if (width !== height) columns.push(createYComponent(j, i, width));
    }
    sets.push(
      ...findSetsFromComponents(rows, height, exclusionCondition),
      ...findSetsFromComponents(columns, height, exclusionCondition) // empty array if width === height
    );
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function createXComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([variable + idx, fixed]);
  }
  return component;
}

function createYComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([fixed, variable + idx]);
  }
  return component;
}

function findSetsFromComponents(components, length, exclusionCondition) {
  const sets = [];
  for (let i = 0; i <= components.length - length; i++) {
    const candidateSet = components.slice(i, i + length).flat();
    if (!exclusionCondition(candidateSet)) {
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
        if (square.sunkInstrument) {
          board.cells[index].classList.add('final-attack');
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

  function clearBoard() {
    const children = Array.from(board.children);
    children.forEach((node) => {
      if (node.classList.contains('permanent')) {
        return;
      }
      if (node.classList.contains('cell')) {
        node.classList.remove('highlight-placed');
        return;
      }
      node.remove();
    });
  }

  function placeSetImages(dataBoard) {
    // places on DOMboard (board variable) all images from board object argument
    clearBoard();
    dataBoard.placedShips.forEach((ship) => {
      const image = (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.newTemplateImage)(ship.name);
      const imageWrapper = (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.newTemplateWrapper)();
      setPosition(image, imageWrapper, ship.coords);
      addPlacedClass(ship.coords);
      imageWrapper.appendChild(image);
      board.appendChild(imageWrapper);
    });
    (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.disableAllPreviewImages)();
  }

  function setPosition(image, wrapper, set) {
    const rowStart = set.reduce((min, coord) => (coord[1] < min ? coord[1] : min), 100) + 1;
    const rowSpan = set.reduce((max, coord) => (coord[1] > max ? coord[1] : max), -100) + 2 - rowStart;
    const colStart = set.reduce((min, coord) => (coord[0] < min ? coord[0] : min), 100) + 1;
    const colSpan = set.reduce((max, coord) => (coord[0] > max ? coord[0] : max), -100) + 2 - colStart;

    if (
      (colSpan > rowSpan && image.type !== 'glockenspiel') ||
      (colSpan < rowSpan && image.type === 'glockenspiel')
    ) {
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
/* harmony export */   broadcastSunkShip: () => (/* binding */ broadcastSunkShip),
/* harmony export */   broadcastWin: () => (/* binding */ broadcastWin),
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
/* harmony import */ var _sunkMessage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sunkMessage */ "./src/sunkMessage.js");
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

const broadcast1 = board1.querySelector('.broadcast');
const broadcast2 = board2.querySelector('.broadcast');

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
  broadcast1.classList.remove('game-over');
  broadcast2.classList.remove('game-over');
  broadcast1.classList.remove('active');
  broadcast2.classList.remove('active');
  gameState.textContent = 'Attack!';
  moveTrackers.forEach((tracker) => tracker.classList.add('invisible'));
  infoButtons.forEach((button) => {
    button.classList.add('hidden');
    button.textContent = 'info';
  });
  stagingArea.innerHTML = '';
  stagingArea.classList.remove('small-board');
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
  if (rowLength === 7) {
    stagingArea.classList.add('small-board');
  }
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

function broadcastSunkShip(data) {
  const broadcast = data.id === 'board1' ? broadcast1 : broadcast2;
  broadcast.textContent = (0,_sunkMessage__WEBPACK_IMPORTED_MODULE_2__["default"])(broadcast.dataset.player, data.inst);
  broadcast.classList.add('active');
  setTimeout(() => broadcast.classList.remove('active'), 2000);
}

function broadcastWin(id) {
  const broadcast = id === 1 ? broadcast1 : broadcast2;
  broadcast.textContent = `${broadcast.dataset.player} Wins!`;
  broadcast.classList.add('game-over');
  broadcast.classList.add('active');
}




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
/* harmony export */   disableAllPreviewImages: () => (/* binding */ disableAllPreviewImages),
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
/* harmony import */ var _mode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mode */ "./src/mode.js");








const stagingArea = document.querySelector('.staging-area');
const previewContainer = document.querySelector('.preview-container');
const previews = document.querySelectorAll('.img-preview');
const setBoardButton = document.querySelector('.set-board');
const clearButton = document.querySelector('.clear');
const autoSetupButton = document.querySelector('.random');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
clearButton.addEventListener('click', clearPlacedImages);
autoSetupButton.addEventListener('click', removeStagedImage);

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
  removeStagedImage();
  stagingArea.appendChild(image);
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_3__.setStagedImage)(image); // for rotation
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
  remainingInstruments = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_4__.getEnsemble)());
  setBoardButton.disabled = true;
  (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('clearPosition');
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

function disableAllPreviewImages() {
  previews.forEach((preview) => preview.classList.add('disabled'));
  setBoardButton.disabled = false;
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
  if ((0,_mode__WEBPACK_IMPORTED_MODULE_6__.getMode)() === 'stealth') {
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
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _unresolvedShips__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./unresolvedShips */ "./src/unresolvedShips.js");
/* harmony import */ var _shipPlacement__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shipPlacement */ "./src/shipPlacement.js");
/* eslint-disable no-param-reassign */










function boardFactory(id) {
  let totalShips = 0;
  let shipsSunk = 0;
  let totalHits = 0;
  let totalSunkHits = 0;
  let maxSharedEdges = Infinity;
  const placedShips = [];
  const squares = [];
  const remainingShips = { ...(0,_ensemble__WEBPACK_IMPORTED_MODULE_6__.getEnsemble)() };
  const unresolvedShips = (0,_unresolvedShips__WEBPACK_IMPORTED_MODULE_7__["default"])();
  for (let i = 0; i < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); i++) {
    squares[i] = [];
    for (let j = 0; j < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); j++) {
      squares[i][j] = {};
    }
  }

  function resetSetup() {
    totalShips = 0;
    placedShips.length = 0; // reassigning placedShips to [] messes up reference
    for (let i = 0; i < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); i++) {
      for (let j = 0; j < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); j++) {
        delete squares[i][j].ship; // reassigning squares[i][j] to {} similarly causes bugs
      }
    }
  }

  let boundSetPosition;
  function listenForPosition() {
    boundSetPosition = setPosition.bind(this);
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('setPosition', boundSetPosition); // board listens for setup onto the DOMBoard to be finalized
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('clearPosition', resetSetup); // autoSetup() relies on adding ships to the board object, not just the DOMBoard
  }

  function setPosition(DOMBoard) {
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.off)('setPosition', boundSetPosition);
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.off)('clearPosition', resetSetup);
    if (placedShips.length > 0) return; // if there are placedShips, autoSetup() has been called and the data already exists in board object

    const ships = (0,_DOMAdapter__WEBPACK_IMPORTED_MODULE_3__.getShipData)(DOMBoard);
    Object.entries(ships).forEach((ship) => {
      this.placeShip(ship[1], ship[0]);
    });
  }

  const isOccupied = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      if (squares[coords[0]][coords[1]].ship) return true;
    }
    return false;
  };

  const isAttacked = (coords) => squares[coords[0]][coords[1]].attacked;

  const containsAttack = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if (square.attacked) return true;
    }
    return false;
  };

  const sharedEdgeCount = () => {
    let count = 0;
    placedShips.forEach((ship) => {
      ship.coords.forEach((coordPair) => {
        (0,_shipPlacement__WEBPACK_IMPORTED_MODULE_8__.getAdjacentSquares)(coordPair).forEach((adj) => {
          if (squares[adj[0]][adj[1]].ship && squares[adj[0]][adj[1]].ship.name !== ship.name) {
            count++;
          }
        });
      });
    });
    return count / 2;
  };

  const willExceedMaxSharedEdges = (coordsSet) => {
    placeShip(coordsSet, 'testPlacement');
    const result = sharedEdgeCount() > maxSharedEdges;
    unplaceLastShip();
    return result;
  };

  const containsMissOrSunkSquare = (coordsSet) => {
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if ((square.attacked && !square.ship) || square.sunk) return true;
      // the engine uses this function for finding moves, and while it should not necessarily know
      // whether a square contains a ship, it does know about misses (i.e. an attacked square with
      // no ship). it also does not necessarily know all squares that contain sunk ships, but can
      // often deduce them by marking hit squares as sunk when there are no unresolved hits
    }
    return false;
  };

  const numAttacksInSet = (coordsSet) => {
    let attacks = 0;
    for (let i = 0; i < coordsSet.length; i++) {
      const coords = coordsSet[i];
      const square = squares[coords[0]][coords[1]];
      if (square.attacked) attacks++;
    }
    return attacks;
  };

  const hasUnresolvedHits = () => totalHits > totalSunkHits;

  const outOfRange = (coords) => coords.flat().some((coord) => coord < 0 || coord > (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)() - 1);

  function placeShip(coords, name) {
    if (outOfRange(coords)) throw new Error('Ships cannot be placed off the board');
    if (isOccupied(coords)) throw new Error('Ships cannot be on top of ships');

    const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(coords.length, name, coords);
    coords.forEach((coord) => {
      squares[coord[0]][coord[1]].ship = newShip;
    });
    totalShips++;
    placedShips.push(newShip);
  }

  function unplaceLastShip() {
    const { coords } = placedShips.pop();
    coords.forEach((coord) => {
      delete squares[coord[0]][coord[1]].ship;
    });
    totalShips--;
  }

  function setMaxSharedEdges(n) {
    maxSharedEdges = n;
  }

  (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('attack', receiveAttack);

  function receiveAttack(attackData) {
    if (attackData.id !== id) return;

    const { coords } = attackData;
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    square.attacked = true;
    if (square.ship) {
      square.ship.hit();
      totalHits++;
      if (square.ship.isSunk()) {
        handleSinkEvent(this, square);
      }
    }
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('boardChange', { squares, id });
  }

  function handleSinkEvent(board, square) {
    shipsSunk++;
    totalSunkHits += square.ship.area;
    delete remainingShips[square.ship.name];
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('sunk', { id, inst: square.ship.name });
    square.sunkInstrument = square.ship.name;

    if (!board) return; // attack from DOM interaction to Observer — `this` in receieveAttack is undefined
    // `this` is defined if called from computer — that's when marking squares is necessary for algorithm

    if (hasUnresolvedHits()) {
      square.sunk = true;
      unresolvedShips.add(square.ship);
      unresolvedShips.resolve(board);
    } else {
      unresolvedShips.clear();
      markSunkSquares();
    }
  }

  function markSunkSquares() {
    for (let i = 0; i < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); i++) {
      for (let j = 0; j < (0,_boardSize__WEBPACK_IMPORTED_MODULE_5__.rowLength)(); j++) {
        if (squares[i][j].attacked) {
          squares[i][j].sunk = true;
        }
      }
    }
  }

  function allShipsSunk() {
    return totalShips === shipsSunk;
  }

  // find1DSets is a faster algorithm for finding sets with width or length equal to 1
  function findSets(conditionFunction, x, y) {
    if (x === 1 || y === 1) {
      const length = x === 1 ? y : x;
      return (0,_1DSetFinder__WEBPACK_IMPORTED_MODULE_1__.find1DSets)(this, length, conditionFunction);
    }
    return (0,_2DSetFinder__WEBPACK_IMPORTED_MODULE_2__.find2DSets)(this, x, y, conditionFunction);
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
    containsMissOrSunkSquare,
    containsAttack,
    isAttacked,
    numAttacksInSet,
    placeShip,
    receiveAttack,
    allShipsSunk,
    emptySquares,
    listenForPosition,
    resetSetup,
    hasUnresolvedHits,
    sharedEdgeCount,
    setMaxSharedEdges,
    willExceedMaxSharedEdges,
    remainingShips,
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
      this.classList.remove('grabbing');
      (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEnd', this);
    },
    { once: true }
  );

  document.addEventListener('touchmove', boundDragMove);
  document.addEventListener(
    'touchend',
    () => {
      document.removeEventListener('touchmove', boundDragMove);
      this.classList.remove('grabbing');
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

/***/ "./src/engine.js":
/*!***********************!*\
  !*** ./src/engine.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   huntDistribution: () => (/* binding */ huntDistribution),
/* harmony export */   selectMove: () => (/* binding */ selectMove),
/* harmony export */   targetDistribution: () => (/* binding */ targetDistribution)
/* harmony export */ });
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* eslint-disable no-param-reassign */


function selectMove(distribution) {
  const keys = Object.keys(distribution);
  if (keys.length === 0) throw new Error('Distribution object is empty');
  let max = -Infinity;
  let candidateMoves = [];

  keys.forEach((key) => {
    if (distribution[key] > max) {
      candidateMoves = [key];
      max = distribution[key];
    } else if (distribution[key] === max) {
      candidateMoves.push(key);
    }
  });

  candidateMoves = candidateMoves.map((el) => (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.indexToCoordinates)(Number(el)));
  const index = Math.floor(Math.random() * candidateMoves.length);
  const move = candidateMoves[index];
  return move;
}

function huntDistribution(board) {
  if (Object.keys(board.remainingShips).length === 0)
    throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsAttack, ...dimensions);
    sets.push(...set);
  });
  return sets.flat().reduce((freq, coords) => {
    const key = (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.coordinatesToIndex)(coords);
    freq[key] = (freq[key] || 0) + 1;
    return freq;
  }, {});
}

function targetDistribution(board) {
  if (Object.keys(board.remainingShips).length === 0)
    throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsMissOrSunkSquare, ...dimensions);
    sets.push(...set);
  });
  const distribution = {};
  sets.forEach((set) => {
    const n = board.numAttacksInSet(set);
    const weightedScore = 15 ** n;

    // 15 possible placements containing 1 hit square would be necessary to equal in weight 1 possible
    // placement containing 2 hit squares, and so on.
    // Designed to prioritize squares that could complete sets with the highest number of hit squares.
    // It is not clear that this offers any improvement against random placement, but against
    // human players it should. Against humans it is more likely that hit squares which could be part of
    // a large ship are, in fact, part of that ship because a human player is less likely to place ships
    // in clusters.
    set
      .filter((coords) => !board.isAttacked(coords))
      .forEach((coords) => {
        const key = (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.coordinatesToIndex)(coords);
        distribution[key] = (distribution[key] || 0) + 1 + weightedScore;
      });
  });
  return distribution;
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
/* harmony export */   getEnsembleName: () => (/* binding */ getEnsembleName),
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

let selection = 'orchestra';

function setEnsemble() {
  const ensembleInput = document.querySelector('.ensemble-select');
  selection = ensembleInput.value;

  switch (selection) {
    case 'chamber':
      ensemble = {
        cello: [2, 5],
        horn: [2, 2],
        violin: [1, 3],
        clarinet: [1, 3],
        flute: [1, 3],
      };
      break;
    case 'brass':
      ensemble = {
        tuba: [2, 3],
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
        oboe: [1, 3],
        piccolo: [1, 2],
      };
      break;
    case 'strings':
      ensemble = {
        bass: [3, 6],
        cello: [2, 5],
        viola: [1, 3],
        violin: [1, 3]
      };
      break;
    case 'harp':
      ensemble = {
        harp: [3, 6]
      };
      break;
    case 'percussion':
      ensemble = {
        bassdrum: [3, 4],
        glockenspiel: [3, 2],
        cymbals: [2, 2],
        snare: [2, 2],
        cabasa: [2, 1],
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

function getEnsembleName() {
  return selection;
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
/* harmony import */ var _mode__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mode */ "./src/mode.js");
/* eslint-disable no-return-assign */











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

const autoSetupButton = document.querySelector('.random');

let player1;
let player2;
let currentPlayer;

let DOMBoard1;
let DOMBoard2;

let attackCount = 0;
let attackMax = 3;
const computerMoveTime = 700;

let sinkDelay = 0; // delay computer start if last move sank a ship

function beginSetup() {
  (0,_ensemble__WEBPACK_IMPORTED_MODULE_7__.setEnsemble)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setSetupPanelView)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setBoardSizes)();
  (0,_mode__WEBPACK_IMPORTED_MODULE_9__.setMode)();
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
  autoSetupButton.addEventListener('click', player1.autoSetup);
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    controlPanel.classList.add('two-player');
    autoSetupButton.addEventListener('click', player2.autoSetup);
    setBoardButton.addEventListener('click', startGame, { once: true });
  }
}

function startGame() {
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setGamePanelView)();
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showInfoButtons)();
  moveTracker1.reset(attackMax);
  moveTracker2.reset(attackMax);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('sunk', setSinkDelay);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('sunk', _DOMController__WEBPACK_IMPORTED_MODULE_3__.updateFleet);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('sunk', _DOMController__WEBPACK_IMPORTED_MODULE_3__.broadcastSunkShip);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('attack', postAttackContinuation); // must be after 'attack' subscription from board.js; (computer attack does not emit this event)
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('game-over', _DOMController__WEBPACK_IMPORTED_MODULE_3__.broadcastWin);
  DOMBoard1.listenForAttack();
  DOMBoard2.listenForAttack();
  currentPlayer = player1;
  moveTracker1.show();
  if (player2.isComputer()) {
    playRound();
    (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showBoards)();
  } else {
    (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.coverBoards)();
    setTimeout(() => {
      (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showBoards)();
      currentPlayer.setTurn();
    }, 2000); // wait for curtain to fully cover boards before changing setup-board to board1
  }
}

function playRound() {
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.setPlayRoundView)();
  currentPlayer.setTurn();
  if (currentPlayer.isComputer()) {
    resetButton.disabled = true;
    setTimeout(() => {
      resetButton.disabled = false;
    }, attackMax * computerMoveTime + 1800 + sinkDelay);
    setTimeout(switchMoveTracker, 500);
    setTimeout(computerAttacks, 1000 + sinkDelay);
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

function setSinkDelay() {
  sinkDelay = 1700;
  setTimeout(() => sinkDelay = 0, 1000);
}

function gameOver() {
  gameState.textContent = 'Wins!';
  const playerID = currentPlayer === player1 ? 1 : 2;
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.emit)('game-over', playerID);
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
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  autoSetupButton.removeEventListener('click', player2.autoSetup);
}


/***/ }),

/***/ "./src/imageGenerator.js":
/*!*******************************!*\
  !*** ./src/imageGenerator.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bass: () => (/* binding */ bass),
/* harmony export */   bassdrum: () => (/* binding */ bassdrum),
/* harmony export */   bassoon: () => (/* binding */ bassoon),
/* harmony export */   cabasa: () => (/* binding */ cabasa),
/* harmony export */   cello: () => (/* binding */ cello),
/* harmony export */   clarinet: () => (/* binding */ clarinet),
/* harmony export */   cymbals: () => (/* binding */ cymbals),
/* harmony export */   flute: () => (/* binding */ flute),
/* harmony export */   glockenspiel: () => (/* binding */ glockenspiel),
/* harmony export */   harp: () => (/* binding */ harp),
/* harmony export */   horn: () => (/* binding */ horn),
/* harmony export */   oboe: () => (/* binding */ oboe),
/* harmony export */   piccolo: () => (/* binding */ piccolo),
/* harmony export */   removeWindowEvents: () => (/* binding */ removeWindowEvents),
/* harmony export */   snare: () => (/* binding */ snare),
/* harmony export */   trombone: () => (/* binding */ trombone),
/* harmony export */   trumpet: () => (/* binding */ trumpet),
/* harmony export */   tuba: () => (/* binding */ tuba),
/* harmony export */   viola: () => (/* binding */ viola),
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
  image.src = `./images/${type}.png`;
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
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_0__.resetRotationAdjustment)(image);
}

function removeWindowEvents() {
  windowEvents.forEach((event) => {
    window.removeEventListener('resize', event);
  });
  windowEvents = [];
}




/***/ }),

/***/ "./src/mode.js":
/*!*********************!*\
  !*** ./src/mode.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMode: () => (/* binding */ getMode),
/* harmony export */   setMode: () => (/* binding */ setMode)
/* harmony export */ });
const modeSelect = document.querySelector('#mode');
let mode = 'standard';

function setMode() {
  mode = modeSelect.value;
}

function getMode() {
  return mode;
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
    tracker.classList.add('invisible');
  }

  function show() {
    tracker.classList.remove('invisible');
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
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./engine */ "./src/engine.js");
/* harmony import */ var _shipPlacement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipPlacement */ "./src/shipPlacement.js");
/* harmony import */ var _2DSetFinder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./2DSetFinder */ "./src/2DSetFinder.js");






function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard, moveCounter) {
  const ships = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)();

  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  const ens = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsembleName)();

  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function autoSetupSimple() {
    homeBoard.resetSetup();
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function autoSetup() {
    if (
      ens === 'harp' ||
      (size === 7 && (ens === 'orchestra' || ens === 'strings' || ens === 'percussion'))
    ) {
      autoSetupSimple();
      return;
    }

    try {
      homeBoard.resetSetup();
      const max = (0,_shipPlacement__WEBPACK_IMPORTED_MODULE_3__.getMaxAdjacentSquares)((0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)());
      homeBoard.setMaxSharedEdges(max);
      let conditionFunction;

      Object.entries(ships).forEach((ship) => {
        const name = ship[0];
        const [width, height] = ship[1];
        const random = Math.random();
        if (random <= 0.2 || (max < 2 && ens === 'chamber' && size === 7)) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.containsNoEdge,
            homeBoard.willExceedMaxSharedEdges
          );
        } else if (random <= 0.4) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.containsMinorityEdges,
            homeBoard.willExceedMaxSharedEdges
          );
        } else {
          conditionFunction = composeFunction(homeBoard.isOccupied, homeBoard.willExceedMaxSharedEdges);
        }

        const set = (0,_2DSetFinder__WEBPACK_IMPORTED_MODULE_4__.find2DSets)(homeBoard, width, height, conditionFunction);
        const coords = set[Math.floor(Math.random() * set.length)];
        homeBoard.placeShip(coords, name);
      });
      homeDOMBoard.placeSetImages(homeBoard);
    } catch {
      autoSetup();
    }
  }

  function composeFunction(...functions) {
    return function conditionFunctions(coordsSet) {
      for (let i = 0; i < functions.length; i++) {
        if (functions[i](coordsSet)) return true;
      }
      return false;
    };
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

  return { isComputer, setup, autoSetup, setTurn, sunkAllShips, incrementMoveCounter };
}

function computerPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, moveCounter) {
  const ships = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)();
  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  const ens = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsembleName)();
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
    const distribution = opponentBoard.hasUnresolvedHits()
      ? (0,_engine__WEBPACK_IMPORTED_MODULE_2__.targetDistribution)(opponentBoard)
      : (0,_engine__WEBPACK_IMPORTED_MODULE_2__.huntDistribution)(opponentBoard);

    const move = (0,_engine__WEBPACK_IMPORTED_MODULE_2__.selectMove)(distribution);
    opponentBoard.receiveAttack({ id: opponentBoard.id, coords: move });
    moveCounter.increment();
  }

  function setupSimple() {
    Object.entries(ships).forEach((ship) => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(homeBoard.isOccupied, ...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    });
    homeDOMBoard.placeSetImages(homeBoard);
  }

  function setup() {
    if (
      ens === 'harp' ||
      (size === 7 && (ens === 'orchestra' || ens === 'strings' || ens === 'percussion'))
    ) {
      setupSimple();
      return;
    }

    try {
      homeBoard.resetSetup();
      const max = (0,_shipPlacement__WEBPACK_IMPORTED_MODULE_3__.getMaxAdjacentSquares)((0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)());
      homeBoard.setMaxSharedEdges(max);
      let conditionFunction;

      Object.entries(ships).forEach((ship) => {
        const name = ship[0];
        const [width, height] = ship[1];
        const random = Math.random();
        if (random <= 0.2 || (max < 2 && ens === 'chamber' && size === 7)) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.containsNoEdge,
            homeBoard.willExceedMaxSharedEdges
          );
        } else if (random <= 0.4) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.containsMinorityEdges,
            homeBoard.willExceedMaxSharedEdges
          );
        } else {
          conditionFunction = composeFunction(homeBoard.isOccupied, homeBoard.willExceedMaxSharedEdges);
        }

        const set = (0,_2DSetFinder__WEBPACK_IMPORTED_MODULE_4__.find2DSets)(homeBoard, width, height, conditionFunction);
        const coords = set[Math.floor(Math.random() * set.length)];
        homeBoard.placeShip(coords, name);
      });
      homeDOMBoard.placeSetImages(homeBoard);
    } catch {
      console.log('setup failed... trying again');
      setup();
    }
  }

  function composeFunction(...functions) {
    return function conditionFunctions(coordsSet) {
      for (let i = 0; i < functions.length; i++) {
        if (functions[i](coordsSet)) return true;
      }
      return false;
    };
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
function shipFactory(area, name, coordinateSet) {
  let hits = 0;
  const coords = coordinateSet;
  const hit = () => {
    if (hits < area) {
      hits++;
    } else {
      throw new Error('You already sank this ship!');
    }
  };
  const isSunk = () => hits === area;
  return { hit, isSunk, name, coords, area };
}


/***/ }),

/***/ "./src/shipPlacement.js":
/*!******************************!*\
  !*** ./src/shipPlacement.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containsMinorityEdges: () => (/* binding */ containsMinorityEdges),
/* harmony export */   containsNoEdge: () => (/* binding */ containsNoEdge),
/* harmony export */   getAdjacentSquares: () => (/* binding */ getAdjacentSquares),
/* harmony export */   getMaxAdjacentSquares: () => (/* binding */ getMaxAdjacentSquares)
/* harmony export */ });
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");



const boardSizes = {
  '7': 'small',
  '10': 'standard',
  '13': 'large'
}

const probabilities = {
  'chamber': {
    'small': [.35, .3, .2, .1, .05],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'orchestra': {
    'small': [-Infinity],
    'standard': [.75, .1, .1, .5],
    'large': [.95, .05]
  },
  'strings': {
    'small': [-Infinity],
    'standard': [.9, 1],
    'large': [.95, .05]
  },
  'woodwinds': {
    'small': [.7, .2, .1],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'brass': {
    'small': [.8, .2],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'percussion': {
    'small': [-Infinity],
    'standard': [.9, 1],
    'large': [.95, .05]
  },
  'harp': {
    'small': [-Infinity],
    'standard': [-Infinity],
    'large': [-Infinity],
  }
}

function getMaxAdjacentSquares(size) {
  const arr = probabilities[(0,_ensemble__WEBPACK_IMPORTED_MODULE_0__.getEnsembleName)()][boardSizes[size]];

  const random = Math.random();
  let maxAdjacent;
  let cumulativeProbability = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeProbability += arr[i];
    if (random <= cumulativeProbability) {
      maxAdjacent = i;
      break;
    }
  }
  return maxAdjacent === undefined ? Infinity : maxAdjacent;
}

const containsNoEdge = (coordsSet) => {
  for (let i = 0; i < coordsSet.length; i++) {
    const coords = coordsSet[i];
    if (
      coords[0] === 0 ||
      coords[0] === (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() - 1 ||
      coords[1] === 0 ||
      coords[1] === (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() - 1
    ) {
      return false;
    }
  }
  return true;
};

const containsMinorityEdges = (coordsSet) => {
  let numEdges = 0;
  for (let i = 0; i < coordsSet.length; i++) {
    const coords = coordsSet[i];
    if (
      coords[0] === 0 ||
      coords[0] === (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() - 1 ||
      coords[1] === 0 ||
      coords[1] === (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() - 1
    ) {
      numEdges++;
    }
  }
  return numEdges < coordsSet.length / 2;
};

const getAdjacentSquares = (origin) => {
  const set = [
    [origin[0] + 1, origin[1]],
    [origin[0] - 1, origin[1]],
    [origin[0], origin[1] + 1],
    [origin[0], origin[1] - 1],
  ];
  return set.filter(
    (adjacent) =>
      adjacent[0] >= 0 && adjacent[0] < (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() && adjacent[1] >= 0 && adjacent[1] < (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)()
  );
};



/***/ }),

/***/ "./src/sunkMessage.js":
/*!****************************!*\
  !*** ./src/sunkMessage.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ message)
/* harmony export */ });
function message(player, inst) {
  return `${player}'s ${instName(inst)} ${verb(inst)} been sunk!`;
}

function instName(inst) {
  switch (inst) {
    case 'bass':
      return 'double bass';
    case 'bassdrum':
      return 'bass drum';
    case 'horn':
      return 'french horn';
    case 'snare':
      return 'snare drum';
    default:
      return inst;
  }
}

function verb(inst) {
  return inst === 'cymbals' ? 'have' : 'has';
}


/***/ }),

/***/ "./src/unresolvedShips.js":
/*!********************************!*\
  !*** ./src/unresolvedShips.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unresolvedShipList)
/* harmony export */ });
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _2DSetFinder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./2DSetFinder */ "./src/2DSetFinder.js");
/* eslint-disable no-param-reassign */



function unresolvedShipList() {
  let list = [];

  function resolve(board) {
    for (let i = 0; i < list.length; i++) {
      const { name } = list[i];
      const [width, height] = [...(0,_ensemble__WEBPACK_IMPORTED_MODULE_0__.getEnsemble)()[name]];
      const invalidPlacement = makeConditionFunction(board, name);
      const set = (0,_2DSetFinder__WEBPACK_IMPORTED_MODULE_1__.find2DSets)(board, width, height, invalidPlacement);
      // find2DSets must be used because it can check that a set includes one square that meets a condition
      // find1DSets looks at each square individually for conditions that would disqualify a set

      if (set.length === 0) {
        throw new Error(`No possible sets found for ${name}`);
      } else if (set.length === 1) {
        markSunkSquares(board, set[0]);
        remove(name);
        resolve(board);
        break;
      }
    }
  }

  function markSunkSquares(board, set) {
    set.forEach((coords) => {
      board.squares[coords[0]][coords[1]].sunk = true;
    });
  }

  function makeConditionFunction(board, name) {
    return function conditionFunction(coordsSet) {
      if (
        !coordsSet.some((coords) => {
          const square = board.squares[coords[0]][coords[1]];
          return square.sunkInstrument === name;
        })
      ) {
        return true;
      }
      if (
        coordsSet.some((coords) => {
          const square = board.squares[coords[0]][coords[1]];
          return !square.attacked || (square.sunk && square.sunkInstrument !== name);
        })
      ) {
        return true;
      }

      return false;
    };
  }

  function add(ship) {
    // list is ordered from largest to smallest because larger instruments
    // are more likely to have only one possible placement
    for (let i = 0; i < list.length; i++) {
      if (ship.area > list[i].area) {
        list.splice(i, 0, ship);
        return;
      }
    }
    list.push(ship);
  }

  function remove(name) {
    for (let i = 0; i < list.length; i++) {
      if (name === list[i].name) {
        list.splice(i, 1);
        return;
      }
    }
    throw new Error('No instrument found to remove');
  }

  function clear() {
    list = [];
  }

  return {
    resolve,
    add,
    clear,
  };
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