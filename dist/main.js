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
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _drag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drag */ "./src/drag.js");






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

(0,_observer__WEBPACK_IMPORTED_MODULE_2__.on)('dragEvent', checkHover);
(0,_observer__WEBPACK_IMPORTED_MODULE_2__.on)('dragEnd', handleRelease);

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
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_3__[element.type]();
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
  console.log((0,_coordinates__WEBPACK_IMPORTED_MODULE_1__.indexToCoordinates)(index));
}

listenForAttack(board1);


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

/***/ "./src/drag.js":
/*!*********************!*\
  !*** ./src/drag.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observer */ "./src/observer.js");



const stagingArea = document.querySelector('.staging-area');
const previews = document.querySelectorAll('.img-preview');

const rotateButton = document.querySelector('.rotate');
const clearButton = document.querySelector('.clear');

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
rotateButton.addEventListener('click', rotate);
clearButton.addEventListener('click', clearStagedImages);

let cursorOffsetX;
let cursurOffsetY;
let staged;

function showStagedImage(e) {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[this.id]();
  image.classList.add('staging-img');
  image.addEventListener('mousedown', dragStart);
  if (stagingArea.firstChild) {
    stagingArea.removeChild(stagingArea.firstChild);
  }
  stagingArea.appendChild(image);
  staged = image;
}

function rotate() {
  if (!staged) return;
  const matchData = staged.style.transform.match(/\d+/);
  const deg = matchData ? Number(matchData[0]) + 90 : 90;
  staged.style.transform = `rotate(${deg}deg)`;
}

function clearStagedImages() {
  const children = Array.from(board1.children);
  for (const node of children) {
    if (node.classList.contains('placed-img-wrapper')) {
      node.remove();
    } else {
      node.classList.remove('placed');
    }
  }
}

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
      (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('dragEnd', this);
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

  (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('dragEvent', positionData);
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