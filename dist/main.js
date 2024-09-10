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
/* harmony import */ var _drag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drag */ "./src/drag.js");





function createGrid(numberOfCells, board) {
  board.cells = [];
  for (let i = 0; i < numberOfCells; i++) {
    board.cells[i] = document.createElement('div');
    board.cells[i].classList.add('cell');
    board.cells[i].dataset.index = i;
    board.appendChild(board.cells[i]);
  }
}

const board1 = document.querySelector('#board1');
// const board2 = document.querySelector('#board2');

(0,_observer__WEBPACK_IMPORTED_MODULE_2__.on)('dragEvent', checkHover);

createGrid(100, board1);
// createGrid(100, board2);

function checkHover(positionData) {
  const { top, left } = positionData;
  console.log(left, top);

  const bound = board1.cells[0].getBoundingClientRect();
  console.log(bound.left, bound.top);
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

previews.forEach((preview) => preview.addEventListener('click', showStagedImage));
rotateButton.addEventListener('click', rotate);

let cursorOffsetX;
let cursurOffsetY;
let staged;

function showStagedImage(e) {
  const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_0__[this.id]();
  image.addEventListener('mousedown', dragStart);
  stagingArea.appendChild(image);
  staged = image;
}

function rotate() {
  if (!staged) return;
  const matchData = staged.style.transform.match(/\d+/);
  const deg = matchData ? Number(matchData[0]) + 90 : 90;
  staged.style.transform = `rotate(${deg}deg)`;
}

function dragStart(e) {
  e.preventDefault();
  cursorOffsetX = e.clientX - this.offsetLeft;
  cursurOffsetY = e.clientY - this.offsetTop;

  const boundDragMove = dragMove.bind(this);
  document.addEventListener('mousemove', boundDragMove);
  document.addEventListener(
    'mouseup',
    () => {
      document.removeEventListener('mousemove', boundDragMove);
    },
    { once: true }
  );
}

function dragMove(e) {
  console.log(this);
  this.style.top = (e.clientY - cursurOffsetY).toString() + 'px';
  this.style.left = (e.clientX - cursorOffsetX).toString() + 'px';
  const positionData = {
    top: this.offsetTop,
    left: this.offsetLeft,
    width: this.offsetWidth,
    height: this.offsetHeight,
  };

  (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('dragEvent', positionData);
}

function dragEnd(e) {
  document.removeEventListener('mousemove', dragMove.bind(this));
  document.removeEventListener('mouseup', dragEnd);
}


/***/ }),

/***/ "./src/imageGenerator.js":
/*!*******************************!*\
  !*** ./src/imageGenerator.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clarinet": () => (/* binding */ clarinet),
/* harmony export */   "flute": () => (/* binding */ flute),
/* harmony export */   "trombone": () => (/* binding */ trombone),
/* harmony export */   "violin": () => (/* binding */ violin)
/* harmony export */ });
const board = document.querySelector('.board');

const boardWidth = 500;
const squareWidth = boardWidth / 10; // 50

const targetWidth = 3; // number of squares flute should occupy
const targetHeight = 1; // number of squares flute should occupy

// flute width should be 150; height should be 50

function flute() {
  const image = new Image();
  image.src = './images/flute.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 3}px`;
  return image;
}

function trombone() {
  const image = new Image();
  image.src = './images/trombone.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 5}px`;
  return image;
}

function clarinet() {
  const image = new Image();
  image.src = './images/clarinet.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 3}px`;
  return image;
}

function violin() {
  const image = new Image();
  image.src = './images/violin.png';
  image.classList.add('staging-img');
  image.style.height = `${squareWidth * 4}px`;
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