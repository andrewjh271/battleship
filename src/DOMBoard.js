/* eslint-disable no-param-reassign */
import { initializeDOMBoard } from './DOMInitializeBoard';
import {
  setupDOMBoard,
  newTemplateImage,
  newTemplateWrapper,
  disableAllPreviewImages,
} from './DOMSetupBoard';
import { on, emit } from './observer';
import { coordinatesToIndex, indexToCoordinates } from './coordinates';
import { rowLength } from './boardSize';

export function DOMBoardFactory(id, ROWS) {
  const board = initializeDOMBoard(id, ROWS);

  on('boardChange', updateBoard);

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
    emit('attack', { coords: indexToCoordinates(index), id });
  }

  function updateBoard(boardData) {
    if (boardData.id !== id) return;

    boardData.squares.forEach((row, i) => {
      row.forEach((square, j) => {
        const index = i + j * rowLength();
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
    setupDOMBoard(board);
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
      const image = newTemplateImage(ship.name);
      const imageWrapper = newTemplateWrapper();
      setPosition(image, imageWrapper, ship.coords);
      addPlacedClass(ship.coords);
      imageWrapper.appendChild(image);
      board.appendChild(imageWrapper);
    });
    disableAllPreviewImages();
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
      board.cells[coordinatesToIndex(coords)].classList.add('highlight-placed');
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
