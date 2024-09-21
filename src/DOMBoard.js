/* eslint-disable no-param-reassign */
import { initializeBoard } from './DOMInitializeBoard';
import { setupBoard as DOMSetup } from './DOMSetupBoard';
import { on, off, emit } from './observer'
import * as imageGenerator from './imageGenerator'
import { coordinatesToIndex } from './coordinates';

export function boardFactory(id, ROWS) {
  const board = initializeBoard(id, ROWS);

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

  function updateBoard(gameboard) {
    gameboard.squares.forEach(square => {
      console.log(square);
      // if square.ship add .occupied
      // if square.ship.isSunk() add .sunk
      // if square.attacked add .attacked
    })
  }

  function setupBoard() {
    DOMSetup(board);
  }

  function placeSetImages(objectBoard) {
    // places on DOMBoard(this) all images from board object
    // duplication from DOMSetupBoard#placeImage
    objectBoard.placedShips.forEach(ship => {
      console.log(ship);
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('placed-img-wrapper');
      const image = imageGenerator[ship.name]();
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
      board.cells[coordinatesToIndex(coords)].classList.add('highlight-placed');
    })
  }

  return { setOffense, setDefense, setupBoard, placeSetImages }
}
