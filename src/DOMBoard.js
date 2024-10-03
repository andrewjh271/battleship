/* eslint-disable no-param-reassign */
import { initializeDOMBoard } from './DOMInitializeBoard';
import { setupDOMBoard, newTemplateImage, newTemplateWrapper } from './DOMSetupBoard';
import { on, emit } from './observer';
import { coordinatesToIndex, indexToCoordinates } from './coordinates';

export function DOMBoardFactory(id, ROWS) {
  const board = initializeDOMBoard(id, ROWS);

  on('boardChange', updateBoard);

  function listenForAttack() {
    board.addEventListener('click', receiveAttack);
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

  function receiveAttack(e) {
    const { index } = e.target.dataset;
    if (!index) return;
    emit('attack', { coords: indexToCoordinates(index), id });
  }

  function updateBoard(boardData) {
    if (boardData.id !== id) return;

    console.log(`updating ${id}....`);
    boardData.squares.forEach((row, i) => {
      row.forEach((square, j) => {
        const index = i + j * 10;
        if (square.ship?.isSunk()) {
          board.cells[index].classList.add('sunk');
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

  function placeSetImages(dataBoard) {
    // places on DOMboard(board variable) all images from board object argument
    dataBoard.placedShips.forEach((ship) => {
      const image = newTemplateImage(ship.name);
      const imageWrapper = newTemplateWrapper();
      setPosition(image, imageWrapper, ship.coords);
      addPlacedClass(ship.coords);
      imageWrapper.appendChild(image);
      board.appendChild(imageWrapper);
    });
  }

  function setPosition(image, wrapper, set) {
    const rowStart = set.reduce((min, coord) => (coord[1] < min ? coord[1] : min), 100) + 1;
    const rowSpan =
      set.reduce((max, coord) => (coord[1] > max ? coord[1] : max), -100) + 2 - rowStart;
    const colStart = set.reduce((min, coord) => (coord[0] < min ? coord[0] : min), 100) + 1;
    const colSpan =
      set.reduce((max, coord) => (coord[0] > max ? coord[0] : max), -100) + 2 - colStart;

    if (colSpan > rowSpan) {
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

  return { setOffense, setDefense, setupBoard, placeSetImages, listenForAttack, disable, enable };
}
