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
/* harmony export */   addResetGlow: () => (/* binding */ addResetGlow),
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
/* harmony import */ var _statsPopulator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./statsPopulator */ "./src/statsPopulator.js");
/* harmony import */ var _audioSamples__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./audioSamples */ "./src/audioSamples.js");
/* eslint-disable no-param-reassign */






const controlPanel = document.querySelector('.control-panel');
const startRoundButton = document.querySelector('.start-round');
const resetButton = document.querySelector('.reset');
const settingsButton = document.querySelector('.settings-toggle .gear');
const settingsPanel = document.querySelector('.settings-panel');

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

settingsButton.addEventListener('click', () => {
  settingsPanel.classList.toggle('open');
})

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
  attackDirection.classList.remove('computer');
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
  resetButton.classList.remove('glow');
  (0,_statsPopulator__WEBPACK_IMPORTED_MODULE_3__.resetStatsPanel)();
  (0,_audioSamples__WEBPACK_IMPORTED_MODULE_4__.disableAudioButton)();
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
  moveTrackers.forEach((tracker) => tracker.classList.add('invisible'));
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

function addResetGlow() {
  resetButton.classList.add('glow');
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
/* harmony import */ var _statsPopulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./statsPopulator */ "./src/statsPopulator.js");
/* harmony import */ var _audioSamples__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audioSamples */ "./src/audioSamples.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _draggable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./draggable */ "./src/draggable.js");
/* harmony import */ var _rotatable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rotatable */ "./src/rotatable.js");
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");
/* harmony import */ var _mode__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mode */ "./src/mode.js");










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
autoSetupButton.addEventListener('click', _statsPopulator__WEBPACK_IMPORTED_MODULE_1__.resetStatsPanel);
autoSetupButtonSimple.addEventListener('click', _statsPopulator__WEBPACK_IMPORTED_MODULE_1__.resetStatsPanel);
autoSetupButton.addEventListener('click', _audioSamples__WEBPACK_IMPORTED_MODULE_2__.disableAudioButton);
autoSetupButtonSimple.addEventListener('click', _audioSamples__WEBPACK_IMPORTED_MODULE_2__.disableAudioButton);

let remainingInstruments;
let currentBoard;
function setupDOMBoard(board) {
  setBoardButton.disabled = true;
  remainingInstruments = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_6__.getEnsemble)());
  enablePreviewImages();
  currentBoard = board;
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_7__.showSetup)(currentBoard);
  setBoardButton.addEventListener('click', () => (0,_observer__WEBPACK_IMPORTED_MODULE_3__.emit)('setPosition', currentBoard), { once: true });
  (0,_observer__WEBPACK_IMPORTED_MODULE_3__.on)('dragEvent', highlightHoveredCells);
  (0,_observer__WEBPACK_IMPORTED_MODULE_3__.on)('dragEnd', handleRelease);
}

function activateStatsPanel() {
  _statsPopulator__WEBPACK_IMPORTED_MODULE_1__.enableStatsButton();
  _statsPopulator__WEBPACK_IMPORTED_MODULE_1__[this.dataset.inst]();
}

function activateAudioButton() {
  _audioSamples__WEBPACK_IMPORTED_MODULE_2__.enableAudioButton();
  _audioSamples__WEBPACK_IMPORTED_MODULE_2__.setAudio(this.dataset.inst);
}

function showStagedImage() {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[this.dataset.inst]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', _draggable__WEBPACK_IMPORTED_MODULE_4__.dragStart);
  image.addEventListener('touchstart', _draggable__WEBPACK_IMPORTED_MODULE_4__.dragStart);
  removeStagedImage();
  stagingArea.appendChild(image);
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_5__.setStagedImage)(image); // for rotation
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
  _statsPopulator__WEBPACK_IMPORTED_MODULE_1__.resetStatsPanel();
  _audioSamples__WEBPACK_IMPORTED_MODULE_2__.disableAudioButton();
  remainingInstruments = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_6__.getEnsemble)());
  setBoardButton.disabled = true;
  (0,_observer__WEBPACK_IMPORTED_MODULE_3__.emit)('clearPosition');
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
    _statsPopulator__WEBPACK_IMPORTED_MODULE_1__.resetStatsPanel();
    _audioSamples__WEBPACK_IMPORTED_MODULE_2__.disableAudioButton();
    element.removeResizeListener();
    element.remove();
    updateHighlights();
  } else {
    (0,_draggable__WEBPACK_IMPORTED_MODULE_4__.resetDraggedImage)(element);
    removeDraggedHighlights();
  }
}

function placeImage(element) {
  const image = newTemplateImage(element.type);
  const imageWrapper = newTemplateWrapper();
  const startingCell = currentBoard.cells.findIndex((cell) =>
    cell.classList.contains('highlight-hovered')
  );

  (0,_rotatable__WEBPACK_IMPORTED_MODULE_5__.adjustForRotation)(element, image);
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
  if ((0,_mode__WEBPACK_IMPORTED_MODULE_8__.getMode)() === 'stealth') {
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

/***/ "./src/audioEffects.js":
/*!*****************************!*\
  !*** ./src/audioEffects.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   subscribeToEvents: () => (/* binding */ subscribeToEvents)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./src/observer.js");


const soundToggle = document.querySelector('input[name="sound-toggle"]');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create a GainNode for volume control
const sfxGain = audioContext.createGain();
sfxGain.gain.value = 0.7; // Default volume
sfxGain.connect(audioContext.destination);

const audioFiles = {
  hit: './audio/Sound Effects/hit.mp3',
  miss: './audio/Sound Effects/miss.mp3',
  explosion1: './audio/Sound Effects/explosion1.mp3',
  explosion2: './audio/Sound Effects/explosion2.mp3',
  explosion3: './audio/Sound Effects/explosion3.mp3',
  explosion4: './audio/Sound Effects/explosion4.mp3',
};

const audioBuffers = {};

function subscribeToEvents() {
  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.on)('hit', playHit);
  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.on)('miss', playMiss);
  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.on)('sunk', playExplosion);
}

async function loadAudioBuffer(name, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);
}

// Preload all sounds
Promise.all(Object.entries(audioFiles).map(([name, url]) => loadAudioBuffer(name, url)));

function playBuffer(buffer) {
  if (!soundToggle.checked) return;
  // iOS: resume context if needed
  if (audioContext.state === 'suspended') audioContext.resume();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(sfxGain); // Connect to gain node instead of destination
  source.start(0);
}

function playHit() {
  if (audioBuffers.hit) playBuffer(audioBuffers.hit);
}

function playMiss() {
  if (audioBuffers.miss) playBuffer(audioBuffers.miss);
}

function playExplosion() {
  const idx = Math.floor(Math.random() * 4) + 1;
  const buffer = audioBuffers[`explosion${idx}`];
  if (buffer) playBuffer(buffer);
}

const sfxSlider = document.getElementById('sfx-volume');
if (sfxSlider) {
  sfxSlider.addEventListener('input', (e) => {
    sfxGain.gain.value = parseFloat(e.target.value);
  });
}




/***/ }),

/***/ "./src/audioSamples.js":
/*!*****************************!*\
  !*** ./src/audioSamples.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableAudioButton: () => (/* binding */ disableAudioButton),
/* harmony export */   enableAudioButton: () => (/* binding */ enableAudioButton),
/* harmony export */   setAudio: () => (/* binding */ setAudio)
/* harmony export */ });
let currentAudio;
let progressRAF;
const audioButton = document.querySelector('.inst-sample');
const audioButtonIcon = audioButton.querySelector('span');
const boardSetup = document.querySelector('.board-setup-container');

audioButton.addEventListener('click', handleAudio);

function disableAudioButton() {
  if (!currentAudio || currentAudio.paused) {
    audioButton.disabled = true;
    audioButton.removeAttribute('data-inst');
  } else {
    currentAudio.addEventListener('ended', () => {
      audioButton.disabled = true;
      audioButton.removeAttribute('data-inst');
    });
  }
}

function enableAudioButton() {
  audioButton.disabled = false;
}

function setAudio(inst) {
  audioButton.setAttribute('data-inst', inst);
}

function handleAudio() {
  if (audioButtonIcon.textContent === 'music_note') {
    playAudio();
  } else {
    stopAudio();
  }
}

function playAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  const inst = audioButton.getAttribute('data-inst');
  if (!inst) {
    console.warn('No instrument selected for audio playback.');
    return;
  }
  currentAudio = new Audio(`./audio/${inst}.mp3`);

  boardSetup.style.setProperty('--audio-progress', '0%');
  boardSetup.style.setProperty('--audio-progress-opacity', '1');

  function updateProgressBar() {
    if (currentAudio.duration) {
      const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
      boardSetup.style.setProperty('--audio-progress', `${percent}%`);
    }
    progressRAF = requestAnimationFrame(updateProgressBar);
  }

  progressRAF = requestAnimationFrame(updateProgressBar);

  currentAudio.addEventListener('pause', () => {
    cancelAnimationFrame(progressRAF);
  });

  currentAudio.addEventListener('ended', () => {
    cancelAnimationFrame(progressRAF);
    audioButtonIcon.textContent = 'music_note';
    setTimeout(() => boardSetup.style.setProperty('--audio-progress-opacity', '0'), 800);
    setTimeout(() => boardSetup.style.setProperty('--audio-progress', '0%'), 1200);
  });

  currentAudio.play().catch((error) => {
    console.error('Error playing audio:', error);
    boardSetup.style.setProperty('--audio-progress-opacity', '0');
    boardSetup.style.setProperty('--audio-progress', '0%');
  });
  audioButtonIcon.textContent = 'stop_circle';
}

function stopAudio() {
  if (currentAudio) {
    boardSetup.style.setProperty('--audio-progress-opacity', '0');
    boardSetup.style.setProperty('--audio-progress', '0%');
    cancelAnimationFrame(progressRAF);

    if (isIOS()) {
      // iOS: skip fade b/c of volume property limitation; just pause and reset
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.volume = 1.0;
      audioButtonIcon.textContent = 'music_note';
      return;
    }

    // Smoother fade out
    const fadeStep = 0.008;
    const fadeInterval = 1;
    const fadeOut = setInterval(() => {
      if (currentAudio.volume > fadeStep) {
        currentAudio.volume = Math.max(0, currentAudio.volume - fadeStep);
      } else {
        clearInterval(fadeOut);
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 1.0; // Reset for next play
        audioButtonIcon.textContent = 'music_note';
      }
    }, fadeInterval);
  }
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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
      } else {
        (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('hit');
      }
    } else {
      (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('miss');
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
/* harmony export */   getAverage: () => (/* binding */ getAverage),
/* harmony export */   huntDistribution: () => (/* binding */ huntDistribution),
/* harmony export */   isEdge: () => (/* binding */ isEdge),
/* harmony export */   selectMove: () => (/* binding */ selectMove),
/* harmony export */   targetDistribution: () => (/* binding */ targetDistribution)
/* harmony export */ });
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* harmony import */ var _boardSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boardSize */ "./src/boardSize.js");
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

function huntDistribution(board, unweighted) {
  if (Object.keys(board.remainingShips).length === 0)
    throw new Error('There are no remaining ships to test');
  const sets = [];
  Object.entries(board.remainingShips).forEach((ship) => {
    const dimensions = ship[1];
    const set = board.findSets(board.containsAttack, ...dimensions);
    sets.push(...set);
  });
  const distribution = sets.flat().reduce((freq, coords) => {
    const key = (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.coordinatesToIndex)(coords);
    freq[key] = (freq[key] || 0) + 1;
    return freq;
  }, {});
  return unweighted ? distribution : weightEdges(distribution);
}

function weightEdges(distribution) {
  const keys = Object.keys(distribution);
  if (keys.length === 0) throw new Error('Distribution object is empty');

  const avg = getAverage(distribution);
  const weight = Math.floor(Math.random() * avg * 1.5);
  const weightedDistribution = {};

  keys.forEach((key) => {
    weightedDistribution[key] = distribution[key] + (isEdge(key) ? weight : 0);
  });
  return weightedDistribution;
}

function getAverage(distribution) {
  const keys = Object.keys(distribution);
  let total = 0;
  keys.forEach((key) => {
    total += distribution[key];
  });
  return total / keys.length;
}

function isEdge(index) {
  const coords = (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.indexToCoordinates)(index);
  return coords.some((coord) => coord === 0 || coord === (0,_boardSize__WEBPACK_IMPORTED_MODULE_1__.rowLength)() - 1);
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
/* harmony import */ var _audioEffects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./audioEffects */ "./src/audioEffects.js");
/* harmony import */ var _music__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./music */ "./src/music.js");
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

const autoSetupButtonSimple = document.querySelector('.random');
const autoSetupButton = document.querySelector('.random-enhanced');

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
  autoSetupButtonSimple.addEventListener('click', player1.autoSetupSimple);
  autoSetupButton.addEventListener('click', player1.autoSetup);
  setBoardButton.addEventListener('click', finishSetup, { once: true });
}

function finishSetup() {
  autoSetupButtonSimple.removeEventListener('click', player1.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  player2.setup();
  if (player2.isComputer()) {
    startGame();
  } else {
    controlPanel.classList.add('two-player');
    autoSetupButtonSimple.addEventListener('click', player2.autoSetupSimple);
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
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('sunk', _music__WEBPACK_IMPORTED_MODULE_11__.removeInstrument);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('attack', postAttackContinuation); // must be after 'attack' subscription from board.js; (computer attack does not emit this event)
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('game-over', _DOMController__WEBPACK_IMPORTED_MODULE_3__.broadcastWin);
  (0,_observer__WEBPACK_IMPORTED_MODULE_5__.on)('game-over', _DOMController__WEBPACK_IMPORTED_MODULE_3__.addResetGlow);
  (0,_audioEffects__WEBPACK_IMPORTED_MODULE_10__.subscribeToEvents)();
  (0,_music__WEBPACK_IMPORTED_MODULE_11__.startMusic)();
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
  sinkDelay = 700;
  setTimeout(() => (sinkDelay = 0), 1000);
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
  autoSetupButtonSimple.removeEventListener('click', player1.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player1.autoSetup);
  autoSetupButtonSimple.removeEventListener('click', player2.autoSetupSimple);
  autoSetupButton.removeEventListener('click', player2.autoSetup);
  (0,_music__WEBPACK_IMPORTED_MODULE_11__.stopMusic)();
  (0,_music__WEBPACK_IMPORTED_MODULE_11__.resetRemovedInstruments)();
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

/***/ "./src/music.js":
/*!**********************!*\
  !*** ./src/music.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   removeInstrument: () => (/* binding */ removeInstrument),
/* harmony export */   resetRemovedInstruments: () => (/* binding */ resetRemovedInstruments),
/* harmony export */   startMusic: () => (/* binding */ startMusic),
/* harmony export */   stopMusic: () => (/* binding */ stopMusic)
/* harmony export */ });
/* harmony import */ var _ensemble__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ensemble */ "./src/ensemble.js");
/* eslint-disable no-param-reassign */


const musicToggle = document.querySelector('input[name="music-toggle"]');
const ENSEMBLES_WITH_PERCUSSION = ['brass', 'strings', 'chamber'];
const boardSetupContainer = document.querySelector('.board-setup-container');

let path;
let instruments;
const musicBuffers = {};
let musicSources = {};
const removedInstruments = new Set();

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const musicGain = audioContext.createGain();
musicGain.gain.value = 1;
musicGain.connect(audioContext.destination);

musicToggle.addEventListener('change', async () => {
  // only start/stop music if in gameplay mode
  if (!boardSetupContainer.classList.contains('hidden')) return;

  if (musicToggle.checked) {
    await startMusic();
  } else {
    stopMusic();
  }
});

const musicSlider = document.getElementById('music-volume');
musicSlider.addEventListener('input', (e) => {
  musicGain.gain.value = parseFloat(e.target.value);
});

function setPath() {
  path = `audio/music/${(0,_ensemble__WEBPACK_IMPORTED_MODULE_0__.getEnsembleName)()}`;
}

function setInstruments() {
  instruments = Object.keys((0,_ensemble__WEBPACK_IMPORTED_MODULE_0__.getEnsemble)());

  if (ENSEMBLES_WITH_PERCUSSION.includes((0,_ensemble__WEBPACK_IMPORTED_MODULE_0__.getEnsembleName)())) {
    instruments.push('percussion');
  }
}

async function loadMusicBuffer(url) {
  if (musicBuffers[url]) return musicBuffers[url];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  musicBuffers[url] = buffer;
  return buffer;
}

async function startMusic() {
  if (!musicToggle.checked) return;

  setPath();
  setInstruments();
  stopMusic();

  // Load all buffers in parallel
  const urls = instruments.map((key) => `${path}/${key}.mp3`);
  await Promise.all(urls.map(loadMusicBuffer));

  // Start all at the same time, except removed instruments
  const now = audioContext.currentTime;
  instruments.forEach((key) => {
    if (removedInstruments.has(key)) return;

    const url = `${path}/${key}.mp3`;
    const source = audioContext.createBufferSource();
    source.buffer = musicBuffers[url];
    source.loop = true;
    const gain = audioContext.createGain();
    gain.gain.value = 1;
    source.connect(gain).connect(musicGain);
    source.start(now);
    musicSources[key] = { source, gain };
  });
}

function removeInstrument(data) {
  if (data.id !== 'board1') return;

  const key = data.inst;
  removedInstruments.add(key);
  const entry = musicSources[key];
  if (entry) {
    const fadeTime = 0.4;
    const stopAt = audioContext.currentTime + fadeTime;
    entry.gain.gain.linearRampToValueAtTime(0.0001, stopAt);
    entry.source.stop(stopAt);
    entry.source.onended = () => {
      entry.gain.disconnect();
      delete musicSources[key];
    };
  }
}

function stopMusic() {
  Object.values(musicSources).forEach(({ source, gain }) => {
    const fadeTime = .5;
    const stopAt = audioContext.currentTime + fadeTime;
    gain.gain.linearRampToValueAtTime(0.0001, stopAt);
    source.stop(stopAt);
    source.onended = () => {
      gain.disconnect();
    };
  });
  musicSources = {};
}

function resetRemovedInstruments() {
  removedInstruments.clear();
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






function playerFactory(homeBoard, opponentBoard, homeDOMBoard) {
  const ships = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsemble)();
  const size = (0,_boardSize__WEBPACK_IMPORTED_MODULE_0__.rowLength)();
  const ens = (0,_ensemble__WEBPACK_IMPORTED_MODULE_1__.getEnsembleName)();

  function sunkAllShips() {
    return opponentBoard.allShipsSunk();
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
        if (random <= 0.1 || (max < 2 && ens === 'chamber' && size === 7)) {
          conditionFunction = composeFunction(
            homeBoard.isOccupied,
            _shipPlacement__WEBPACK_IMPORTED_MODULE_3__.containsNoEdge,
            homeBoard.willExceedMaxSharedEdges
          );
        } else if (random <= 0.15) {
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

  return { sunkAllShips, autoSetup, autoSetupSimple };
}

function humanPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, opponentDOMBoard, moveCounter) {
  const prototype = playerFactory(homeBoard, opponentBoard, homeDOMBoard);

  function isComputer() {
    return false;
  }

  function setup() {
    homeDOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function setTurn() {
    opponentDOMBoard.setDefense();
    opponentDOMBoard.enable();
    homeDOMBoard.setOffense();
  }

  function incrementMoveCounter() {
    moveCounter.increment();
  }

  return { ...prototype, isComputer, setup, setTurn, incrementMoveCounter };
}

function computerPlayerFactory(homeBoard, opponentBoard, homeDOMBoard, moveCounter) {
  const { sunkAllShips, autoSetup } = playerFactory(homeBoard, opponentBoard, homeDOMBoard);

  function isComputer() {
    return true;
  }

  function setup() {
    autoSetup();
  }

  function setTurn() {
    homeDOMBoard.disable();
  }

  function attack() {
    const unweighted = Math.random() < .66;
    const distribution = opponentBoard.hasUnresolvedHits()
      ? (0,_engine__WEBPACK_IMPORTED_MODULE_2__.targetDistribution)(opponentBoard)
      : (0,_engine__WEBPACK_IMPORTED_MODULE_2__.huntDistribution)(opponentBoard, unweighted);

    const move = (0,_engine__WEBPACK_IMPORTED_MODULE_2__.selectMove)(distribution);
    opponentBoard.receiveAttack({ id: opponentBoard.id, coords: move });
    moveCounter.increment();
  }

  return { sunkAllShips, isComputer, setup, setTurn, attack };
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
    // 35% chance no shared edges allowed, 65% chance 1 shared edge allowed, etc.
    'small': [.35, .3, .2, .1, .05],
    'standard': [.9, .1],
    'large': [.95, .05]
  },
  'orchestra': {
    'small': [-Infinity],
    'standard': [.75, .1, .1, .05],
    'large': [.95, .05]
  },
  'strings': {
    'small': [-Infinity],
    'standard': [.9, .1],
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
    'standard': [.9, .1],
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

/***/ "./src/statsPopulator.js":
/*!*******************************!*\
  !*** ./src/statsPopulator.js ***!
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
/* harmony export */   enableStatsButton: () => (/* binding */ enableStatsButton),
/* harmony export */   flute: () => (/* binding */ flute),
/* harmony export */   glockenspiel: () => (/* binding */ glockenspiel),
/* harmony export */   harp: () => (/* binding */ harp),
/* harmony export */   horn: () => (/* binding */ horn),
/* harmony export */   oboe: () => (/* binding */ oboe),
/* harmony export */   piccolo: () => (/* binding */ piccolo),
/* harmony export */   resetStatsPanel: () => (/* binding */ resetStatsPanel),
/* harmony export */   snare: () => (/* binding */ snare),
/* harmony export */   trombone: () => (/* binding */ trombone),
/* harmony export */   trumpet: () => (/* binding */ trumpet),
/* harmony export */   tuba: () => (/* binding */ tuba),
/* harmony export */   viola: () => (/* binding */ viola),
/* harmony export */   violin: () => (/* binding */ violin)
/* harmony export */ });
const statsPanel = document.querySelector('.stats-panel');
const statsButton = document.querySelector('.inst-stats');
const statsButtonIcon = statsButton.querySelector('span')

function bass() {
  const instTitle = 'Bass';
  const instLink = 'https://www.youtube.com/watch?v=nUUVSxZ4ohI';

  const statsData = [
    { label: 'Dexterity', value: 77 },
    { label: 'Intellect', value: 84 },
    { label: 'Charisma', value: 88 },
    { label: 'Strength', value: 90 },
    { label: 'Balance', value: 94 },
  ];

  const notesData = [
    'Tuned in fourths, unlike the other members of the string section, which are tuned in fifths',
    'Known as the contrabass, string bass, or double bass',
    'The term "double bass" comes from its original role of doubling the cello part an octave lower',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cello() {
  const instTitle = 'Cello';
  const instLink = 'https://www.youtube.com/watch?v=RcqzPoMza7c';

  const statsData = [
    { label: 'Dexterity', value: 90 },
    { label: 'Intellect', value: 93 },
    { label: 'Charisma', value: 96 },
    { label: 'Stamina', value: 95 },
    { label: 'Balance', value: 94 },
  ];

  const notesData = [
    'Range closely mirrors that of the human voice, spanning bass to soprano',
    'Full name is violoncello, which translates to “little violone"',
    "Most people's favorite instrument",
    'The oldest surviving cello was crafted by Andrea Amati between 1538 and 1560'
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function viola() {
  const instTitle = 'Viola';
  const instLink = 'https://www.youtube.com/watch?v=XierDLeUiYg';

  const statsData = [
    { label: 'Dexterity', value: 87 },
    { label: 'Intellect', value: 94 },
    { label: 'Charisma', value: 92 },
    { label: 'Stamina', value: 90 },
    { label: 'Balance', value: 89 },
  ];

  const notesData = [
    'Often confused with the violin, but is a bit bigger and possesses a deeper, mellower sound',
    'Reads alto clef, unique among string instruments',
    'Unlike the standardized size of violins, violas lack a uniform full size. They typically range from 15 to 18 inches in body length',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function violin() {
  const instTitle = 'Violin';
  const instLink = 'https://www.youtube.com/watch?v=zgaQFLUdUL0';

  const statsData = [
    { label: 'Dexterity', value: 97 },
    { label: 'Intellect', value: 87 },
    { label: 'Charisma', value: 84 },
    { label: 'Stamina', value: 91 },
    { label: 'Strength', value: 93 },
  ];

  const notesData = [
    'The modern violin emerged in early 16th-century northern Italy.',
    'Plays the most notes of any instrument in the orchestra',
    'The most expensive violin is a 1715 Stradivarius, sold for $23 million in 2025',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function bassoon() {
  const instTitle = 'Bassoon';
  const instLink = 'https://www.youtube.com/watch?v=-kmy-hm3ai4';

  const statsData = [
    { label: 'Dexterity', value: 86 },
    { label: 'Guile', value: 81 },
    { label: 'Charisma', value: 94 },
    { label: 'Stamina', value: 84 },
    { label: 'Strength', value: 87 },
  ];

  const notesData = [
    'Evolved from the dulcian in the 16th and 17th centuries',
    'Features a conical bore that doubles back on itself, contributing to its rich, warm tone and extensive range',
    'Traditionally made from maple wood',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function clarinet() {
  const instTitle = 'Clarinet';
  const instLink = 'https://www.youtube.com/watch?v=nENXs6n_ITI';
  const statsData = [
    { label: 'Dexterity', value: 93 },
    { label: 'Intellect', value: 85 },
    { label: 'Charisma', value: 91 },
    { label: 'Luck', value: 92 },
    { label: 'Balance', value: 88 },
  ];

  const notesData = [
    'The modern clarinet was developed around 1700 in Nuremberg, Germany',
    'Prominent in jazz, klezmer, and various folk traditions',
    'The clarinet family ranges from the high-pitched E♭ clarinet to the low, deep contrabass clarinet',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function oboe() {
  const instTitle = 'Oboe';
  const instLink = 'https://www.youtube.com/watch?v=QNBsgfh4UMY';

  const statsData = [
    { label: 'Dexterity', value: 87 },
    { label: 'Intellect', value: 88 },
    { label: 'Charisma', value: 86 },
    { label: 'Willpower', value: 94 },
    { label: 'Quirkiness', value: 95 },
  ];

  const notesData = [
    'A professional oboist will spend approxiimately 30% of their life making reeds',
    'Orchestras tune to an A played by the principal oboist',
    'The term "oboe" is derived from the French word "hautbois," meaning "high wood," reflecting its pitch and wooden construction',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function flute() {
  const instTitle = 'Flute';
  const instLink = 'https://www.youtube.com/watch?v=MTqOckjkkeE';

  const statsData = [
    { label: 'Dexterity', value: 97 },
    { label: 'Intellect', value: 90 },
    { label: 'Stealth', value: 92 },
    { label: 'Strength', value: 85 },
    { label: 'Balance', value: 88 },
  ];

  const notesData = [
    'Archaeological discoveries indicate flutes made from bird bones and mammoth ivory dating back over 30,000 years',
    'Throughout history, flutes have also been crafted from materials such as wood, bamboo, jade, glass, silver, and gold',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function piccolo() {
  const instTitle = 'Piccolo';
  const instLink = 'https://www.youtube.com/watch?v=ivQpiJos1Sw';

  const statsData = [
    { label: 'Dexterity', value: 94 },
    { label: 'Intellect', value: 86 },
    { label: 'Stealth', value: 100 },
    { label: 'Strength', value: 84 },
    { label: 'Charisma', value: 90 },
  ];

  const notesData = [
    'Highest-pitched instrument of the orchestra',
    'Evolved from military transverse flutes used during the Middle Ages',
    'Due to its piercing sound, the piccolo is a staple in military and marching bands',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function tuba() {
  const instTitle = 'Tuba';
  const instLink = 'https://www.youtube.com/watch?v=PzH4XAv9ZCQ';

  const statsData = [
    { label: 'Dexterity', value: 72 },
    { label: 'Strength', value: 88 },
    { label: 'Charisma', value: 92 },
    { label: 'Balance', value: 95 },
    { label: 'Luck', value: 88 },
  ];

  const notesData = [
    'First appeared in the mid-19th century',
    'Largest and lowest-pitched instrument in the brass family',
    'Used in orchestras, marching bands, drum and bugle corps, and jazz bands ',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function trombone() {
  const instTitle = 'Trombone';
  const instLink = 'https://www.youtube.com/watch?v=9MNS9LKcDII';
  const statsData = [
    { label: 'Dexterity', value: 80 },
    { label: 'Strength', value: 92 },
    { label: 'Charisma', value: 86 },
    { label: 'Balance', value: 89 },
    { label: 'Slidy-ness', value: 100 },
  ];
  const notesData = [
    'Employs a telescoping slide to change pitch, allowing for smooth glissandos',
    'Used in a wide range of musical genres, including classical, jazz, funk, ska, and salsa',
    'Orchestras also feature the bigger and lower-pitched bass trombone'
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function trumpet() {
  const instTitle = 'Trumpet';
  const instLink = 'https://www.youtube.com/watch?v=QcIp7K2UFgE';

  const statsData = [
    { label: 'Volume', value: 97 },
    { label: 'Strength', value: 94 },
    { label: 'Charisma', value: 88 },
    { label: 'Stamina', value: 79 },
    { label: 'Luck', value: 85 },
  ];

  const notesData = [
    'Dates back to at least 1500 BC — notably, a pair of trumpets was found in the tomb of Egyptian Pharaoh Tutankhamun.',
    'Modern trumpets are typically made of brass and may be finished with lacquer or silver plating',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function horn() {
  const instTitle = 'French Horn';
  const instLink = 'https://www.youtube.com/watch?v=cK0UFgnrIqY';

  const statsData = [
    { label: 'Dexterity', value: 85 },
    { label: 'Strength', value: 89 },
    { label: 'Intellect', value: 90 },
    { label: 'Charisma', value: 95 },
    { label: 'Stamina', value: 77 },
  ];

  const notesData = [
    "The horn's ancestors were used in hunting to signal and communicate",
    'If you were to uncoil a standard horn, it would reach halfway to the moon!',
    'Why is it called the French Horn? Nobody knows!',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function bassdrum() {
  const instTitle = 'Bass Drum';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=PeagTj475s9LsQU4&t=354';
  const statsData = [
    { label: 'Dexterity', value: 60 },
    { label: 'Strength', value: 96 },
    { label: 'Charisma', value: 77 },
    { label: 'Willpower', value: 94 },
    { label: 'Stealth', value: 25 },
  ];
  const notesData = [
    'Its low, booming sound serves as a rhythmic anchor for the orchestra',
    'Traces its roots to the Turkish davul, used as early as the 14th century',
    'Became a central component of the modern drum kit in the early 1900s',
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cymbals() {
  const instTitle = 'Cymbals';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=G8lMEujNxs-7x1jf&t=649';

  const statsData = [
    { label: 'Volume', value: 97 },
    { label: 'Strength', value: 95 },
    { label: 'Charisma', value: 84 },
    { label: 'Stamina', value: 90 },
    { label: 'Intellect', value: 81 },
  ];

  const notesData = [
    'The earliest evidence of cymbals dates back to 3000 BCE in ancient Mesopotamia and Egypt',
    'Come in various types, including crash, ride, hi-hat, splash, and china',
    'Most are made from bronze alloys, typically 80-90% copper and 10-20% tin',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function glockenspiel() {
  const instTitle = 'Glockenspiel';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=dTdxtj1MA-l9Qc3K&t=293';
  const statsData = [
    { label: 'Dexterity', value: 90 },
    { label: 'Strength', value: 85 },
    { label: 'Charisma', value: 94 },
    { label: 'Intellect', value: 91 },
    { label: 'Silly name', value: 100 },
  ];

  const notesData = [
    'The term "glockenspiel" comes from German, meaning "bell play,"',
    'While similar to the xylophone, the glockenspiel uses metal bars, producing a bright, bell-like sound, whereas the xylophone has wooden bars, yielding a warmer tone',
  ];
  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function cabasa() {
  const instTitle = 'Cabasa';
  const instLink = 'https://www.youtube.com/watch?v=weMXR0xtEXA';

  const statsData = [
    { label: 'Balance', value: 90 },
    { label: 'Strength', value: 74 },
    { label: 'Charisma', value: 94 },
    { label: 'Intellect', value: 87 },
    { label: 'Stamina', value: 91 },
  ];

  const notesData = [
    'Invented in the 1960s by Martin Cohen, drawing inspiration from the traditional African shekere',
    'Commonly used in Latin jazz and bossa nova',
    'Consists of a cylindrical wooden or plastic body wrapped with loops of steel ball chains, creating a distinctive metallic, rattling sound',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function snare() {
  const instTitle = 'Snare Drum';
  const instLink = 'https://youtu.be/-lJctvybAJ8?si=0djRp8gH7EWfwSwf&t=537';

  const statsData = [
    { label: 'Dexterity', value: 94 },
    { label: 'Strength', value: 92 },
    { label: 'Charisma', value: 82 },
    { label: 'Intellect', value: 88 },
    { label: 'Stamina', value: 95 },
  ];

  const notesData = [
    'Evolved from the medieval tabor, a drum used in the 14th century to signal troops in battle',
    'Its sharp, staccato sound comes from metal or nylon wires — called snares — stretched across the bottom head',
    'A core component of modern drum kits',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}
function harp() {
  const instTitle = 'Harp';
  const instLink = 'https://www.youtube.com/watch?v=P2Xdb1ljd3g';

  const statsData = [
    { label: 'Dexterity', value: 91 },
    { label: 'Intellect', value: 89 },
    { label: 'Charisma', value: 94 },
    { label: 'Etherealness', value: 100 },
    { label: 'Luck', value: 87 },
  ];

  const notesData = [
    'Dates back to around 3000 BCE in ancient Mesopotamia, Egypt, and Persia',
    'Modern concert harps typically have 47 strings, while smaller folk harps may have between 22 and 38 strings',
    'National symbol of Ireland',
  ];

  populateStatsPanel(instTitle, instLink, statsData, notesData);
}

function populateStatsPanel(instTitle, instLink, statsData, notesData) {
  clearStatsPanel();

  // Create and populate the title section
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title');

  const titleHeading = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = instLink;
  titleLink.target = '_blank';
  titleLink.textContent = instTitle;

  titleHeading.appendChild(titleLink);
  titleDiv.appendChild(titleHeading);
  statsPanel.appendChild(titleDiv);

  // Create and populate the stats panel
  const stats = document.createElement('div');
  stats.classList.add('stats', 'inst-details');

  const statsHeading = document.createElement('h6');
  statsHeading.textContent = 'Stats';
  stats.appendChild(statsHeading);

  const statsList = document.createElement('ul');

  statsData.forEach((stat) => {
    const listItem = document.createElement('li');

    const statsLabel = document.createElement('div');
    statsLabel.classList.add('stats-label');

    const labelSpan = document.createElement('span');
    labelSpan.textContent = `${stat.label}:`;
    statsLabel.appendChild(labelSpan);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = stat.value;
    statsLabel.appendChild(valueSpan);

    listItem.appendChild(statsLabel);

    const statsBar = document.createElement('div');
    statsBar.classList.add('stats-bar');

    const statsBarInner = document.createElement('div');
    statsBarInner.classList.add('stats-bar-inner');
    statsBarInner.style.width = `${stat.value}%`;
    statsBar.appendChild(statsBarInner);

    listItem.appendChild(statsBar);
    statsList.appendChild(listItem);
  });

  stats.appendChild(statsList);
  statsPanel.appendChild(stats);

  // Create and populate the notes panel
  const notesPanel = document.createElement('div');
  notesPanel.classList.add('notes', 'inst-details');

  const notesHeading = document.createElement('h6');
  notesHeading.textContent = 'Notes';
  notesPanel.appendChild(notesHeading);

  const notesList = document.createElement('ul');

  notesData.forEach((note) => {
    const listItem = document.createElement('li');
    const noteMarker = document.createElement('span');
    noteMarker.textContent = '▴';
    listItem.appendChild(noteMarker);
    const noteText = document.createTextNode(` ${note}`);
    listItem.appendChild(noteText);
    notesList.appendChild(listItem);
  });

  notesPanel.appendChild(notesList);
  statsPanel.appendChild(notesPanel);
}

function clearStatsPanel() {
  statsPanel.innerHTML = '';
}

function enableStatsButton() {
  statsButton.disabled = false;
}

function resetStatsPanel() {
  clearStatsPanel();
  statsButton.disabled = true;
  statsButtonIcon.textContent = 'info';
  statsPanel.classList.remove('active');
}

statsButton.addEventListener('click', () => {
  if (statsButtonIcon.textContent === 'info') {
    statsButtonIcon.textContent = 'cancel';
    statsPanel.classList.add('active');
  } else {
    statsButtonIcon.textContent = 'info';
    statsPanel.classList.remove('active');
  }
});




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