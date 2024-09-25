/* eslint-disable no-param-reassign */
import { initializeDOMBoard } from './DOMInitializeBoard';
import { setupDOMBoard, newTemplateImage, newTemplateWrapper } from './DOMSetupBoard';
import { on, off, emit } from './observer'
import { coordinatesToIndex } from './coordinates';

export function DOMBoardFactory(id, ROWS) {
  const board = initializeDOMBoard(id, ROWS);

  function setOffense() {
    board.classList.remove('defense');
    board.classList.add('offense');
    board.removeEventListener('click', receiveAttack);
    off('boardChange', updateBoard);
  }

  function setDefense() {
    board.classList.remove('offense');
    board.classList.add('defense');
    board.addEventListener('click', receiveAttack);
    on('boardChange', updateBoard);
  }

  function receiveAttack() {
    // get index
    const index = 22;
    emit('attack', index);
  }

  function updateBoard(dataBoard) {
    dataBoard.squares.forEach(square => {
      console.log(square);
      // if square.ship add .occupied
      // if square.ship.isSunk() add .sunk
      // if square.attacked add .attacked
    })
  }

  function setupBoard() {
    setupDOMBoard(board);
  }

  function placeSetImages(dataBoard) {
    // places on DOMboard(board variable) all images from board object argument
    dataBoard.placedShips.forEach(ship => {
      const image = newTemplateImage(ship.name);
      const imageWrapper = newTemplateWrapper();
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
    
    if (colSpan > rowSpan) {
      image.style.transform = `translateX(${image.style.height}) rotate(90deg)`;
    }
    wrapper.style.gridRow = `${rowStart} / span ${rowSpan}`;
    wrapper.style.gridColumn = `${colStart} / span ${colSpan}`;
  }

  function addPlacedClass(set) {
    set.forEach(coords => {
      board.cells[coordinatesToIndex(coords)].classList.add('highlight-placed');
    })
  }

  return { setOffense, setDefense, setupBoard, placeSetImages }
}
