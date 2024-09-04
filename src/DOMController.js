import { humanPlayerFactory, computerPlayerFactory } from "./player";
import { indexToCoordinates } from "./coordinates";

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
const board2 = document.querySelector('#board2');

createGrid(100, board1);
createGrid(100, board2);


function listenForAttack(board) {
  board.addEventListener('click', handleAttack);
}

function unListenForAttack(board) {
  board.removeEventListener('click', handleAttack);
}

function handleAttack(e) {

  const { index } = e.target.dataset;
  if (!index) return;
  console.log(indexToCoordinates(index));
  
}

listenForAttack(board1);