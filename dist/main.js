/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOMController.js":
/*!******************************!*\
  !*** ./src/DOMController.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMInitializeBoard */ "./src/DOMInitializeBoard.js");
/* harmony import */ var _DOMSetupBoard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOMSetupBoard */ "./src/DOMSetupBoard.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");





const ROWS = 10;

const board1 = (0,_DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_1__.initializeBoard)('board1', ROWS);
(0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_2__.setupBoard)(board1);

function listenForAttack(board) {
  board.addEventListener('click', handleAttack);
}

function unListenForAttack(board) {
  board.removeEventListener('click', handleAttack);
}

function handleAttack(e) {
  const { index } = e.target.dataset;
  if (!index) return;
  console.log((0,_coordinates__WEBPACK_IMPORTED_MODULE_3__.indexToCoordinates)(index));
}

listenForAttack(board1);


/***/ }),

/***/ "./src/DOMInitializeBoard.js":
/*!***********************************!*\
  !*** ./src/DOMInitializeBoard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initializeBoard": () => (/* binding */ initializeBoard)
/* harmony export */ });
function createGrid(rows, board) {
  board.cells = [];
  for (let i = 0; i < rows * rows; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].style.gridArea = `${Math.floor(i / rows) + 1} / ${
      (i % rows) + 1
    } / span 1 / span 1`;
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

function initializeBoard(id, rows) {
  const board = document.getElementById(id)
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
/* harmony export */   "setupBoard": () => (/* binding */ setupBoard)
/* harmony export */ });
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _draggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./draggable */ "./src/draggable.js");
/* harmony import */ var _rotatable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rotatable */ "./src/rotatable.js");





// const setupContainer = document.querySelector('.board-setup-container');
const stagingArea = document.querySelector('.staging-area');
const previews = document.querySelectorAll('.img-preview');
const clearButton = document.querySelector('.clear');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
clearButton.addEventListener('click', clearPlacedImages);

let currentBoard;
function setupBoard(board) {
  // show setupContainer, configure container
  currentBoard = board;
}

function showStagedImage() {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[this.id]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', _draggable__WEBPACK_IMPORTED_MODULE_2__.dragStart);
  if (stagingArea.firstChild) {
    stagingArea.removeChild(stagingArea.firstChild);
  }
  stagingArea.appendChild(image);
  (0,_rotatable__WEBPACK_IMPORTED_MODULE_3__.setStagedImage)(image);
}

function clearPlacedImages() {
  const children = Array.from(currentBoard.children);
  for (const node of children) {
    if (node.classList.contains('placed-img-wrapper')) {
      node.remove();
    } else {
      node.classList.remove('highlight-placed');
    }
  }
}

(0,_observer__WEBPACK_IMPORTED_MODULE_1__.on)('dragEvent', highlightHoveredCells);
(0,_observer__WEBPACK_IMPORTED_MODULE_1__.on)('dragEnd', handleRelease);

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

function resetDraggedImage(element) {
  element.style.top = '';
  element.style.left = '';
}

function placeImage(element) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('placed-img-wrapper');
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[element.type]();
  image.classList.add('placed-img');

  const startingCell = currentBoard.cells.findIndex((cell) =>
    cell.classList.contains('highlight-hovered')
  );

  (0,_rotatable__WEBPACK_IMPORTED_MODULE_3__.adjustForRotation)(element, image, imageWrapper);
  imageWrapper.style.gridRow = `${Math.floor(startingCell / currentBoard.numRows) + 1} / span ${
    element.spanY
  }`;
  imageWrapper.style.gridColumn = `${(startingCell % currentBoard.numRows) + 1} / span ${
    element.spanX
  }`;

  imageWrapper.appendChild(image);
  currentBoard.appendChild(imageWrapper);
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




/***/ }),

/***/ "./src/coordinates.js":
/*!****************************!*\
  !*** ./src/coordinates.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "coordinatesToIndex": () => (/* binding */ coordinatesToIndex),
/* harmony export */   "indexToCoordinates": () => (/* binding */ indexToCoordinates)
/* harmony export */ });
function indexToCoordinates(index) {
  const x = index % 10;
  const y = Math.floor(index / 10);
  return [x, y];
}

function coordinatesToIndex(coords) {
  return coords[1] * 10 + coords[0];
}




/***/ }),

/***/ "./src/draggable.js":
/*!**************************!*\
  !*** ./src/draggable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dragStart": () => (/* binding */ dragStart)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./src/observer.js");


let cursorOffsetX;
let cursurOffsetY;

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
      (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEnd', this);
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

  (0,_observer__WEBPACK_IMPORTED_MODULE_0__.emit)('dragEvent', positionData);
}



/***/ }),

/***/ "./src/imageGenerator.js":
/*!*******************************!*\
  !*** ./src/imageGenerator.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bassoon": () => (/* binding */ bassoon),
/* harmony export */   "cello": () => (/* binding */ cello),
/* harmony export */   "clarinet": () => (/* binding */ clarinet),
/* harmony export */   "flute": () => (/* binding */ flute),
/* harmony export */   "horn": () => (/* binding */ horn),
/* harmony export */   "piccolo": () => (/* binding */ piccolo),
/* harmony export */   "trombone": () => (/* binding */ trombone),
/* harmony export */   "trumpet": () => (/* binding */ trumpet),
/* harmony export */   "violin": () => (/* binding */ violin)
/* harmony export */ });
const board = document.querySelector('.board');

const boardWidth = 500;
const squareWidth = boardWidth / 10; // number of cells in row

function flute() {
  return newImage('flute', 1, 3);
}

function trombone() {
  const image = newImage('trombone', 1, 5);
  image.classList.add('stretch');
  return image;
}

function clarinet() {
  return newImage('clarinet', 1, 3);
}

function violin() {
  return newImage('violin', 1, 3);
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
  image.style.width = `${squareWidth * width}px`;
  image.style.height = `${squareWidth * height}px`;
  image.spanX = width;
  image.spanY = height;
  image.area = width * height;
  image.type = type;
  return image;
}




/***/ }),

/***/ "./src/observer.js":
/*!*************************!*\
  !*** ./src/observer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "emit": () => (/* binding */ emit),
/* harmony export */   "off": () => (/* binding */ off),
/* harmony export */   "on": () => (/* binding */ on)
/* harmony export */ });
const events = {};

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




/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computerPlayerFactory": () => (/* binding */ computerPlayerFactory),
/* harmony export */   "humanPlayerFactory": () => (/* binding */ humanPlayerFactory)
/* harmony export */ });
function humanPlayerFactory(homeBoard, opponentBoard) {
  function attack(coords) {
    const coordinates = coords || getCoords();
    opponentBoard.receiveAttack(coordinates);
  }

  function getCoords() {
    // get coordinates from User/DOM
  }

  function placeShip(coords) {
    homeBoard.placeShip(coords);
  }

  function placeAllShips() {
    // while (remainingShips)
      // get name and coordinates of ship from User/DOM
      // placeShip
  }

  function isComputer() {
    return false;
  }

  return { attack, placeShip, isComputer };
}

function computerPlayerFactory(homeBoard, opponentBoard) {
  const ships = {
    'Carrier': 5,
    'Battleship': 4,
    'Destroyer': 3,
    'Submarine': 3,
    'Patrol Boat': 2
  }

  const size = 10;
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
    if (possibleMoves.length == 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = possibleMoves[possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack(move);
  }

  function placeAllShips() {
    for (const ship in ships) {
      const name = ship;
      const length =  ships[ship];
      const set = homeBoard.findSets(length);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    }
  }

  return { attack, placeAllShips, isComputer }
}




/***/ }),

/***/ "./src/rotatable.js":
/*!**************************!*\
  !*** ./src/rotatable.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adjustForRotation": () => (/* binding */ adjustForRotation),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "setStagedImage": () => (/* binding */ setStagedImage)
/* harmony export */ });
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

function adjustForRotation(draggedImage, newImage, wrapper) {
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");
// import './setup';


})();

/******/ })()
;
//# sourceMappingURL=main.js.map