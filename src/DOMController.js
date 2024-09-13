import { humanPlayerFactory, computerPlayerFactory } from './player';
import { initializeBoard } from './DOMInitializeBoard';
import { setupBoard } from './DOMSetupBoard';
import { indexToCoordinates } from './coordinates';

const ROWS = 10;

const board1 = initializeBoard('board1', ROWS);
setupBoard(board1);

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
