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
/* harmony export */   "find1DSets": () => (/* binding */ find1DSets)
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
  return sets;
}

function findSetsFromRow(row, length, board) {
  let lft = 0;
  let rt = 1;
  const sets = [];

  while (rt < row.length) {
    if (board.isOccupied([row[lft][0], row[lft][1]])) {
      lft = rt;
      rt += 1;
    } else if (board.isOccupied([row[rt][0], row[rt][1]])) {
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
/* harmony export */   "find2DSets": () => (/* binding */ find2DSets)
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
/* harmony export */   "getShipData": () => (/* binding */ getShipData)
/* harmony export */ });
function getShipData(DOMboard) {
  const result = Array.from(DOMboard.children)
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
    .reduce((object, entry) => ({ ...object, ...entry }), {});

  // console.log(result);
  return result;
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
/* harmony export */   "boardFactory": () => (/* binding */ boardFactory)
/* harmony export */ });
/* harmony import */ var _DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMInitializeBoard */ "./src/DOMInitializeBoard.js");
/* harmony import */ var _DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMSetupBoard */ "./src/DOMSetupBoard.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* harmony import */ var _imageGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./imageGenerator */ "./src/imageGenerator.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* eslint-disable no-param-reassign */






function boardFactory(id, ROWS) {
  const board = (0,_DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_0__.initializeBoard)(id, ROWS);

  function setOffense() {
    board.classList.remove('defense');
    board.classList.add('offense');
    board.removeEventListener('click', receiveAttack);
    (0,_observer__WEBPACK_IMPORTED_MODULE_2__.off)('boardChange', updateBoard);
  }

  function setDefense() {
    board.classList.remove('offense');
    board.classList.add('defense');
    board.addEventListener('click', receiveAttack);
    (0,_observer__WEBPACK_IMPORTED_MODULE_2__.on)('boardChange', updateBoard);
  }

  function receiveAttack() {
    // get index
    const index = 22;
    (0,_observer__WEBPACK_IMPORTED_MODULE_2__.emit)('attack', index);
  }

  function updateBoard(gameboard) {
    gameboard.squares.forEach(square => {
      console.log(square);
      // if square.ship add .occupied
      // if square.ship.isSunk() add .sunk
      // if square.attacked add .attacked
    })
  }

  function setupBoard() {
    (0,_DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__.setupBoard)(board);
  }

  function placeSetImages(objectBoard) {
    // places on DOMBoard(this) all images from board object
    // duplication from DOMSetupBoard#placeImage
    objectBoard.placedShips.forEach(ship => {
      console.log(ship);
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('placed-img-wrapper');
      const image = _imageGenerator__WEBPACK_IMPORTED_MODULE_3__[ship.name]();
      image.classList.add('placed-img');
      setPosition(image, imageWrapper, ship.coords);
      addPlacedClass(ship.coords);
      imageWrapper.appendChild(image);
      board.appendChild(imageWrapper);
    })
  }

  function setPosition(image, wrapper, set) {
    const rowStart = set.reduce((min, coord) => coord[1] < min ? coord[1] : min, 100) + 1;
    const rowSpan = set.reduce((max, coord) => coord[1] > max ? coord [1] : max, -100) + 2 - rowStart;
  
    const colStart = set.reduce((min, coord) => coord[0] < min ? coord[0] : min, 100) + 1;
    const colSpan = set.reduce((max, coord) => coord[0] > max ? coord [0] : max, -100) + 2 - colStart;
    
    console.log(rowStart, rowSpan, colStart, colSpan);
    if (colSpan > rowSpan) {
      image.style.transform = `translateX(${image.style.height}) rotate(90deg)`;
    }
    // const gridArea =  `grid-area: ${rowStart} / ${colStart} / span ${rowSpan} / span ${colSpan}`
    // console.log(gridArea);
    // wrapper.style.gridArea = gridArea;

    wrapper.style.gridRow = `${rowStart} / span ${rowSpan}`;
    wrapper.style.gridColumn = `${colStart} / span ${colSpan}`;
  }

  function addPlacedClass(set) {
    set.forEach(coords => {
      board.cells[(0,_coordinates__WEBPACK_IMPORTED_MODULE_4__.coordinatesToIndex)(coords)].classList.add('highlight-placed');
    })
  }

  return { setOffense, setDefense, setupBoard, placeSetImages }
}


/***/ }),

/***/ "./src/DOMController.js":
/*!******************************!*\
  !*** ./src/DOMController.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "showBoards": () => (/* binding */ showBoards)
/* harmony export */ });
/* harmony import */ var _DOMInitializeBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMInitializeBoard */ "./src/DOMInitializeBoard.js");
/* harmony import */ var _DOMSetupBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMSetupBoard */ "./src/DOMSetupBoard.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./coordinates */ "./src/coordinates.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
// import { humanPlayerFactory, computerPlayerFactory } from './player';






const ROWS = 10;

// const startButton = document.querySelector('start-game');
// startButton.addEventListener('click', setupBoard1)

function showBoards() {
  const board1 = document.querySelector('#board1')
  const board2 = document.querySelector('#board2')
  const setupContainer = document.querySelector('.board-setup-container');
  board1.classList.remove('hidden');
  board2.classList.remove('hidden');
  setupContainer.classList.add('hidden');
}

function setupBoard1() {

}

// const board1 = initializeBoard('board1', ROWS);
// setupBoard(board1);

function recordBoardPositions() {
  (0,_observer__WEBPACK_IMPORTED_MODULE_4__.emit)('positionSet', board1)
}



function handleAttack(e) {
  const { index } = e.target.dataset;
  if (!index) return;
  console.log((0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.indexToCoordinates)(index));
}

function listenForAttack(board) {
  board.addEventListener('click', handleAttack);
}

// function unListenForAttack(board) {
//   board.removeEventListener('click', handleAttack);
// }

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
/* eslint-disable no-param-reassign */
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
  console.log(board);
  currentBoard = board;
}

const setBoardButton = document.querySelector('.set-board');
setBoardButton.addEventListener('click', () => (0,_observer__WEBPACK_IMPORTED_MODULE_1__.emit)('setPosition', currentBoard), { once: true });
// not sure this should be set to once — not set again for player 2

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
  children.forEach(element => {
    if (element.classList.contains('placed-img-wrapper')) {
      element.remove();
    } else {
      element.classList.remove('highlight-placed');
    }
  })
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
    (0,_draggable__WEBPACK_IMPORTED_MODULE_2__.resetDraggedImage)(element);
    removeDraggedHighlights();
  }
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
/* harmony export */   "dragStart": () => (/* binding */ dragStart),
/* harmony export */   "resetDraggedImage": () => (/* binding */ resetDraggedImage)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ "./src/observer.js");
/* eslint-disable no-param-reassign */


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

function resetDraggedImage(element) {
  element.style.top = '';
  element.style.left = '';
}



/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "start": () => (/* binding */ start)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");



function initialize(p1, p2) {
  const board1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const board2 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const player1 = p1 === 'human' ? (0,_player__WEBPACK_IMPORTED_MODULE_1__.humanPlayerFactory)() : (0,_player__WEBPACK_IMPORTED_MODULE_1__.computerPlayerFactory)(board1, board2);
  const player2 = p2 === 'human' ? (0,_player__WEBPACK_IMPORTED_MODULE_1__.humanPlayerFactory)() : (0,_player__WEBPACK_IMPORTED_MODULE_1__.computerPlayerFactory)(board2, board1);
  return [player1, player2, board1, board2];
}

function start(p1, p2) {
  const [player1, player2, gameBoard1, gameBoard2] = initialize(p1, p2);
  player1.setup();
  player2.setup();
  const result = play(player1, player2, gameBoard1, gameBoard2);
  return result;
}

function play(player1, player2, gameBoard1, gameBoard2) {
  while (true) {
    player1.attack();
    if (gameBoard2.gameOver()) {
      return 'Player 1 Wins';
    }
    player2.attack();
    if (gameBoard1.gameOver()) {
      return 'Player 2 Wins';
    }
  }
}




/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gameBoardFactory)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _1DSetFinder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./1DSetFinder */ "./src/1DSetFinder.js");
/* harmony import */ var _2DSetFinder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./2DSetFinder */ "./src/2DSetFinder.js");
/* harmony import */ var _DOMAdapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOMAdapter */ "./src/DOMAdapter.js");
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./observer */ "./src/observer.js");






function gameBoardFactory() {
  let totalShips = 0;
  let shipsSunk = 0;
  const placedShips = [];
  const squares = [];
  for (let i = 0; i < 10; i++) {
    squares[i] = [];
    for (let j = 0; j < 10; j++) {
      squares[i][j] = {};
    }
  }

  function setPosition(DOMBoard) {
    const ships = (0,_DOMAdapter__WEBPACK_IMPORTED_MODULE_3__.getShipData)(DOMBoard);
    // console.log(ships);
    Object.entries(ships).forEach(ship => {
      this.placeShip(ship[1], ship[0]);
    })
    // console.log(this.squares);
    ;(0,_observer__WEBPACK_IMPORTED_MODULE_4__.off)('setPosition', setPosition);
  }

  function listenForPosition() {
    console.log(this);
    console.log('listenForPosition called');
    (0,_observer__WEBPACK_IMPORTED_MODULE_4__.on)('setPosition', setPosition.bind(this));
  }

  const isOccupied = (coords) => {
    if (typeof coords[0] === 'number') {
      return !!squares[coords[0]][coords[1]].ship;
    }
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i];
      if (squares[coord[0]][coord[1]].ship) return true;
    }
    return false;
  };

  const outOfRange = (coords) => coords.flat().some((coord) => coord < 0 || coord > 9);

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

  function receiveAttack(coords) {
    const square = squares[coords[0]][coords[1]];
    if (square.attacked) throw new Error('this square has already been attacked');
    if (square.ship) {
      square.ship.hit();
      if (square.ship.isSunk()) shipsSunk++;
    }
    square.attacked = true;
  }

  function gameOver() {
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
    squares,
    findSets,
    get size() {
      return squares.length;
    },
    isOccupied,
    placeShip,
    receiveAttack,
    gameOver,
    emptySquares,
    listenForPosition,
    placedShips
  };
}


/***/ }),

/***/ "./src/gameflow.js":
/*!*************************!*\
  !*** ./src/gameflow.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _DOMBoard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOMBoard */ "./src/DOMBoard.js");
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");






const startButton = document.querySelector('.start-game');
startButton.addEventListener('click', beginSetup)
const setBoardButton = document.querySelector('.set-board');
// mouse events need to be disabled if not valid

let player1;
let player2;

let board1; // eventually declare inside beginSetup?
let board2; // eventually declare inside beginSetup?

function beginSetup() {
  console.log('setup begins...')
  board1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  board2 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const DOMBoard1 = (0,_DOMBoard__WEBPACK_IMPORTED_MODULE_2__.boardFactory)('board1', 10);
  const DOMBoard2 = (0,_DOMBoard__WEBPACK_IMPORTED_MODULE_2__.boardFactory)('board2', 10);
  player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__.humanPlayerFactory)(board1, board2, DOMBoard1);
  player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__.computerPlayerFactory)(board2, board1, DOMBoard2);

  player1.setup();
  setBoardButton.addEventListener('click', player2.setup, {once: true});
  setBoardButton.addEventListener('click', finishSetup, {once: true});
  
}

function finishSetup() {
  if (player2.isComputer()) {
    startGame();
  } else {
    setBoardButton.addEventListener('click', startGame, {once: true});
  }
}

function startGame() {
  console.log('game starts!');
  console.log('board1...');
  console.log(board1);
  console.log('board2...');
  console.log(board2);
  (0,_DOMController__WEBPACK_IMPORTED_MODULE_3__.showBoards)();
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
const boardWidth = board.offsetWidth;
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
function humanPlayerFactory(homeBoard, opponentBoard, DOMBoard) {

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

  function setup() {
    DOMBoard.setupBoard();
    homeBoard.listenForPosition();
  }

  function isComputer() {
    return false;
  }

  return { attack, placeShip, isComputer, setup };
}

function computerPlayerFactory(homeBoard, opponentBoard, DOMBoard) {
  const ships = {
    'flute': [1, 3],
    'trombone': [1, 5],
    'clarinet': [1, 3],
    'violin': [1, 3],
    'bassoon': [1, 4],
    'cello': [2, 5],
    'horn': [2, 2],
    'piccolo': [1, 2],
    'trumpet': [1, 3]
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
    if (possibleMoves.length === 0) throw new Error('there are no moves left');
    const index = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[index];
    possibleMoves[index] = possibleMoves[possibleMoves.length - 1];
    possibleMoves.pop();
    opponentBoard.receiveAttack(move);
  }

  function setup() {
    Object.entries(ships).forEach(ship => {
      const name = ship[0];
      const dimensions = ship[1];
      const set = homeBoard.findSets(...dimensions);
      const coords = set[Math.floor(Math.random() * set.length)];
      homeBoard.placeShip(coords, name);
    })
    DOMBoard.placeSetImages(homeBoard);
  }


  return { attack, setup, isComputer }
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
    default: // 270
      newImage.style.transform = `translateY(${newImage.style.width}) rotate(${rotation}deg)`;
  }
  if (rotation !== 180) {
    wrapper.style.height = newImage.style.width;
    [draggedImage.spanY, draggedImage.spanX] = [draggedImage.spanX, draggedImage.spanY];
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DOMController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMController */ "./src/DOMController.js");
/* harmony import */ var _DOMAdapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMAdapter */ "./src/DOMAdapter.js");
/* harmony import */ var _gameflow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameflow */ "./src/gameflow.js");
// import './setup';




})();

/******/ })()
;
//# sourceMappingURL=main.js.map